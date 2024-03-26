import { type Dispatch, type SetStateAction } from "react";
import { IoIosClose } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";

export type Song = {
  id?: string;
  name: string;
  alt_name?: string;
  song_language: string;
  original_key: string;
  original_band: string;
  album?: string;
  original_youtube_url?: string;
  chord_lyrics: string;
  main_key_link?: string;
  sub_key_link?: string;
  eg_link?: string;
  ag_link?: string;
  bass_link?: string;
  drum_link?: string;
  tags?: string[];
  sequencer_files?: string[];
  sub_voice_file?: string;
};

interface SearchBarProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  songList?: Song[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchString,
  setSearchString,
}) => {
  return (
    <div className="flex h-[30px] items-center justify-evenly rounded-md border">
      <input
        type="text"
        placeholder="Search"
        className="ps-2"
        defaultValue={searchString}
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
        {searchString === "" || searchString === undefined ? (
          <RiSearch2Line />
        ) : (
          <IoIosClose />
        )}
      </button>
    </div>
  );
};

export default SearchBar;
