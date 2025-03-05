import Link from "next/link";
import React from "react";
import { type Song } from "@prisma/client";
import Image from "next/image";

interface BandAlbumListProps {
  uniqueAlbumList: string[];
  filteredSongListWithAlbum: Song[];
  getYoutubeVideoId: (
    youtubeUrl: string | undefined,
  ) => string | null | undefined;
  band: string;
}

const BandAlbumList: React.FC<BandAlbumListProps> = ({
  uniqueAlbumList,
  filteredSongListWithAlbum,
  band,
  getYoutubeVideoId,
}) => {
  return (
    <div className="grid h-fit w-full gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
            href={`/album/${album?.toLowerCase().trim().replace(/ /g, "-")}?band=${band?.toLowerCase().trim().replace(/ /g, "-")}`}
            className="flex flex-col items-center overflow-hidden rounded-lg border-2 p-3 hover:bg-[#f8f8f9] hover:shadow-md"
          >
            <div
              className={`grid ${gridCol} min-h-[250px] w-full gap-[1px] overflow-hidden rounded`}
            >
              {songsToShowInAlbum.map((items, j) => {
                let thumbnailUrl = "";
                if (items.original_youtube_url) {
                  const youtubeVideoId = getYoutubeVideoId(
                    items.original_youtube_url,
                  );
                  thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                }
                return (
                  <div
                    key={j}
                    className={`${
                      thumbnailUrl === "" && "border-2"
                    } flex items-center justify-center overflow-hidden`}
                  >
                    <div className="relative h-[135%] w-full">
                      <Image
                        src={
                          thumbnailUrl !== ""
                            ? thumbnailUrl
                            : "/no-album-cover.svg"
                        }
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
            <h1 className="gap-1 text-wrap pt-2">
              <span className="font-medium">{album}</span>{" "}
              <span className="text-center text-neutral-500">
                - {numberOfSongsInAlbum}{" "}
                {numberOfSongsInAlbum > 1 ? "songs" : "song"}
              </span>
            </h1>
          </Link>
        );
      })}
    </div>
  );
};

export default BandAlbumList;
