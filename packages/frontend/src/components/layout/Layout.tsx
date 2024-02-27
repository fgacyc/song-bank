import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Header />
      <div className="flex">
        <Navigation />
        <main className="relative left-[90px] top-[90px] z-0 w-[92dvw]">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
