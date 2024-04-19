import React, { type ReactElement } from "react";
import Layout from "@/components/dir/layout/Layout";
import BandBreadcrumb from "@/components/dir/BandBreadcrumb";

const Band = () => {
  return (
    <>
      <BandBreadcrumb original_band={"band"} />
    </>
  );
};

export default Band;

Band.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
