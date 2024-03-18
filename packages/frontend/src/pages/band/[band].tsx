import React, { type ReactElement } from "react";
import Layout from "@/components/dir/layout/Layout";

const Artist = () => {
  return (
    <>
      <div>Artist</div>
    </>
  );
};

export default Artist;

Artist.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
