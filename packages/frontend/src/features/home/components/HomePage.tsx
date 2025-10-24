import React from "react";
import MainCarousel from "./MainCarousel";
import LatestAlbums from "./LatestAlbums";
import FeaturedCreators from "./FeaturedCreators";
import TopHotSongs from "./TopHotSongs";

const HomePage = () => {
  return (
    <div className="space-y-16 px-4 py-14 md:px-12 lg:px-24">
      <MainCarousel />
      <LatestAlbums />
      <FeaturedCreators />
      <TopHotSongs />
    </div>
  );
};

export default HomePage;
