import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "@/features/theme";
import "@/styles/global.css";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <ThemeProvider>
      <div className="transition-colors duration-300">
        {getLayout(<Component {...pageProps} />)}
      </div>
    </ThemeProvider>
  );
}
