import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoPerson } from "react-icons/io5";

const Header = () => {
  return (
    <nav className="fixed top-0 z-20 flex h-[50px] w-full items-center justify-between border bg-white p-[10px] px-5 sm:h-[70px]">
      <Link href={"/"} className="flex items-center justify-center">
        <Image src={"/img/logo.png"} alt="logo" width={30} height={30} />
        <h1 className="text truncate ps-5 font-semibold">FGA Worship</h1>
      </Link>
      <Link href="/profile" className="hidden p-1 sm:block">
        <IoPerson />
      </Link>
    </nav>
  );
};

export default Header;
