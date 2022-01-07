import { Request, Response, Router } from "express";
import ScraperController from "../controllers/scraper";

export default class IndexRouter {
    private _router: Router = Router();
    private _scrapeController = new ScraperController();
    public constructor() { this.initializeRoutes() }

    public get router() { return this._router };

    private initializeRoutes(): void {
        this._router.post('/scrape', (req: Request, res: Response) => this._scrapeController.getScrapingResults(req, res));
        this._router.get('/', (req: Request, res: Response) => res.status(200).json({message: "Hello from api :)"}))
    }
}