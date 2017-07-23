import { Statistics } from './services/api';
import * as cache from './services/cache';

export async function getAllPlayerStatistics(category: PlayerCategory, gender: PlayerGender) {

    try {
        const players = await cache.PlayerStatistics.get(category, gender);
        return players;

    } catch (err) {
        if (err === 'NoPlayers') {
            const players = await Statistics.getData({
                category,
                gender,
                maximumRows: await Statistics.getCount({ category, gender })
            });

            await cache.PlayerStatistics.set(category, gender, players);
            return cache.PlayerStatistics.get(category, gender);
        } else {
            throw err;
        }
    }
}