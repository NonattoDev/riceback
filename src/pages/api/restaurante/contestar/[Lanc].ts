import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { Lanc } = req.query;
    const { contestacao } = req.body;
    try {
      await db("servico1").where("Lanc", Lanc).update({ Transito: contestacao });
      return res.status(200).json({ message: "Contestação atualizada com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao atualizar a contestação!" });
    }
  } else {
    return res.status(401).json({ message: "Método não permitido!" });
  }
}
