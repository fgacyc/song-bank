import type { AppType } from "next/dist/shared/lib/utils";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "@/styles/globals.css";
import Layout from "@/components/layout/Layout";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserProvider>
        <Layout>{page}</Layout>
      </UserProvider>
    ));

  return getLayout(<Component {...pageProps} />);
};

export default MyApp;
