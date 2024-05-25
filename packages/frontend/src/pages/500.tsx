import Head from "next/head";
import Link from "next/link";
import { type NextPageWithLayout } from "./_app";

const Custom500: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>500</title>
        <meta name="description" content="Server Side Error" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/server-down.svg"}
          alt="server side error"
          width={200}
          height={200}
        />
        <h1 className="text-sm text-neutral-500">Server-side error.</h1>
        <Link
          href={"/"}
          className="rounded-lg border px-4 py-2 hover:bg-[#fcfcfc] hover:shadow-sm"
        >
          Go back homepage
        </Link>
      </div>
    </>
  );
};

Custom500.getLayout = (page) => page;
export default Custom500;
