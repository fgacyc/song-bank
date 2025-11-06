import LinkButton from "@/components/ui/LinkButton";
import React from "react";

const Home = () => {
  return (
    <>
      <div className="flex h-dvh items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-6 p-8">
          <LinkButton href="/song" size="large" variant="primary">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span>Manage Songs</span>
            </div>
          </LinkButton>

          <LinkButton href="/album" size="large" variant="secondary">
            <div className="flex flex-col items-center gap-2">
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
    </>
  );
};

export default Home;
