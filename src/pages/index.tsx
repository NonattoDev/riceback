import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/loading";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("Você não está logado");
      router.push("/auth/login");
      return;
    },
  });

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  if (session?.user?.admin) return <h1 onClick={() => signOut()}>Olá Adm {session?.user?.name}</h1>;
  if (session?.user?.segmento === "Restaurante") return <h1 onClick={() => signOut()}>Olá Restaurante {session?.user?.name}</h1>;
  if (session?.user?.segmento === "Consumidor") return <h1 onClick={() => signOut()}>Olá Consumidor {session?.user?.name}</h1>;
  return <h1 onClick={() => signOut()}>Olá {session?.user?.name}, esse login foi feito, e nao identificado como cliente cadastrado pelo Site</h1>;
}
