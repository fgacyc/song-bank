import MainLayout from "@/layouts/MainLayout";
import React from "react";

const Home = () => {
  return <div className="flex h-dvh items-center justify-center">Home</div>;
};

Home.getLayout = (page: React.ReactElement) => {
  return <MainLayout title="Home | FGA Worship - Song Bank">{page}</MainLayout>;
};

export default Home;
