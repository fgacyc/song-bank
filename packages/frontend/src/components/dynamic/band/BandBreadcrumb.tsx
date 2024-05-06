import React from "react";

interface BandBreadcrumb {
  original_band: string | undefined;
}

const BandBreadcrumb: React.FC<BandBreadcrumb> = ({ original_band }) => {
  return (
    <div className="flex h-[35px] items-center gap-2 rounded-lg border-2 px-3 py-1 text-xs sm:text-sm">
      {original_band}
    </div>
  );
};

export default BandBreadcrumb;
