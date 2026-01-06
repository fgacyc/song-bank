import Head from "next/head";
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
      <header className="sticky top-0 z-50 border-b border-border bg-bg-primary px-4 py-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <h2 className="text-xl font-bold">Song Bank Admin</h2>
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/song"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Songs
            </Link>
            <Link
              href="/album"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Albums
            </Link>
            <Link
              href="/artist"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
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
