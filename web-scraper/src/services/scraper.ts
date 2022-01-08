import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
import { URL,  } from 'url';
import { WikiPage } from '../types/page-types';
import { getRawHTMLFromFiles, saveRawHTMLToFile, saveWikiDataToFile } from '../utils/file-io';


export default class ScraperService {
    private _URL = new URL("https://en.wikipedia.org/wiki/Nintendo")
    private NUM_OF_LINKS = 200;

    public async createDataset() {
        const rawHTML: Map<string, string> = await getRawHTMLFromFiles()
        const pageData = this.createDatasetsFromHTML(rawHTML);
        return await saveWikiDataToFile(pageData);
    }

    public async scrapeAndStoreHMTL() {
        const rawHTML = await this.scrapeRawHMTL(this._URL.href);
        const links: string[] = await saveRawHTMLToFile(rawHTML, this._URL.origin);
        return links;
    }

    private createDatasetsFromHTML(rawHTML: Map<string, string>) {
        const pageData = new Map<string, WikiPage>();

        for (const [page, html] of rawHTML) {
            const $ = cheerio.load(html);
            const allLinks = this.getAllLinks($);
            const allWords = this.getAllWords($);

            pageData.set(page, {
                links: allLinks,
                paragraphs: allWords
            });
        }

        return pageData;
    }

    private async scrapeRawHMTL(startingArticleURL: string) {
        const rawHTML = new Map<string, string>();
        const response = await axios.get(startingArticleURL);
        const $ = cheerio.load(response.data);
        const potentialArticleLinks = $('#mw-content-text a');

        for (const element of potentialArticleLinks) {
            const wikiLink = $(element).attr('href');
            if (wikiLink && this.linkIsValid(wikiLink) && this.shouldUseLink(wikiLink, rawHTML)) {
                console.log("Scraping HTML for link: " + wikiLink);
                const linkResponse = await axios.get(this._URL.origin + wikiLink);
                rawHTML.set(wikiLink, linkResponse.data);
            }
        }

        return rawHTML;
    }

    private shouldUseLink(linkURL: string, currentDataset: Map<string, string>) {
        const tempURL = new URL(this._URL.origin + linkURL)
        
        return (
            this.urlHasNoExtension(tempURL) && 
            !currentDataset.has(tempURL.pathname) && 
            currentDataset.size < this.NUM_OF_LINKS
        )
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

    private urlHasNoExtension(link: URL) {
        const parsed = path.parse(link.href);
        return parsed.ext === "";
    }

    private linkIsValid(linkText: string): boolean {
        return (linkText.startsWith('/wiki/') && !linkText.includes(':') && !linkText.includes('#'))
    }
}