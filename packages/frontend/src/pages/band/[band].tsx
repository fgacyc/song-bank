import React, { useEffect, useState } from "react";
import BandBreadcrumb from "@/components/dynamic/band/BandBreadcrumb";
import { useRouter } from "next/router";
import Head from "next/head";
import BandDetails from "@/components/dynamic/band/BandDetails";
import { type Song } from "@prisma/client";
import BandSongList from "@/components/dynamic/band/BandSongList";
import BandAlbumList from "@/components/dynamic/band/BandAlbumList";
import BandLoading from "@/components/dynamic/band/BandLoading";
import { useUser } from "@auth0/nextjs-auth0/client";

const Band = () => {
  const { isLoading, user } = useUser();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      await fetch("/api/songs", {
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
    if (songList.length > 0 && router.query.band) {
      const bandExist = songList.some((song) => {
        return (
          song.original_band?.toLowerCase().trim().replace(/ /g, "-") ===
          router.query.band
        );
      });

      if (!bandExist) {
        void router.push("/404");
      }
    }
  }, [songList, router]);

  useEffect(() => {
    if (!isLoading && user && router.query.band) {
      void (async () => {
        await fetch("/api/history", {
          method: "POST",
          body: JSON.stringify({
            user_id: user.sub,
            search_content: router.query.band,
            search_category: "band",
          }),
        });
      })();
    }
  }, [isLoading, user, router.query.band]);

  // TODO: fix fetching twice bug
  // useEffect(() => {
  //   console.log(!isLoading, user, router.query.band);
  // }, [isLoading, user, router.query.band]);

  useEffect(() => {
    const filteredSongList = songList.filter((items) => {
      return (
        items.original_band!.toLowerCase().trim().replace(/ /g, "-") ===
        router.query.band?.toString()
      );
    });
    setFilteredSongList(filteredSongList);

    const filteredSongListWithAlbum = filteredSongList.filter((items) => {
      return (
        items.album &&
        items.album.toString().trim() !== "" &&
        items.album.toString().trim() !== "-"
      );
    });
    setFilteredSongListWithAlbum(filteredSongListWithAlbum);

    const filteredSongListWithoutAlbum = filteredSongList.filter((items) => {
      return (
        items.album === null ||
        items.album?.toString().trim() === "" ||
        items.album?.toString().trim() === "-"
      );
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
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API;

    void (async () => {
      const videoId = getYoutubeVideoId(
        filteredSongList[0]?.original_youtube_url ?? "",
      );
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`,
        { method: "GET" },
      ).then(async (res) => {
        setLoading(false);
        await res.json().then((result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const channelId = result?.items?.[0]?.snippet.channelId;
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
                });
              });
            })();
          }
        });
      });
    })();
  }, [filteredSongList]);

  if (loading) {
    return <BandLoading />;
  } else {
    return (
      <>
        <Head>
          <title>{filteredSongList[0]?.original_band}</title>
          <meta
            name="keywords"
            content={`${filteredSongList[0]?.original_band}`}
          />
          <link rel="icon" href="/logo.png" />
        </Head>
        <div className="flex flex-col gap-5 p-5 pb-[70px] sm:pb-5">
          <BandBreadcrumb
            original_band={filteredSongList[0]?.original_band ?? ""}
          />
          <div className="flex flex-col gap-5 md:flex-row">
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
        </div>
      </>
    );
  }
};

export default Band;
