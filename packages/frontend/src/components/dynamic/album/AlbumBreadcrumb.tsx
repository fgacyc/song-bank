import Link from "next/link";
import React from "react";

interface AlbumBreadcrumb {
  album: string | undefined | null;
  original_band: string | undefined | null;
}

const slash = <div className="flex h-full items-center text-xs">/</div>;

const AlbumBreadcrumb: React.FC<AlbumBreadcrumb> = ({
  album,
  original_band,
}) => {
  return (
    <div className="flex h-[35px] items-end gap-2 truncate rounded-lg border-2 px-3 py-1 text-xs sm:text-sm">
      <Link
        href={`/band/${original_band?.toLowerCase().replace(/ /g, "-")}`}
        className="flex h-full items-center text-neutral-500 decoration-1 hover:underline sm:text-sm md:text-base"
      >
        {original_band}
      </Link>
      <div className="flex h-full items-end gap-2">
        {slash}
        <div className="flex h-full items-center">{album}</div>
      </div>
    </div>
  );
};

export default AlbumBreadcrumb;
