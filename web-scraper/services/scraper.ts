import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
import { URL,  } from 'url';
import { WikiPage } from '../types/page-types';


export default class ScraperService {
    private _URL = new URL("https://en.wikipedia.org/wiki/Nintendo")
    private NUM_OF_LINKS = 200;

    public async startScraping() {
        const response = await axios.get(this._URL.href);
        let links: string[] = []
        this.getLinksFromSameSite(response.data, this._URL.origin, links);
        
        const linksToScrape = this.createXNumberOfLinks(this.NUM_OF_LINKS, new Set([...links]))

        console.log(linksToScrape)
    }

    private getLinksFromSameSite(data: any, urlOrigin: string, uniqueLinks: Array<string>) {
        const $ = cheerio.load(data);
        const potentialLinks = $('#content a');
        const linkMap = new Map<string, WikiPage>();

        const uniqueSet = new Set<string>();

        for (const element of potentialLinks) {
            const linkText = $(element).attr('href');

            if (linkText && this.linkIsValid(linkText)) {
                const tempURL = new URL(urlOrigin + linkText)
                const parsed = path.parse(tempURL.href);

                if (parsed.ext === "" && !linkMap.has(tempURL.pathname) && linkMap.size < this.NUM_OF_LINKS) {
                    linkMap.set(
                        tempURL.pathname,
                        {
                            links: new Set<string>(),
                            words: ""
                        }
                    )

                    uniqueLinks.push(tempURL.pathname)
                }
            }
        }
    }

    private getLinksAndWords(){
            
    }

    private linkIsValid(linkText: string): boolean {
        return (linkText.startsWith('/wiki') && !linkText.includes(':'))
    }

    private createXNumberOfLinks(numOfLinks: number, links: Set<string>) {
        const newSet = new Set<string>();

        for (const link of links) {

            if (newSet.size < numOfLinks) {
                newSet.add(link);
            } else {
                break;
            }
        }

        return newSet;
    }
}