import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import React from "react";
import slugify from "slugify";
import type { AlbumTypeWithSongs } from "../types/types";

interface AlbumBreadcrumbProps {
  album: AlbumTypeWithSongs;
}

const AlbumBreadcrumb = ({ album }: AlbumBreadcrumbProps) => {
  return (
    <div className="flex justify-center px-4 md:px-12 lg:px-24">
      <Breadcrumb className="w-full text-start">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {album.artist && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/artist/${album.artist.id}/${slugify(album.artist.name, { lower: true })}`}
                >
                  {album.artist.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}

          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-text-primary">
            {album.name}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AlbumBreadcrumb;
