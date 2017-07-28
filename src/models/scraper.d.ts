interface PageOptions {
    id: string;
}

interface ScorePageOptions extends PageOptions {}

interface ScraperPage {
    id: string;
    requestedAt: number;
}
