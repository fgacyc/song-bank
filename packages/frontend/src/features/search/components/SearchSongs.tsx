import React from "react";
import type { SearchSong } from "../types";
import { Music } from "lucide-react";
import SongList from "@/features/shared/ui/SongList";

interface SearchSongsProps {
  songs: SearchSong[];
  selected: string;
}

const SearchSongs = ({ songs, selected }: SearchSongsProps) => {
  if (songs.length === 0) return null;

  return (
    <section className="space-y-4">
      {selected.startsWith("All") && (
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-text-primary">Songs</h2>
        </div>
      )}
      <SongList songs={songs} showAlbumName={true} noIndex={true} />
    </section>
  );
};

export default SearchSongs;
