import type { SearchHistory, Sequencer, Song, Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdImageNotSupported } from "react-icons/md";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

interface SearchHistoryBandListProps {
  songList: SongType[] | undefined;
  searchHistory: SearchHistory[];
  search_content: string;
  getYoutubeVideoId: (
    youtubeUrl: string | undefined,
  ) => string | null | undefined;
}

const SearchHistoryBandList: React.FC<SearchHistoryBandListProps> = ({
  songList,
  searchHistory,
  search_content,
  getYoutubeVideoId,
}) => {
  const [channelProfiles, setChannelProfiles] = useState<string[]>([]);
  const [channelProfileIsLoading, setChannelProfileIsLoading] = useState(true);
  const [filteredYouTubeURL, setFilteredYouTubeURL] = useState<string[]>([]);

  useEffect(() => {
    const filteredSearchHistory = searchHistory
      .filter((item) => {
        return item.search_category === "band";
      })
      .sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

    const filteredYouTubeURL = [];
    for (const history of filteredSearchHistory ?? []) {
      for (const song of songList ?? []) {
        if (
          history.search_content ===
          song.original_band?.toLowerCase().trim().replace(/ /g, "-")
        ) {
          filteredYouTubeURL.push(song.original_youtube_url);
          break;
        }
      }
    }

    setFilteredYouTubeURL(filteredYouTubeURL as string[]);
  }, [songList, searchHistory]);

  useEffect(() => {
    const apiKey = "AIzaSyACcxuHB_5vduPISTHPH5XjJNlZWjSd8R4";

    void (async () => {
      let completedRequests = 0;
      const profiles: string[] = [];

      for (const url of filteredYouTubeURL ?? []) {
        const videoId = getYoutubeVideoId(url ?? "");
        await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`,
        ).then(
          async (res) =>
            await res.json().then(async (result) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              const channelId = result?.items?.[0]?.snippet.channelId as string;
              if (channelId) {
                await fetch(
                  `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
                ).then(
                  async (res) =>
                    await res.json().then((result) => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      const channelProfile = result.items[0]?.snippet.thumbnails
                        .high.url as string;
                      profiles.push(channelProfile);
                      completedRequests++;
                      if (completedRequests === filteredYouTubeURL?.length) {
                        setChannelProfileIsLoading(false);
                      }
                    }),
                );
              }
            }),
        );
      }
      setChannelProfiles(profiles);
    })();
  }, [filteredYouTubeURL, getYoutubeVideoId]);

  let count = -1;

  return (
    <>
      {songList
        ?.filter((song) => {
          return (
            song.original_band?.toLowerCase().trim().replace(/ /g, "-") ===
            search_content
          );
        })
        .slice(0, 1)
        .map((song, i) => {
          count++;
          return (
            <Link
              key={i}
              href={`/band/${song.original_band
                ?.toLowerCase()
                .trim()
                .replace(/ /g, "-")}`}
              className="flex min-h-[82px] items-center gap-3 rounded-md border-2 p-3 hover:bg-[#f8f8f9] sm:min-h-[102px] md:min-h-[122px] lg:min-h-[142px]"
            >
              {channelProfiles.length > 0 ? (
                <div className="flex h-[60px] w-[60px] items-center justify-center sm:min-h-[80px] sm:min-w-[80px] md:min-h-[100px] md:min-w-[100px] lg:min-h-[120px] lg:min-w-[120px]">
                  <div className="relative min-h-[50px] min-w-[50px] overflow-hidden rounded-full sm:min-h-[70px] sm:min-w-[70px] md:min-h-[90px] md:min-w-[90px] lg:min-h-[110px] lg:min-w-[110px]">
                    <Image
                      src={channelProfiles[count] ?? ""}
                      alt={song.original_band!}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border bg-white">
                  <MdImageNotSupported />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold sm:text-base md:text-lg lg:text-2xl">
                  {song.original_band}
                </p>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default SearchHistoryBandList;
