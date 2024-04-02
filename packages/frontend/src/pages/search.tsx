import { useEffect, useState, type ReactElement } from "react";
import SearchBar from "@/components/search/SearchBar";
import FilterTags from "@/components/search/FilterTags";
import ListView from "@/components/search/ListView";
import GalleryView from "@/components/search/GalleryView";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";

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
  const [grid, setGrid] = useState("grid-cols-1");
  const [searchString, setSearchString] = useState("");
  const [songList, setSongList] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { q } = router.query;

  useEffect(() => {
    setIsLoading(true);
    setSearchString(q as string);
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      }).then(
        async (res) =>
          await res.json().then((result: Song[]) => {
            setSongList(result);
            setIsLoading(false);
          }),
      );
    })();
  }, [q]);

  if (isLoading) {
    <div>search loading</div>;
  }

  useEffect(() => {
    if (!searchString) return;
    router
      .push("/search?q=" + encodeURI(searchString))
      .catch((err) => console.error(err));
  }, [searchString]);

  let filteredSongList = songList;
  if (router.query.q && router.query.q?.toString().trim() !== "") {
    filteredSongList = songList.filter((items) =>
      items.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }

  return (
    <>
      <div className="sticky top-[70px] z-10 justify-between border-b bg-white p-3 sm:flex md:flex lg:flex">
        <div className="flex items-center gap-3">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
            songList={songList}
          />
          {/* <FilterTags /> */}
        </div>
        <div className="grid w-[70px] grid-cols-2 gap-1">
          <button
            className="hidden h-[30px] w-[30px] items-center justify-center rounded-md border sm:flex"
            onClick={() => {
              setView("list");
              setGrid("grid-cols-1");
            }}
          >
            <CiGrid2H className="h-[20px] w-[20px]" />
          </button>
          <button
            className="hidden h-[30px] w-[30px] items-center justify-center rounded-md border sm:flex"
            onClick={() => {
              setView("gallery");
              setGrid("grid-cols-5");
            }}
          >
            <CiGrid41 className="h-[20px] w-[20px]" />
          </button>
        </div>
      </div>
      <div className={`grid gap-3 p-3 ${grid}`}>
        {view === "list" ? (
          <ListView songList={filteredSongList} />
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
