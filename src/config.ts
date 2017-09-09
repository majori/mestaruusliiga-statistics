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

    // Corresponding CompID and PhaseID for API calls
    export const apiIds = {
      regular: {
          men: {
            compId: 19,
            phaseId: 21,
          },
          women: {
            compId: 21,
            phaseId: 23,
          },
      },
      playoffs: {
          men: {
            compId: 24,
            phaseId: 26,
          },
          women: {
            compId: 23,
            phaseId: 25,
          },
      },
      qualifiers: {
          men: {
            compId: 26,
            phaseId: 28,
          },
          women: {
            compId: 0,
            phaseId: 0,
          },
      },
    };
}
