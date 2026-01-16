import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import type { SongType } from "@/types/types";
import React from "react";
import slugify from "slugify";

interface SongPageBreadcrumbProps {
  song: SongType;
}

const SongBreadcrumb = ({ song }: SongPageBreadcrumbProps) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-[80dvw] justify-center">
        <Breadcrumb className="w-full text-start">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            {song.artist && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/artist/${song.artist.id}/${slugify(song.artist.name, { lower: true })}`}
                  >
                    {song.artist.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {song.album && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/album/${song.album.id}/${slugify(song.album.name, { lower: true })}`}
                  >
                    {song.album.name}
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
    </div>
  );
};

export default SongBreadcrumb;
