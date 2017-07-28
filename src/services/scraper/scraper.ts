import { PhantomJS, WebPage, create as createInstance} from 'phantom';
import * as _ from 'lodash';
import { EventEmitter } from 'events';

import { ScorePage } from './scorePage';
import { MestaruusliigaScorePage } from './scorePages/mestaruusliiga';

class ScraperPage {
    public id: string;
    public requestedAt: number;
}

class ScoreScraperPage extends ScraperPage {
    public page: ScorePage;
}

export class Scraper {
    
    private instance?: PhantomJS;
    private openPages: { scorePages: { [key: string]: ScoreScraperPage } };
    private updateInterval: number = 5000;
    private expireTime: number = 60 * 1000;
    public onUpdate: EventEmitter = new EventEmitter();

    constructor() {
        this.openPages = {
            scorePages: {},
        };

        setInterval(() => this.processScorePages(), this.updateInterval)
    }

    async init() {
        this.instance = await createInstance();
    }

    extendPageExpireTime(id: string) {
        if (this.scorePageIsOpen(id)) {
            this.openPages.scorePages[id].requestedAt = Date.now();
        }
    }

    scorePageIsOpen(id: string): boolean {
        return _.has(this.openPages.scorePages, id);
    }

    async createScorePage(scorePageClass: typeof MestaruusliigaScorePage, pageOptions: PageOptions) {
        if (!this.instance) throw new Error();

        const scorePage = new scorePageClass(await this.instance.createPage(), pageOptions);
        await scorePage.openPage();

        const id = `${scorePage.id}:${pageOptions.id}`;
        this.openPages.scorePages[id] = {
            id,
            requestedAt: Date.now(),
            page: scorePage
        };

        return id;
    }

    async processScorePages() {
        if (!_.isEmpty(this.openPages.scorePages)) {
            console.log(`Processing ${_.size(this.openPages.scorePages)} pages`)
            const now = Date.now();

            _.forEach(this.openPages.scorePages, async (pageInfo) => {
                if (now - pageInfo.requestedAt < this.expireTime) {
                    const scores = await pageInfo.page.evaluateScores();
                    this.onUpdate.emit('update', { id: pageInfo.id, scores });

                } else {
                    // Page has expired, close it
                    console.log('Closing page', pageInfo.id);
                    pageInfo.page.close();
                    delete this.openPages.scorePages[pageInfo.id]
                }
                
            });
        }
    }

    async close() {
        if (!this.instance) throw new Error();

        if (_.isEmpty(this.openPages.scorePages)) {
            for(let page of _.values(this.openPages.scorePages)) {
                await page.page.close()
            }
        }
        this.instance.exit();
        this.instance = undefined;
    }
}

export abstract class Page {
    abstract id: string;
    private waitTime: number = 4000;

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