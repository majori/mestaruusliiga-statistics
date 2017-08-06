import * as express from 'express';
import * as path from 'path';
import { Request, Response, NextFunction} from 'express';

import { ExtendedRequest } from './models/http';
import statistics from './routes/statistics';
import livescore from './routes/livescore';

export async function createServer() {
    const server = express();

    server.set('view engine', 'pug');
    server.set('views', path.join(__dirname, 'views'));

    server.use('/styles', express.static(path.join(__dirname, 'styles')));

    server.get('/', (req, res) => {
        res.render('pages/home', { title: 'Hey', message: 'Hello there!' });
    });

    // Parse category and gender
    server.use('/statistics', statistics);

    server.use('/livescore', livescore);

    return server;
}
