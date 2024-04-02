import Footer from "@/components/index/Footer";
import SearchBar from "@/components/index/SearchBar";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, type RefObject, useState } from "react";
import { IoPerson } from "react-icons/io5";
import Header from "../components/layout/Header";
import Navigation from "../components/layout/Navigation";
import Loading from "@/components/index/Loading";

const Home = () => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Song Bank</title>
          <meta name="description" content="search" />
          <link rel="icon" href="/img/logo.png" />
        </Head>
        <Header />
        <Navigation />
        <Loading />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>FGA Worship</title>
          <meta name="description" content="index" />
          <link rel="icon" href="/img/logo.png" />
        </Head>
        <Link href={""} className="fixed right-0 p-5">
          <IoPerson className="h-[20px] w-[20px]" />
        </Link>
        <SearchBar inputRef={inputRef} setIsLoading={setIsLoading} />
        <Footer />
      </>
    );
  }
};

export default Home;
