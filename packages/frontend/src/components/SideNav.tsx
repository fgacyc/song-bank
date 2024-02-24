import React from "react";

const SideNav = () => {
  return (
    <nav className="fixed left-0 top-0 z-10 flex h-dvh w-[70px] flex-col items-center justify-between border bg-white pb-5 pt-[90px]">
      <div className="flex h-[100px] flex-col items-center justify-evenly border">
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </div>
      <div className="border">
        <p>s</p>
      </div>
    </nav>
  );
};

export default SideNav;
