import { load } from 'cheerio';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as request from 'superagent';

export async function getMatches() {
  const res = await request
    .get('https://lentopallo.torneopal.fi/taso/joukkue.php')
    .query({ joukkue: 12973 });

  const $ = load(res.text);

  const matches: any[] = [];

  $('.ottelulista tbody tr').each((i, e) => {
    const $$ = $(e);
    const match = {
      home: $$.find('td.col_kotisiisti > a').text(),
      guest: $$.find('td.col_vierassiisti > a').text(),
      meta: {
        place: $$.find('td.col_info').text().slice(5),
        date: moment(),
      },
    };

    const clock = _.split($$.find('td.col_info').text().slice(0, 5), ':', 2);
    const rawDate = $$.find('td.col_pvmsiisti').text().split('.');

    match.meta.date.date(+rawDate[0]);
    match.meta.date.month(+rawDate[1]);

    if (rawDate[2]) {
      match.meta.date.year(+rawDate[2]);
    }

    match.meta.date.hour(+clock[0]);
    match.meta.date.minute(+clock[1]);

    matches.push(match);
  });

  return matches;
}
