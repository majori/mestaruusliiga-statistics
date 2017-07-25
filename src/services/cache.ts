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
    // Fields which will be converted to numbers
    const toNumber = ['PlayerMatchID', 'RankingTypeID', 'ChampionshipMatchID',
        'ChampionshipID','TeamID', 'PlayerID', 'PositionID', 'PointsTot_ForAllPlayerStats', 'PointsW_P',
        'Libero', 'SpikeTot', 'RecTot', 'PlayedMatches', 'PlayedSet', 'SpikeWin_MatchWin',
        'SpikeWin_MatchLose', 'BlockWin_MatchWin', 'BlockWin_MatchLose', 'ServeWin_MatchWin',
        'ServeWin_MatchLose', 'RecEffPerc', 'RecWinPerc', 'ServeWinMatch', 'ServeWinSet',
        'BlockWinSet', 'SpikerEff', 'SpikerPos', 'SpikerPerSet', 'PointsTot', 'PointsPerMatch',
        'PointsPerSet', 'PlayedSets', 'Points', 'SideOut', 'ServeErr', 'ServeWin', 'ServeMinus',
        'ServePlus', 'ServeHP', 'ServeEx', 'RecErr', 'RecWin', 'RecMinus', 'RecPlus', 'RecHP', 'RecEx',
        'SpikeErr', 'SpikeWin', 'SpikeMinus', 'SpikePlus', 'SpikeHP', 'SpikeEx', 'BlockErr', 'BlockWin',
        'BlockMinus', 'BlockPlus', 'BlockHP', 'BlockEx', 'Number', 'Vote'
    ];

    export function toRedis(players: RawStatistic[]): CacheStatistic[] {
        return _.map(players, (player: any) => {
            // Convert boolean to number
            player.Captain = player.Captain ? 1 : 0;

            // Remove useless fields
            player.PlayerSurnameName = undefined;
            player.__type = undefined;

            return _.pickBy(player, (value) => !_.isNil(value)); // Remove nulls
        });
    }

    export function fromRedis(players: CacheStatistic[]): PlayerStatistic[] {
        return _.map(players, (player: any) => {
            player.Captain = Boolean(+player.Captain);
            player.ImageUrl = `http://dataprojectimages.cloudapp.net:8080/lml/TeamPlayer/100/200/TeamPlayer_${player.TeamID}_${player.PlayerID}.jpg`;
            _.forEach(toNumber, field => {
                player[field] = _.toNumber(player[field]); // Convert strings back to numbers
            });
            return player;
        });
    }
}