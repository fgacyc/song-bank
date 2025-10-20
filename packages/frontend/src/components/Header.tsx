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
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="flex justify-between border-b border-border px-24 py-4">
        <a href="/">
          <Image
            className="min-h-[60px] min-w-[60px] rounded"
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
          />
        </a>
        <div className="flex gap-2">
          <ThemeToggle variant="toggle" size="lg" />
          <IconButton
            icon={<FaRegHeart size={18} />}
            text="Library"
            href="/library"
          />
        </div>
      </header>
    </>
  );
};

export default Header;
