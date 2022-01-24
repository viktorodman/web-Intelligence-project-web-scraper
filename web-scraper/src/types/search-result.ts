export type SearchScore = {
    link: string;
    score: number;
    content: number;
    location: number;
    pageRank: number;
}

export type SearchResult = {
    numOfResults: number;
    queryTime: number;
    searchScores: SearchScore[];
}