import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
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
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <h1 className="hidden text-sm font-bold sm:inline">
              Song Bank Admin
            </h1>
          </Link>
          <nav className="hidden gap-4 text-xs font-semibold text-text-secondary sm:flex">
            <Link
              href="/song"
              className="transition-colors hover:text-text-primary"
            >
              Songs
            </Link>
            <Link
              href="/album"
              className="transition-colors hover:text-text-primary"
            >
              Albums
            </Link>
            <Link
              href="/artist"
              className="transition-colors hover:text-text-primary"
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
