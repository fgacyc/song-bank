/* eslint-disable @next/next/no-img-element */
import Gallery from "@/components/Gallery";
import Head from "next/head";
import { RiSearch2Line } from "react-icons/ri";
// import Link from "next/link";
// import { IoIosSearch } from "react-icons/io";
// import { Field, Form, Formik, type FormikProps } from "formik";
// import * as Yup from "yup";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Search engine for songs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-dvh justify-between bg-[#eaeaea] p-5">
        {/* side navigation */}
        <div className="w-fit rounded-3xl bg-white p-5">
          <img
            src="https://placehold.co/100"
            alt="logo"
            className="rounded-full"
          />
        </div>
        <div className="w-full px-5">
          {/* top navigation */}
          <div className="flex items-center justify-between rounded-3xl bg-white p-3">
            {/* search bar */}
            <form
              action=""
              className="flex w-4/5 items-center rounded-2xl bg-[#eaeaea] px-5 py-3"
            >
              <label className="pe-2" htmlFor="search">
                <RiSearch2Line />
              </label>
              <input
                className="w-full bg-inherit"
                type="text"
                id="search" // htmlFor
                name="search"
                placeholder="Search"
              />
            </form>
            {/* profile picture */}
            <img
              src="https:placehold.co/50"
              alt="pfp"
              className="rounded-full"
            />
          </div>
          {/* songs */}
          <div className="pt-3">
            <div className="grid h-[85dvh] grid-cols-4 content-start gap-5 overflow-auto">
              <Gallery />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
