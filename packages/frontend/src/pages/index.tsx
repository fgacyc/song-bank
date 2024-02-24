import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ListView from "@/components/ListView";
import GalleryView from "@/components/GalleryView";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { songList } from "@/mock-data";

export default function Home() {
  const [view, setView] = useState("list");
  const [grid, setGrid] = useState("grid-cols-1");
  const [searchString, setSearchString] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onKeyDownHandler = (event: KeyboardEvent) => {
    if (event.key === "/" && inputRef.current) {
      console.log(`Hit: ${event.key}`);
      event.preventDefault();
      inputRef.current.focus();
      inputRef.current.defaultValue = "";
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownHandler);

    return () => {
      window.removeEventListener("keydown", onKeyDownHandler);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Search Songs</title>
        <meta name="description" content="landing page" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <div>
        <div className="sticky top-[70px] z-10 flex h-[50px] items-center justify-between bg-white px-3">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
            songList={songList}
            inputRef={inputRef}
          />
          <div className="grid w-[70px] grid-cols-2 gap-1">
            <button
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md border"
              onClick={() => {
                setView("list");
                setGrid("grid-cols-1");
              }}
            >
              <CiGrid2H className="h-[20px] w-[20px]" />
            </button>
            <button
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md border"
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
            <ListView songList={songList} />
          ) : (
            <GalleryView songList={songList} />
          )}
        </div>
      </div>
    </>
  );
}
