import IndexFooter from "@/components/index/IndexFooter";
import IndexSearchBar from "@/components/index/IndexSearchBar";
import Head from "next/head";
import Link from "next/link";
import { IoPerson } from "react-icons/io5";

const Home = () => {
  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="description" content="index" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Link href={"/"} className="fixed right-0 p-5">
        <IoPerson className="h-[20px] w-[20px]" />
      </Link>
      <IndexSearchBar />
      <IndexFooter />
    </>
  );
};

export default Home;
