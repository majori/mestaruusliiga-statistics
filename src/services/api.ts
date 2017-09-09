import * as request from 'superagent';
import * as _ from 'lodash';

import { Config } from '../config';

const apiUrl = 'http://lml-web.dataproject.com/Statistics_AllPlayers.aspx';

export async function getCount(params: ICountOptions) {
    const res = await request
        .post(`${apiUrl}/GetCount`)
        .send({
            compID: _.get(Config.apiIds, [params.options.category, params.options.gender, 'compId']),
            phaseID: _.get(Config.apiIds, [params.options.category, params.options.gender, 'phaseId']),
            filterExpressions: params.filterExpressions || [],
            playerSearchByName: params.playerSearchByName || '',
        });

    return res.body.d;
}

export async function getData(params: IDataOptions): Promise<RawStatistic[]> {
    const res = await request
        .post(`${apiUrl}/GetData`)
        .send({
            compID: _.get(Config.apiIds, [params.options.category, params.options.gender, 'compId']),
            phaseID: _.get(Config.apiIds, [params.options.category, params.options.gender, 'phaseId']),
            maximumRows: params.maximumRows,
            sortExpressions: params.sortExpressions || '',
            startIndex: params.startIndex || 0,
            filterExpressions: params.filterExpressions || [],
            playerSearchByName: params.playerSearchByName || '',
        });

    return res.body.d;
}
