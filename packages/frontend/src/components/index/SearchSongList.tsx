import Image from "next/image";
import React from "react";
import { type Tag, type Song } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";

interface SearchSongListProps {
  showBand: boolean | undefined;
  showAlbum: boolean | undefined;
  searchString: string;
  filteredSongList: (Song & { tags: Tag[] })[];
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

  return (
    <>
      {searchString.trim() !== "" && filteredSongList.length !== 0 && (
        <div className="flex items-center gap-1 truncate py-3 pl-3 text-lg font-semibold sm:py-0 sm:pl-1">
          {(showBand! || showAlbum) && (
            <>
              <h1>
                Songs from{" "}
                {showAlbum
                  ? filteredSongList[0]?.album
                  : filteredSongList[0]?.original_band}{" "}
              </h1>
              <p className="h-[60%] text-sm font-normal text-neutral-500">-</p>
            </>
          )}
          <p className="h-[60%] text-sm font-normal text-neutral-500">
            {filteredSongList.length}{" "}
            {filteredSongList.length > 1 ? "results" : "result"}
          </p>
        </div>
      )}
      {filteredSongList.map((items, i) => {
        let thumbnailUrl = "";
        if (items.original_youtube_url) {
          const youtubeVideoId = getYoutubeVideoId(items.original_youtube_url);
          thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
        }

        return (
          <Link
            key={i}
            href={`/song/${items.id}`}
            className="flex flex-col gap-5 border-b pb-3 hover:bg-[#f8f8f9] hover:shadow-md sm:flex-row sm:rounded-lg sm:border-2 sm:p-3"
          >
            <div
              className={`${
                thumbnailUrl === "" && "border-2"
              } relative h-[30dvh] w-full overflow-hidden sm:h-[140px] sm:w-[250px] sm:min-w-[250px] sm:rounded md:h-[165px] md:w-[300px] md:min-w-[300px]`}
            >
              <Image
                src={thumbnailUrl !== "" ? thumbnailUrl : "/no-song-cover.svg"}
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
                                .trim()
                                .replace(/ /g, "-")}`,
                            );
                          }}
                        >
                          {items.original_band}
                        </button>
                      </span>{" "}
                    </>
                  )}

                  {items.album && items.album.trim() !== "-" && (
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
                              .trim()
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
                {items.tags.length > 0 && (
                  <div className="flex gap-1 pt-1">
                    {items.tags.map((tag, i) => {
                      return (
                        <div
                          key={i}
                          className="rounded border px-1 brightness-90"
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
