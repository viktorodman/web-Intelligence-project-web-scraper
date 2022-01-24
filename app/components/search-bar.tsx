import { useRef } from "react";
import styles from "../styles/SearchBar.module.css";
import SubmitButton from "./submit-button";
type SearchBarProps = {
  placeholder?: string;
  onSearch: (text: string) => void;
};

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const searchRef = useRef<any>();

  const handleSearchClick = () => {
    const text = searchRef.current.value;
    onSearch(text);
    searchRef.current.value = "";
  };

  const handleEnter = (e: any) => {
    if (e.code == "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        onKeyDown={(e) => handleEnter(e)}
        className={styles.searchInput}
        type="search"
        name="search"
        id="searchBar"
        placeholder={placeholder}
        ref={searchRef}
      />
      <SubmitButton text="Search" click={handleSearchClick} />
    </div>
  );
};

export default SearchBar;
