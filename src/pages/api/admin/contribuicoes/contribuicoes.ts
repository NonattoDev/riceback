import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { limit, page } = req.query;

    const totalContribuicoes = await db("servico1").count("* as total").first(); // Conta o total de contribuições
    console.log(totalContribuicoes?.total);

    // Calculando o offset
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const contribuicoes = await db("servico1")
      .orderBy("Lanc", "desc")
      .limit(parseInt(limit as string))
      .offset(offset)
      .select("Lanc", "CodPro", "Data", "Hora", "Transito", "CodCli", "CodFor");

    console.log(contribuicoes);
    return res.status(200).json({
      contribuicoes: contribuicoes,
      total: totalContribuicoes?.total,
    });
  }
}
