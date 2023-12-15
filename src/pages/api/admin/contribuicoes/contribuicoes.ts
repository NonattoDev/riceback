import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { page, limit, cliente, restaurante, data, produto } = req.query;

      // Calculando o offset
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Constrói a query base
      let baseQuery = db("servico1").leftJoin("clientes as c1", "servico1.CodCli", "c1.CodCli").leftJoin("clientes as c2", "servico1.CodFor", "c2.CodCli").whereNotNull("CodFor");

      // Aplica filtros conforme disponibilidade
      if (cliente) {
        baseQuery = baseQuery.where("c1.Cliente", "like", `%${cliente}%`);
      }
      if (restaurante) {
        baseQuery = baseQuery.where("c2.Cliente", "like", `%${restaurante}%`);
      }
      if (data) {
        // Isso cria uma data em formato ISO 8601 com 'Z' no final indicando UTC
        const exactDateTime = moment.utc(data).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
        baseQuery = baseQuery.where("servico1.Data", "=", exactDateTime);
      }

      if (produto) {
        baseQuery = baseQuery.where("servico1.CodPro", "=", produto);
      }
      // Conta o total de contribuições após aplicar os filtros
      const totalQuery = baseQuery.clone().count("* as total").first();

      // Executa a query final com limit e offset para paginação e ordenação
      const dataQuery = baseQuery
        .clone()
        .select(
          "servico1.Lanc",
          "servico1.CodPro",
          "servico1.Data",
          "servico1.Hora",
          "servico1.Preco",
          "servico1.Percentual",
          "servico1.Transito",
          "c1.Cliente as NomeCliente",
          "c2.Cliente as NomeRestaurante"
        )
        .orderBy("Lanc", "desc")
        .limit(parseInt(limit as string))
        .offset(offset);

      // Executa ambas as queries
      const [totalContribuicoes, contribuicoes] = await Promise.all([totalQuery, dataQuery]);

      // console.log(totalContribuicoes, contribuicoes); // para depuração

      return res.status(200).json({
        contribuicoes,
        total: totalContribuicoes?.total,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
}
