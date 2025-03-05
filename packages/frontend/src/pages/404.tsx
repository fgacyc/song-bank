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
          onClick={async () => {
            if (process.env.NODE_ENV === "development") {
              const response = await fetch("/api/getAllSong");
              if (response.ok) {
                const blob = await response.blob();
                // Only use window APIs on the client side
                if (typeof window !== "undefined") {
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "songs_backup.csv";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }
              }
            }
          }}
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
