import React, { useState } from "react";
import User from "@/types/User";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/db/db";
import RestauranteDados from "./Components/RestauranteDados/RestauranteDados";
import ContribuicoesRecebidas from "./Components/ContribuicoesRecebidas/ContribuicoesRecebidas";

const RestaurantePage: React.FC<{ user: string }> = (props) => {
  const [user, setUser] = useState<User>(JSON.parse(props.user));

  return (
    <div className="flex flex-col justify-center items-center m-5">
      <RestauranteDados Usuario={user} />
      <ContribuicoesRecebidas CodCli={user?.CodCli} />
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

  if (session.user?.segmento !== "Restaurante") {
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

export default RestaurantePage;
