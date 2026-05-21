import Footer from "@/features/shared/components/Footer";
import Header from "@/features/shared/components/Header";
import Head from "next/head";
import type { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
        <Header title={title ?? "Song Bank Admin"} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
