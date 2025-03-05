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
        <div className="flex flex-col gap-3 truncate rounded-lg border-2 p-3">
          <h1 className="font-semibold">Songs Without Album</h1>
          {filteredSongListWithoutAlbum.map((items, i) => {
            return (
              <p key={i} className="text-sm text-neutral-500">
                {i + 1}.{" "}
                <Link
                  href={`/song/${items.id}`}
                  className="underline md:no-underline md:hover:underline"
                >
                  {items.name}
                </Link>
              </p>
            );
          })}
        </div>
      )}
    </>
  );
};

export default BandSongList;
