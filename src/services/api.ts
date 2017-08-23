import * as request from 'superagent';
import * as _ from 'lodash';

// Corresponding CompID and PhaseID
export const apiIds = {
    regular: {
        men: {
          compId: 19,
          phaseId: 21,
        },
        women: {
          compId: 21,
          phaseId: 23,
        },
    },
    playoffs: {
        men: {
          compId: 24,
          phaseId: 26,
        },
        women: {
          compId: 23,
          phaseId: 25,
        },
    },
    qualifiers: {
        men: {
          compId: 26,
          phaseId: 28,
        },
        women: {
          compId: 0,
          phaseId: 0,
        },
    },
};

const apiUrl = 'http://lml-web.dataproject.com/Statistics_AllPlayers.aspx';

export async function getCount(params: ICountOptions) {
    const res = await request
        .post(`${apiUrl}/GetCount`)
        .send({
            compID: _.get(apiIds, [params.options.category, params.options.gender, 'compId']),
            phaseID: _.get(apiIds, [params.options.category, params.options.gender, 'phaseId']),
            filterExpressions: params.filterExpressions || [],
            playerSearchByName: params.playerSearchByName || '',
        });

    return res.body.d;
}

export async function getData(params: IDataOptions): Promise<RawStatistic[]> {
    const res = await request
        .post(`${apiUrl}/GetData`)
        .send({
            compID: _.get(apiIds, [params.options.category, params.options.gender, 'compId']),
            phaseID: _.get(apiIds, [params.options.category, params.options.gender, 'phaseId']),
            maximumRows: params.maximumRows,
            sortExpressions: params.sortExpressions || '',
            startIndex: params.startIndex || 0,
            filterExpressions: params.filterExpressions || [],
            playerSearchByName: params.playerSearchByName || '',
        });

    return res.body.d;
}
