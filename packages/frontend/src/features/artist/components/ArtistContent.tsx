import ToggleButton from "@/features/shared/ui/ToggleButton";
import type { ArtistType } from "@/types/types";
import React, { useState } from "react";
import ArtistAlbumList from "./ArtistAlbumList";
import ArtistSongList from "./ArtistSongList";

interface ArtistContentProps {
  artist: ArtistType;
}

const ArtistContent = ({ artist }: ArtistContentProps) => {
  const [selected, setSelected] = useState("Albums");

  return (
    <div className="relative flex w-full flex-col items-start justify-center overflow-hidden px-4 py-12 md:justify-start md:px-12 lg:px-24">
      <ToggleButton
        left="Albums"
        right="All Songs"
        selected={selected}
        setSelected={setSelected}
      />
      <div className="w-full pt-12">
        {selected === "Albums" ? (
          <ArtistAlbumList albums={artist.albums} />
        ) : (
          <ArtistSongList songs={artist.songs} />
        )}
      </div>
    </div>
  );
};

export default ArtistContent;
