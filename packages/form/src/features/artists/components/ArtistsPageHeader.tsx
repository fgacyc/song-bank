import React from "react";
import { FiPlus } from "react-icons/fi";

import Button from "@/features/shared/components/ui/Button";

interface ArtistsPageHeaderProps {
  artistCount: number;
  onAddArtist: () => void;
}

const ArtistsPageHeader = ({
  artistCount,
  onAddArtist,
}: ArtistsPageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Manage Artists
          </h1>
          <span className="rounded-full bg-bg-quaternary px-2.5 py-1 text-xs font-medium text-text-primary">
            {artistCount}
          </span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Keep track of all artists and their statistics.
        </p>
      </div>

      <Button
        onClick={onAddArtist}
        variant="primary"
        className="gap-2 self-start rounded-xl !border-black !bg-black text-xs !text-white shadow-lg shadow-black/15 hover:!bg-black/90"
      >
        <FiPlus className="h-3 w-3" />
        Add New Artist
      </Button>
    </div>
  );
};

export default ArtistsPageHeader;
