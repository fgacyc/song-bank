import React from "react";
import MainCarousel from "./MainCarousel";
import LatestAlbums from "./LatestAlbums";
import FeaturedArtists from "./FeaturedArtists";
import TopHotSongs from "./TopHotSongs";

const HomePage = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[80dvw] space-y-12 pt-12">
        <MainCarousel />
        <LatestAlbums />
        <FeaturedArtists />
        <TopHotSongs />
      </div>
    </div>
  );
};

export default HomePage;
