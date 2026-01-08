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
        return (
          <Polaroid
            key={album.id}
            imageSrc={album.image_cover_url ?? ""}
            title={album.name}
            captions={[
              album.release_date
                ? new Date(album.release_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    day: "2-digit",
                  })
                : "",
              `${album.song_count ?? 0} ${album.song_count === 1 ? "song" : "songs"}`,
            ]}
            fill={true}
            imgRatio={0.48}
            descriptionAlignment="left"
          />
        );
      })}
    </div>
  );
};

export default ArtistAlbums;
