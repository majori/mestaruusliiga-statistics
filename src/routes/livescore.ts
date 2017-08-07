import * as express from 'express';
import { Request, Response, NextFunction} from 'express';
import * as _ from 'lodash';
import * as path from 'path';

import { Livescore } from '../data';
import { ScorePageEnum } from '../services/live-scraper/scorePage';
import { ExtendedRequest } from '../models/http';

const router = express.Router();

router.get('/mestaruusliiga/:id', async (req, res) => {
    res.render('pages/livescore', {
        self: true,
        ...(await Livescore.get(req.params.id, ScorePageEnum.MestaruusLiiga)),
    });
});

router.get('/mestaruusliiga/:id/raw', async (req, res) => {
    res.json(await Livescore.get(req.params.id, ScorePageEnum.MestaruusLiiga));
});

export default router;
