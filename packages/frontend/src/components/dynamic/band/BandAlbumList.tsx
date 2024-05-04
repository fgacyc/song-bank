import Link from "next/link";
import React, { useState } from "react";
import { type Song } from "@prisma/client";
import Image from "next/image";

interface BandAlbumListProps {
  uniqueAlbumList: string[];
  filteredSongListWithAlbum: Song[];
  getYoutubeVideoId: (
    youtubeUrl: string | undefined,
  ) => string | null | undefined;
}

const BandAlbumList: React.FC<BandAlbumListProps> = ({
  uniqueAlbumList,
  filteredSongListWithAlbum,
  getYoutubeVideoId,
}) => {
  const [activeBand, setActiveBand] = useState<number | null>(null);
  return (
    <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {uniqueAlbumList.map((album, i) => {
        const songsInAlbum = filteredSongListWithAlbum.filter(
          (items) => items.album === album,
        );
        const numberOfSongsInAlbum = songsInAlbum.length;

        const songsToShow =
          numberOfSongsInAlbum === 1 ? 1 : numberOfSongsInAlbum >= 4 ? 4 : 2;
        const songsToShowInAlbum = songsInAlbum.slice(0, songsToShow);

        let gridCol = "";
        if (numberOfSongsInAlbum == 1) {
          gridCol = "grid-cols-1";
        } else if (numberOfSongsInAlbum == 2 || numberOfSongsInAlbum == 3) {
          gridCol = "grid-cols-2";
        } else if (numberOfSongsInAlbum >= 4) {
          gridCol = "grid-cols-2";
        }
        return (
          <Link
            key={i}
            href={`/album/${album?.toLowerCase().trim().replace(/ /g, "-")}`}
            className={`${
              activeBand === i ? "bg-[#f5f5f6] shadow-md" : ""
            } flex flex-col items-center overflow-hidden rounded-lg border-2 p-5`}
            onMouseEnter={() => {
              setActiveBand(i);
            }}
            onMouseLeave={() => {
              setActiveBand(null);
            }}
          >
            <div
              className={`grid ${gridCol} min-h-[250px] w-full gap-[1px] overflow-hidden rounded border-2`}
            >
              {songsToShowInAlbum.map((items, j) => {
                const originalYoutubeUrl = items.original_youtube_url ?? "";
                const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
                const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                return (
                  <div
                    key={j}
                    className="flex items-center justify-center overflow-hidden"
                  >
                    <div className="relative h-[135%] w-full">
                      <Image
                        src={
                          youtubeVideoId ? thumbnailUrl : "/img/no-cover.jpg"
                        }
                        alt={items.name!}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <h1 className="gap-1 text-wrap pt-2">
              <span className="font-medium">{album}</span>{" "}
              <span className="text-center text-neutral-500">
                - {numberOfSongsInAlbum} songs
              </span>
            </h1>
          </Link>
        );
      })}
    </div>
  );
};

export default BandAlbumList;
