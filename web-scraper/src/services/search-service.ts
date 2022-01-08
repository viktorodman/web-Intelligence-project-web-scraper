import Page from "../models/page";
import PageDB from "../models/page-db";
import PageScore from "../models/page-score";
import Score from "../models/score";
import { SearchResult } from "../types/search-result";
import { normalize } from "../utils/create-page-db";

export default class SearchService {

    public searchWord(searchPhrase: string, pageDB: PageDB) {
        const pageDBIncludingWord: PageDB = pageDB.getPagesWithWord(searchPhrase);
        const result: PageScore[] = this.query(pageDBIncludingWord, searchPhrase);
        

        return this.createResults(result);
    }

    private createResults(scores: PageScore[]): SearchResult {
        const searchResults: SearchResult = {
            numOfResults: scores.length,
            queryTime: 0,
            searchScores: scores.map(s => ({ 
                score: s.score, 
                content: s.content, 
                link: `https://en.wikipedia.org${s.page?.url}`, 
                location: s.location, 
                pageRank: s.pageRank
            })).slice(0, 5)
        }

        return searchResults
    }

    private query(pageDB: PageDB, searchPhrase: string) {
        const result: PageScore[] = []


        const scores: Score = new Score();


        for (let i = 0; i < pageDB.pages.length; i++) {
            const p: Page = pageDB.pages[i];
            scores.content[i] = this.getFrequencyScore(p, searchPhrase, pageDB);
            scores.location[i] = this.getDocumentLocation(p, searchPhrase, pageDB);
        }

        normalize(scores.content, false);
        normalize(scores.location, true);

        for (let i = 0; i < pageDB.pages.length; i++) {
            const p: Page = pageDB.pages[i];
            if (scores.content[i] > 0) {
                const contentScore = 1 * scores.content[i];
                const locScore = 0.8 * scores.location[i];
                const pageRank = 0.5 * p.pageRank;

                const score = contentScore + locScore + pageRank
                result.push(new PageScore(p, score, contentScore, locScore, pageRank));
            }
        }

        result.sort((a, b) => b.score - a.score)

        return result;
    }

    private getFrequencyScore(p: Page, searchPhrase: string, pageDB: PageDB): number {
        const qws: string[] = searchPhrase.split(" ");
        let score: number = 0;
        for (const q of qws) {
            if (pageDB.includesWord(q)) {
                const queryIndex = pageDB.getIdForWord(q);
                for (const wordIndex of p.words) {
                    if (wordIndex === queryIndex) {
                        score += 1;
                    }
                }   
            }
        }

        return score;
    }

    private getDocumentLocation(p: Page, queryWord: string, pageDB: PageDB): number {
        const qws = queryWord.split(" ");
        let score = 0;

        for (const q of qws) {
            let found: boolean = false;
            if (pageDB.includesWord(q)) {
                const queryIndex = pageDB.getIdForWord(q);
                for (let i = 0; i < p.words.length; i++) {
                    const word = p.words[i];

                    if (word === queryIndex) {
                        found = true;
                        score += i + 1;
                        break;
                    }
                }
            }
            if (!found) score += 100000;
        }

        return score;
    }

    private getWordDistance(p: Page, queryWord: string, pageDB: PageDB): number {
        const qws: string[] = queryWord.split(" ");
        let score: number = 0;

        for (let i = 0; i < qws.length -1; i++) {
            const loc1 = this.getDocumentLocation(p, qws[i], pageDB);
            const loc2 = this.getDocumentLocation(p, qws[i +1], pageDB);
            
            if (loc1 === 100000 || loc2 === 100000) {
                score += 100000;
            } else {
                score += Math.abs((loc1 - loc2));
            }
        }

        return score;
    }
}