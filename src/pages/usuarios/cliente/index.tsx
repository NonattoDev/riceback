import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loading from "@/components/Loading/loading";

const ClientePage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você precisa estar logado para acessar essa página");
      return router.push("/auth/login");
    },
  });

  useEffect(() => {
    if (session) {
      if (session.user?.seguimento != "Consumidor") router.push("/auth/login");
    }
  }, [session, router, status]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-4xl font-bold">Página do Consumidor</h2>
    </div>
  );
};

export default ClientePage;
