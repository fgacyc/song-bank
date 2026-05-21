import { BiPlus } from "react-icons/bi";

import React from "react";

interface DashboardQuickButtonsProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
}

const DashboardQuickButtons = ({
  icon,
  title,
  count,
  color,
}: DashboardQuickButtonsProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-bg-primary p-4 shadow-inner">
      <div className="flex items-center justify-center gap-4">
        <div
          style={{
            backgroundColor: `${color}26`,
            color,
          }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg"
        >
          {icon}
        </div>
        <div>
          <h2 className="text-xs text-text-secondary">Total {title}</h2>
          <p className="text-2xl font-bold text-primary">
            {count.toLocaleString()}
          </p>
        </div>
      </div>

      <div
        style={{ backgroundColor: color }}
        className="text-text-opposite flex h-fit items-center justify-center gap-2 rounded-lg px-3 py-2"
      >
        <BiPlus className="text-sm" />
        <p className="hidden text-xs font-semibold lg:block">Add {title}</p>
      </div>
    </div>
  );
};

export default DashboardQuickButtons;
