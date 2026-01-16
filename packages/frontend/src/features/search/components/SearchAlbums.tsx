import React from "react";
import Link from "next/link";
import type { SearchAlbum } from "../types";
import { Disc3 } from "lucide-react";
import slugify from "slugify";
import Polaroid from "@/features/shared/ui/Polaroid";

interface SearchAlbumsProps {
  albums: SearchAlbum[];
  selected: string;
}

const SearchAlbums = ({ albums, selected }: SearchAlbumsProps) => {
  if (albums.length === 0) return null;

  return (
    <section className="space-y-4">
      {selected.startsWith("All") && (
        <div className="flex items-center gap-2">
          <Disc3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-text-primary">Albums</h2>
        </div>
      )}
      <div
        className={`${selected.startsWith("All") ? "flex gap-x-6" : "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} overflow-y-scroll`}
      >
        {albums.map((album) => {
          const createdDate = album.release_date
            ? new Date(album.release_date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                day: "2-digit",
              })
            : "";
          const songCount = `${album.song_count ?? 0} ${album.song_count === 1 ? "song" : "songs"}`;
          const captions = [
            album.artist?.name ?? "Unknown artist",
            createdDate,
            songCount,
          ].filter(Boolean);

          return (
            <Link
              href={`/album/${album.id}/${slugify(album.name, { lower: true })}`}
              key={album.id}
              className="flex-shrink-0"
            >
              <Polaroid
                imageSrc={album.image_cover_url ?? ""}
                imageAlt={album.name}
                width={380}
                fill={!selected.startsWith("All")}
                height={360}
                imgRatio={0.56}
              >
                <div className="flex h-full w-full flex-col items-start justify-center p-6 text-start">
                  <div className="h-fit w-3/4 space-y-2">
                    <h3 className="truncate text-text-primary">{album.name}</h3>
                    {captions.map((caption, index) => (
                      <p
                        key={index}
                        className="text-wrap text-sm text-text-secondary"
                      >
                        {caption}
                      </p>
                    ))}
                  </div>
                </div>
              </Polaroid>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SearchAlbums;
