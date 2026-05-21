import Layout from "@/layouts/Layout";
import React from "react";
import DashboardPage from "@/features/dashboard/components/DashboardPage";

const Home = () => {
  return (
    <Layout title="Dashboard | Song Bank Admin">
      <DashboardPage />
    </Layout>
  );
};

export default Home;
