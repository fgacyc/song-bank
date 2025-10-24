import React from "react";
import MainCarousel from "./MainCarousel";
import LatestAlbums from "./LatestAlbums";
import FeaturedCreators from "./FeaturedCreators";
import TopHotSongs from "./TopHotSongs";

const HomePage = () => {
  return (
    <div className="space-y-12 px-6 py-12 md:px-12 lg:px-24">
      <MainCarousel />
      <LatestAlbums />
      <FeaturedCreators />
      <TopHotSongs />
    </div>
  );
};

export default HomePage;
