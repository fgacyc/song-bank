import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

interface SongBreadcrumbProps {
  name: string | undefined;
  album: string | undefined;
  original_band: string;
}

const SongBreadcrumb: React.FC<SongBreadcrumbProps> = ({
  name,
  album,
  original_band,
}) => {
  return (
    <div className="hidden items-end gap-2 rounded border px-3 py-1 sm:flex">
      <Link
        href={"/search"}
        className="text-neutral-500 decoration-1 hover:underline"
      >
        Home
      </Link>
      <IoIosArrowForward className="pb-1" />
      <Link
        href={`/band/${original_band.toLowerCase().replace(/ /g, "-")}`}
        className="text-neutral-500 decoration-1 hover:underline"
      >
        {original_band}
      </Link>
      <IoIosArrowForward className="pb-1" />
      {album && (
        <Link
          href={`/album/${album.toLowerCase().replace(/ /g, "-")}`}
          className="text-neutral-500 decoration-1 hover:underline"
        >
          {album}
        </Link>
      )}
      <IoIosArrowForward className="pb-1" />
      <span>{name}</span>
    </div>
  );
};

export default SongBreadcrumb;
