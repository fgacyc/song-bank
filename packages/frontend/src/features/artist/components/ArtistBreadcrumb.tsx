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
    <div className="flex justify-center px-4 md:px-12 lg:px-24">
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
  );
};

export default ArtistBreadcrumb;
