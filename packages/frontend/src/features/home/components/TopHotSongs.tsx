import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

const TopHotSongs = () => {
  return (
    <div className="flex items-center gap-2">
      <h2>Top 20 Hot Songs</h2>
      <HiMiniArrowTrendingUp className="text-xl" />
    </div>
  );
};

export default TopHotSongs;
