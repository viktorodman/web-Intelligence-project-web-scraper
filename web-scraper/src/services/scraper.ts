import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
import { URL,  } from 'url';
import { WikiPage } from '../types/page-types';


export default class ScraperService {
    private _URL = new URL("https://en.wikipedia.org/wiki/Nintendo")
    private NUM_OF_LINKS = 200;

    public async startScraping() {
        const linksData = await this.scrapeWikiArticles(this._URL.href);

        console.log(linksData);
    }


    private async scrapeWikiArticles(startingArticleURL: string) {
        const response = await axios.get(startingArticleURL);
        const $ = cheerio.load(response.data);
        const potentialArticleLinks = $('#mw-content-text a');
        const linksData = await this.scrapeData(potentialArticleLinks, $);

        return linksData
    }

    private async scrapeData(potentialLinks: cheerio.Cheerio, $: cheerio.Root): Promise<Map<string, WikiPage>> {
        const linksData = new Map<string, WikiPage>();
        for (const element of potentialLinks) {
            const wikiLink = $(element).attr('href');

            if (wikiLink && this.linkIsValid(wikiLink) && this.shouldUseLink(wikiLink, linksData)) {
                console.log("Scraping link: " + wikiLink);
                const response = await axios.get(this._URL.origin + wikiLink);
                const $2 = cheerio.load(response.data);
                
                const allLinks = this.getAllLinks($2);
                const allWords = this.getAllWords($2);

                linksData.set(wikiLink, {
                  links: allLinks,
                  paragraphs: allWords  
                })
            }
        }

        return linksData
    }

    private getAllWords($: cheerio.Root) {
        const paragraphs: string[] = [];
        const articleParagraphs = $('#mw-content-text p');

        for (const element of articleParagraphs) {
            const linkText = $(element).text().replace(/(\[.*?\])/g, ''); // removes [x] links from text

            if (linkText) {
                paragraphs.push(linkText)
            }
        }

        return paragraphs;
    }

    private getAllLinks($: cheerio.Root) {
        const uniqueLinks = new Set<string>();
        const potentialLinks = $('#mw-content-text a');

        for (const element of potentialLinks) {
            const wikiLink = $(element).attr('href');

            if (wikiLink && this.linkIsValid(wikiLink)) {
                const tempURL = new URL(this._URL.origin + wikiLink);
                if (this.urlHasNoExtension(tempURL)) {
                    uniqueLinks.add(wikiLink);
                }
            }
        }

        return uniqueLinks;
    }


    private shouldUseLink(linkURL: string, currentDataset: Map<string, WikiPage>) {
        const tempURL = new URL(this._URL.origin + linkURL)
        
        return (
            this.urlHasNoExtension(tempURL) && 
            !currentDataset.has(tempURL.pathname) && 
            currentDataset.size < this.NUM_OF_LINKS
        )
    }

    private urlHasNoExtension(link: URL) {
        const parsed = path.parse(link.href);
        return parsed.ext === "";
    }

    private linkIsValid(linkText: string): boolean {
        return (linkText.startsWith('/wiki/') && !linkText.includes(':') && !linkText.includes('#'))
    }
}