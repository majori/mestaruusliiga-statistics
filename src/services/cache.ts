import * as redis from 'redis';
import * as _ from 'lodash';
import { Config } from '../config';

const client = redis.createClient(Config.redis.server);

export namespace PlayerStatistics {
    // Fields which are meaningful to compare
    const rankedFields = [
        'PointsTot_ForAllPlayerStats', 'PointsPerMatch',
        'SpikeWin', 'RecWin', 'BlockWin', 'ServeWin'
    ];

    export async function exists(options: PlayerOptions) {
        return new Promise<string[]>((resolve, reject) => {
            client.smembers(`players:${options.category}:${options.gender}`, (err, ids) => {
                if (err) {
                    return reject(err);
                }

                if (_.isEmpty(ids)) {
                    return reject('NoPlayers');
                }

                return resolve(ids);
            });
        });
    }

    export async function getKeys() {
        return new Promise<string[]>((resolve, reject) => {
            client.smembers(`keys:player`, (err, keys) => {
                if (err) {
                    return reject(err);
                }

                return resolve(keys);
            });
        });
    }

    export async function get(options: PlayerOptions) {
        return new Promise<RefinedStatistics[]>(async (resolve, reject) => {
            const ids = await exists(options);
            const multi = client.multi();

            _.forEach(ids, (id) => {
                multi.get(id, err => {
                    if (err) return reject(err);
                });
            });
            
            multi.exec((err, players) => {
                if (err) return reject(err);
                resolve(_.map(players, player => JSON.parse(player)));
            });
        });
    }

    export async function set(options: PlayerOptions, rawPlayers: RawStatistic[]) {
        return new Promise<void>((resolve, reject) => {
            const multi = client.multi();

            // Refine raw API data
            const players = Mapper.processPlayers(rawPlayers);

            _.forEach(players, (player) => {
                const id = `player:${player.PlayerID}`; // The ID format
                multi.set(id, JSON.stringify(player), 'EX', Config.redis.expire.players);
                
                multi.sadd(`players:${options.category}:${options.gender}`, id)

                _.forEach(rankedFields, (field) => {
                    multi.ZADD(field, _.get<RefinedStatistics, number>(player, field) || 0, id);
                })
            });

            // Store keys of player
            multi.sadd('keys:player', _.chain(players).first<any>().keys().value())

            multi.expire(`keys:player`, Config.redis.expire.players * 3);
            multi.expire(`players:${options.category}:${options.gender}`, Config.redis.expire.players);

            multi.exec((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    export namespace Mapper {
        export function processPlayers(players: RawStatistic[]): RefinedStatistics[] {
            return _.map(players, (player: any) => {
                return _.chain(player)
                    .assign({
                        FirstName: player.Name,
                        LastName: player.Surname,
                        FullName: `${player.Name} ${player.Surname}`,
                        ImageUrl: `http://dataprojectimages.cloudapp.net:8080/lml/TeamPlayer/100/200/TeamPlayer_${player.TeamID}_${player.PlayerID}.jpg`,

                        // Remove "%" from strings and convert to number
                        SpikePerf: _.chain(player.SpikePerf as string).words().first<any>().toNumber().value(), 
                        SpikePos: _.chain(player.SpikePos as string).words().first<any>().toNumber().value(),
                        RecPos: _.chain(player.RecPos as string).words().first<any>().toNumber().value(),
                        RecPerf: _.chain(player.RecPerf as string).words().first<any>().toNumber().value(),
                    })
                    .omit(['__type', 'Name', 'Surname', 'PlayerSurnameName']) // Remove useless fields
                    .value() as RefinedStatistics;
            });
        }
    }
}

export namespace Livescore {
    export async function get(id: string): Promise<MatchPoints> {
        return new Promise<MatchPoints>(async (resolve, reject) => {
            client.get(`livescore:${id}`, (err, data: string) => {
                if (err) {
                    return reject(err);
                }

                resolve(JSON.parse(data));
            })
        });
    }

    export async function set(id: string, points: MatchPoints) {
        return new Promise<void>(async (resolve, reject) => {
            client.set(`livescore:${id}`, JSON.stringify(points), 'EX', 20, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            })
        });
    }
}