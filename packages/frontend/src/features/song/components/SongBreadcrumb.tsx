import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import type { Song } from "@prisma/client";
import React from "react";

interface SongPageBreadcrumbProps {
  song: Song;
}

const SongBreadcrumb = ({ song }: SongPageBreadcrumbProps) => {
  return (
    <div className="flex justify-center px-6">
      <Breadcrumb className="w-full text-start sm:max-w-[80dvw] lg:max-w-[60dvw]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {song.original_band && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/creator/${song.original_band.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {song.original_band}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}

          {song.album && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/album/${song.album.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {song.album}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}

          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-text-primary">
            {song.name}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default SongBreadcrumb;
