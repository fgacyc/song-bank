import { RiSearch2Line } from "react-icons/ri";
import { type songList } from "@/mock-data";

interface SearchBarAutocompleteProps {
  songList: typeof songList;
}

const SearchBarAutocomplete: React.FC<SearchBarAutocompleteProps> = ({
  songList,
}) => {
  return (
    <div className="absolute flex flex-col bg-white pt-2">
      <div className="flex w-[223.5px] flex-col rounded border px-1 shadow-md">
        {songList.map((items, i) => (
          <div key={i} className="border-b border-black/10 last:border-none">
            <button className="flex items-center">
              <div className="p-2">
                <RiSearch2Line />
              </div>
              <p className="truncate">{items.songName}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBarAutocomplete;
