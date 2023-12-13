import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/loading";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

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
    segmento = session?.user?.segmento ? session?.user?.segmento : "Administrador";
  }

  return (
    <div className="hero min-h-screen bg-base-200 flex justify-center items-center">
      <div className="text-center">
        <Image src="/logo.png" alt="Riceback" width={400} height={400} style={{ margin: "-50px auto" }} />
        <h1 className="text-5xl font-bold">Olá, seja bem vindo ao RiceBack</h1>
        <p className="py-6">Fomos desenvolvidos pela Softline Sistemas.</p>
        <div className="flex justify-center items-center">
          <Link href={`/auth/login`} className="btn btn-primary">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
