import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import Polaroid from "@/features/shared/ui/Polaroid";
import Link from "next/link";
import slugify from "slugify";
import type { ArtistType } from "@/types/types";

/* 
TODO: 
    implement collaborative filtering, 
    currently use mock data first
*/

const FeaturedArtists = () => {
  const { featuredArtists, isLoading, error } = useHome();

  const getArtistImage = (artist: ArtistType) => {
    return artist.image_cover_url ?? "";
  };

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
      <div className="grid w-fit grid-cols-2 items-center justify-center gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {featuredArtists.data?.map((artist) => {
          return (
            <Link
              href={`/artist/${artist.id}/${slugify(artist.name, { lower: true })}`}
              key={artist.id}
              className="w-full flex-shrink-0 md:w-fit"
            >
              <Polaroid
                imageSrc={getArtistImage(artist)}
                imageAlt={artist.name}
                width={250}
                height={400}
                imgRatio={0.6}
              >
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <div className="w-3/4 space-y-2">
                    <h3 className="truncate text-text-primary">
                      {artist.name}
                    </h3>
                    <p className="text-wrap text-sm text-text-secondary">
                      {artist.bio ?? "lorem ipsum dolor sit amet"}
                    </p>
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
