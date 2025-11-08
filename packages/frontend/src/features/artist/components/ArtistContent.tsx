import type { ArtistType } from "@/types/types";
import React from "react";

interface ArtistContentProps {
  artist: ArtistType;
}

const ArtistContent = ({ artist }: ArtistContentProps) => {
  return <div>ArtistContent</div>;
};

export default ArtistContent;
