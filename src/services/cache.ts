import * as redis from 'redis';
import * as _ from 'lodash';

const config = {
    host: '127.0.0.1',
    port: 6379,
};

const client = redis.createClient(config.port, config.host);

export namespace PlayerStatistics {
    // Fields which are meaningful to compare
    const rankedFields = ['Points'];

    export async function get() {
        return new Promise((resolve, reject) => {
            client.smembers('players', (err, ids) => {
                if (err) return reject(err);
                if (_.isEmpty(ids)) return reject('NoPlayers');

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
        });
    }

    export async function set(players: PlayerStatistic[]) {
        return new Promise((resolve, reject) => {
            const multi = client.multi();

            _.forEach(Mapper.toRedis(players), (player) => {
                const id = `player:${player.PlayerID}`; // The ID format
                multi.hmset(id, player);
                multi.sadd('players', id)

                _.forEach(rankedFields, (field) => {
                    multi.ZADD(field, player[field] || 0, id);
                })
            });

            multi.expire('players', 20);

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

    export function toRedis(players: PlayerStatistic[]): any {
        return _.map(players, (player: any) => {
            player.Captain = player.Captain ? 1 : 0;
            return _.pickBy(player, _.identity); // Remove nulls
        });
    }

    export function fromRedis(players: any): PlayerStatistic[] {
        return _.map(players, (player: any) => {
            player.Captain = Boolean(+player.Captain);
            _.forEach(toNumber, field => {
                player[field] = +player[field]; // Convert strings back to numbers
            });
            return player;
        });
    }
}