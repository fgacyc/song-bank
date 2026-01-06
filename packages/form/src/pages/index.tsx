import LinkButton from "@/components/ui/LinkButton";
import MainLayout from "@/layouts/MainLayout";
import React from "react";

const Home = () => {
  return (
    <MainLayout title="Home | Song Bank Admin">
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 p-8">
          <LinkButton href="/song" size="large" variant="primary">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span>Manage Songs</span>
            </div>
          </LinkButton>

          <LinkButton href="/album" size="large" variant="secondary">
            <div className="flex flex-col items-center gap-2 text-black/70">
              <span className="text-2xl">💽</span>
              <span>Manage Albums</span>
            </div>
          </LinkButton>

          <LinkButton href="/artist" size="large">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🎤</span>
              <span>Manage Artists</span>
            </div>
          </LinkButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
