import MainLayout from "@/layouts/MainLayout";
import { ThemeToggle } from "@/features/theme";
import React from "react";

const Home = () => {
  return (
    <div className="bg-bg-primary p-4 text-text-primary">
      <h1 className="mb-4 text-2xl font-bold text-text-primary">
        Welcome to FGA Worship
      </h1>
      <p className="mb-8 text-text-secondary">
        This text should change with the theme!
      </p>

      {/* Demo different ThemeToggle variants */}
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Button Variant:</h2>
          <ThemeToggle variant="buttons" />
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Dropdown Variant:</h2>
          <ThemeToggle variant="dropdown" />
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Toggle Variant:</h2>
          <ThemeToggle variant="toggle" />
        </div>
      </div>

      {/* Test different theme colors */}
      <div className="mt-8 space-y-4">
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Secondary Background
          </h2>
          <p className="text-text-secondary">This uses secondary text color</p>
        </div>

        <button className="rounded bg-accent px-4 py-2 text-white transition-opacity hover:opacity-80">
          Accent Color Button
        </button>
      </div>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
