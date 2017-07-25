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

    server.get('/players/:category/:gender/raw', async (req, res) => {
        if (
            _.includes(['regular', 'playoffs', 'qualifiers'], req.params.category) &&
            _.includes(['men', 'women'], req.params.gender)
        ) {
            const players = await data.getAllPlayerStatistics({
                category: req.params.category,
                gender: req.params.gender
            });
            res.json(players);
        } else {
            res.send('Not found');
        }
    });

    server.get('/players/search', async (req, res) => {
        res.json(await data.searchPlayers({ Team: 'ducks' }, { gender: 'men', category: 'regular'}))
    });

    return server;
} 