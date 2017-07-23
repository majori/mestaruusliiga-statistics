import { Statistics } from './services/api';
import * as cache from './services/cache';

export async function getAllPlayerStatistics() {
    const compID = 21;
    const phaseID = 0;

    try {
        const players = await cache.PlayerStatistics.get();
        return players;

    } catch (err) {
        if (err === 'NoPlayers') {
            const players = await Statistics.getData({
                compID,
                phaseID,
                maximumRows: await Statistics.getCount({ compID, phaseID })
            });

            await cache.PlayerStatistics.set(players);
            return cache.PlayerStatistics.get();
        } else {
            throw err;
        }
    }
}