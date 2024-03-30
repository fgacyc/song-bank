import React, { type ReactElement } from "react";
import Layout from "@/components/layout/Layout";

const Browse = () => {
  return <div>Browse</div>;
};

export default Browse;

Browse.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
