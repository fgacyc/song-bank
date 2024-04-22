import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoPerson } from "react-icons/io5";

interface headerDataProps {
  link: string;
  icon: React.ReactNode;
}

const iconStyle = "h-[20px] w-[20px]";

const headerData: headerDataProps[] = [
  { link: "", icon: <IoPerson className={iconStyle} /> },
];

const Header = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[70px] w-full items-center justify-between border bg-white p-[10px] px-5">
      <Link href={"/search"} className="flex items-center justify-center">
        <Image src={"/img/logo.png"} alt="logo" width={50} height={50} />
        <h1 className="text ps-5 text-2xl font-semibold">FGA Worship</h1>
      </Link>
      <div className="flex items-center gap-3">
        {headerData.map((item, i) => (
          <Link key={i} href={item.link} className="rounded border p-1">
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Header;
