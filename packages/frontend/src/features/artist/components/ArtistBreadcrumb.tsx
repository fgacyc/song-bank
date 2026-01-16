import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/features/shared/ui/Breadcrumb";
import type { ArtistType } from "@/types/types";
import React from "react";

interface ArtistBreadcrumbProps {
  artist: ArtistType;
}

const ArtistBreadcrumb = ({ artist }: ArtistBreadcrumbProps) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-[80dvw] max-w-[80dvw] justify-center">
        <Breadcrumb className="w-full text-start">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-text-primary">
              {artist.name}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default ArtistBreadcrumb;
