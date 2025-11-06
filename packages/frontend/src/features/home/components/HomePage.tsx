import React from "react";
import MainCarousel from "./MainCarousel";
import LatestAlbums from "./LatestAlbums";
import FeaturedArtists from "./FeaturedArtists";
import TopHotSongs from "./TopHotSongs";

const HomePage = () => {
  return (
    <div className="space-y-12 px-6 pb-28 pt-12 md:px-12 lg:px-24">
      <MainCarousel />
      <LatestAlbums />
      <FeaturedArtists />
      <TopHotSongs />
    </div>
  );
};

export default HomePage;
