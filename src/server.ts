import * as express from 'express';
import { Request, Response, NextFunction} from 'express';
import { ExtendedRequest } from './models/http';

import * as path from 'path';

import statistics from './routes/statistics';

export async function createServer() {
    const server = express();

    server.set('view engine', 'pug');
    server.set('views', path.join(__dirname, 'views'));

    server.get('/', (req, res) => {
        res.render('index', { title: 'Hey', message: 'Hello there!' })
    });

    // Parse category and gender
    server.use('/statistics', statistics);

    return server;
} 