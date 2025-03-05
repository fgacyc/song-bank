// import { type UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
import React from "react";

// interface HeaderProps {
// setUser: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
// showProfile: boolean;
// setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
// }

const Header = () => {
  // const { isLoading, user } = useUser();
  // const router = useRouter();

  return (
    <nav
      className="sticky top-0 z-20 flex h-[50px] w-full items-center justify-between border bg-white p-[10px] px-5 md:h-[70px]"
      // onClick={() => {
      //   setShowProfile(false);
      // }}
    >
      <Link href={"/"} className="flex items-center justify-center">
        <Image src={"/logo.png"} alt="logo" width={30} height={30} />
        <h1 className="text truncate ps-5 font-semibold">FGA Worship</h1>
      </Link>
      {/* <button
        className="hidden p-1 md:block"
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoading && user) {
            setUser(user);
            if (showProfile) {
              setShowProfile(false);
            } else {
              setShowProfile(true);
            }
          } else {
            void router.push("/api/auth/login");
          }
        }}
      >
         <Image
          src={!isLoading && user ? user.picture! : "/male-avatar.svg"}
          alt="pfp"
          width={30}
          height={30}
          className="rounded-full"
        /> 
      </button> */}
    </nav>
  );
};

export default Header;
