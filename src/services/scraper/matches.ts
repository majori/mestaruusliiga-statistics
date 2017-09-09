import { load } from 'cheerio';
import * as _ from 'lodash';
import * as request from 'superagent';

export async function getMatches() {
  const res = await request
    .get('https://lentopallo.torneopal.fi/taso/joukkue.php')
    .query({ joukkue: 12973 });

  const $ = load(res.text);

  const matches: any[] = [];

  $('.ottelulista tbody tr').each((i, e) => {
    const $$ = $(e);
    matches.push({
      home: $$.find('td.col_kotisiisti > a').text(),
      guest: $$.find('td.col_vierassiisti > a').text(),
      meta: {
        date: $$.find('td.col_pvmsiisti').text(),
        place: $$.find('td.col_info').text(),
      },
    });
  });

  return matches;
}
