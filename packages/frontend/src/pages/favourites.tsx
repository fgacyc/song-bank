import FavouritesLoading from "@/components/favourites/FavouritesLoading";
import FavouritesSongList from "@/components/favourites/FavouritesSongList";
import Layout from "@/components/layout/Layout";
import { useUser } from "@auth0/nextjs-auth0/client";
import type { Song, Tag, Favorite } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState, type ReactElement } from "react";
import { IoIosArrowBack } from "react-icons/io";

type SongType = Song & { tags: Tag[] };

const Favourites = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [songList, setSongList] = useState<SongType[]>([]);
  const [favouriteSongList, setFavouriteSongList] = useState<Favorite[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      void router.push("/api/auth/login");
      return;
    }

    const fetchSongs = async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(
          async (res) =>
            await res
              .json()
              .then((result: SongType[]) => {
                setSongList(result);
              })
              .catch((err) => {
                console.error(err);
              }),
        )
        .catch((err) => console.error(err));
    };

    const fetchFavorites = async () => {
      await fetch(`/api/favorite?${user?.sub}`, {
        method: "GET",
      })
        .then(
          async (res) =>
            await res
              .json()
              .then(async (result: Favorite[]) => {
                setFavouriteSongList(result);
              })
              .catch((err) => console.error(err)),
        )
        .catch((err) => console.error(err));
    };

    Promise.all([fetchSongs(), fetchFavorites()])
      .then(() => setLoading(false))
      .catch((err) => console.error(err));
  }, [isLoading, router, user]);

  useMemo(() => {
    const filteredSongList = songList.filter((song) => {
      return favouriteSongList.some((favourite) => {
        return song.id === favourite.song_id;
      });
    });
    setFilteredSongList(filteredSongList);
    setCount(filteredSongList.length);
  }, [songList, favouriteSongList]);

  return (
    <>
      <Head>
        <title>Favourite Songs</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <div className="fixed z-10 flex w-full items-center gap-2 bg-white p-3">
        <div className="hidden sm:block">
          <Link href={"/"}>
            <IoIosArrowBack className="h-[25px] w-[25px]" />
          </Link>
        </div>
        <div className="sm:hidden">
          <Link href={"/profile"}>
            <IoIosArrowBack className="h-[25px] w-[25px]" />
          </Link>
        </div>
        <h1 className="truncate pb-1 text-3xl font-black">Favourite songs</h1>
      </div>
      {loading ? (
        <FavouritesLoading />
      ) : count > 0 ? (
        <FavouritesSongList
          favouriteSongList={favouriteSongList}
          filteredSongList={filteredSongList}
          count={count}
          setCount={setCount}
        />
      ) : (
        <div className="flex h-[90dvh] flex-col items-center justify-center gap-5">
          <Image
            src={"/img/no-favourite-song.svg"}
            alt="no favourite song"
            width={200}
            height={200}
          />
          <p className="text-sm text-neutral-500">No favourite songs.</p>
        </div>
      )}
    </>
  );
};

export default Favourites;

Favourites.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
