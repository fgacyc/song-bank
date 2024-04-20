import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

interface BandBreadcrumb {
  original_band: string | undefined;
}

const BandBreadcrumb: React.FC<BandBreadcrumb> = ({ original_band }) => {
  return (
    <div className="hidden items-end gap-2 rounded border px-3 py-1 sm:flex">
      <Link
        href={"/search"}
        className="text-neutral-500 decoration-1 hover:underline"
      >
        Home
      </Link>
      <IoIosArrowForward className="pb-1" />
      <span>{original_band}</span>
    </div>
  );
};

export default BandBreadcrumb;
