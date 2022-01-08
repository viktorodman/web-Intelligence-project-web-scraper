import Page from "./page";

export default class PageDB {
    private _wordTold: Map<string, number> = new Map<string, number>();
    private _pages: Page[] = [];

    constructor(wordToId = new Map<string, number>()) {
        this._wordTold = wordToId;
    }


    public set pages(newPages: Page[]) {
        this._pages = newPages;
    }

    public get pages() {
        return this._pages;
    }

    public getPagesWithWord(phrase: string): PageDB {
        const pagesIncludingWord: Page[] = []
        const wordsInPhrase: string[] = phrase.split(" "); 
        let allWordsExists: boolean = true;

        const possibleWords: string[] = [];

        for (const word of wordsInPhrase) {
            const wordToLowerCase = word.toLowerCase();
            if (this._wordTold.has(wordToLowerCase)) possibleWords.push(wordToLowerCase);
        }


        if (possibleWords.length > 0) {
            for (let page of this._pages) {
                let includesAllWords = false;
                for (const word of possibleWords) {
                    const wordIndex = this.getIdForWord(word);
                    if (page.containsWord(wordIndex)) includesAllWords = true;
                }
                if (includesAllWords) {
                    pagesIncludingWord.push(page);
                }
            }
        }

        const newPageDB = new PageDB(this._wordTold);
        newPageDB.pages = pagesIncludingWord;
       
        return newPageDB
    }

    public includesWord(word: string): boolean {
        const wordToLowerCase = word.toLowerCase();
        return (this._wordTold.has(wordToLowerCase)); 
    }

    public addPage(page: Page, wordsFromFile: string[], links: string[]): void {
        for (const word of wordsFromFile) {
            const wordID = this.getIdForWord(word);
            page.addWord(wordID)
        }

        for (const link of links) {
            page.addLink(link);
        }

        this._pages.push(page);
    }
    
    public getIdForWord(word: string): number {
        const wordToLowerCase = word.toLowerCase();
        if (this._wordTold.has(wordToLowerCase)) {
            return this._wordTold.get(wordToLowerCase) || -1;
        } else {
            const id = this._wordTold.size;
            this._wordTold.set(wordToLowerCase, id);
            return id;
        }
    }

    public noPages(): number {
        return this._pages.length;
    }

    public getNumberOfWords(): number {
        return this._wordTold.size
    }

}