import HistoryAlbumList from "@/components/history/HistoryAlbumList";
import HistoryBandList from "@/components/history/HistoryBandList";
import HistoryLoading from "@/components/history/HistoryLoading";
import HistorySongList from "@/components/history/HistorySongList";
import Layout from "@/components/layout/Layout";
import { useUser } from "@auth0/nextjs-auth0/client";
import type { SearchHistory, Sequencer, Song, Tag } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState, type ReactElement } from "react";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const History = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>();
  const [songList, setSongList] = useState<SongType[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    void (async () => {
      if (!user) {
        void router.push("/api/auth/login");
        return;
      }
    })();
  }, [isLoading, user, router]);

  const getYoutubeVideoId = (youtubeUrl: string | undefined) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl?.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (!isLoading && user) {
      const fetchHistory = async () => {
        await fetch(`/api/history?${user.sub}`, {
          method: "GET",
        })
          .then(async (res) => {
            await res
              .json()
              .then((result: SearchHistory[]) => {
                setSearchHistory(result);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      };

      const fetchSongs = async () => {
        await fetch("/api/song", {
          method: "GET",
        })
          .then(async (res) => {
            await res
              .json()
              .then((result: SongType[]) => {
                setSongList(result);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      };

      Promise.all([fetchHistory(), fetchSongs()])
        .then(() => setLoading(false))
        .catch((err) => console.error(err));
    }
  }, [isLoading, user]);

  return (
    <>
      <h1 className="fixed z-10 w-full bg-white p-3 text-3xl font-black">
        History
      </h1>
      {loading ? (
        <HistoryLoading />
      ) : (
        <>
          {/* TODO: logic for date title */}
          {searchHistory && searchHistory.length > 0 ? (
            <div className="flex flex-col gap-3 px-3 py-[62px]">
              {searchHistory
                ?.sort((a, b) => {
                  return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                  );
                })
                .map((history, i) => {
                  if (history.search_category === "song") {
                    return (
                      <HistorySongList
                        key={i}
                        songList={songList}
                        search_content={history.search_content}
                        getYoutubeVideoId={getYoutubeVideoId}
                      />
                    );
                  } else if (history.search_category === "album") {
                    return (
                      <HistoryAlbumList
                        key={i}
                        songList={songList}
                        search_content={history.search_content}
                      />
                    );
                  } else if (history.search_category == "band") {
                    return (
                      <HistoryBandList
                        key={i}
                        songList={songList}
                        searchHistory={searchHistory}
                        search_content={history.search_content}
                        getYoutubeVideoId={getYoutubeVideoId}
                      />
                    );
                  }
                })}
            </div>
          ) : (
            <div className="flex h-[90dvh] flex-col items-center justify-center gap-5">
              <Image
                src={"/img/no-search-history.svg"}
                alt="no search history"
                width={200}
                height={200}
              />
              <p className="text-sm text-neutral-500">No search history.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default History;

History.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
