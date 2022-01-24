import Page from "./page";

export default class Score {
    private _page: Page | null;
    private _score: number;
    private _content: number[] = [];
    private _location: number[] = [];

    constructor(page: Page | null = null, score: number = 0) {
        this._page = page;
        this._score = score;
    }

    public get page(): Page | null {
        return this._page;
    }

    public get score(): number {
        return this._score;
    }
    
    public get content(): number[] {
        return this._content
    }
    
    public get location(): number[] {
        return this._location;
    }
}