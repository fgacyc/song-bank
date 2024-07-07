import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { useRouter } from "next/router";

const Custom404: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>404</title>
        <meta name="description" content="Page Not Found" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="fixed top-0 flex h-screen w-screen flex-col items-center justify-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/page-not-found.svg"}
          alt="page not found"
          width={200}
          height={200}
        />
        <h1 className="text-sm text-neutral-500">Page not found.</h1>
        <button
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2 hover:bg-[#fcfcfc] hover:shadow-sm"
        >
          Go back previous page
        </button>
      </div>
    </>
  );
};

Custom404.getLayout = (page) => page;
export default Custom404;
