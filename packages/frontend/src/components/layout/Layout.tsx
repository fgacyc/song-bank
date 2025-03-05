import Head from "next/head";
import React, { type ReactNode } from "react";
import Header from "./Header";
// import { type UserProfile } from "@auth0/nextjs-auth0/client";
// import ProfileNavigationBlock from "../profile/ProfileNavigationBlock";
// import { MdOutlineHistory } from "react-icons/md";
// import { HiOutlineStar } from "react-icons/hi";
// import ProfileUserInfo from "../profile/ProfileUserInfo";
// import { IoMdInformationCircleOutline } from "react-icons/io";
// import { TbLogout2 } from "react-icons/tb";
// import { useRouter } from "next/router";
// import { RiFeedbackLine } from "react-icons/ri";
// import { IoDocumentTextOutline } from "react-icons/io5";
// import ActionSheetButtons from "../miniapp/MiniAppActionSheetButtons";
// import ActionSheetMenu from "../miniapp/MiniAppActionSheetMenu";
// import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode | ReactNode[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const [showProfile, setShowProfile] = useState(false);
  // const [user, setUser] = useState<UserProfile>();
  // const router = useRouter();

  // useEffect(() => {
  //   setShowProfile(false);
  // }, [router.asPath]);

  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="description" content="Song Bank" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {/* <ActionSheetButtons /> */}

      {/* {showProfile && (
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
          <div
            role="button"
            className="fixed z-10 h-screen w-screen"
            onClick={() => setShowProfile(false)}
          ></div>
        </>
      )} */}
      {/* <Navigation /> */}
      <main className="relative z-0 min-h-screen w-full">
        <Header />
        {children}
      </main>
      {/* <ActionSheetMenu /> */}
    </>
  );
};

export default Layout;
