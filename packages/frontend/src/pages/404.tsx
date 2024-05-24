import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404</title>
        <meta name="description" content="Page Not Found" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/page-not-found.svg"}
          alt="page not found"
          width={200}
          height={200}
        />
        <h1 className="text-sm text-neutral-500">Page not found.</h1>
        <Link
          href={"/"}
          className="rounded-lg border px-4 py-2 hover:bg-[#fcfcfc] hover:shadow-sm"
        >
          Go back homepage
        </Link>
      </div>
    </>
  );
}
