import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

interface AlbumBreadcrumb {
  album: string | undefined | null;
  original_band: string | undefined | null;
}

const icon = (
  <>
    <div className="hidden h-[90%] items-center justify-center sm:flex">
      <MdKeyboardArrowRight />
    </div>
    <div className="flex h-full items-center text-xs sm:hidden">/</div>
  </>
);

const AlbumBreadcrumb: React.FC<AlbumBreadcrumb> = ({
  album,
  original_band,
}) => {
  return (
    <div className="flex h-[35px] items-end gap-2 truncate rounded-lg border-2 px-3 py-1">
      <Link
        href={"/search"}
        className="flex h-full items-center text-xs text-neutral-500 decoration-1 hover:underline sm:text-sm md:text-base"
      >
        Home
      </Link>
      {icon}
      <Link
        href={`/band/${original_band?.toLowerCase().replace(/ /g, "-")}`}
        className="flex h-full items-center text-xs text-neutral-500 decoration-1 hover:underline sm:text-sm md:text-base"
      >
        {original_band}
      </Link>
      <div className="hidden h-full items-end gap-2 sm:flex">
        {icon}
        <div className="flex h-full items-center sm:text-sm md:text-base">
          {album}
        </div>
      </div>
    </div>
  );
};

export default AlbumBreadcrumb;
