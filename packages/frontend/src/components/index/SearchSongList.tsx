/* eslint-disable @next/next/no-img-element */
import React from "react";
import { type Tag, type Song } from "@prisma/client";
import Link from "next/link";

interface SearchSongListProps {
  searchString: string;
  filteredSongList: (Song & { tags: Tag[] })[];
  getYoutubeVideoId: (youtubeUrl: string) => string | null | undefined;
}

const SearchSongList: React.FC<SearchSongListProps> = ({
  searchString,
  filteredSongList,
  getYoutubeVideoId,
}) => {
  return (
    <>
      {filteredSongList.map((item) => {
        const ytid = getYoutubeVideoId(item.original_youtube_url ?? "");

        return (
          <Link
            key={item.id}
            href={`/song/${item.id}`}
            className="flex w-full flex-col overflow-hidden rounded-md pb-3 hover:bg-[#f8f8f9] hover:shadow-md md:flex-row md:rounded-lg md:border-2 md:p-3"
          >
            <div
              className={`${
                ytid === "" ? "border-2" : ""
              } aspect-video h-full w-full overflow-hidden  md:max-w-[210px] md:rounded lg:max-w-[300px]`}
            >
              {/* <Image
                src={thumbnailUrl !== "" ? thumbnailUrl : "/no-song-cover.svg"}
                alt={item.name!}
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full"
              /> */}
              <img
                src={
                  ytid
                    ? `https://i.ytimg.com/vi/${ytid}/hqdefault.jpg`
                    : "/no-song-cover.svg"
                }
                alt={item.name ?? ""}
                className={`h-full w-full ${ytid === "" ? "object-contain" : "object-cover"}`}
              />
            </div>
            <div className="flex w-full flex-col justify-between rounded-b-md border-x border-b py-2 pl-2 pr-2 md:border-none md:py-0 md:pr-0">
              <div className="flex w-full flex-col gap-0.5">
                <div className="item-center flex w-full flex-row justify-between">
                  <h1 className="max-w-[80%] truncate text-start text-lg font-semibold md:text-xl">
                    {item.name}{" "}
                    {item.alt_name && item.alt_name !== "-" && (
                      <span className="font-thin">{item.alt_name}</span>
                    )}
                  </h1>
                  {item.original_key && (
                    <div className="item-center flex h-[28px] w-[28px] flex-row justify-center rounded-md border border-black text-[10px] leading-[2.5]">
                      {item.original_key}
                    </div>
                  )}
                </div>
                {item.original_band && (
                  <button className="text-left text-xs italic text-gray-400">
                    {item.original_band}
                  </button>
                )}

                {item.album && item.album.trim() !== "-" && (
                  <button className="text-left text-xs italic text-gray-400">
                    {item.album}
                  </button>
                )}
              </div>
              <div className="flex w-full flex-col text-start text-xs">
                {item.tags.length > 0 && (
                  <div className="flex gap-1.5 pt-3">
                    {item.tags.map((tag, i) => {
                      return (
                        <div
                          key={i}
                          className="rounded border px-2 py-0.5 brightness-90"
                          style={{
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                        >
                          {tag.content}
                        </div>
                      );
                    })}
                  </div>
                )}
                {searchString.trim() !== "" &&
                  !item
                    .name!.toLowerCase()
                    .replace(/[', ]/g, "")
                    .includes(
                      searchString.toLowerCase().replace(/[', ]/g, ""),
                    ) &&
                  item
                    .chord_lyrics!.toLowerCase()
                    .replace(/\[.*?\]|\n| /g, " ")
                    .includes(searchString.toLowerCase().trim()) &&
                  item
                    .chord_lyrics!.toLowerCase()
                    .replace(/\[.*?\]|\n| /g, " ")
                    .split(" ")
                    .filter(
                      (word) =>
                        word &&
                        searchString.toLowerCase().trim().includes(word),
                    ) && (
                    <div className="pt-2 italic text-green-600">
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
