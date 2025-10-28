import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import Polaroid from "@/features/shared/ui/Polaroid";
import type { Creator } from "@/types/types";

/* 
TODO: 
    implement collaborative filtering, 
    currently use static mock data first
*/

const FeaturedCreators = () => {
  const { featuredCreators, isLoading, error } = useHome();

  const getCreatorImage = (creator: Creator) => {
    console.log(
      `Creator "${creator.name}" cover URL:`,
      creator.cover_image_url,
    );
    return creator.cover_image_url ?? "/carousel-2.jpg";
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
            <div key={creator.id} className="w-full flex-shrink-0 md:w-fit">
              <Polaroid
                imageSrc={getCreatorImage(creator)}
                title={creator.name}
                captions={[
                  `${creator.songCount} Songs`,
                  `${creator.albumCount} Albums`,
                ]}
                width={250}
                height={400}
                imgRatio={0.6}
                descriptionAlignment="topRight"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCreators;
