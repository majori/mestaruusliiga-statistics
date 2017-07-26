import * as express from 'express';
import { Request, Response, NextFunction} from 'express';
import { ExtendedRequest } from '../models/http';
import * as _ from 'lodash';
import * as path from 'path';
import * as data from '../data';

const router = express.Router();

router.use('/:category/:gender', (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
});

router.get('/:category/:gender/', (req, res) => {
    res.render('statistics')
});

// --------------  PLAYER ROUTER ---------------------
//
const playerRouter = express.Router();

playerRouter.get('/', async (req, res) => {
    res.render('players');
});

playerRouter.get('/fields', async (req, res) => {
    res.json(await data.getPlayerFields());
});

playerRouter.get('/raw', async (req: ExtendedRequest, res) => {
    res.json(await data.getAllPlayerStatistics(req.options));
});

playerRouter.get('/search/raw', async (req: ExtendedRequest, res) => {
    res.json(await data.searchPlayers(req.query, req.options))
});

router.use('/:category/:gender/players', playerRouter);

export default router;