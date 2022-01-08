import styles from "../styles/Result.module.css";
import { SearchResult } from "../types/search-result";
type ResultTableProps = {
  searchResult: SearchResult;
};

const ResultTable = ({ searchResult }: ResultTableProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        <table>
          <thead>
            <tr>
              <th>Link</th>
              <th>Score</th>
              <th>Content</th>
              <th>Location</th>
              <th>PageRank</th>
            </tr>
          </thead>
          <tbody>
            {searchResult.searchScores.map((sc, index) => {
              return (
                <tr key={index}>
                  <td>
                    <a rel="noreferrer noopener" href={sc.link} target="_blank">
                      {decodeURIComponent(sc.link)}
                    </a>
                  </td>
                  <td>{sc.score.toFixed(2)}</td>
                  <td>{sc.content.toFixed(2)}</td>
                  <td>{sc.location.toFixed(2)}</td>
                  <td>{sc.pageRank.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                Found {searchResult.numOfResults} results in{" "}
                {searchResult.queryTime} sec
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;
