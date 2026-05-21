import React from "react";
import { FiMusic } from "react-icons/fi";
import { LuDisc3, LuMicVocal } from "react-icons/lu";
import { TbSmartHome } from "react-icons/tb";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 flex justify-evenly bg-bg-primary px-8 py-4 text-xs text-text-secondary sm:hidden">
      <div className="flex flex-col items-center justify-center gap-0.5">
        <TbSmartHome className="h-6 w-6" />
        <p>Home</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5">
        <FiMusic className="h-5 w-5" />
        <p>Songs</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5">
        <LuMicVocal className="h-5 w-5" />
        <p>Albums</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5">
        <LuDisc3 className="h-5 w-5" />
        <p>Artists</p>
      </div>
    </footer>
  );
};

export default Footer;
