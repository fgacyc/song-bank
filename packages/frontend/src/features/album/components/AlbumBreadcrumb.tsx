import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import { AlbumType } from "@/types/types";
import React from "react";
import slugify from "slugify";

interface AlbumBreadcrumbProps {
  album: AlbumType;
}

const AlbumBreadcrumb = ({ album }: AlbumBreadcrumbProps) => {
  return (
    <div className="flex justify-center px-6">
      <Breadcrumb className="w-full text-start sm:max-w-[80dvw] lg:max-w-[60dvw]">
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
