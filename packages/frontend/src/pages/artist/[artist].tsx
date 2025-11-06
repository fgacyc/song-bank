import { useRouter } from "next/router";
import React from "react";

const Artist = () => {
  const router = useRouter();

  // const { data: artist, isLoading, error } =
  return <div>Artist Page: {router.query.artist}</div>;
};

export default Artist;
