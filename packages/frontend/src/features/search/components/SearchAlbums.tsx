import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SearchAlbum } from "../types";
import { Disc3 } from "lucide-react";

interface SearchAlbumsProps {
  albums: SearchAlbum[];
}

const SearchAlbums = ({ albums }: SearchAlbumsProps) => {
  if (albums.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Disc3 className="h-5 w-5" />
        <h2 className="text-xl font-semibold text-text-primary">Albums</h2>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            className="hover:border-border-hover group rounded-lg border border-border bg-bg-secondary p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {album.image_cover_url && (
                <Image
                  src={album.image_cover_url}
                  alt={album.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded object-cover"
                />
              )}
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-text-primary group-hover:text-primary">
                  {album.name}
                </h3>
                {album.artist && (
                  <p className="text-sm text-text-secondary">
                    {album.artist.name}
                  </p>
                )}
                <div className="text-text-tertiary flex flex-wrap gap-2 text-xs">
                  <span>{new Date(album.release_date).getFullYear()}</span>
                  {album._count && <span>• {album._count.Song} songs</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div> */}
    </section>
  );
};

export default SearchAlbums;
