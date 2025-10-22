import MainLayout from "@/layouts/MainLayout";
import React from "react";

const Home = () => {
  return (
    <div>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl">Top Section - Scroll down to test</h1>
      </div>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl">Middle Section - Check header</h1>
      </div>
      <div className="flex h-screen items-center justify-center ">
        <h1 className="text-4xl">Bottom Section</h1>
      </div>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <MainLayout title="Home | FGA Worship - Song Bank">{page}</MainLayout>;
};

export default Home;
