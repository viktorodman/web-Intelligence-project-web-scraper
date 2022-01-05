import express, { Application } from "express";
import morgan from "morgan";
import IndexRouter from "../routers/index-router";

export default class Server {
    private _app: Application = express();
    private _indexRouter: IndexRouter = new IndexRouter();

    public constructor(private _port: string | number) {}

    public async run() {
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

