import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/loading";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let segmento;

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  if (session) {
    segmento = session?.user?.segmento ? session?.user?.segmento : "admin";
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Olá, seja bem vindo ao RiceBack</h1>
          <p className="py-6">Fomos desenvolvidos pela Softline Sistemas.</p>
          {segmento ? (
            <div className="flex justify-center items-center">
              <Link href={`/usuarios/${segmento.toLocaleLowerCase()}/`} className="btn btn-primary">
                Meu dashboard
              </Link>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <Link href={`/auth/login`} className="btn btn-primary">
                Fazer login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
