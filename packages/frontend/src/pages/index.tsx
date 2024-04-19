import Footer from "@/components/index/Footer";
import SearchBar from "@/components/index/SearchBar";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, type RefObject } from "react";
import { IoPerson } from "react-icons/io5";

const Home = () => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Song Bank</title>
        <meta name="description" content="index" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <Link href={""} className="fixed right-0 p-5">
        <IoPerson className="h-[20px] w-[20px]" />
      </Link>
      <SearchBar inputRef={inputRef} />
      <Footer />
    </>
  );
};

export default Home;
