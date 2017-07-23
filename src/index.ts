import * as data from './data';
import * as _ from 'lodash';

export async function init() { 
    const p = await data.getAllPlayerStatistics();
    console.log(p);
}

init();