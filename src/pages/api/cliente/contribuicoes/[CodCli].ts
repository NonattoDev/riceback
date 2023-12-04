import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { CodCli, limit, page } = req.query;

    const totalContribuicoes = await db("servico1").join("Clientes", "servico1.CodFor", "=", "Clientes.CodCli").where("servico1.CodCli", CodCli).count("* as total").first(); // Conta o total de contribuições

    // Calculando o offset
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const contribuicoes = await db("servico1")
      .join("Clientes", "servico1.CodFor", "=", "Clientes.CodCli")
      .where("servico1.CodCli", CodCli)
      .orderBy("servico1.Lanc", "desc") // Adicione uma cláusula ORDER BY
      .limit(parseInt(limit as string))
      .offset(offset)
      .select("servico1.Lanc", "servico1.CodPro", "servico1.Data", "servico1.Hora", "servico1.Hora", "servico1.Transito", "servico1.CodFor", "servico1.CodCli", "Clientes.Cliente as NomeRestaurante");

    return res.status(200).json({
      contribuicoes: contribuicoes,
      total: totalContribuicoes?.total,
    });
  }
}
