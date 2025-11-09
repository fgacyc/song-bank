import { SearchBar, useSearch } from "@/features/search";
import { useScrollPosition } from "@/features/shared/hooks/useScrollPosition";
import IconButton from "@/features/shared/ui/IconButton";
import { ThemeToggle } from "@/features/theme";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { FaRegHeart } from "react-icons/fa";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { search, isLoading } = useSearch();

  const { scrollY, isAboveThreshold: showSearchBar } = useScrollPosition({
    threshold: 400,
  });

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="sticky top-0 z-50 flex flex-col gap-4 border-b border-border bg-bg-primary px-4 pb-2 pt-6 md:px-12 lg:px-24">
        <div className="flex justify-between">
          <a href="/">
            <Image
              className="min-h-[40px] min-w-[40px] rounded transition-opacity hover:opacity-80"
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
            />
          </a>
          <div className="flex items-center justify-center gap-2">
            <ThemeToggle variant="toggle" size="sm" />
            <IconButton
              icon={<FaRegHeart size={14} />}
              size="sm"
              text="Library"
              href="/library"
            />
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showSearchBar
              ? "pointer-events-none max-h-0 pb-0 opacity-0"
              : "max-h-64 pb-4 opacity-100"
          }`}
        >
          <SearchBar onSearch={search} isLoading={isLoading} />
        </div>
      </header>
    </>
  );
};

export default Header;
