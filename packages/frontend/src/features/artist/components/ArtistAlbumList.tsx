import Polaroid from "@/features/shared/ui/Polaroid";
import type { AlbumType } from "@/types/types";
import Link from "next/link";
import React from "react";
import slugify from "slugify";

interface ArtistAlbumListProps {
  albums: AlbumType[];
}

const ArtistAlbumList = ({ albums }: ArtistAlbumListProps) => {
  if (!albums || albums.length === 0) {
    // TODO: replace with better empty state
    return <div>No albums found</div>;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <Link
            key={album.id}
            href={`/album/${album.id}/${slugify(album.name, { lower: true })}`}
          >
            <Polaroid
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
          </Link>
        );
      })}
    </div>
  );
};

export default ArtistAlbumList;
