import Layout from "@/components/layout/Layout";
import React, { type ReactElement } from "react";

const History = () => {
  return (
    <>
      <h1 className="fixed z-10 w-full bg-white p-3 text-3xl font-black">
        History
      </h1>
      <div className="border px-3 py-[62px]">lorem ipsum</div>
    </>
  );
};

export default History;

History.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
