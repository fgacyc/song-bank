import { useRouter } from "next/router";
import React from "react";

const Album = () => {
  const router = useRouter();
  return <div>Album Page: {router.query.album}</div>;
};

export default Album;
