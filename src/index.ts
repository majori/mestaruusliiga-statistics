import * as data from './data';


export async function init() { 
    const p = await data.getAllPlayerStatistics();
    //console.log(p);
}

init();