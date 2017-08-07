import * as request from 'superagent';
import * as _ from 'lodash';

// Corresponding CompID and PhaseID
const categories = {
    regular: {
        men: [ 19, 21 ],
        women: [ 21, 23 ],
    },
    playoffs: {
        men: [ 24, 26 ],
        women: [ 23, 25 ],
    },
    qualifiers: {
        men: [ 26, 28 ],
        women: [ 0, 0 ], // Not yet discovered
    },
};

const apiUrl = 'http://lml-web.dataproject.com/Statistics_AllPlayers.aspx';

export async function getCount(params: ICountOptions) {
    const res = await request
        .post(`${apiUrl}/GetCount`)
        .send({
            compID: _.get(categories, [params.options.category, params.options.gender, 0]),
            phaseID: _.get(categories, [params.options.category, params.options.gender, 1]),
            filterExpressions: params.filterExpressions || [],
            playerSearchByName: params.playerSearchByName || '',
        });

    return res.body.d;
}

export async function getData(params: IDataOptions): Promise<RawStatistic[]> {
    const res = await request
        .post(`${apiUrl}/GetData`)
        .send({
            compID: _.get(categories, [params.options.category, params.options.gender, 0]),
            phaseID: _.get(categories, [params.options.category, params.options.gender, 1]),
            maximumRows: params.maximumRows,
            sortExpressions: params.sortExpressions || '',
            startIndex: params.startIndex || 0,
            filterExpressions: params.filterExpressions || [],
            playerSearchByName: params.playerSearchByName || '',
        });

    return res.body.d;
}
