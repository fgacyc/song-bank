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
import { RiFeedbackLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";

const Profile = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  // const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (window.innerWidth > 640) {
      void router.push("/404");
    }

    if (!user) {
      void router.push("/api/auth/login");
      return;
    }
  }, [isLoading, user, router]);

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

          <ProfileNavigationBlock link="/favourite" name="Favourite songs">
            <HiOutlineStar />
          </ProfileNavigationBlock>

          <hr className="mx-3" />

          {/* TODO: add dark mode */}
          {/* <button
            className="flex h-[40px] w-full items-center justify-between px-3 hover:bg-[#f8f8f9]"
            onClick={() => {
              if (darkMode) {
                setDarkMode(false);
              } else {
                setDarkMode(true);
              }
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="text-lg">
                {darkMode ? <MdOutlineDarkMode /> : <MdDarkMode />}
              </div>
              <p>Dark Mode</p>
            </div>
          </button> */}

          <ProfileNavigationBlock link="/about" name="About">
            <IoMdInformationCircleOutline />
          </ProfileNavigationBlock>

          <ProfileNavigationBlock
            link="https://miniapp-feedback.vercel.app/"
            name="Feedback"
          >
            <RiFeedbackLine />
          </ProfileNavigationBlock>

          <ProfileNavigationBlock
            link="https://docs.google.com/document/d/1E0Pn3ZL6LTlumWKQB7UyeJ88m0jrQjf8a7Z4tqapCi0/edit?usp=sharing"
            name="Tutorial"
          >
            <IoDocumentTextOutline />
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
