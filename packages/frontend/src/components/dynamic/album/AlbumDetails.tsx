import React from "react";
import { type Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface AlbumDetailsProps {
  albumCoverImage: Song[] | undefined;
  filteredSongList: Song[] | undefined;
  gridCol: string;
  getYoutubeVideoId: (youtubeUrl: string) => string | null | undefined;
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({
  albumCoverImage,
  filteredSongList,
  gridCol,
  getYoutubeVideoId,
}) => {
  return (
    <>
      <div className="h-fit rounded border-2 p-5">
        <div
          className={`${gridCol} grid h-[300px] w-full gap-[1px] overflow-hidden rounded md:h-[200px] md:w-[200px] lg:h-[270px] lg:w-[300px]`}
        >
          {albumCoverImage?.map((items, i) => {
            const originalYoutubeUrl = items.original_youtube_url ?? "";
            const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);

            if (youtubeVideoId) {
              const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;

              return (
                <div
                  key={i}
                  className="flex items-center justify-center overflow-hidden"
                >
                  <div className="relative h-[135%] w-full">
                    <Image
                      src={thumbnailUrl}
                      alt={items.name!}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={i}
                  className="relative flex items-center justify-center overflow-hidden"
                >
                  <div className="relative h-[135%] w-full">
                    <Image
                      src={"/img/logo.png"}
                      alt={items.name!}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="py-3">
          <h1 className="font-semibold">Album</h1>
          <p className="text-sm text-neutral-500">
            {filteredSongList ? filteredSongList[0]?.album : "Album"}
          </p>
        </div>
        <div className="pb-3">
          <h1 className="font-semibold">Band</h1>
          <Link
            href={`/band/${
              filteredSongList
                ? filteredSongList[0]
                    ?.original_band!.toLowerCase()
                    .replace(/ /g, "-")
                : "Band"
            }`}
            className="text-sm text-neutral-500 underline md:no-underline md:hover:underline"
          >
            {filteredSongList ? filteredSongList[0]?.original_band : "Band"}
          </Link>
        </div>
        <hr />
        <div className="flex flex-col pt-3">
          <h1 className="font-semibold">Total Songs</h1>
          <p className="text-sm text-neutral-500">{filteredSongList?.length}</p>
        </div>
      </div>
    </>
  );
};

export default AlbumDetails;
