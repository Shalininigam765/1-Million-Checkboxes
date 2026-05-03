import Redis from "ioredis";

/*export const publisher = new Redis({
    host: 'localhost',
    port: 6379
});

export const subscriber = new Redis({
    host: 'localhost',
    port: 6379
});*/

function createRedisConnection(){
    const client = new Redis({ host: 'localhost', port: 6379 });
    client.on('error', (err) => console.error('[Redis] Connection error:', err.message));
    return client;
}

export const redis = createRedisConnection()


export const publisher = createRedisConnection()

export const subscriber = createRedisConnection()