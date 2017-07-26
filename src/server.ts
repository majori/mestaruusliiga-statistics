import * as express from 'express';
import { Request, Response, NextFunction} from 'express';
import { ExtendedRequest } from './models/http';
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

    const playerRouter = express.Router({ mergeParams: true });

    playerRouter.use((req: ExtendedRequest, res: Response, next: NextFunction) => {
        if (
            _.includes(['regular', 'playoffs', 'qualifiers'], req.params.category) &&
            _.includes(['men', 'women'], req.params.gender)
        ) {
            req.options = {
                category: req.params.category as PlayerCategory,
                gender: req.params.gender as PlayerGender
            };

            next();
        } else {
            res.send("Invalid category or gender");
        }
    })

    playerRouter.get('/raw', async (req: ExtendedRequest, res) => {
        res.json(await data.getAllPlayerStatistics(req.options));
    });

    playerRouter.get('/search/raw', async (req: ExtendedRequest, res) => {
        res.json(await data.searchPlayers(req.query, req.options))
    });

    server.use('/players/:category/:gender', playerRouter);

    return server;
} 