import React from "react";
import { FiMusic } from "react-icons/fi";
import { LuDisc3, LuMicVocal } from "react-icons/lu";
import DashboardQuickButtons from "./DashboardQuickButtons";
import { useDashboard } from "../hooks/useDashboard";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-bg-primary shadow-inner">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-center gap-2">
                <FaArrowTrendUp className="h-3.5 w-3.5 text-text-secondary" />
                <h3 className="text-base text-primary">Top Artists</h3>
              </div>
              <Link
                href="/artist"
                className="flex items-center justify-center gap-1 text-xs text-text-secondary transition-all hover:text-text-primary"
              >
                View All
                <GoArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div></div>
          </div>
          <div className="rounded-2xl bg-bg-primary px-5 py-4 shadow-inner">
            <div></div>
            <div></div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default DashboardPage;
