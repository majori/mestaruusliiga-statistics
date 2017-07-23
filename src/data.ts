import { Statistics } from './services/api';
import * as redis from './services/redis';

export async function getAllPlayerStatistics() {
    const compID = 21;
    const phaseID = 0;

    const players = await Statistics.getData({
        compID,
        phaseID,
        maximumRows: await Statistics.getCount({ compID, phaseID })
    });

    await redis.PlayerStatistics.set(players);

    return redis.PlayerStatistics.get();
}