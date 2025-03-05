import Link from "next/link";
import React from "react";
import { type Song } from "@prisma/client";

interface BandSongListProps {
  filteredSongListWithoutAlbum: Song[];
}

const BandSongList: React.FC<BandSongListProps> = ({
  filteredSongListWithoutAlbum,
}) => {
  return (
    <>
      {filteredSongListWithoutAlbum.length > 0 && (
        <div className="flex flex-col gap-2 truncate rounded-lg border-2 p-3 md:min-w-[220px]">
          <h1 className="w-full text-sm font-semibold">Songs Without Album</h1>
          <div className="flex flex-col gap-1.5">
            {filteredSongListWithoutAlbum.map((items) => {
              return (
                <Link
                  key={items.id}
                  href={`/song/${items.id}`}
                  className="text-xs text-neutral-500 hover:underline"
                >
                  {items.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default BandSongList;
