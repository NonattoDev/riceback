import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "PUT") {
    const user = req.body;
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
