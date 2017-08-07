import * as _ from 'lodash';

export namespace Config {
    export const http = {
        hostname: (process.env.hostname || '127.0.0.1') as string,
        port: (process.env.port || 4000) as number,
    };

    export const redis = {
        server: {
            host: process.env.redis_host || '127.0.0.1',
            port: process.env.redis_port ? _.toNumber(process.env.redis_port) : 6379,
            auth_pass: process.env.redis_access_key,
            tls: (process.env.NODE_ENV === 'production') ? {
                servername: process.env.redis_host
            } : undefined
        },

        // Seconds until redis keys expire
        expire: {
            players: process.env.redis_expire_players ? _.toNumber(process.env.redis_expire_players) : 3600, // seconds
            scores: process.env.redis_expire_scores ? _.toNumber(process.env.redis_expire_scores) : 60, // seconds
        },
    };

    export const scraper = {
        pageExpire: 10 * 60 * 1000, // milliseconds
        processInterval: 5 * 1000, // milliseconds
    };
}
