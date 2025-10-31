import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { ReactNode } from "react";

interface MainLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function MainLayout({ title, children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
      <Header title={title ?? "FGA Worship - Song Bank"} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
