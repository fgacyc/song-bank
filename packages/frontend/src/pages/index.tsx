import Footer from "@/components/index/Footer";
import SearchBar from "@/components/index/SearchBar";
import Head from "next/head";
import React, { useEffect, useRef, type RefObject } from "react";

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
        <title>FGA Worship</title>
        <meta name="description" content="index" />
        <link rel="icon" href="/img/logo.png" />
      </Head>
      <SearchBar inputRef={inputRef} />
      <Footer />
    </>
  );
};

export default Home;
