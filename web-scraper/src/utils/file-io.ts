import { WikiPage } from "../types/page-types";
import { readFile, readdir, writeFile, mkdir,  unlink, appendFile} from 'fs/promises'
import path from "path/posix";
import { DirFiles } from "../types/file-io-types";
const LINKS_PATH = "data/Links/Nintendo"
const WORDS_PATH = "data/Words/Nintendo"
const HTML_PATH = "data/HTML/Nintendo"


export const saveWikiDataToFile = async (wikiData: Map<string, WikiPage>): Promise<string[]> => {
    const filenames: string[] = [];

    for (const [key, value] of wikiData) {
        const filename = key.split('/wiki/')[1];
        const links = [...value.links].join('\n');
        const words = value.paragraphs.join('')
        await writeFile(path.join(LINKS_PATH, filename), links);
        await writeFile(path.join(WORDS_PATH, filename), words);
        filenames.push(filename);
    }

    return filenames;
}

export const saveRawHTMLToFile = async (rawHTML: Map<string, string>, baseURL: string) => {
    const savedPages: string[] = [];
    let startTime = process.hrtime();
    console.log("Saving raw html to file")

    for (const [key, value] of rawHTML) {
        const filename = key.split('/wiki/')[1];
        savedPages.push(baseURL + key);
        await writeFile(path.join(HTML_PATH, filename), value);
    }

    const test = process.hrtime(startTime)
    const queryTime = Number((test[0] + (test[1] / 1e9)).toFixed(5))
    console.log("Done...")
    console.log(queryTime);

    return savedPages;
} 

export const getRawHTMLFromFiles = async () => {
    const rawHTML = new Map<string, string>(); 
    const filesInDir: string[] = await readdir(HTML_PATH, 'utf8');

    for (const file of filesInDir) {
        const data = await readFile(path.join(HTML_PATH, file), 'utf8');
        const url = "/wiki/" + file;
        rawHTML.set(url, data)
    }

    return rawHTML;
}

export const resetFiles = async () => {
    await removeFilesFromDir(LINKS_PATH);
    await removeFilesFromDir(WORDS_PATH);
    await removeFilesFromDir(HTML_PATH);
}

const removeFilesFromDir = async (dirPath: string) => {
    const filesInDir = await readdir(dirPath, 'utf8');

    if (filesInDir.length > 0) {
        for (const file of filesInDir) {
            await unlink(path.join(dirPath, file))
        }
    }
}