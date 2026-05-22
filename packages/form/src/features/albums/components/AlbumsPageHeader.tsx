import React from "react";
import { FiPlus } from "react-icons/fi";

import Button from "@/features/shared/components/ui/Button";

interface AlbumsPageHeaderProps {
  albumCount: number;
  onAddAlbum: () => void;
}

const AlbumsPageHeader = ({
  albumCount,
  onAddAlbum,
}: AlbumsPageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Manage Albums
          </h1>
          <span className="rounded-full bg-bg-quaternary px-2.5 py-1 text-xs font-medium text-text-primary">
            {albumCount}
          </span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Organize and track your music releases.
        </p>
      </div>

      <Button
        onClick={onAddAlbum}
        className="gap-2 self-start rounded-xl text-xs"
      >
        <FiPlus className="h-3 w-3" />
        Add New Album
      </Button>
    </div>
  );
};

export default AlbumsPageHeader;
