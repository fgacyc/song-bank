import Image from "next/image";
import Link from "next/link";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { type Song } from "@prisma/client";
import { MdPiano } from "react-icons/md";
import { SongType } from "@/pages";

interface SearchBandProps {
  searchString: string;
  setResults: Dispatch<
    SetStateAction<{ song: boolean; band: boolean; album: boolean }>
  >;
}

const SearchBand: React.FC<SearchBandProps> = ({
  searchString,
  setResults,
}) => {
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchString && searchString.length > 2) {
      void (async () => {
        await fetch(`/api/searchBandByName?band=${searchString}`, {
          method: "GET",
        })
          .then(async (res) => {
            await res
              .json()
              .then((result: SongType[]) => {
                setResults((prev) => ({
                  ...prev,
                  band: result.length > 0,
                }));
                if (result && result.length > 0) {
                  setFilteredSongList(
                    result.filter(
                      (song) =>
                        song?.original_band === result[0]?.original_band,
                    ),
                  );
                }
                setLoading(false);
              })
              .catch((err) => {
                console.error(err);
                setLoading(false);
              });
          })
          .catch((err) => console.error(err));
      })();
    }
  }, [searchString, loading]);

  return filteredSongList.length > 0 ? (
    <div className="flex flex-col gap-1.5">
      <h1 className="pl-1 text-lg font-semibold">Bands</h1>
      <Link
        href={`/band/${filteredSongList[0]!
          .original_band!.toLowerCase()
          .trim()
          .replace(/ /g, "-")}`}
        className="flex flex-row items-center gap-2 rounded-lg border-2 p-3 hover:bg-[#f8f8f9] hover:shadow-md md:border-2"
      >
        <MdPiano size={40} />
        <div className="flex flex-col justify-center">
          <h1 className="text-base font-semibold md:text-lg">
            {filteredSongList[0]?.original_band}
          </h1>
          <p className="text-xs italic text-gray-500">
            {filteredSongList.length} songs,{" "}
            {new Set(filteredSongList.map((song) => song.album)).size - 1}{" "}
            albums
          </p>
        </div>
      </Link>
    </div>
  ) : null;
};

export default SearchBand;
