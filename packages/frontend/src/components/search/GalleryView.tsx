import { type Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface GalleryViewProps {
  songList?: Song[];
  isLoading: boolean;
}

const LoadingCards = () => {
  const [mouseEntered, setMouseEntered] = useState(false);

  return (
    <div
      className={`${
        mouseEntered && "bg-[#fafafb] shadow-md"
      } flex flex-col gap-2 rounded border-2 p-3 pb-5`}
      onMouseEnter={() => {
        setMouseEntered(true);
      }}
      onMouseLeave={() => setMouseEntered(false)}
    >
      <div className="h-[135px]">
        <Skeleton height={"100%"} />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="h-[20px] w-[140px]">
          <Skeleton height={"100%"} />
        </h1>
        <p className="h-[10px] w-[100px]">
          <Skeleton height={"100%"} />
        </p>
        <p className="h-[10px] w-[120px]">
          <Skeleton height={"100%"} />
        </p>
        <p className="hidden h-[10px] w-[60px] sm:block">
          <Skeleton height={"100%"} />
        </p>
        <p className="hidden h-[10px] w-[80px] md:block">
          <Skeleton height={"100%"} />
        </p>
      </div>
    </div>
  );
};

const GalleryView: React.FC<GalleryViewProps> = ({ songList, isLoading }) => {
  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };
  const [activeCard, setActiveCard] = useState<number | null>(null);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 20 }, (_, i) => (
          <LoadingCards key={i} />
        ))}
      </>
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
                <Link
                  key={i}
                  href={`/song/${items.name?.toLowerCase().replace(/ /g, "-")}`}
                  className={activeCard === i ? "bg-[#f5f5f6] shadow-md" : ""}
                  onMouseEnter={() => {
                    setActiveCard(i);
                  }}
                  onMouseLeave={() => {
                    setActiveCard(null);
                  }}
                >
                  <div className="flex h-full flex-col items-center justify-start rounded border-2 p-3">
                    <div className="relative h-[135px] w-full">
                      <Image
                        src={thumbnailUrl}
                        alt={items.name!}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-1 p-1">
                      <p className="truncate text-lg font-semibold">
                        {items.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        By{" "}
                        <Link
                          href={`/band/${items.original_band
                            ?.toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="pointer-events-none hover:underline md:pointer-events-auto md:font-semibold md:text-black"
                        >
                          {items.original_band}
                        </Link>{" "}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {items.album && (
                          <span>
                            On album{" "}
                            <Link
                              href={`/album/${items.album
                                ?.toLowerCase()
                                .replace(/ /g, "-")}`}
                              className="pointer-events-none hover:underline md:pointer-events-auto md:font-semibold md:text-black"
                            >
                              {items.album}
                            </Link>
                          </span>
                        )}
                      </p>
                      {items.original_key && (
                        <p className="flex gap-1 truncate text-xs text-neutral-500">
                          Key of {items.original_key} Major
                        </p>
                      )}
                      {items.song_language && (
                        <p className="flex gap-1 truncate text-xs text-neutral-500">
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
                  </div>
                </Link>
              );
            }
          })}
      </>
    );
  }
};

export default GalleryView;
