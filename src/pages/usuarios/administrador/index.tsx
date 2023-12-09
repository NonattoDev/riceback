import React, { useState } from "react";
import User from "@/types/User";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/db/db";
import AdminDados from "./Components/AdminDados";
import ContribuicoesGeral from "./Components/ContribuicoesGeral";

const ClientePage: React.FC<{ user: string }> = (props) => {
  const [user, setUser] = useState<User>(JSON.parse(props.user));

  return (
    <div className="flex flex-col justify-center items-center m-5">
      <AdminDados Usuario={user} />
      <ContribuicoesGeral />
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

  if (!session.user?.admin) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user: User = await db("senha").where("email", session.user?.email).select("CodUsu", "Email", "Usuario", "Senha").first();

  return {
    props: {
      user: JSON.stringify(user),
    },
  };
}

export default ClientePage;
