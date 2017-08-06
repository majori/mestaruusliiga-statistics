import * as _ from 'lodash';

import * as StatisticService from './services/api';
import * as cache from './services/cache';

import { Scraper } from './services/scraper/scraper';
import { MestaruusliigaScorePage } from './services/scraper/scorePages/mestaruusliiga';

const scraper = new Scraper();
scraper.init();

export namespace Statistics {
    async function setupPlayers(options: PlayerOptions) {
        try {
            await cache.PlayerStatistics.exists(options);
        } catch (err) {
            if (err === 'NoPlayers') {
                const players = await StatisticService.getData({
                    options,
                    maximumRows: await StatisticService.getCount({ options }),
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
                const value = _.get<RefinedStatistics, string | number>(player, key);

                if (_.isObject(searchValue) && _.isNumber(value)) {
                    return _.inRange(value, searchValue.min || 0, searchValue.max);
                } else {
                    if (_.isString(value)) {
                        return _.includes(_.toLower(value), _.toLower(searchValue));
                    } else if (_.isNumber(value)) {
                        return _.eq(value, searchValue);
                    }
                }
                return false;

            }).every(_.identity);
        });
    }

    export async function getPlayerFields() {
        const keys = await cache.PlayerStatistics.getKeys();

        if (_.isEmpty(keys)) {
            await setupPlayers({ category: 'regular', gender: 'men'});
            return cache.PlayerStatistics.getKeys();
        } else {
            return keys;
        }
    }
}

export namespace Livescore {
    scraper.onUpdate.on('update', (newScores) => {
        cache.Livescore.set(newScores.id, newScores.scores);
    });

    export async function get(id: string, scorePageId: string): Promise<MatchPoints> {
        const combinedId = `${scorePageId}:${id}`;
        const scores = await cache.Livescore.get(combinedId);

        if (scores) {
            scraper.extendPageExpireTime(combinedId);
            return scores;
        }

        if (!scraper.scorePageIsOpen(combinedId)) {
            await scraper.createScorePage(MestaruusliigaScorePage, { id });
        }

        await new Promise((res) => setTimeout(res, 3000));

        return await Livescore.get(id, scorePageId);
    }
}
