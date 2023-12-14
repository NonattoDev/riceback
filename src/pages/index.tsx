import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/loading";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";

export default function Home() {
  const { data: session, status } = useSession();
  let segmento;

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  if (session) {
    segmento = session?.user?.segmento ? session?.user?.segmento : "Administrador";
  }

  return (
    <div className="hero min-h-screen bg-base-200 flex justify-center items-center overflow-hidden">
      <div className="text-center">
        <Image src={logo} alt="Riceback" width={400} height={400} style={{ margin: "-50px auto" }} />
        <h1 className="text-5xl font-bold">Olá, seja bem vindo ao RiceBack</h1>
        <p className="py-6">Fomos desenvolvidos pela Softline Sistemas.</p>
        <div className="flex justify-center items-center">
          {status === "unauthenticated" ? (
            <Link href={`/auth/login`} className="btn btn-primary">
              Fazer login
            </Link>
          ) : (
            <Link href={`/usuarios/${segmento?.toLocaleLowerCase()}`} className="btn btn-primary">
              Meu Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
