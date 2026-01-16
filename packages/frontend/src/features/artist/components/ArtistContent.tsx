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
    <div className="flex items-center justify-center">
      <div className="relative flex w-full max-w-[80dvw] flex-col items-start justify-center overflow-hidden pt-12 md:justify-start">
        <ToggleButton
          options={["Albums", "All Songs"]}
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
    </div>
  );
};

export default ArtistContent;
