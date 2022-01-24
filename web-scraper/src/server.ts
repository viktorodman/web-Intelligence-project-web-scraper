import express, { Application } from "express";
import morgan from "morgan";
import SearchController from "./controllers/search-controller";
import PageDB from "./models/page-db";
import { createPageDB } from "./utils/create-page-db";
import { startTimer, stopTimer } from "./utils/timer";

export default class Server {
    private _app: Application = express();
    private searchController: SearchController = new SearchController();
    private pageDB: PageDB = new PageDB();

    public constructor(private _port: string | number) {}

    public async run() {
        let timer = startTimer("Creating PageDB...")
        
        this.pageDB = await createPageDB();

        console.log(this.pageDB.pages.length)
        stopTimer(timer, "Done creating db, timer: ");
   
        this._app.use(morgan('dev'));
        this._app.get('/api', (req, res) => res.status(200).json("Hello from API"));
        this._app.get('/api/search',(req, res) => this.searchController.searchPageDB(req, res, this.pageDB));
        this.listen();
    }
    
    private listen() {
        this._app.listen(
            this._port, () => console.log(`App listening on http://localhost:${this._port}`)
        )
    }
}

