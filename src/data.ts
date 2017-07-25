import * as _ from 'lodash';

import { Statistics } from './services/api';
import * as cache from './services/cache';

async function setupPlayers(options: PlayerOptions) {
    try {
        await cache.PlayerStatistics.exists(options);
    } catch (err) {
        if (err === 'NoPlayers') {
            const players = await Statistics.getData({
                options,
                maximumRows: await Statistics.getCount({ options })
            });

            await cache.PlayerStatistics.set(options, players);
        } else {
            throw err;
        }
    }
}

export async function getAllPlayerStatistics(options: PlayerOptions) {
    await setupPlayers(options);
    return cache.PlayerStatistics.get(options);
}

export async function searchPlayers(params: SearchParams, options: PlayerOptions) {
    await setupPlayers(options);
    const players = await cache.PlayerStatistics.get(options);

    return _.filter(players, (player) => {
        return _(params).map((searchValue: any, key: string) => {
            const value = _.get<PlayerStatistic, string | number>(player, key);

            if (_.isObject(searchValue) && _.isNumber(value)) {
                return _.inRange(value, searchValue.min || 0, searchValue.max)
            } else {
                if (_.isString(value)) {
                    return _.includes(_.toLower(value), _.toLower(searchValue))
                } else if (_.isNumber(value)) {
                    return _.eq(value, searchValue);
                }
            }
            return false;

        }).every(_.identity);
    });
}