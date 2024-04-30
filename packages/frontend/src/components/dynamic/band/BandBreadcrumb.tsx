import Link from "next/link";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

interface BandBreadcrumb {
  original_band: string | undefined;
}

const BandBreadcrumb: React.FC<BandBreadcrumb> = ({ original_band }) => {
  return (
    <div className="flex h-[35px] items-end gap-2 rounded-lg border-2 px-3 py-1 sm:flex">
      <Link
        href={"/search"}
        className="text-neutral-500 decoration-1 hover:underline"
      >
        Home
      </Link>
      <div className="hidden h-[90%] items-center justify-center sm:flex">
        <MdKeyboardArrowRight />
      </div>
      <span className="hidden sm:block">{original_band}</span>
    </div>
  );
};

export default BandBreadcrumb;
