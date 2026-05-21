import React from "react";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

interface DashboardSectionProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}

const DashboardSection = ({
  title,
  icon,
  href,
  children,
}: DashboardSectionProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-bg-primary">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-text-secondary">{icon}</span>
          <h3 className="text-base text-primary">{title}</h3>
        </div>
        <Link
          href={href}
          className="flex items-center justify-center gap-1 text-xs text-text-secondary transition-all hover:text-text-primary"
        >
          View All
          <GoArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
};

export default DashboardSection;
