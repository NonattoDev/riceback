import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const CodCli = req.body.CodCli;

    const inserirServico = await db("servico")
      .insert({
        CodCli: CodCli,
        CodFor: 2, //CodCli do Restaurante,
        CodPro: 1, // Codigo do Arroz
        Data: moment().format("YYYY-MM-DD 00:00:00.000"),
        Hora: moment().format("HH:mm"),
      })
      .returning("Lanc");
    console.log(inserirServico);

    // Lógica para lidar com a requisição POST aqui
    res.status(200).json({ message: "Requisição POST recebida com sucesso!" });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
