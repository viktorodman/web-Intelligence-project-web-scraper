export default class Page {
    private _url: string;
    private _words: number[] = [];
    private _pageRank: number = 1;
    private _links: Set<string> = new Set<string>();

    constructor(url: string) {
        this._url = url
    }

    public set pageRank(score: number) {
        this._pageRank = score;
    }

    public get pageRank(): number {
        return this._pageRank;
    }

    public get links(): Set<string> {
        return this._links;
    }

    public get url(): string {
        return this._url;
    }

    public get words(): number[] {
        return this._words;
    }

    public addLink(link: string) {
        this._links.add(link);
    }

    public hasLinkTo(page: Page): boolean {
        for (const link of this._links) {
            if (page._url === link) {
                return true;
            }
        }

        return false;
    }

    public getNoLinks(): number {
        return this._links.size;
    }

    public addWord (word: number): void {
        this._words.push(word);
    }
    
    public containsWord(word: number): boolean {
        for (const wordInList of this._words) {
            if (wordInList === word) return true;
        }

        return false;
    }
}