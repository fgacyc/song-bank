import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

interface AlbumBreadcrumb {
  album: string | undefined | null;
  original_band: string | undefined | null;
}

const AlbumBreadcrumb: React.FC<AlbumBreadcrumb> = ({
  album,
  original_band,
}) => {
  return (
    <div className="hidden items-end gap-2 rounded border-2 px-3 py-1 sm:flex">
      <Link
        href={"/search"}
        className="text-neutral-500 decoration-1 hover:underline"
      >
        Home
      </Link>
      <IoIosArrowForward className="pb-1" />
      <Link
        href={`/band/${original_band?.toLowerCase().replace(/ /g, "-")}`}
        className="text-neutral-500 decoration-1 hover:underline"
      >
        {original_band}
      </Link>
      <IoIosArrowForward className="pb-1" />
      <span>{album}</span>
    </div>
  );
};

export default AlbumBreadcrumb;
