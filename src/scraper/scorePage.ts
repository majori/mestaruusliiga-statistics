import { Page } from './scraper';

export abstract class ScorePage extends Page {
    abstract parseScores: () => MatchPoints;
    async evaluateScores() {
        return this.page.evaluate(this.parseScores);
    }
}
