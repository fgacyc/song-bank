import Head from "next/head";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { type UserProfile, UserProvider } from "@auth0/nextjs-auth0/client";
import ProfileNavigationBlock from "../profile/ProfileNavigationBlock";
import { MdOutlineHistory } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi";
import ProfileUserInfo from "../profile/ProfileUserInfo";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { useRouter } from "next/router";
// import ActionSheetButtons from "../miniapp/MiniAppActionSheetButtons";
// import ActionSheetMenu from "../miniapp/MiniAppActionSheetMenu";
// import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<UserProfile>();
  const router = useRouter();

  useEffect(() => {
    setShowProfile(false);
  }, [router.asPath]);

  return (
    <UserProvider>
      <Head>
        <title>Song Bank</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      {/* <ActionSheetButtons /> */}
      <Header
        setUser={setUser}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      {showProfile && (
        <>
          <div className="fixed right-3 top-[62px] z-20 hidden flex-col gap-3 rounded-md border-2 bg-white pb-3 sm:flex">
            <div className="p-3 pt-6">
              <ProfileUserInfo user={user} />
            </div>
            <hr className="mx-3" />

            <ProfileNavigationBlock link="/history" name="Search history">
              <MdOutlineHistory />
            </ProfileNavigationBlock>

            <ProfileNavigationBlock link="/favourite" name="Favourite songs">
              <HiOutlineStar />
            </ProfileNavigationBlock>

            <hr className="mx-3" />

            <ProfileNavigationBlock link="/about" name="About">
              <IoMdInformationCircleOutline />
            </ProfileNavigationBlock>

            <hr className="mx-3" />

            <ProfileNavigationBlock
              link="/api/auth/logout"
              name="Log Out"
              logout={true}
            >
              <TbLogout2 />
            </ProfileNavigationBlock>
          </div>
          <div
            className="fixed z-10 h-screen w-screen"
            onClick={() => setShowProfile(false)}
          ></div>
        </>
      )}
      {/* <Navigation /> */}
      <main className="relative top-[50px] z-0 min-h-[91vh] sm:top-[70px]">
        {children}
      </main>
      <Footer />
      {/* <ActionSheetMenu /> */}
    </UserProvider>
  );
};

export default Layout;
