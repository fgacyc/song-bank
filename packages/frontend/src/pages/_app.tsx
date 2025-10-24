import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { useState, type ReactElement, type ReactNode } from "react";
import { ThemeProvider } from "@/features/theme";
import "@/styles/global.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 mins
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.ico" sizes="any" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
        {/* DEBUG: temp react query debugger */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
