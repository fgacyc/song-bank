import type { ArtistType } from "@/types/types";
import React from "react";
import ArtistBreadcrumb from "./ArtistBreadcrumb";
import ArtistHero from "./ArtistHero";
import ArtistContent from "./ArtistContent";

interface ArtistPageProps {
  artist: ArtistType;
}

const ArtistPage = ({ artist }: ArtistPageProps) => {
  return (
    <div className="w-full space-y-2 pt-6">
      <ArtistBreadcrumb artist={artist} />
      <ArtistHero artist={artist} />
      <ArtistContent artist={artist} />
    </div>
  );
};

export default ArtistPage;
