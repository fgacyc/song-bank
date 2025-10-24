import HomePage from "@/features/home/components/HomePage";
import MainLayout from "@/layouts/MainLayout";
import React from "react";

const Home = () => <HomePage />;

Home.getLayout = (page: React.ReactElement) => {
  return <MainLayout title="Home | FGA Worship - Song Bank">{page}</MainLayout>;
};

export default Home;
