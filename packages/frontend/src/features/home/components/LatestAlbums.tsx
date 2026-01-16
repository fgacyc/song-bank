import React, { useEffect, useRef, useState } from "react";
import { useHome } from "../hooks/useHome";
import Polaroid from "@/features/shared/ui/Polaroid";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/features/shared/ui/Badge";
import Link from "next/link";
import slugify from "slugify";

const LatestAlbums = () => {
  const { latestAlbums, isLoading, error } = useHome();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollAmount = 320;

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, [latestAlbums.data]);

  // TODO: loading and error ui
  if (isLoading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2>Latest Albums</h2>
        <Badge className="h-fit rounded-lg bg-bg-quaternary px-2.5 py-0.5 text-xs text-text-primary hover:bg-bg-quaternary">
          New
        </Badge>
      </div>

      <div className="group relative">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-[45%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary text-text-primary transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:backdrop-blur-md group-hover:opacity-100 lg:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-[45%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary text-text-primary transition-all duration-200 hover:bg-white/10 hover:shadow-lg hover:backdrop-blur-md group-hover:opacity-100 lg:flex"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex gap-6 overflow-x-auto overflow-y-hidden"
          onScroll={checkScrollButtons}
        >
          {latestAlbums.data?.map((album) => {
            const createdDate = album.release_date
              ? new Date(album.release_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                  day: "2-digit",
                })
              : "";

            const captions = [
              album.artist.name || "Unknown artist",
              createdDate,
            ].filter(Boolean);

            return (
              <Link
                href={`/album/${album.id}/${slugify(album.name, { lower: true })}`}
                key={album.id}
                className="flex-shrink-0"
              >
                <Polaroid
                  imageSrc={album.image_cover_url ?? ""}
                  imageAlt={album.name}
                  width={260}
                  height={300}
                  imgRatio={0.48}
                >
                  <div className="flex h-full w-full flex-col items-start justify-end p-6 text-start">
                    <div className="h-3/4 w-3/4 space-y-2">
                      <h3 className="truncate text-text-primary">
                        {album.name}
                      </h3>
                      {captions.map((caption, index) => (
                        <p
                          key={index}
                          className="text-wrap text-sm text-text-secondary"
                        >
                          {caption}
                        </p>
                      ))}
                    </div>
                  </div>
                </Polaroid>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestAlbums;
