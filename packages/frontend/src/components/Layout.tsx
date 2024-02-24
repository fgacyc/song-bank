import React, { type ReactNode } from "react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopNav />
      <div className="flex">
        <SideNav />
        <main className="relative left-[90px] top-[90px] z-0 w-[92dvw]">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
