import { Request, Response } from "express";
import ScraperService from "../services/scraper";

export default class ScraperController {
    private scraperService = new ScraperService();

    public async getScrapingResults(req: Request, res: Response): Promise<void> {
        try {
            console.log("in controller")
            let startTime = process.hrtime();
            await this.scraperService.startScraping();

            const test = process.hrtime(startTime)
    
            const queryTime = Number((test[0] + (test[1] / 1e9)).toFixed(5))

            console.log(queryTime);

            res.status(200).json({message: "From controller"})
        } catch (error) {
            console.log(error);
        }
    }
}