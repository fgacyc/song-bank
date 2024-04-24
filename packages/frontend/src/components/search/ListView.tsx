import { type Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ListViewProps {
  songList?: Song[];
  isLoading: boolean;
}

const LoadingList = () => {
  const [mouseEntered, setMouseEntered] = useState(false);
  return (
    <div
      className={`${
        mouseEntered && "bg-[#fafafb] shadow-md"
      } flex flex-col truncate rounded pb-5 sm:flex-row sm:border-2 sm:p-5`}
      onMouseEnter={() => {
        setMouseEntered(true);
      }}
      onMouseLeave={() => setMouseEntered(false)}
    >
      <div className="relative h-[25dvh] w-full overflow-hidden sm:h-[125px] sm:w-[260px] sm:rounded md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex w-full flex-col gap-3 pl-5 pt-5 sm:pt-0">
        <h1 className="w-[300px]">
          <Skeleton />
        </h1>
        <p className="h-[15px] w-[260px]">
          <Skeleton height={"100%"} />
        </p>
        <p className="h-[15px] w-[280px]">
          <Skeleton height={"100%"} />
        </p>
        <p className="hidden h-[15px] w-[200px] sm:block">
          <Skeleton height={"100%"} />
        </p>
        <p className="hidden h-[15px] w-[180px] md:block">
          <Skeleton height={"100%"} />
        </p>
      </div>
    </div>
  );
};

const ListView: React.FC<ListViewProps> = ({ songList, isLoading }) => {
  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  const router = useRouter();
  const [activeList, setActiveList] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col sm:gap-5">
        {Array.from({ length: 7 }, (_, i) => (
          <LoadingList key={i} />
        ))}
      </div>
    );
  } else {
    return (
      <>
        {songList &&
          songList.length !== 0 &&
          songList.map((items, i) => {
            const originalYoutubeUrl = items.original_youtube_url ?? "";
            const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
            if (youtubeVideoId) {
              const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
              return (
                <button
                  onClick={() =>
                    void router.push(
                      `/song/${items.name?.toLowerCase().replace(/ /g, "-")}`,
                    )
                  }
                  key={i}
                  className={`${
                    activeList === i ? "bg-[#f5f5f6] shadow-md" : ""
                  } flex flex-col overflow-hidden sm:flex-row sm:rounded sm:border-2 sm:p-3 sm:pb-3`}
                  onMouseEnter={() => {
                    setActiveList(i);
                  }}
                  onMouseLeave={() => {
                    setActiveList(null);
                  }}
                >
                  <div className="relative h-[25dvh] w-full overflow-hidden sm:h-[125px] sm:w-[260px] sm:rounded md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
                    <Image
                      src={thumbnailUrl}
                      alt={items.name!}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3 sm:pl-5 sm:pt-0">
                    <h1 className="truncate text-base sm:py-1 sm:text-lg md:py-1 md:text-2xl lg:py-1 lg:text-3xl">
                      <span className="font-semibold">{items.name}</span>{" "}
                      {items.alt_name && items.alt_name.trim() !== "-" && (
                        <span className=" font-light">{items.alt_name}</span>
                      )}
                    </h1>
                    <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
                      By{" "}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          void router.push(
                            `/band/${items
                              .original_band!.toLowerCase()
                              .replace(/ /g, "-")}`,
                          );
                        }}
                        className="pointer-events-none hover:underline md:pointer-events-auto md:font-semibold md:text-black"
                      >
                        {items.original_band}
                      </button>{" "}
                      {items.album && (
                        <span>
                          on album{" "}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              void router.push(
                                `/album/${items.album
                                  ?.toLowerCase()
                                  .replace(/ /g, "-")}`,
                              );
                            }}
                            className="pointer-events-none hover:underline md:pointer-events-auto md:font-semibold md:text-black"
                          >
                            {items.album}
                          </button>
                        </span>
                      )}
                    </p>
                    {items.original_key && (
                      <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
                        Key of {items.original_key} Major
                      </p>
                    )}
                    {items.song_language && (
                      <p className="flex gap-1 truncate pt-2 text-xs text-neutral-500 lg:text-sm">
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
                      </p>
                    )}
                  </div>
                </button>
              );
            }
          })}
      </>
    );
  }
};

export default ListView;
