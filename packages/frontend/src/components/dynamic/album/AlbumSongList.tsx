import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type Song } from "@prisma/client";
import { useRouter } from "next/router";

interface AlbumSongListProps {
  filteredSongList: Song[] | undefined;
  getYoutubeVideoId: (youtubeUrl: string) => string | null | undefined;
}

const AlbumSongList: React.FC<AlbumSongListProps> = ({
  filteredSongList,
  getYoutubeVideoId,
}) => {
  const router = useRouter();
  return (
    <div className="w-full pb-5 pt-5 md:pt-0">
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-2">
        {filteredSongList?.map((items, i) => {
          let thumbnailUrl = "";
          if (items.original_youtube_url) {
            const youtubeVideoId = getYoutubeVideoId(
              items.original_youtube_url,
            );
            thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
          }
          return (
            <Link
              href={`/song/${items.id}`}
              key={i}
              className="flex gap-5 truncate rounded-lg border-2 p-5 hover:bg-[#f8f8f9] hover:shadow-md lg:block xl:flex"
            >
              <div
                className={`${
                  thumbnailUrl === "" && "rounded-md border-2"
                } relative w-[100px] min-w-[100px] md:h-[100px] md:h-[105px] md:w-[200px] md:w-[200px] md:min-w-[200px] md:min-w-[200px] lg:h-[150px] lg:w-full lg:min-w-full xl:h-[105px] xl:w-[200px] xl:min-w-[200px]`}
              >
                <Image
                  src={
                    thumbnailUrl !== "" ? thumbnailUrl : "/no-song-cover.svg"
                  }
                  alt={items.name!}
                  fill={true}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`${
                    thumbnailUrl !== ""
                      ? "rounded-md object-cover"
                      : "absolute bottom-0 left-0 right-0 top-0 m-auto max-h-[80%] max-w-[80%]"
                  }`}
                />
              </div>
              <div className="truncate lg:pt-2 xl:pt-0">
                <h1 className="truncate text-sm md:text-base lg:text-lg">
                  <span className="font-semibold">{items.name}</span>{" "}
                  {items.alt_name && items.alt_name.trim() !== "-" && (
                    <span className="font-light">{items.alt_name}</span>
                  )}
                </h1>
                <p className="flex flex-col gap-1 pt-1 text-xs text-neutral-500 lg:text-sm">
                  <span>
                    By{" "}
                    <button
                      className="pointer-events-none md:pointer-events-auto md:font-semibold md:text-black md:hover:underline"
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
                    </button>{" "}
                  </span>
                  {items.original_key && (
                    <span className="flex gap-1 text-xs text-neutral-500 lg:text-sm">
                      Key of{" "}
                      <span className="md:font-semibold md:text-black">
                        {items.original_key}
                      </span>
                    </span>
                  )}
                  {items.song_language && (
                    <span className="flex gap-1 text-xs text-neutral-500 lg:text-sm">
                      Language :
                      <span className="flex gap-1">
                        {items.song_language.split(" + ").map((lang, j) => {
                          return (
                            <span key={j} className="rounded border px-1">
                              {lang}
                            </span>
                          );
                        })}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumSongList;
