import React, { type ReactElement } from "react";
import DirLayout from "@/components/dir/layout/Layout";

const Album = () => {
  return (
    <>
      <div>Album</div>
    </>
  );
};

export default Album;

Album.getLayout = function getLayout(page: ReactElement) {
  return <DirLayout>{page}</DirLayout>;
};
