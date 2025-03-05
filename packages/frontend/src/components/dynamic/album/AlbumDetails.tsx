import React from "react";
import { type Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface AlbumDetailsProps {
  albumCoverImages: Song[] | undefined;
  filteredSongList: Song[] | undefined;
  gridCol: string;
  getYoutubeVideoId: (youtubeUrl: string) => string | null | undefined;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({
  albumCoverImages,
  filteredSongList,
  gridCol,
  getYoutubeVideoId,
}) => {
  return (
    <>
      <div className="h-fit rounded-lg border-2 p-3">
        <div
          className={`${gridCol} grid h-[300px] w-full gap-[1px] overflow-hidden rounded md:h-[200px] md:w-[200px] lg:h-[270px] lg:w-[300px]`}
        >
          {albumCoverImages?.map((items, i) => {
            let thumbnailUrl = "";
            if (items.original_youtube_url) {
              const youtubeVideoId = getYoutubeVideoId(
                items.original_youtube_url,
              );
              thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
              console.log("exist");
            }

            return (
              <div
                key={i}
                className={`${
                  thumbnailUrl === "" && "border-2"
                } flex items-center justify-center overflow-hidden`}
              >
                <div className="relative h-[135%] w-full">
                  <Image
                    src={thumbnailUrl || "/no-album-cover.svg"}
                    alt={items.name!}
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={
                      thumbnailUrl !== ""
                        ? "object-cover"
                        : "absolute bottom-0 left-0 right-0 top-0 m-auto max-h-[80%] max-w-[80%]"
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="py-3">
          <h1 className="text-sm font-semibold">Album</h1>
          <p className="text-xs text-neutral-500">
            {filteredSongList ? filteredSongList[0]?.album : "Album"}
          </p>
        </div>
        <div className="pb-4">
          <h1 className="text-sm font-semibold">Band</h1>
          <Link
            href={`/band/${
              filteredSongList
                ? filteredSongList[0]
                    ?.original_band!.toLowerCase()
                    .replace(/ /g, "-")
                : "Band"
            }`}
            className="text-xs text-neutral-500 underline md:no-underline md:hover:underline"
          >
            {filteredSongList ? filteredSongList[0]?.original_band : "Band"}
          </Link>
        </div>
        <hr />
        <div className="flex flex-col pt-4">
          <h1 className="text-sm font-semibold">Total Songs</h1>
          <p className="text-xs text-neutral-500">{filteredSongList?.length}</p>
        </div>
      </div>
    </>
  );
};

export default AlbumDetails;
