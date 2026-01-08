import ToggleButton from "@/features/shared/ui/ToggleButton";
import type { ArtistType } from "@/types/types";
import React, { useState } from "react";
import ArtistAlbums from "./ArtistAlbums";
import ArtistSongs from "./ArtistSongs";

interface ArtistContentProps {
  artist: ArtistType;
}

const ArtistContent = ({ artist }: ArtistContentProps) => {
  const [selected, setSelected] = useState("Albums");

  return (
    <div className="relative flex flex-col items-start justify-center overflow-hidden border-b border-border px-4 py-12 md:justify-start md:px-12 lg:px-24">
      <ToggleButton
        left="Albums"
        right="All Songs"
        selected={selected}
        setSelected={setSelected}
      />
      {selected === "Albums" ? (
        <ArtistAlbums albums={artist.albums} />
      ) : (
        <ArtistSongs songs={artist.songs} />
      )}
    </div>
  );
};

export default ArtistContent;
