import Link from "next/link";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { MdAlbum } from "react-icons/md";
import { type SongType } from "@/pages";
import { useRouter } from "next/router";
interface SearchAlbumListProps {
  searchString: string;
  setResults: Dispatch<
    SetStateAction<{ song: boolean; band: boolean; album: boolean }>
  >;
}

const SearchAlbumList: React.FC<SearchAlbumListProps> = ({
  searchString,
  setResults,
}) => {
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (searchString && searchString.length > 2) {
      void (async () => {
        await fetch(`/api/searchAlbumByName?album=${searchString}`, {
          method: "GET",
        })
          .then(async (res) => {
            await res
              .json()
              .then((result: SongType[]) => {
                setResults((prev) => ({
                  ...prev,
                  album: result.length > 0,
                }));
                if (result && result.length > 0) {
                  setFilteredSongList(
                    result.filter((song) => song.album === result[0].album),
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
    <div className="flex w-full flex-col gap-1.5 md:w-5/12">
      <h1 className="pl-1 text-lg font-semibold">
        Albums from {filteredSongList[0]?.original_band}
      </h1>

      <Link
        href={`/album/${filteredSongList[0]!.album?.toLowerCase().trim().replace(/ /g, "-")}?band=${filteredSongList[0]!.original_band?.toLowerCase().trim().replace(/ /g, "-")}`}
        className="flex flex-col gap-3 rounded-lg border-2 p-3 hover:bg-[#f8f8f9] hover:shadow-md"
      >
        <div className="flex flex-row items-center gap-3">
          <MdAlbum className="h-[40px] w-[40px]" />

          <div className="flex flex-col">
            <h1 className="font-semibold">{filteredSongList[0]!.album}</h1>
            <p className="text-[10px] italic text-slate-500">
              {filteredSongList.length} songs
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-slate-200 pl-[calc(40px+0.75rem)]" />
        <div className="pl-[calc(40px+0.75rem)] text-xs text-slate-500">
          {filteredSongList.map((song, i) => (
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              key={song.id}
              className="flex flex-row items-center"
            >
              <p className="mr-1">{i + 1}.</p>
              <button
                className="hover:underline"
                onClick={async () => {
                  await router.push(`/song/${song.id}`);
                }}
              >
                {song.name}
              </button>
            </div>
          ))}
        </div>
      </Link>
    </div>
  ) : null;
};

export default SearchAlbumList;
