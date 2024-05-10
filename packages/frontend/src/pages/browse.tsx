import React, { useEffect, type ReactElement } from "react";
import Layout from "@/components/layout/Layout";

const Browse = () => {
  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      }).then(async (res) => {
        await res.json().then((result) => console.log(result));
      });
    });
    // ();
  }, []);

  return <div>Browse</div>;
};

export default Browse;

Browse.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
