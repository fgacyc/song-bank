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

const FeaturedCreators = () => {
  const { featuredCreators, isLoading, error } = useHome();

  const getCreatorImage = (creator: Artist) => {
    return creator.image_cover_url ?? "";
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
        <h2>Featured Creators</h2>
        <HiMiniArrowTrendingUp className="text-xl" />
      </div>
      <div className="grid w-fit grid-cols-2 items-center justify-center gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {featuredCreators.data?.map((creator) => {
          return (
            <Link
              href={`/creator/${creator.id}`}
              key={creator.id}
              className="w-full flex-shrink-0 md:w-fit"
            >
              <Polaroid
                imageSrc={getCreatorImage(creator)}
                title={creator.name}
                captions={[
                  `${creator.song_count} Songs`,
                  `${creator.album_count} Albums`,
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

export default FeaturedCreators;
