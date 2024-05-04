import IndexFooter from "@/components/index/IndexFooter";
import IndexSearchBar from "@/components/index/IndexSearchBar";
import IndexSearchBarAutoComplete from "@/components/index/IndexSearchBarAutoComplete";
import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useMemo, useState } from "react";
import type { Song } from "@prisma/client";

const Home = () => {
  const { user, isLoading } = useUser();
  const [searchString, setSearchString] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [songList, setSongList] = useState<Song[]>();
  const [filteredSongList, setFilteredSongList] = useState<Song[]>();

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          await res
            .json()
            .then((result: Song[]) => {
              setSongList(result);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      console.log(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useMemo(() => {
    const filteredSongList = songList?.filter((items) => {
      return items.name
        ?.toString()
        .toLowerCase()
        .trim()
        .includes(searchString.toString().toLowerCase().trim());
    });
    const slicedFilteredSongList = filteredSongList?.slice(0, 7);
    setFilteredSongList(slicedFilteredSongList);
  }, [songList, searchString]);

  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="description" content="index" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <IndexSearchBar
        searchString={searchString}
        setSearchString={setSearchString}
        setShowAutoComplete={setShowAutoComplete}
      />
      {filteredSongList?.length !== 0 && (
        <IndexSearchBarAutoComplete
          showAutoComplete={showAutoComplete}
          filteredSongList={filteredSongList}
          setShowAutoComplete={setShowAutoComplete}
        />
      )}
      <IndexFooter />
    </>
  );
};

export default Home;
