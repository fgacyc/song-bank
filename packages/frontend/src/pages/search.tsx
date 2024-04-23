import { useEffect, useMemo, useState, type ReactElement } from "react";
import SearchBar from "@/components/search/SearchBar";
import ListView from "@/components/search/ListView";
import GalleryView from "@/components/search/GalleryView";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import Layout from "@/components/layout/Layout";
import FilterTags from "@/components/search/FilterTags";

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

const Search = () => {
  const [view, setView] = useState("list");
  const [gridCol, setGridCol] = useState("grid-cols-1");
  const [songList, setSongList] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          const param = localStorage.getItem("song-search");
          if (param) {
            setSearchString(String(param));
            localStorage.removeItem("song-search");
          }
          await res
            .json()
            .then((result: Song[]) => {
              setSongList(result);
              setIsLoading(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  const filteredSongList = useMemo(() => {
    if (!searchString || searchString.toString() === "") {
      return songList;
    }

    const filteredSongs = songList.filter((song) => {
      if (activeTag === "") {
        const matchedName = song.name
          .toLowerCase()
          .includes(searchString.toString().toLowerCase());
        const matchedAltName = song.alt_name
          ?.toLowerCase()
          .includes(searchString.toString().toLowerCase());
        return matchedName || matchedAltName;
      } else {
        switch (activeTag) {
          case "Lyrics":
            return song.chord_lyrics
              ?.toLowerCase()
              .includes(searchString.toString().toLowerCase());
          case "Album":
            return song.album
              ?.toLowerCase()
              .includes(searchString.toString().toLowerCase());
          case "Band":
            return song.original_band
              ?.toLowerCase()
              .includes(searchString.toString().toLowerCase());
          case "Key":
            return song.original_key
              ?.toLowerCase()
              .includes(searchString.toString().toLowerCase());
          case "Language":
            return song.song_language
              ?.toLowerCase()
              .includes(searchString.toString().toLowerCase());
        }
      }
    });
    return filteredSongs;
  }, [searchString, songList, activeTag]);

  return (
    <>
      <div className="sticky top-[70px] z-10 justify-between border-b bg-white p-3 sm:flex md:flex lg:flex">
        <div className="flex items-center gap-3">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <FilterTags activeTag={activeTag} setActiveTag={setActiveTag} />
        </div>
        <div className="grid w-[70px] grid-cols-2 gap-1">
          <button
            className="hidden h-[30px] w-[30px] items-center justify-center rounded-md border sm:flex"
            onClick={() => {
              setView("list");
              setGridCol("grid-cols-1");
            }}
          >
            <CiGrid2H className="h-[20px] w-[20px]" />
          </button>
          <button
            className="hidden h-[30px] w-[30px] items-center justify-center rounded-md border sm:flex"
            onClick={() => {
              setView("gallery");
              setGridCol("sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4");
            }}
          >
            <CiGrid41 className="h-[20px] w-[20px]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:hidden sm:p-3">
        <ListView songList={filteredSongList} isLoading={isLoading} />
      </div>
      <div className={`hidden gap-3 p-3 sm:grid ${gridCol}`}>
        {view === "list" ? (
          <ListView songList={filteredSongList} isLoading={isLoading} />
        ) : (
          <GalleryView songList={filteredSongList} />
        )}
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
