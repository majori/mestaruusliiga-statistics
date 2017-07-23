import * as request from 'superagent';
import * as _ from 'lodash';

export namespace Statistics {
    const apiUrl = 'http://lml-web.dataproject.com/Statistics_AllPlayers.aspx';

    export async function getCount(options: ICountOptions) {
        const res = await request
            .post(`${apiUrl}/GetCount`)
            .send({
                compID: options.compID,
                phaseID: options.phaseID,
                filterExpressions: options.filterExpressions || [],
                playerSearchByName: options.playerSearchByName || '',
            });

        return res.body.d;
    } 
    
    export async function getData(options: IDataOptions): Promise<PlayerStatistic[]> {
        const res = await request
            .post(`${apiUrl}/GetData`)
            .send({
                compID: options.compID,
                phaseID: options.phaseID,
                maximumRows: options.maximumRows,
                sortExpressions: options.sortExpressions || '',
                startIndex: options.startIndex || 0,
                filterExpressions: options.filterExpressions || [],
                playerSearchByName: options.playerSearchByName || '',
            });

        return res.body.d;
    } 
}