import Layout from "@/components/layout/Layout";
import React, { useEffect, type ReactElement } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import ProfileUserInfo from "@/components/profile/ProfileUserInfo";
import ProfileRecentSearch from "@/components/profile/ProfileRecentSearch";
import {
  // MdDarkMode,
  // MdOutlineDarkMode,
  MdOutlineHistory,
} from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi";
import ProfileNavigationBlock from "@/components/profile/ProfileNavigationBlock";
import { TbLogout2 } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useRouter } from "next/router";
import Head from "next/head";

const Profile = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    void (() => {
      if (window.innerWidth > 640) {
        void router.push("/404");
      }
    })();

    void (() => {
      if (!user) {
        void router.push("/api/auth/login");
        return;
      }
    })();
  }, [isLoading, user, router]);

  // TODO: make profile unaccessible for tablet & computer devices
  return (
    <>
      <Head>
        <title>{user?.name}</title>
        <meta name="" content="" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <div className="block sm:hidden">
        <div className="flex flex-col gap-3 p-3">
          <ProfileUserInfo user={user} />
          <ProfileRecentSearch />
        </div>
        <div className="flex flex-col gap-1">
          <hr className="mx-3" />

          <ProfileNavigationBlock link="/history" name="Search history">
            <MdOutlineHistory />
          </ProfileNavigationBlock>

          <ProfileNavigationBlock link="/favourites" name="Favourite songs">
            <HiOutlineStar />
          </ProfileNavigationBlock>

          <hr className="mx-3" />

          {/* TODO: dark mode */}
          {/* <button className="flex h-[40px] items-center justify-between px-3">
            <div className="flex items-center justify-center gap-3">
              <div className="text-lg">
                {false ? <MdOutlineDarkMode /> : <MdDarkMode />}
              </div>
              <p>Dark Mode</p>
            </div>
            <IoIosArrowForward className="text-neutral-400" />
          </button> */}

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
      </div>
    </>
  );
};

export default Profile;

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
