import React, { useEffect, useState, type ReactElement } from "react";
import DynamicLayout from "@/components/dynamic/dynamic-layout/DynamicLayout";
import BandBreadcrumb from "@/components/dynamic/band/BandBreadcrumb";
import { useRouter } from "next/router";
import Head from "next/head";
import BandDetails from "@/components/dynamic/band/BandDetails";
import { type Song } from "@prisma/client";
import BandSongList from "@/components/dynamic/band/BandSongList";
import BandAlbumList from "@/components/dynamic/band/BandAlbumList";
import BandLoading from "@/components/dynamic/band/BandLoading";

const Band = () => {
  const router = useRouter();
  const [songList, setSongList] = useState<Song[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);
  const [filteredSongListWithAlbum, setFilteredSongListWithAlbum] = useState<
    Song[]
  >([]);
  const [filteredSongListWithoutAlbum, setFilteredSongListWithoutAlbum] =
    useState<Song[]>([]);
  const [uniqueAlbumList, setUniqueAlbumList] = useState<string[]>([""]);
  const [channelProfile, setChannelProfile] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    const filteredSongList = songList.filter((items) => {
      return (
        items.original_band!.toLowerCase().trim().replace(/ /g, "-") ===
        router.query.band?.toString()
      );
    });
    setFilteredSongList(filteredSongList);

    const filteredSongListWithAlbum = filteredSongList.filter((items) => {
      return items.album && items.album.toString().trim() !== "";
    });
    setFilteredSongListWithAlbum(filteredSongListWithAlbum);

    const filteredSongListWithoutAlbum = filteredSongList.filter((items) => {
      return items.album === null || items.album?.toString().trim() === "";
    });
    setFilteredSongListWithoutAlbum(filteredSongListWithoutAlbum);

    const uniqueAlbumSet = new Set();
    filteredSongListWithAlbum.forEach((items) => {
      uniqueAlbumSet.add(items.album);
    });
    const uniqueAlbumList = [...uniqueAlbumSet];
    setUniqueAlbumList(uniqueAlbumList as string[]);
  }, [songList, router.query.band]);

  const getYoutubeVideoId = (youtubeUrl: string | undefined) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl?.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const apiKey = "AIzaSyACcxuHB_5vduPISTHPH5XjJNlZWjSd8R4";

    void (async () => {
      const videoId = getYoutubeVideoId(
        filteredSongList[0]?.original_youtube_url
          ? filteredSongList[0]?.original_youtube_url
          : "",
      );
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`,
        { method: "GET" },
      ).then(async (res) => {
        await res.json().then((result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const channelId = result.items[0]?.snippet.channelId;
          if (channelId) {
            void (async () => {
              await fetch(
                `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
                { method: "GET" },
              ).then(async (res) => {
                await res.json().then((result) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const channelProfile: string =
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    result.items[0]?.snippet.thumbnails.high.url;
                  setChannelProfile(channelProfile);
                  setIsLoading(false);
                });
              });
            })();
          }
        });
      });
    })();
  }, [filteredSongList]);

  if (isLoading) {
    <BandLoading />;
  } else {
    return (
      <>
        <Head>
          <title>
            {filteredSongList
              ? filteredSongList[0]?.original_band
              : "Song Bank"}
          </title>
        </Head>
        <BandBreadcrumb original_band={filteredSongList[0]!.original_band!} />
        <div className="flex flex-col gap-5 pb-5 sm:pt-5 md:flex-row">
          <div className="flex w-full flex-col gap-5 md:w-fit">
            <BandDetails
              channelProfile={channelProfile}
              router={router}
              filteredSongList={filteredSongList}
              uniqueAlbumList={uniqueAlbumList}
            />
            <BandSongList
              filteredSongListWithoutAlbum={filteredSongListWithoutAlbum}
            />
          </div>
          <BandAlbumList
            uniqueAlbumList={uniqueAlbumList}
            filteredSongListWithAlbum={filteredSongListWithAlbum}
            getYoutubeVideoId={getYoutubeVideoId}
          />
        </div>
      </>
    );
  }
};

export default Band;

Band.getLayout = function getLayout(page: ReactElement) {
  return <DynamicLayout>{page}</DynamicLayout>;
};
