import Layout from "@/components/layout/Layout";
import React, { useEffect, type ReactElement } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import ProfileUserInfo from "@/components/profile/ProfileUserInfo";
import ProfileSearchHistory from "@/components/profile/ProfileSearchHistory";
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

const Profile = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    void (async () => {
      if (!user) {
        void router.push("/api/auth/login");
        return;
      }
    })();
  }, [isLoading, user, router]);

  return (
    <>
      <div className="flex flex-col gap-3 p-3">
        <ProfileUserInfo user={user} />
        <ProfileSearchHistory />
      </div>
      <div className="flex flex-col gap-1">
        <ProfileNavigationBlock link="/history" name="History">
          <MdOutlineHistory />
        </ProfileNavigationBlock>

        <ProfileNavigationBlock link="/favourites" name="Favourites">
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
    </>
  );
};

export default Profile;

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
