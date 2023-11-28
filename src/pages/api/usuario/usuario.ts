import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const usuario = req.body;

    // Verifica se o email já existe no banco de dados
    if (await db("clientes").where("EMail", usuario.email).first()) return res.status(400).json({ message: "O email informado já está cadastrado nos nossos sistemas." });

    // Verifica se o CPF já está cadastrado no banco de dados
    if (await db("clientes").where("CPF", usuario.cpf).first()) return res.status(400).json({ message: "O CPF já está cadastrado" });

    try {
      const Cliente = await db("clientes")
        .insert({
          ...usuario,
          Tipo: "F",
          DataCad: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .returning("*");

      return res.status(201).json(Cliente);
    } catch (error) {
      return res.status(400).json({ message: "Não foi possível cadastrar o usuário" });
    }
  }
}
