import AlbumBreadcrumb from "@/components/dynamic/album/AlbumBreadcrumb";
import AlbumDetails from "@/components/dynamic/album/AlbumDetails";
import AlbumLoading from "@/components/dynamic/album/AlbumLoading";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { Sequencer, Tag, Song } from "@prisma/client";
import AlbumSongList from "@/components/dynamic/album/AlbumSongList";
import { useUser } from "@auth0/nextjs-auth0/client";
import Custom404 from "../404";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const Album = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>();
  const [albumCoverImages, setAlbumCoverImages] = useState<Song[]>();
  const [gridCol, setGridCol] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (router.query.album && router.query.band) {
      void (async () => {
        await fetch(
          `/api/album?album=${router.query.album?.toString()}&band=${router.query.band?.toString()}`,
          {
            method: "GET",
          },
        )
          .then(async (res) => {
            await res
              .json()
              .then((result: SongType[]) => {
                if (result && result.length > 0) {
                  setFilteredSongList(result);
                } else {
                  setNotFound(true);
                }
                setLoading(false);
              })
              .catch((err) => {
                setNotFound(true);
                console.error(err);
              });
          })
          .catch((err) => console.error(err));
      })();
    }
  }, [router.query.album, router.query.band]);

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
  // useEffect(() => {
  //   console.log(!isLoading, user, router.query.album);
  // }, [isLoading, user, router.query.album]);

  useEffect(() => {
    if (filteredSongList?.length == 1) {
      setAlbumCoverImages(filteredSongList.slice(0, 1));
      setGridCol("grid-cols-1");
    } else if (filteredSongList?.length == 2 || filteredSongList?.length == 3) {
      setAlbumCoverImages(filteredSongList?.slice(0, 2));
      setGridCol("grid-cols-1");
    } else if (filteredSongList && filteredSongList?.length >= 4) {
      setAlbumCoverImages(filteredSongList?.slice(0, 4));
      setGridCol("grid-cols-2");
    } else {
      setGridCol("");
    }
  }, [filteredSongList, router.query.album]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  if (notFound) {
    return <Custom404 />;
  }

  if (loading) {
    return <AlbumLoading />;
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <Head>
        <title>{filteredSongList?.[0]?.album}</title>
        <meta name="keywords" content={`${filteredSongList?.[0]?.album}`} />
        <link rel="icon" href="/logo.png" />
      </Head>
      <AlbumBreadcrumb
        album={filteredSongList ? filteredSongList[0]?.album : "Album"}
        original_band={
          filteredSongList ? filteredSongList[0]?.original_band : "Band"
        }
      />
      <div className="block gap-3 md:flex">
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
};

export default Album;
