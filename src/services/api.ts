import * as request from 'superagent';
import * as _ from 'lodash';

// Corresponding CompID and PhaseID
const categories = {
    regular: {
        men: [ 19, 21 ],
        women: [ 21, 0 ],
    },
    playoffs: {
        men: [ 24, 26 ],
        women: [ 23, 25 ],
    },
    qualifiers: {
        men: [ 26, 28 ],
        women: [ 0, 0 ], // Not yet discovered
    }
}

export namespace Statistics {
    const apiUrl = 'http://lml-web.dataproject.com/Statistics_AllPlayers.aspx';

    export async function getCount(options: ICountOptions) {
        const res = await request
            .post(`${apiUrl}/GetCount`)
            .send({
                compID: _.get(categories, [options.category, options.gender, 0]),
                phaseID: _.get(categories, [options.category, options.gender, 1]),
                filterExpressions: options.filterExpressions || [],
                playerSearchByName: options.playerSearchByName || '',
            });

        return res.body.d;
    } 
    
    export async function getData(options: IDataOptions): Promise<PlayerStatistic[]> {
        const res = await request
            .post(`${apiUrl}/GetData`)
            .send({
                compID: _.get(categories, [options.category, options.gender, 0]),
                phaseID: _.get(categories, [options.category, options.gender, 1]),
                maximumRows: options.maximumRows,
                sortExpressions: options.sortExpressions || '',
                startIndex: options.startIndex || 0,
                filterExpressions: options.filterExpressions || [],
                playerSearchByName: options.playerSearchByName || '',
            });

        return res.body.d;
    } 
}