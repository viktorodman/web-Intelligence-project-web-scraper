import { Response } from "express";
import PageDB from "../models/page-db";
import SearchService from "../services/search-service";
import { startTimer, stopTimer } from "../utils/timer";

export default class SearchController {
    private searchService = new SearchService()

    public searchPageDB(req: any, res: Response, pageDB: PageDB) {
        try {
            const searchPhrase = req.query.phrase as string;
            let timer = startTimer("Startng search!!");
            const data = this.searchService.searchWord(searchPhrase, pageDB);
            const stopTime = stopTimer(timer, "Done with search!!!, time: ");

            data.queryTime = stopTime;

            res.status(200).json(data);
        } catch (error) {
            res.status(400).json([]);
        }
    }
}