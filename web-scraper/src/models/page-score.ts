import Page from './page'

export default class PageScore {
    private _score: number = 0;
    private _content: number = 0;
    private _location: number = 0;
    private _pageRank: number = 0;
    private _page: Page;

    constructor(page: Page, score: number, content: number, location: number, pageRank: number){
        this._page = page;
        this._score = score;
        this._content = content;
        this._location = location;
        this._pageRank = pageRank;
    } 

    public get content(): number {
        return this._content;
    }

    public get pageRank(): number {
        return this._pageRank;
    }

    public get score(): number {
        return this._score;
    }

    public get location(): number {
        return this._location;
    }

    public get page(): Page {
        return this._page;
    }

    public set content(score: number) {
        this._content = score;
    }

    public set pageRank(score: number) {
        this._pageRank = score;
    }
    
    public set score(newScore: number) {
        this._score = newScore;
    }

    public set location(score: number) {
        this._location = score;
    }
}