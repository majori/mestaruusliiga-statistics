import * as data from './data';
import { createServer } from './server'
import { Config } from './config'; 

export async function init() { 
    const server = await createServer();

    server.listen(Config.http.port, Config.http.hostname, () => {
        console.log('Server listening');
    });
}

init();