import IndexFooter from "@/components/index/IndexFooter";
import IndexSearchBar from "@/components/index/IndexSearchBar";
import Head from "next/head";
import Link from "next/link";
import { CiMenuBurger } from "react-icons/ci";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

const Home = () => {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    console.log(user);
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="description" content="index" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <div className="absolute top-0 flex h-[100px] w-full items-center justify-between px-7">
        <div className="flex select-none items-center justify-center gap-3"></div>
        <div>
          <div className="flex items-center gap-5 text-xs">
            <Link href={"/"} className="hidden sm:block">
              SEARCH
            </Link>
            <Link href={"/"} className="hidden sm:block">
              BROWSE
            </Link>
            <Link
              href={"/api/auth/login"}
              className="hidden rounded-full border px-5 py-1 sm:block"
            >
              SIGN IN
            </Link>
          </div>
          <button className="sm:hidden">
            <CiMenuBurger className="w-[20px]" />
          </button>
        </div>
      </div>

      <IndexSearchBar />
      <IndexFooter />
    </>
  );
};

export default Home;
