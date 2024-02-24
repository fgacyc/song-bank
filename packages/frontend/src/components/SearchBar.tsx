import {
  useState,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import SearchBarAutocomplete from "./SearchBarAutocomplete";
import { type songList } from "@/mock-data";

interface SearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  songList: typeof songList;
  inputRef: RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchString,
  setSearchString,
  songList,
  inputRef,
}) => {
  const [showSearchBarAutocomplete, setShowSearchBarAutocomplete] =
    useState(false);

  return (
    <div>
      <div className="flex h-[30px] items-center justify-evenly rounded-md border">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className="ps-2"
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
          onFocus={() => setShowSearchBarAutocomplete(true)}
          onBlur={() => setShowSearchBarAutocomplete(false)}
        />
        <button
          type="reset"
          className="flex h-full w-[30px] items-center justify-center rounded-e-md border-s"
          onClick={() => {
            setSearchString("");
          }}
        >
          {searchString === "" ? <RiSearch2Line /> : <IoIosClose />}
        </button>
      </div>
      {showSearchBarAutocomplete && (
        <SearchBarAutocomplete songList={songList} />
      )}
    </div>
  );
};

export default SearchBar;
