import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { SearchResult } from "../types/search-result";
import styles from "../styles/Home.module.css";
import SubmitButton from "../components/submit-button";
import ResultTable from "../components/result-table";
import SearchBar from "../components/search-bar";

const Home: NextPage = () => {
  const [searchResult, setSearchResult] = useState<SearchResult>();

  const fetchSearchResult = async (searchPhrase: String) => {


    const response = await fetch(
      `http://localhost:3000/api/pagedb/search?phrase=${encodeURIComponent(String(searchPhrase))}`
    );
    const result = await response.json();
    console.log(result);

    if (response.status !== 400) {
      setSearchResult(result);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Clustering App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Search Engine</h1>
        <p className={styles.description}>Search for a word or phrase</p>
        <div>
          <SearchBar
            onSearch={(searchString: string) => fetchSearchResult(searchString)}
            placeholder="Search phrase"
          />
        </div>
        {searchResult && <ResultTable searchResult={searchResult} />}
      </main>
    </div>
  );
};

export default Home;
