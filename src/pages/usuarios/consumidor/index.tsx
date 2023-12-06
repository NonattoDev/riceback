import React, { useState } from "react";
import User from "@/types/User";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/db/db";
import Contribuicoes from "./Components/Contribuicoes/Contribuicoes";
import Contribuir from "./Components/Contribuir/Contribuir";
import ClienteDados from "./Components/ClienteDados/ClienteDados";

const ClientePage: React.FC<{ user: string }> = (props) => {
  const [user, setUser] = useState<User>(JSON.parse(props.user));

  return (
    <div className="flex flex-col justify-center items-center m-5">
      <ClienteDados Usuario={user} />
      <Contribuir Usuario={user} />
      <Contribuicoes CodCli={user?.CodCli} />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  if (session.user?.segmento !== "Consumidor") {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user: User = await db("clientes").where("email", session.user?.email).first();

  return {
    props: {
      user: JSON.stringify(user),
    },
  };
}

export default ClientePage;
