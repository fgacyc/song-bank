import Image from "next/image";
import React, { useState } from "react";
import { type Song } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";

interface SearchSongListProps {
  showBand: boolean | undefined;
  showAlbum: boolean | undefined;
  searchString: string;
  filteredSongList: Song[];
  getYoutubeVideoId: (youtubeUrl: string) => string | null | undefined;
}

const SearchSongList: React.FC<SearchSongListProps> = ({
  showBand,
  showAlbum,
  searchString,
  filteredSongList,
  getYoutubeVideoId,
}) => {
  const router = useRouter();
  const [activeList, setActiveList] = useState(-1);
  return (
    <>
      {searchString.trim() !== "" && filteredSongList.length !== 0 && (
        <h1 className="flex items-center pl-3 text-lg font-semibold sm:pl-1">
          {(showBand! || showAlbum) && (
            <span>
              Songs from{" "}
              {showAlbum
                ? filteredSongList[0]?.album
                : filteredSongList[0]?.original_band}{" "}
              <span className="text-sm font-normal text-neutral-500">-</span>
            </span>
          )}
          <span className="pt-1 text-sm font-normal text-neutral-500">
            {filteredSongList.length}{" "}
            {filteredSongList.length > 1 ? "results" : "result"}
          </span>
        </h1>
      )}
      {filteredSongList.map((items, i) => {
        const originalYoutubeUrl = items.original_youtube_url ?? "";
        const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
        const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;

        return (
          <Link
            key={i}
            href={`/song/${items.name?.toLowerCase().replace(/ /g, "-")}`}
            className={`${
              activeList === i ? "bg-[#f5f5f6] shadow-md" : ""
            } flex flex-col gap-5 border-b pb-3 sm:flex-row sm:rounded-lg sm:border-2 sm:p-3`}
            onMouseEnter={() => setActiveList(i)}
            onMouseLeave={() => setActiveList(-1)}
          >
            <div className="relative h-[30dvh] w-full overflow-hidden sm:h-[110px] sm:w-[200px] sm:min-w-[200px] sm:rounded md:h-[140px] md:w-[250px] md:min-w-[250px] lg:h-[165px] lg:w-[300px] lg:min-w-[300px]">
              <Image
                src={thumbnailUrl}
                alt={items.name!}
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 truncate pb-3 pl-3 sm:pb-0 sm:pl-0">
              <h1 className="text-start text-lg font-semibold md:text-2xl">
                {items.name}{" "}
                {items.alt_name && items.alt_name !== "-" && (
                  <span className="font-thin">{items.alt_name}</span>
                )}
              </h1>
              <div className="flex flex-col gap-1 text-start text-xs text-slate-500 md:text-sm">
                <p>
                  {items.original_band && (
                    <>
                      <span>
                        By{" "}
                        <button
                          className="text-black underline lg:font-semibold lg:no-underline lg:hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void router.push(
                              `/band/${items
                                .original_band!.toLowerCase()
                                .replace(/ /g, "-")}`,
                            );
                          }}
                        >
                          {items.original_band}
                        </button>
                      </span>{" "}
                    </>
                  )}

                  {items.album && (
                    <span>
                      on album{" "}
                      <button
                        className="text-black underline lg:font-semibold lg:no-underline lg:hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void router.push(
                            `/album/${items.album
                              ?.toLowerCase()
                              .replace(/ /g, "-")}`,
                          );
                        }}
                      >
                        {items.album}
                      </button>
                    </span>
                  )}
                </p>
                {items.original_key && <p>Key of {items.original_key}</p>}
                {items.song_language && (
                  <p className="flex items-center gap-1">
                    Language :
                    <span className="flex gap-1">
                      {items.song_language.split(" + ").map((language, j) => {
                        return (
                          <span key={j} className="rounded border px-1 text-xs">
                            {language}
                          </span>
                        );
                      })}
                    </span>
                  </p>
                )}
                {searchString.trim() !== "" &&
                  !items
                    .name!.toLowerCase()
                    .replace(/[', ]/g, "")
                    .includes(
                      searchString.toLowerCase().replace(/[', ]/g, ""),
                    ) &&
                  items
                    .chord_lyrics!.toLowerCase()
                    .replace(/\[.*?\]|\n| /g, " ")
                    .includes(searchString.toLowerCase().trim()) &&
                  items
                    .chord_lyrics!.toLowerCase()
                    .replace(/\[.*?\]|\n| /g, " ")
                    .split(" ")
                    .filter(
                      (word) =>
                        word &&
                        searchString.toLowerCase().trim().includes(word),
                    ) && (
                    <div className="font-semibold text-green-600">
                      Lyrics matched
                    </div>
                  )}
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default SearchSongList;
