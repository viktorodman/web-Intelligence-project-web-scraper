import { Request, Response, Router } from "express";

export default class IndexRouter {
    private _router: Router = Router();

    public constructor() { this.initializeRoutes() }

    public get router() { return this._router };

    private initializeRoutes(): void {
        this._router.post('/scrape', (req: Request, res: Response) => console.log("object"));
        this._router.get('/', (req: Request, res: Response) => res.status(200).json({message: "Hello from api :)"}))
    }
}