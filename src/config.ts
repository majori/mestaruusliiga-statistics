export namespace Config {
    export const http = {
        hostname: process.env.hostname || '127.0.0.1',
        port: process.env.port || 4000,
    };

    export const redis = {
        host: process.env.redis_host || '127.0.0.1',
        port: process.env.redis_port || 6379,
    };
}