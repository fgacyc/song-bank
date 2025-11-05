import { useRouter } from "next/router";
import React from "react";

const Creator = () => {
  const router = useRouter();

  // const { data: creator, isLoading, error } =
  return <div>Creator Page: {router.query.creator}</div>;
};

export default Creator;
