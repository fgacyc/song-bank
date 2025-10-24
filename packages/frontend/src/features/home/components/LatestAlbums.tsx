import React, { useEffect } from "react";
import { useHome } from "../hooks/useHome";

const LatestAlbums = () => {
  const { latestAlbums, isLoading, error } = useHome();

  useEffect(() => {
    console.log(latestAlbums.data);
  }, [latestAlbums]);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <h2>Latest Albums</h2>
    </>
  );
};

export default LatestAlbums;
