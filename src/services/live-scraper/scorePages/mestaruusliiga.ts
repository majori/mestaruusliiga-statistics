import { ScorePage, ScorePageEnum } from '../scorePage';

export class MestaruusliigaScorePage extends ScorePage {
    public id: string = ScorePageEnum.MestaruusLiiga;

    public url(options: ScorePageOptions) {
        return `http://lml-web.dataproject.com/DV_LiveScore.aspx?ID=${this.options.id}`;
    }

    // This function is used in PhantomJS, for that reason
    // arrow function notation can not be used
    public parseScores = function() { // tslint:disable-line
        return {
            home: {
                name: document.getElementById('LBL_TeamHome')!.innerHTML,
                roundsWon: +document.getElementById('LBL_WonSetHome')!.innerHTML,
                scores: [
                    +document.getElementById('LB_Set1Casa')!.innerHTML,
                    +document.getElementById('LB_Set2Casa')!.innerHTML,
                    +document.getElementById('LB_Set3Casa')!.innerHTML,
                    +document.getElementById('LB_Set4Casa')!.innerHTML,
                    +document.getElementById('LB_Set5Casa')!.innerHTML,
                ],
                golden: document.getElementById('LBL_GoldenSetHome')!.innerHTML,
            },
            guest: {
                name: document.getElementById('LBL_TeamGuest')!.innerHTML,
                roundsWon: +document.getElementById('LBL_WonSetGuest')!.innerHTML,
                scores: [
                    +document.getElementById('LB_Set1Ospiti')!.innerHTML,
                    +document.getElementById('LB_Set2Ospiti')!.innerHTML,
                    +document.getElementById('LB_Set3Ospiti')!.innerHTML,
                    +document.getElementById('LB_Set4Ospiti')!.innerHTML,
                    +document.getElementById('LB_Set5Ospiti')!.innerHTML,
                ],
                golden: document.getElementById('LBL_GoldenSetGuest')!.innerHTML,
            },
        };
    };
}
