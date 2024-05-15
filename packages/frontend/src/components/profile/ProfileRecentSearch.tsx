import { useUser } from "@auth0/nextjs-auth0/client";
import type { SearchHistory, Sequencer, Song, Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const ProfileRecentSearch = () => {
  const { isLoading, user } = useUser();
  const [songList, setSongList] = useState<SongType[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      await fetch(`/api/history?user_id=${user?.sub}`, {
        method: "GET",
      }).then(async (res) => {
        await res.json().then((result: SearchHistory[]) => {
          setSearchHistory(result);
        });
      });
    };

    const fetchSongs = async () => {
      await fetch("/api/song", {
        method: "GET",
      }).then(async (res) => {
        await res.json().then((result: SongType[]) => {
          setSongList(result);
        });
      });
    };

    Promise.all([fetchHistory(), fetchSongs()])
      .then(() => setLoading(false))
      .catch((err) => console.error(err));
  }, [isLoading, user]);

  useMemo(() => {
    const filteredSearchHistory = searchHistory
      .filter((history) => history.search_category === "song")
      .sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })
      .slice(0, 12);

    const filteredSongList = [];
    for (const history of filteredSearchHistory) {
      for (const song of songList) {
        if (
          history.search_content ===
          song.name?.toLowerCase().trim().replace(/ /g, "-")
        )
          [filteredSongList.push(song)];
      }
    }

    setFilteredSongList(filteredSongList);
  }, [searchHistory, songList]);

  const getYoutubeVideoId = (youtubeUrl: string | undefined) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl?.match(regex);
    return match ? match[1] : null;
  };

  const LoadingList = () => {
    return (
      <div className="flex flex-col gap-2 rounded-md border-2 p-3">
        <div className="min-h-[70px] min-w-[130px] overflow-hidden rounded-md">
          <Skeleton height={"100%"} />
        </div>
        <div className="h-[13px] w-[100px] overflow-hidden">
          <Skeleton />
        </div>
        <div className="h-[11px] w-[80px] overflow-hidden">
          <Skeleton />
        </div>
      </div>
    );
  };

  if (
    searchHistory.length > 0 &&
    searchHistory.some((item) => item.search_category?.includes("song"))
  )
    return (
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold">Recent search</h1>
        <div className="flex gap-2 overflow-scroll">
          {loading ? (
            new Array(7).fill(null).map((_, i) => {
              return <LoadingList key={i} />;
            })
          ) : (
            <>
              {filteredSongList.map((items, i) => {
                const originalYoutubeUrl = items.original_youtube_url ?? "";
                const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
                const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                return (
                  <Link
                    key={i}
                    href={`/song/${items.name
                      ?.toLowerCase()
                      .trim()
                      .replace(/ /g, "-")}`}
                    className="flex flex-col gap-1 rounded-md border-2 p-3 hover:bg-[#f8f8f9]"
                  >
                    <div className="relative min-h-[70px] min-w-[130px] overflow-hidden rounded-md">
                      <Image
                        src={thumbnailUrl}
                        alt={items.name!}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="truncate text-sm font-semibold">
                        {items.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {items.original_band}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
};

export default ProfileRecentSearch;
