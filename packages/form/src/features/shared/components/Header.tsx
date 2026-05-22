import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const path = router.pathname;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="sticky top-0 z-50 border-b bg-bg-primary px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center justify-center gap-4 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <h1 className="hidden text-sm font-bold sm:inline">
              Song Bank Admin
            </h1>
          </Link>
          <nav className="hidden gap-1 text-xs font-semibold text-text-secondary sm:flex">
            <Link
              href="/songs"
              className={`${path === "/songs" ? "bg-bg-quaternary text-text-primary" : "hover:bg-bg-tertiary hover:text-text-primary"} rounded-lg px-3 py-2 transition-colors`}
            >
              Songs
            </Link>
            <Link
              href="/albums"
              className={`${path === "/albums" ? "bg-bg-quaternary text-text-primary" : "hover:bg-bg-tertiary hover:text-text-primary"} rounded-lg px-3 py-2 transition-colors`}
            >
              Albums
            </Link>
            <Link
              href="/artists"
              className={`${path === "/artists" ? "bg-bg-quaternary text-text-primary" : "hover:bg-bg-tertiary hover:text-text-primary"} rounded-lg px-3 py-2 transition-colors`}
            >
              Artists
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
