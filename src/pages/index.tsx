import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { redirect } from "next/dist/server/api-utils";
import Loading from "@/components/Loading/loading";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("You are not authenticated");
      console.log("onUnauthenticated");
      return;
    },
  });

  if (status === "loading") return <Loading />;

  console.log(session);
  if (session?.user?.admin) return <h1>Olá Adm {session?.user?.name}</h1>;

  if (session?.user?.CodSeg === "Restaurante") return <h1>Olá Restaurante{session?.user?.name}</h1>;
  if (session?.user?.CodSeg === "Consumidor") return <h1>Olá Consumidor {session?.user?.name}</h1>;

  return <h1>Olá {session?.user?.name}, esse login foi feito, e nao identificado como cliente cadastrado pelo Site</h1>;
}
