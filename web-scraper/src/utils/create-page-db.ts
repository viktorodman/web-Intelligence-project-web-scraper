import ScraperService from "../services/scraper"


export const createPageDB = async () => {
    const filenames = await scrapeHTMLAndCreateDatasets();
    await createPageDBFromDatasets(filenames);
}

const scrapeHTMLAndCreateDatasets = async (): Promise<string[]> => {
    const scraperService = new ScraperService();
    await scraperService.scrapeAndStoreHMTL();
    const filenames = await scraperService.createDataset();

    return filenames;
}

const createPageDBFromDatasets = async (filenames: string[]) => {

}