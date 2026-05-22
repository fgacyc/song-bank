import Link from "next/dist/client/link";
import React from "react";
import { FiMusic } from "react-icons/fi";
import { LuDisc3, LuMicVocal } from "react-icons/lu";
import { TbSmartHome } from "react-icons/tb";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  const path = router.pathname;

  return (
    <footer className="sticky bottom-0 flex justify-evenly border-t bg-bg-primary px-8 py-4 text-xs text-text-secondary sm:hidden">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-0.5 ${path === "/" ? "text-text-primary" : "hover:text-text-primary"}`}
      >
        <TbSmartHome className="h-6 w-6" />
        <p>Home</p>
      </Link>
      <Link
        href="/songs"
        className={`flex flex-col items-center justify-center gap-0.5 ${path === "/songs" ? "text-text-primary" : "hover:text-text-primary"}`}
      >
        <FiMusic className="h-5 w-5" />
        <p>Songs</p>
      </Link>
      <Link
        href="/albums"
        className={`flex flex-col items-center justify-center gap-0.5 ${path === "/albums" ? "text-text-primary" : "hover:text-text-primary"}`}
      >
        <LuMicVocal className="h-5 w-5" />
        <p>Albums</p>
      </Link>
      <Link
        href="/artists"
        className={`flex flex-col items-center justify-center gap-0.5 ${path === "/artists" ? "text-text-primary" : "hover:text-text-primary"}`}
      >
        <LuDisc3 className="h-5 w-5" />
        <p>Artists</p>
      </Link>
    </footer>
  );
};

export default Footer;
