import { Request, Response } from "express";
import ScraperService from "../services/scraper";

export default class ScraperController {
    private scraperService = new ScraperService();

    public async storeHTMLForSites(req: Request, res: Response): Promise<void> {
        try {
            let startTime = process.hrtime();
            const savedPages = await this.scraperService.scrapeAndStoreHMTL();
            const test = process.hrtime(startTime)
            const queryTime = Number((test[0] + (test[1] / 1e9)).toFixed(5))

            console.log("Time for scraping html: " + queryTime);

            res.status(200).json({ time: queryTime, savedPages })
        } catch (error) {
            console.log(error);
        }
    }

    public async createDataset(req: Request, res: Response): Promise<void> {
        try {
            let startTime = process.hrtime();
            await this.scraperService.createDataset();
            const test = process.hrtime(startTime)
            const queryTime = Number((test[0] + (test[1] / 1e9)).toFixed(5))

            console.log(queryTime);

            res.status(200).json({ time: queryTime })
        } catch (error) {
            console.log(error);
        }
    }
}