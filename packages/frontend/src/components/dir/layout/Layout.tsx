import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./Header";
import { useRouter } from "next/router";

interface DirLayoutProps {
  children: ReactNode;
}

const Layout: React.FC<DirLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Header />
      <main className="relative top-[90px] px-5">{children}</main>
    </>
  );
};

export default Layout;
