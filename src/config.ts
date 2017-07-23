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
        expire: process.env.redis_expire ? _.toNumber(process.env.redis_expire) : 300,
    };
}