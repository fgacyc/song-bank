import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./Header";
// import Navigation from "./Navigation";

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
      {/* <Navigation /> */}
      <main className="relative top-[70px] z-0 min-h-[91vh]">{children}</main>
    </>
  );
};

export default Layout;
