import FavouritesLoading from "@/components/favourites/FavouritesLoading";
import FavouritesSongList from "@/components/favourites/FavouritesSongList";
import Layout from "@/components/layout/Layout";
import { useUser } from "@auth0/nextjs-auth0/client";
import type { Song, Tag, Favorite } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState, type ReactElement } from "react";

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
      <h1 className="fixed z-10 w-full bg-white p-3 text-3xl font-black">
        Favourites
      </h1>
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
