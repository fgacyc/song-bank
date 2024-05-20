import Head from "next/head";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500</title>
        <meta name="" content="" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/server-down.svg"}
          alt="page not found"
          width={200}
          height={200}
        />
        <h1 className="text-sm text-neutral-500">Server-side error.</h1>
      </div>
    </>
  );
}
