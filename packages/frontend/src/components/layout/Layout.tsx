import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { UserProvider } from "@auth0/nextjs-auth0/client";
// import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UserProvider>
      <Head>
        <title>Song Bank</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Header />
      {/* <Navigation /> */}
      <main className="relative top-[50px] z-0 min-h-[91vh] sm:top-[70px]">
        {children}
      </main>
      <Footer />
    </UserProvider>
  );
};

export default Layout;
