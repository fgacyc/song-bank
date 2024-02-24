import Image from "next/image";
import React from "react";

const TopNav = () => {
  return (
    <nav className="fixed top-0 z-20 flex h-[70px] w-dvw items-center justify-between border bg-white p-[10px] px-5">
      <div className="flex items-center justify-center">
        <Image src={"/img/logo.png"} alt="logo" width={50} height={50} />
        <h1 className="text ps-5 text-2xl font-semibold">FGA Worship</h1>
      </div>
      <div className="flex w-20 items-center justify-evenly border">
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </div>
    </nav>
  );
};

export default TopNav;
