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

    export async function get(options: PlayerOptions) {
        return new Promise<PlayerStatistic[]>(async (resolve, reject) => {
            const ids = await exists(options);
            const multi = client.multi();

            _.forEach(ids, (id) => {
                multi.hgetall(id, (err, x) => {
                    if (err) return reject(err);
                });
            });
            
            multi.exec((err, players) => {
                if (err) return reject(err);
                resolve(Mapper.fromRedis(players));
            });
        });
    }

    export async function set(options: PlayerOptions, players: RawStatistic[]) {
        return new Promise<void>((resolve, reject) => {
            const multi = client.multi();

            _.forEach(Mapper.toRedis(players), (player) => {
                const id = `player:${player.PlayerID}`; // The ID format
                multi.hmset(id, player as any);
                multi.sadd(`players:${options.category}:${options.gender}`, id)

                _.forEach(rankedFields, (field) => {
                    multi.ZADD(field, _.get<CacheStatistic, number>(player, field) || 0, id);
                })
            });

            multi.expire(`players:${options.category}:${options.gender}`, Config.redis.expire);

            multi.exec((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

export namespace Mapper {
    // Fields which will be converted back to numbers
    const toNumber = ['PlayerMatchID', 'RankingTypeID', 'ChampionshipMatchID',
        'ChampionshipID','TeamID', 'PlayerID', 'PositionID', 'PointsTot_ForAllPlayerStats', 'PointsW_P',
        'Libero', 'SpikeTot', 'RecTot', 'PlayedMatches', 'PlayedSet', 'SpikeWin_MatchWin',
        'SpikeWin_MatchLose', 'BlockWin_MatchWin', 'BlockWin_MatchLose', 'ServeWin_MatchWin',
        'ServeWin_MatchLose', 'RecEffPerc', 'RecWinPerc', 'RecPos', 'RecPerf', 'ServeWinMatch', 'ServeWinSet',
        'BlockWinSet', 'SpikerEff', 'SpikerPos', 'SpikerPerSet', 'PointsTot', 'PointsPerMatch',
        'PointsPerSet', 'PlayedSets', 'Points', 'SideOut', 'ServeErr', 'ServeWin', 'ServeMinus',
        'ServePlus', 'ServeHP', 'ServeEx', 'RecErr', 'RecWin', 'RecMinus', 'RecPlus', 'RecHP', 'RecEx',
        'SpikeErr', 'SpikeWin', 'SpikeMinus', 'SpikePerf', 'SpikePlus', 'SpikeHP', 'SpikeEx', 'SpikePos', 'BlockErr', 'BlockWin',
        'BlockMinus', 'BlockPlus', 'BlockHP', 'BlockEx', 'Number', 'Vote'
    ];

    export function toRedis(players: RawStatistic[]): CacheStatistic[] {
        return _.map(players, (player: any) => {
            return _.chain(player)
                .assign({
                    FirstName: player.Name,
                    LastName: player.Surname,
                    FullName: `${player.Name} ${player.Surname}`,
                    ImageUrl: `http://dataprojectimages.cloudapp.net:8080/lml/TeamPlayer/100/200/TeamPlayer_${player.TeamID}_${player.PlayerID}.jpg`,

                    Captain: player.Captain ? 1 : 0, // Convert boolean to number

                    // Remove "%" from strings and convert to number
                    SpikePerf: _.chain(player.SpikePerf as string).words().first<any>().toNumber().value(), 
                    SpikePos: _.chain(player.SpikePos as string).words().first<any>().toNumber().value(),
                    RecPos: _.chain(player.RecPos as string).words().first<any>().toNumber().value(),
                    RecPerf: _.chain(player.RecPerf as string).words().first<any>().toNumber().value(),
                })
                .omit(['__type', 'Name', 'Surname', 'PlayerSurnameName']) // Remove useless fields
                .pickBy((value) => !_.isNil(value)) // Remove nulls
                .value() as CacheStatistic;
        });
    }

    export function fromRedis(players: CacheStatistic[]): PlayerStatistic[] {
        return _.map(players, (player: any) => {

            _.assign(player, {
                Captain: Boolean(+player.Captain),
            });

            // Convert strings back to numbers
            _.forEach(toNumber, field => {
                player[field] = _.toNumber(player[field]); 
            });

            return player;
        });
    }
}