import * as express from 'express';
import * as _ from 'lodash';
import * as path from 'path';
import * as data from './data';

export async function createServer() {
    const server = express();

    server.set('view engine', 'pug');
    server.set('views', path.join(__dirname, 'views'));

    server.get('/', (req, res) => {
        res.render('index', { title: 'Hey', message: 'Hello there!' })
    });

    server.get('/raw', async (req, res) => {
        res.json(await data.getAllPlayerStatistics());
    });

    return server;
} 