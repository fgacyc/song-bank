import MainCarousel from "@/features/home/components/MainCarousel";
import MainLayout from "@/layouts/MainLayout";
import React from "react";

const Home = () => {
  return (
    <div className="py-14">
      <MainCarousel />
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <MainLayout title="Home | FGA Worship - Song Bank">{page}</MainLayout>;
};

export default Home;
