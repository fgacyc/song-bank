import Layout from "@/components/layout/Layout";
import React, { type ReactElement } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
// import { useRouter } from "next/router";
import ProfileUserInfo from "@/components/profile/ProfileUserInfo";
import ProfileSearchHistory from "@/components/profile/ProfileSearchHistory";
import ProfileFavouriteSongs from "@/components/profile/ProfileFavouriteSongs";

const Profile = () => {
  const { user, isLoading } = useUser();
  //   const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      console.log(user);
    } else {
      console.log("not login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-3 p-3">
      <ProfileUserInfo user={user} />
      <ProfileSearchHistory />
      <ProfileFavouriteSongs />
    </div>
  );
};

export default Profile;

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
