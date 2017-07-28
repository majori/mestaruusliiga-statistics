import { PhantomJS, WebPage, create as createInstance} from 'phantom';
import { ScorePage } from './scorePage';
import { MestaruusliigaScorePage } from './scorePages/mestaruusliiga';
import * as _ from 'lodash';

class ScraperPage {
    public id: string;
    public requestedAt: number;
}

class ScoreScraperPage extends ScraperPage {
    public page: ScorePage;
}

export class Scraper {
    
    private instance?: PhantomJS;
    private openPages: {
        scorePages: ScoreScraperPage[];
    }
    private updateInterval: number = 5000;

    constructor() {
        this.openPages = {
            scorePages: [],
        };

        setInterval(() => this.processScorePages(), this.updateInterval)
    }

    async create() {
        this.instance = await createInstance();
    }

    async createScorePage(scorePageClass: typeof MestaruusliigaScorePage, pageOptions: PageOptions) {
        if (!this.instance) throw new Error();

        const scorePage = new scorePageClass(await this.instance.createPage(), pageOptions);
        await scorePage.openPage();
        this.openPages.scorePages.push({
            id: `${scorePage.id}:${pageOptions.id}`,
            requestedAt: Date.now(),
            page: scorePage
        });
        return scorePage;
    }

    async processScorePages() {
        if (!_.isEmpty(this.openPages.scorePages)) {
            _.forEach(this.openPages.scorePages, async (pageInfo) => {
                const scores = await pageInfo.page.evaluateScores();
                
                // TODO: Save scores to redis
            });
        }
    }

    async close() {
        if (!this.instance) throw new Error();

        if (_.isEmpty(this.openPages.scorePages)) {
            for(let page of this.openPages.scorePages) {
                await page.page.close()
            }
        }
        this.instance.exit();
        this.instance = undefined;
    }
}

export abstract class Page {
    abstract id: string;
    private waitTime: number = 5000;

    constructor(public page: WebPage, public options: PageOptions) {}

    abstract url(options: PageOptions): string;

    async openPage() {
        console.log(`Opening page ${this.url(this.options)}`)
        await this.page.open(this.url(this.options));

        console.log(`Page ${this.url(this.options)} opened, waiting ${this.waitTime}ms page to load`)
        await new Promise(res => setTimeout(res, this.waitTime));
    }

    async close() {
        await this.page.close();
    }

}