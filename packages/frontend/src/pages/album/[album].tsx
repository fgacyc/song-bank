import AlbumBreadcrumb from "@/components/dynamic/album/AlbumBreadcrumb";
import AlbumDetails from "@/components/dynamic/album/AlbumDetails";
import AlbumLoading from "@/components/dynamic/album/AlbumLoading";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState, type ReactElement } from "react";
import type { Sequencer, Tag, Song } from "@prisma/client";
import AlbumSongList from "@/components/dynamic/album/AlbumSongList";
import Layout from "@/components/layout/Layout";
import { useUser } from "@auth0/nextjs-auth0/client";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const Album = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [songList, setSongList] = useState<SongType[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>();
  const [albumCoverImages, setAlbumCoverImages] = useState<Song[]>();
  const [gridCol, setGridCol] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          await res
            .json()
            .then((result: SongType[]) => {
              setSongList(result);
              setLoading(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  useEffect(() => {
    if (songList.length > 0 && router.query.album) {
      const albumExist = songList.some((song) => {
        return (
          song.album?.toLowerCase().trim().replace(/ /g, "-") ===
          router.query.album
        );
      });

      if (!albumExist) {
        void router.push("/404");
      }
    }
  }, [songList, router]);

  useEffect(() => {
    if (!isLoading && user && router.query.album) {
      void (async () => {
        await fetch("/api/history", {
          method: "POST",
          body: JSON.stringify({
            user_id: user.sub,
            search_content: router.query.album,
            search_category: "album",
          }),
        });
      })();
    }
  }, [isLoading, user, router.query.album]);

  // TODO: fix fetching twice bug
  useEffect(() => {
    console.log(!isLoading, user, router.query.album);
  }, [isLoading, user, router.query.album]);

  useEffect(() => {
    const filteredSongList = songList.filter((items) => {
      return (
        items.album?.toLowerCase().trim().replace(/ /g, "-") ===
        router.query.album?.toString()
      );
    });
    setFilteredSongList(filteredSongList);

    if (filteredSongList.length == 1) {
      setAlbumCoverImages(filteredSongList.slice(0, 1));
      setGridCol("grid-cols-1");
    } else if (filteredSongList.length == 2 || filteredSongList.length == 3) {
      setAlbumCoverImages(filteredSongList.slice(0, 2));
      setGridCol("grid-cols-1");
    } else if (filteredSongList.length >= 4) {
      setAlbumCoverImages(filteredSongList.slice(0, 4));
      setGridCol("grid-cols-2");
    } else {
      setGridCol("");
    }
  }, [songList, router.query.album]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    <AlbumLoading />;
  } else {
    return (
      <div className="flex flex-col gap-5 p-5 pb-[50px] sm:pb-5">
        <Head>
          <title>
            {filteredSongList ? filteredSongList[0]?.album : "Song Bank"}
          </title>
        </Head>
        <AlbumBreadcrumb
          album={filteredSongList ? filteredSongList[0]?.album : "Album"}
          original_band={
            filteredSongList ? filteredSongList[0]?.original_band : "Band"
          }
        />
        <div className="block gap-5 md:flex">
          <AlbumDetails
            albumCoverImages={albumCoverImages}
            filteredSongList={filteredSongList}
            gridCol={gridCol}
            getYoutubeVideoId={getYoutubeVideoId}
          />
          <AlbumSongList
            filteredSongList={filteredSongList}
            getYoutubeVideoId={getYoutubeVideoId}
          />
        </div>
      </div>
    );
  }
};

export default Album;

Album.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
