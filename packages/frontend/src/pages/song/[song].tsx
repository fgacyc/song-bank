import { useRouter } from "next/router";
import React from "react";

const Song = () => {
  const router = useRouter();
  return <div>Song Page: {router.query.song}</div>;
};

export default Song;
