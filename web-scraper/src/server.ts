import express, { Application } from "express";
import morgan from "morgan";
import PageDB from "./models/page-db";
import IndexRouter from "./routers/index-router";
import { createPageDB } from "./utils/create-page-db";
import { startTimer, stopTimer } from "./utils/timer";

export default class Server {
    private _app: Application = express();
    private _indexRouter: IndexRouter = new IndexRouter();
    private pageDB: PageDB = new PageDB();

    public constructor(private _port: string | number) {}

    public async run() {
     /*    let timer = startTimer("Creating PageDB...")
        
        this.pageDB = await createPageDB();

        console.log(this.pageDB.pages.length)
        stopTimer(timer, "Done creating db, timer: ");
 */
        this._app.use(morgan('dev'));
        this._app.use('/api', this._indexRouter.router);
        this.listen();
    }
    
    private listen() {
        this._app.listen(
            this._port, () => console.log(`App listening on http://localhost:${this._port}`)
        )
    }
}

