import { type AppType } from "next/dist/shared/lib/utils";
import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NextUIProvider>
      <ToastContainer
        stacked
        className={"z-20"}
        bodyClassName={"z-30"}
        toastClassName={"z-30"}
        position="top-right"
        theme="dark"
        pauseOnFocusLoss={false}
      />
      <Component {...pageProps} />
    </NextUIProvider>
  );
};

export default MyApp;
