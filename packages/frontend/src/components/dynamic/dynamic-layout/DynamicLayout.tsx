import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./DynamicHeader";

interface DynamicLayoutProps {
  children: ReactNode;
}

const DynamicLayout: React.FC<DynamicLayoutProps> = ({ children }) => {
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

export default DynamicLayout;
