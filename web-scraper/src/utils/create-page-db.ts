import Page from "../models/page";
import PageDB from "../models/page-db";
import ScraperService from "../services/scraper"
import { readLinksFromFile, readWordsFromFile } from "./file-io";
import { startTimer, stopTimer } from "./timer";


export const createPageDB = async () => {
    const filenames = await scrapeHTMLAndCreateDatasets();

    let timer = startTimer('Creating Page db from datasets')
    const pageDB = await createPageDBFromDatasets(filenames);
    stopTimer(timer, 'Done creating pageDB from datasets... time: ');
    return pageDB;
}

const scrapeHTMLAndCreateDatasets = async (): Promise<string[]> => {
    const scraperService = new ScraperService();

    let timer = startTimer("Scraping pages from the internet....");
    await scraperService.scrapeAndStoreHMTL();
    stopTimer(timer, "Done scraping and storing HMTL, time: ");

    timer = startTimer("Creating datasets from the saved html....");
    const filenames = await scraperService.createDataset();
    stopTimer(timer, "Done creating datasets, time: ");


    return filenames;
}

const createPageDBFromDatasets = async (filenames: string[]) => {
    const pageDB: PageDB = new PageDB();

    for (const filename of filenames) {
        const page: Page = new Page(`wiki/${filenames}`);
        const wordsFromFile = await readWordsFromFile(filename);
        const linksFromFile = await readLinksFromFile(filename);

        pageDB.addPage(page, wordsFromFile, linksFromFile);
    }

    calculatePageRank(pageDB);

    return pageDB;
}


export const normalize = (scores: number[], smallIsBetter: boolean) => {
    if(smallIsBetter) {
        const min_val = Math.min(...scores);

        for (let i = 0; i < scores.length; i++) {
            scores[i] = (min_val / (Math.max(scores[i], 0.00001)));
        }
    } else {
        let max_val = Math.max(...scores);
        max_val = Math.max(max_val, 0.00001);

        for (let i = 0; i < scores.length; i++) {
            scores[i] = (scores[i] / max_val);
        }
    }
}

const calculatePageRank = (pageDB: PageDB) => {
    const MAX_ITERATIONS = 20;
    let ranks: number[] = []

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        ranks = [];

        for (let j = 0; j < pageDB.pages.length; j++) {
            ranks.push(iteratePR(pageDB.pages[j], pageDB));
        }
        
        for (let k = 0; k < pageDB.pages.length; k++) {
            pageDB.pages[k].pageRank = ranks[k];
        }
    }

    normalize(ranks, false);


    for (let i = 0; i < pageDB.pages.length; i++) {
        pageDB.pages[i].pageRank = ranks[i];
    }
}

const iteratePR = (page: Page, pageDB: PageDB) => {
    let pr: number = 0;


    for (let i = 0; i < pageDB.pages.length; i++) {
        const currentPage = pageDB.pages[i];
        if (currentPage.hasLinkTo(page)) {
            pr += (currentPage.pageRank / currentPage.getNoLinks());
        }
    }

    pr = 0.85 * pr + 0.15;
    
    return pr;
}