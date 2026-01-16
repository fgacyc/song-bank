import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import React from "react";
import slugify from "slugify";
import type { AlbumType } from "@/types/types";

interface AlbumBreadcrumbProps {
  album: AlbumType;
}

const AlbumBreadcrumb = ({ album }: AlbumBreadcrumbProps) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-[80dvw] justify-center">
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
    </div>
  );
};

export default AlbumBreadcrumb;
