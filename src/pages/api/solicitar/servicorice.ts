import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { CodCli, restauranteId } = req.body;

    // Pega o Preco e o Percentual de Cliente
    const dados = await db("clientes").select("Preco", "Percentual").where("CodCli", restauranteId).first();

    try {
      const inserirServico = await db("servico1")
        .insert({
          CodCli: CodCli,
          CodFor: restauranteId, //CodCli do Restaurante,
          CodPro: 1, // Codigo do Arroz
          Data: moment().format("YYYY-MM-DD 00:00:00.000"),
          Hora: moment().format("HH:mm"),
          Preco: dados.Preco,
          Percentual: dados.Percentual,
        })
        .returning("Lanc");
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ message: "Erro ao inserir o serviço" });
    }

    // Lógica para lidar com a requisição POST aqui
    res.status(200).json({ message: "Requisição POST recebida com sucesso!" });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
