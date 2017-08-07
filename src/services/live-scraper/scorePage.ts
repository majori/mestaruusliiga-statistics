import { Page } from './scraper';

export abstract class ScorePage extends Page {
    public abstract parseScores: () => MatchPoints;
    public async evaluateScores() {
        return this.page.evaluate(this.parseScores);
    }
}

export enum ScorePageEnum {
    MestaruusLiiga = 'mliiga',
}

export interface ScoreScraperPage extends ScraperPage {
    page: ScorePage;
}
