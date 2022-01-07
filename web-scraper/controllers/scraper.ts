import { Request, Response } from "express";
import ScraperService from "../services/scraper";

export default class ScraperController {
    private scraperService = new ScraperService();

    public async getScrapingResults(req: Request, res: Response): Promise<void> {
        try {
            console.log("in controller")
            await this.scraperService.startScraping();

            res.status(200).json({message: "From controller"})
        } catch (error) {
            console.log(error);
        }
    }
}