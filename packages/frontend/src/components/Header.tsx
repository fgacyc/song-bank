import { SearchBar } from "@/features/search";
import { useScrollPosition } from "@/features/shared/hooks/useScrollPosition";
import IconButton from "@/features/shared/ui/IconButton";
import { ThemeToggle } from "@/features/theme";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaRegHeart } from "react-icons/fa";
import type { SearchFilters } from "@/features/search";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  const { isAboveThreshold: showSearchBar } = useScrollPosition({
    threshold: 400,
  });

  // determine search bar values based on current route
  const isSearchPage = router.pathname === "/search";
  const searchQuery = isSearchPage ? (router.query.query as string) || "" : "";
  const searchLanguage = isSearchPage
    ? (router.query.language as string) || "all"
    : "all";
  const searchKey = isSearchPage
    ? (router.query.key as string) || "all"
    : "all";
  const searchDate =
    isSearchPage && router.query.date
      ? new Date(router.query.date as string)
      : undefined;

  const handleSearch = async (filters: SearchFilters) => {
    const params = new URLSearchParams();

    if (filters.query) params.set("query", filters.query);
    if (filters.language) params.set("language", filters.language);
    if (filters.keySignature) params.set("key", filters.keySignature);
    if (filters.date) params.set("date", filters.date);

    await router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="sticky top-0 z-50 flex flex-col items-center justify-center gap-4 border-b border-border bg-bg-primary pb-2 pt-6">
        <div className="flex w-full max-w-[80dvw] justify-between">
          <Link href="/">
            <Image
              className="min-h-[40px] min-w-[40px] rounded transition-opacity hover:opacity-80"
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
            />
          </Link>
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
          className={`w-full max-w-[80dvw] overflow-hidden transition-all duration-300 ease-in-out ${
            showSearchBar
              ? "pointer-events-none max-h-0 pb-0 opacity-0"
              : "max-h-64 pb-4 opacity-100"
          }`}
        >
          <SearchBar
            onSearch={handleSearch}
            initialQuery={searchQuery}
            initialLanguage={searchLanguage}
            initialKeySignature={searchKey}
            initialDate={searchDate}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
