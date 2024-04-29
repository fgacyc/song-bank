import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoPerson } from "react-icons/io5";

interface dynamicHeaderDataProps {
  link: string;
  icon: React.ReactNode;
}

const iconStyle = "h-[20px] w-[20px]";

const dynamicHeaderData: dynamicHeaderDataProps[] = [
  { link: "", icon: <IoPerson className={iconStyle} /> },
];

const DynamicHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[70px] w-full items-center justify-between border bg-white p-[10px] px-5">
      <Link href={"/"} className="flex items-center justify-center">
        <Image src={"/img/logo.png"} alt="logo" width={50} height={50} />
        <h1 className="text truncate ps-5 text-2xl font-semibold">
          FGA Worship
        </h1>
      </Link>
      <div className="flex items-center gap-3">
        {dynamicHeaderData.map((item, i) => (
          <Link key={i} href={item.link} className="rounded border p-1">
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DynamicHeader;