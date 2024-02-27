import { type Dispatch, type SetStateAction } from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";

interface SongListProps {
  songName: string;
  artist: string;
  language: string;
  type: string;
  originalKey: string;
  imgSrc: string;
  imgAlt: string;
}

interface SearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  songList: SongListProps[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchString,
  setSearchString,
}) => {
  return (
    <div>
      <div className="flex h-[30px] items-center justify-evenly rounded-md border">
        <input
          type="text"
          placeholder="Search"
          className="ps-2"
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
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
    </div>
  );
};

export default SearchBar;
