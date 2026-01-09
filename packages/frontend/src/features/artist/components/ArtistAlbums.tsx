import Polaroid from "@/features/shared/ui/Polaroid";
import type { AlbumType } from "@/types/types";
import React from "react";

interface ArtistAlbumsProps {
  albums: AlbumType[];
}

const ArtistAlbums = ({ albums }: ArtistAlbumsProps) => {
  if (!albums || albums.length === 0) {
    return <div>No albums found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {albums.map((album) => {
        const releaseDate = album.release_date
          ? new Date(album.release_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "2-digit",
            })
          : "";
        const songCount = `${album.song_count ?? 0} ${album.song_count === 1 ? "song" : "songs"}`;

        return (
          <Polaroid
            key={album.id}
            imageSrc={album.image_cover_url ?? ""}
            imageAlt={album.name}
            fill={true}
            imgRatio={0.55}
            height={300}
          >
            <div className="flex h-full w-full flex-col items-start justify-center p-6 text-start">
              <div className="w-3/4 space-y-2">
                <h3 className="truncate text-text-primary">{album.name}</h3>
                {releaseDate && (
                  <p className="text-wrap text-sm text-text-secondary">
                    {releaseDate}
                  </p>
                )}
                <p className="text-wrap text-sm text-text-secondary">
                  {songCount}
                </p>
              </div>
            </div>
          </Polaroid>
        );
      })}
    </div>
  );
};

export default ArtistAlbums;
