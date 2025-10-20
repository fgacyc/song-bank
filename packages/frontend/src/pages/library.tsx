import MainLayout from "@/layouts/MainLayout";
import React from "react";

const Library = () => {
  return <div className="flex h-dvh items-center justify-center">Library</div>;
};

Library.getLayout = (page: React.ReactElement) => {
  return (
    <MainLayout title="Library | FGA Worship - Song Bank">{page}</MainLayout>
  );
};

export default Library;
