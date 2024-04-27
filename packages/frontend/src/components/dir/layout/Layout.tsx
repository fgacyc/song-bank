import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./Header";

interface DirLayoutProps {
  children: ReactNode;
}

const Layout: React.FC<DirLayoutProps> = ({ children }) => {
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
