import { Statistics } from './services/api';
import * as cache from './services/cache';

export async function getAllPlayerStatistics() {
    const category = 'regular';
    const gender = 'men';

    try {
        const players = await cache.PlayerStatistics.get();
        return players;

    } catch (err) {
        if (err === 'NoPlayers') {
            const players = await Statistics.getData({
                category,
                gender,
                maximumRows: await Statistics.getCount({ category, gender })
            });

            await cache.PlayerStatistics.set(players);
            return cache.PlayerStatistics.get();
        } else {
            throw err;
        }
    }
}