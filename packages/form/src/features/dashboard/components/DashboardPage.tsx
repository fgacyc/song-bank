import React from "react";
import { FiMusic } from "react-icons/fi";
import { LuDisc3, LuMicVocal } from "react-icons/lu";

import DashboardQuickButtons from "./DashboardQuickButtons";
import { useDashboard } from "../hooks/useDashboard";

const DashboardPage = () => {
  const { counts, isLoading, error } = useDashboard();

  const quickStats = [
    {
      title: "Songs",
      count: counts?.songs ?? 0,
      color: "#80a3bf",
      icon: <FiMusic />,
    },
    {
      title: "Albums",
      count: counts?.albums ?? 0,
      color: "#456389",
      icon: <LuMicVocal />,
    },
    {
      title: "Artists",
      count: counts?.artists ?? 0,
      color: "#1d1b28",
      icon: <LuDisc3 />,
    },
  ];

  return (
    <div className="flex w-full justify-center bg-bg-tertiary px-8 py-6">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl text-primary">Dashboard</h1>
          <p className="text-xs font-semibold text-text-secondary">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div
                key={stat.title}
                className="h-[92px] animate-pulse rounded-2xl bg-bg-primary"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-bg-primary px-4 py-3 text-sm text-destructive">
            Failed to load dashboard counts.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <DashboardQuickButtons
                key={stat.title}
                icon={stat.icon}
                title={stat.title}
                count={stat.count}
                color={stat.color}
              />
            ))}
          </div>
        )}

        <div />
        <div />
      </div>
    </div>
  );
};

export default DashboardPage;
