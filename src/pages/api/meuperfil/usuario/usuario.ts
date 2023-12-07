import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "PUT") {
    const user = req.body;

    if (user && user.CodUsu) {
      // Se entrar aqui, significa que o Administrador está alterando o seu próprio perfil
      try {
        const updateAdmin = await db("Senha").where("CodUsu", user.CodUsu).update(user);
        return res.status(200).json({ message: "Dados do admnistrador atualizado" });
      } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: "Erro ao atualizar o usuário" });
        return;
      }
    }

    try {
      await db("Clientes").where("CodCli", user.CodCli).update(user);
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Erro ao atualizar o usuário" });
      return;
    }

    res.status(200).json({ message: "Requisição PUT recebida" });
  }
}
