import { PhantomJS, WebPage, create as createInstance} from 'phantom';
import * as _ from 'lodash';
import { EventEmitter } from 'events';

import { Config } from '../../config';
import { ScorePage, ScoreScraperPage } from './scorePage';
import { MestaruusliigaScorePage } from './scorePages/mestaruusliiga';

// This class controls opened pages and process
// them every `updateInterval` second. If nobody requests the content of the opened
// page, it will be closed automatically after `expireTime`
export class Scraper {
    
    private instance?: PhantomJS;
    private openPages: { scorePages: { [key: string]: ScoreScraperPage } };
    private updateInterval: number = Config.scraper.processInterval;
    private expireTime: number = Config.scraper.pageExpire;
    public onUpdate: EventEmitter = new EventEmitter();

    constructor() {
        this.openPages = {
            scorePages: {},
        };

        // Set continuous task to check and proccess open pages
        setInterval(() => this.processScorePages(), this.updateInterval)
    }

    async init() {
        this.instance = await createInstance();
    }

    // Give more time to page before expiring
    extendPageExpireTime(id: string) {
        if (this.scorePageIsOpen(id)) {
            this.openPages.scorePages[id].requestedAt = Date.now();
        }
    }

    // Check if page with given ID is open
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
        // Check if there is any active pages
        if (!_.isEmpty(this.openPages.scorePages)) {
            console.log(`Processing ${_.size(this.openPages.scorePages)} pages`)
            const now = Date.now();

            _.forEach(this.openPages.scorePages, async (pageInfo) => {
                
                // Page hasn't expired yet, get scores 
                if (now - pageInfo.requestedAt < this.expireTime) {
                    const scores = await pageInfo.page.evaluateScores();
                    this.onUpdate.emit('update', { id: pageInfo.id, scores });

                // Page has expired, close it
                } else {
                    console.log('Closing page', pageInfo.id);
                    pageInfo.page.close();
                    delete this.openPages.scorePages[pageInfo.id]
                }
                
            });
        }
    }

    async close() {
        if (!this.instance) throw new Error();

        // Close all open pages
        if (_.isEmpty(this.openPages.scorePages)) {
            for(let page of _.values(this.openPages.scorePages)) {
                await page.page.close()
            }
        }
        this.instance.exit();
        this.instance = undefined;
    }
}

// The abstract base page class which controls opening page to specific url and closing it
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