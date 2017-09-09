import { load } from 'cheerio';
import * as _ from 'lodash';
import * as request from 'superagent';

export async function getMatches() {
  const res = await request
    .get('https://lentopallo.torneopal.fi/taso/joukkue.php')
    .query({ joukkue: 12973 });

  const $ = load(res.text);
  const rows =  $('.ottelulista tbody tr');

  _.map(rows, (row) => {
    const y = load(row);
    const z = y('td').children();

    console.log(z.html());
  });
  return;
}
