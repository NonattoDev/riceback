import { v4 as uuidv4 } from "uuid";
import db from "@/db/db"; // Substitua com o caminho correto para o seu arquivo de configuração do banco de dados
import { NextApiRequest, NextApiResponse } from "next";

export default async function gerarTokenParaUsuarios(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    // Garante que estamos aceitando apenas requisições POST
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Seleciona todos os clientes onde ContaConfirmada é null
    const clientes = await db("Clientes").whereNull("ConfirmationToken").andWhere("ContaConfirmada", "F");

    // Itera sobre cada cliente e atualiza o token
    for (const cliente of clientes) {
      const token = uuidv4(); // Gera um novo token UUID v4
      await db("Clientes").where("CodCli", cliente.CodCli).update({ ConfirmationToken: token });
    }

    res.status(200).json({ message: "Tokens gerados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar tokens" });
  }
}
