import Link from "next/link";
import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { TbFolder } from "react-icons/tb";

interface navigationDataProps {
  name: string;
  icon: React.ReactNode;
}

const iconStyle = "h-[20px] w-[20px]";

const navigationData: navigationDataProps[] = [
  { name: "Search", icon: <RiSearch2Line className={iconStyle} /> },
  { name: "Browse", icon: <TbFolder className={iconStyle} /> },
];

const Navigation = () => {
  return (
    <nav className="fixed left-0 top-0 z-10 hidden h-full w-[70px] flex-col items-center border bg-white pb-5 pt-[90px] sm:flex md:flex lg:flex lg:w-[250px]">
      <div className="flex w-full flex-col items-center gap-3">
        {navigationData.map((item, i) => (
          <Link
            key={i}
            href={`/${item.name.toLowerCase()}`}
            className="flex items-center justify-start gap-4 rounded p-2 lg:w-10/12 lg:px-3"
          >
            <div>{item.icon}</div>
            <div className="hidden lg:block">{item.name}</div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
