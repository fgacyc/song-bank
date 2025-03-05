import Link from "next/link";
import React from "react";

interface SongBreadcrumbProps {
  name: string | undefined;
  album: string | undefined | null;
  original_band: string;
}

const slash = <div className="flex h-full items-center text-xs">/</div>;

const SongBreadcrumb: React.FC<SongBreadcrumbProps> = ({
  name,
  album,
  original_band,
}) => {
  return (
    <div className="flex h-[35px] items-end gap-2 truncate rounded-lg border-2 px-3 text-xs md:text-sm">
      <Link
        href={`/band/${original_band.toLowerCase().replace(/ /g, "-")}`}
        className="flex h-full items-center text-neutral-500 decoration-1 hover:underline"
      >
        {original_band}
      </Link>

      {album && album.trim() !== "-" && (
        <>
          {slash}
          {album && (
            <Link
              href={`/album/${album?.toLowerCase().trim().replace(/ /g, "-")}?band=${original_band?.toLowerCase().trim().replace(/ /g, "-")}`}
              className="flex h-full items-center text-neutral-500 decoration-1 hover:underline"
            >
              {album}
            </Link>
          )}
        </>
      )}

      <div className="flex h-full items-end justify-center gap-2">
        {slash}
        <div className="flex h-full items-center">{name}</div>
      </div>
    </div>
  );
};

export default SongBreadcrumb;
