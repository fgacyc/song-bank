import Link from "next/link";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { TbFolder } from "react-icons/tb";

interface navigationDataProps {
  link: string;
  icon: React.ReactNode;
}

const iconStyle = "h-[20px] w-[20px]";

const navigationData: navigationDataProps[] = [
  { link: "/search", icon: <RiSearch2Line className={iconStyle} /> },
  { link: "/browse", icon: <TbFolder className={iconStyle} /> },
];

const Navigation = () => {
  return (
    <nav className="fixed left-0 top-0 z-10 flex h-full w-[70px] flex-col items-center border bg-white pb-5 pt-[90px]">
      <div className="flex flex-col items-center gap-3">
        {navigationData.map((item, i) => (
          <Link key={i} href={item.link} className="rounded border p-1">
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
