import HistoryAlbumList from "@/components/history/HistoryAlbumList";
import HistoryBandList from "@/components/history/HistoryBandList";
import HistoryLoading from "@/components/history/HistoryLoading";
import HistorySongList from "@/components/history/HistorySongList";
import Layout from "@/components/layout/Layout";
import { useUser } from "@auth0/nextjs-auth0/client";
import type { SearchHistory, Sequencer, Song, Tag } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState, type ReactElement } from "react";
import { IoIosArrowBack } from "react-icons/io";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const History = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>();
  const [songList, setSongList] = useState<SongType[]>();
  const [uniqueDatesArray, setUniqueDatesArray] = useState([""]);
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
        await fetch(`/api/history?user_id=${user.sub}`, {
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

  useEffect(() => {
    const sortedSearchHistory = searchHistory?.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    const uniqueDates = new Set();
    sortedSearchHistory?.forEach((items) => {
      const [d, m, y] = getDMY(items.created_at);
      const mdy = `${m}/${d}/${y}`;
      uniqueDates.add(mdy);
    });
    const uniqueDatesArray = [...uniqueDates] as string[];
    setUniqueDatesArray(uniqueDatesArray);
  }, [searchHistory]);

  const getNumberOfDaysDifference = (today: string, currentDate: string) => {
    const date1 = new Date(today);
    const date2 = new Date(currentDate);
    date1.getHours();
    date2.getHours();
    const differenceInMilliseconds = date1.getTime() - date2.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays;
  };

  const getDMY = (date?: Date | string) => {
    let currentDate = new Date();
    if (date) {
      currentDate = new Date(date);
    }
    const d = currentDate.getDate();
    const m = currentDate.getMonth() + 1;
    const y = currentDate.getFullYear();
    return [d, m, y];
  };

  const getDay = (date: string) => {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDay();
    switch (currentDay) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "";
    }
  };

  return (
    <>
      <Head>
        <title>Search History</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <div className="fixed z-10 flex w-full items-center gap-2 bg-white p-3">
        <button onClick={() => router.back()}>
          <IoIosArrowBack className="h-[25px] w-[25px]" />
        </button>
        <h1 className="truncate pb-1 text-3xl font-black">Search history</h1>
      </div>
      {loading ? (
        <HistoryLoading />
      ) : (
        <div className="pb-[65px] pt-[50px] sm:pb-0">
          {searchHistory && searchHistory.length > 0 ? (
            uniqueDatesArray.map((date, i) => {
              const [td, tm, ty] = getDMY();
              const tmdy = `${tm}/${td}/${ty}`;

              let displayedDate = "";
              if (date === tmdy) {
                displayedDate = "Today";
              } else if (getNumberOfDaysDifference(tmdy, date) === 1) {
                displayedDate = "Yesterday";
              } else if (
                getNumberOfDaysDifference(tmdy, date) >= 2 &&
                getNumberOfDaysDifference(tmdy, date) <= 7
              ) {
                displayedDate = getDay(date);
              } else {
                const [d, m, y] = getDMY(date);

                let month = "";
                switch (m) {
                  case 0:
                    month = "Jan";
                    break;
                  case 1:
                    month = "Feb";
                    break;
                  case 2:
                    month = "Mar";
                    break;
                  case 3:
                    month = "Apr";
                    break;
                  case 4:
                    month = "May";
                    break;
                  case 5:
                    month = "Jun";
                    break;
                  case 6:
                    month = "Jul";
                    break;
                  case 7:
                    month = "Aug";
                    break;
                  case 8:
                    month = "Sep";
                    break;
                  case 9:
                    month = "Oct";
                    break;
                  case 10:
                    month = "Nov";
                    break;
                  case 11:
                    month = "Dec";
                    break;
                  default:
                    month = "";
                    break;
                }

                displayedDate = `${month} ${d}${ty === y ? "" : `, ${y}`}`;
              }
              return (
                <div key={i} className="px-3 sm:pb-3">
                  <h1 className="pb-1 pt-3 text-sm font-semibold text-neutral-500">
                    {displayedDate}
                  </h1>
                  <div className="flex flex-col gap-3">
                    {searchHistory
                      ?.sort((a, b) => {
                        return (
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                        );
                      })
                      .filter((history) => {
                        const currentDate = new Date(history.created_at);
                        const d = currentDate.getDate();
                        const m = currentDate.getMonth() + 1;
                        const y = currentDate.getFullYear();
                        const mdy = `${m}/${d}/${y}`;
                        return mdy === date;
                      })
                      .map((history, j) => {
                        if (history.search_category === "song") {
                          return (
                            <HistorySongList
                              key={j}
                              songList={songList}
                              search_content={history.search_content}
                            />
                          );
                        } else if (history.search_category === "album") {
                          return (
                            <HistoryAlbumList
                              key={j}
                              songList={songList}
                              search_content={history.search_content}
                            />
                          );
                        } else if (history.search_category == "band") {
                          return (
                            <HistoryBandList
                              key={j}
                              songList={songList}
                              searchHistory={searchHistory}
                              search_content={history.search_content}
                              getYoutubeVideoId={getYoutubeVideoId}
                            />
                          );
                        }
                      })}
                  </div>
                </div>
              );
            })
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
        </div>
      )}
    </>
  );
};

export default History;

History.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
