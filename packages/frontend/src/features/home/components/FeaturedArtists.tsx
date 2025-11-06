import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import Polaroid from "@/features/shared/ui/Polaroid";
import Link from "next/link";
import type { Artist } from "@prisma/client";

/* 
TODO: 
    implement collaborative filtering, 
    currently use mock data first
*/

const FeaturedArtists = () => {
  const { featuredArtists, isLoading, error } = useHome();

  const getArtistImage = (artist: Artist) => {
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
              href={`/artist/${artist.id}`}
              key={artist.id}
              className="w-full flex-shrink-0 md:w-fit"
            >
              <Polaroid
                imageSrc={getArtistImage(artist)}
                title={artist.name}
                captions={[
                  `${artist.song_count} Songs`,
                  `${artist.album_count} Albums`,
                ]}
                width={250}
                height={400}
                imgRatio={0.6}
                descriptionAlignment="topRight"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedArtists;
