import { AppProps } from "next/app";
import { Session } from "next-auth";
import { NextComponentType } from "next";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type EnhancedAppProps = AppProps & {
  Component: NextComponentType;
  pageProps: {
    session?: Session;
  };
};

export default function App({ Component, pageProps }: EnhancedAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
}
