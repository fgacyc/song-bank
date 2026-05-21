import React, { useEffect, useState } from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import Polaroid from "@/features/shared/ui/Polaroid";
import Link from "next/link";
import slugify from "slugify";
import type { ArtistType } from "@/types/types";
import { Disc3, Music } from "lucide-react";

/* 
TODO: 
    implement collaborative filtering, 
    currently use mock data first
*/

const FeaturedArtists = () => {
  const { featuredArtists, isLoading, error } = useHome();

  const [isMobile, setIsMobile] = useState(false);

  const getArtistImage = (artist: ArtistType) => {
    return artist.image_cover_url ?? "";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <h2>Featured Artists</h2>
        <HiMiniArrowTrendingUp className="text-xl" />
      </div>
      <div className="grid w-full grid-cols-1 items-center justify-center gap-6 sm:w-fit sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featuredArtists.data?.map((artist) => {
          return (
            <Link
              href={`/artist/${artist.id}/${slugify(artist.name, { lower: true })}`}
              key={artist.id}
              className="w-full flex-shrink-0 md:w-fit"
            >
              <Polaroid
                imageSrc={artist.image_cover_url ?? ""}
                imageAlt={artist.name}
                fill={isMobile}
                width={250}
                height={400}
                imgRatio={0.6}
              >
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-start">
                  <div className="w-3/4 space-y-2">
                    <h3 className="truncate text-text-primary">
                      {artist.name}
                    </h3>
                    {/* <p className="text-wrap text-sm text-text-secondary">
                      {artist.bio ?? "lorem ipsum dolor sit amet"}
                    </p> */}

                    <div className="flex flex-col items-start justify-center gap-2">
                      {artist.album_count > 0 && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <Disc3 className="h-4 w-4 text-text-secondary" />
                          {artist.album_count}{" "}
                          {artist.album_count === 1 ? "Album" : "Albums"}
                        </div>
                      )}
                      {artist.song_count > 0 && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <Music className="h-4 w-4 text-text-secondary" />
                          {artist.song_count}{" "}
                          {artist.song_count === 1 ? "Song" : "Songs"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Polaroid>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedArtists;
