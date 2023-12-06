import { AppProps } from "next/app";
import { Session } from "next-auth";
import { NextComponentType } from "next";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header/Header";
import Head from "next/head";

type EnhancedAppProps = AppProps & {
  Component: NextComponentType;
  pageProps: {
    session?: Session;
  };
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: EnhancedAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <>
          <Head>
            <title>Riceback</title>
          </Head>
          <Header />
          <Component {...pageProps} />
          <ToastContainer />
        </>
      </QueryClientProvider>
    </SessionProvider>
  );
}
