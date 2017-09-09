import { load } from 'cheerio';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as request from 'superagent';

export async function getTeamMatches(teamID: number, previous?: boolean) {
  const res = await request
    .get('https://lentopallo.torneopal.fi/taso/naytajoukkue.php')
    .query({ joukkue: teamID, arkisto: previous ? 1 : 0 });

  const $ = load(res.text);

  const matches: any[] = [];

  $('.ottelulista tbody tr').each((i, e) => {
    const $$ = $(e);
    const match = {
      home: $$.find('td.col_kotisiisti > a').text(),
      guest: $$.find('td.col_vierassiisti > a').text(),
      rounds: '',
      meta: {
        place: '',
        date: '',
      },
    };

    const date = moment();
    const rawDate = $$.find('td.col_pvmsiisti').text().split('.');

    date.date(+rawDate[0]);
    date.month(+rawDate[1]);

    if (rawDate[2]) {
      date.year(+rawDate[2]);
    }

    if (date.isAfter(moment())) {
      match.meta.place = $$.find('td.col_info').text().slice(5);

      const clock = _.split($$.find('td.col_info').text().slice(0, 5), ':', 2);
      date.hour(+clock[0]);
      date.minute(+clock[1]);

    } else {
      match.rounds = $$.find('td.col_info').text();
    }

    match.meta.date = date.format(`DD.MM.YYYY${match.rounds ? '' : ' [klo] HH:mm'}`);

    matches.push(match);
  });

  return matches;
}
