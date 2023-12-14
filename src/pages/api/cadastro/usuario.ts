import db from "@/db/db";
import transporter from "@/utils/NodeMailer/Transporter";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const usuario = req.body;

    try {
      // Verifica se o email já existe no banco de dados
      if (await db("clientes").where("EMail", usuario.email).first()) return res.status(400).json({ message: "O email informado já está cadastrado nos nossos sistemas." });

      // Verifica se o CPF já está cadastrado no banco de dados
      if (await db("clientes").where("CPF", usuario.cpf).first()) return res.status(400).json({ message: "O CPF já está cadastrado" });

      const ultimoCodCli = await db("Clientes").max("CodCli as CodCli").first();
      let CodCli = ultimoCodCli?.CodCli + 1;

      const Cliente = await db("clientes")
        .insert({
          CodCli,
          Cliente: usuario.nome,
          CPF: usuario.cpf,
          EMail: usuario.email,
          Chave: usuario.senha,
          Tel: usuario.telefone,
          Dia_Nasc: parseInt(moment(usuario.dataNascimento, "YYYY-MM-DD").format("DD")),
          Mes_Nasc: parseInt(moment(usuario.dataNascimento, "YYYY-MM-DD").format("MM").padStart(2, "0")),
          Ano_Nasc: parseInt(moment(usuario.dataNascimento, "YYYY-MM-DD").format("YYYY")),
          Endereco: usuario.endereco,
          Bairro: usuario.bairro,
          Cidade: usuario.cidade,
          Estado: usuario.estado,
          Numero: usuario.numero,
          CEP: usuario.cep,
          CodSeg: 1,
          Tipo: "F",
          DataCad: moment().format("yyyy-MM-DD"),
          ContaConfirmada: "F",
        })
        .returning("*");

      try {
        await transporter.sendMail({
          from: {
            name: "Soft - RiceBack",
            address: process.env.GMAIL_LOGIN as string,
          },
          to: usuario.email,
          subject: "Confirmação de Cadastro",
          html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; }
                  .container { background-color: #f7f7f7; padding: 20px; }
                  .header { color: #ffffff; background-color: #4CAF50; padding: 10px; text-align: center; }
                  .content { padding: 20px; text-align: center; }
                  .button { background-color: #008CBA; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px; }
                  .footer { padding: 10px; text-align: center; background-color: #f1f1f1; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Confirmação de Cadastro</h1>
                  </div>
                  <div class="content">
                    <p>Olá, obrigado por se cadastrar no Soft - RiceBack!</p>
                    <p>Por favor, confirme seu cadastro clicando no botão abaixo.</p>
                    <a href="LINK_DE_CONFIRMACAO" class="button">Confirmar Cadastro</a>
                  </div>
                  <div class="footer">
                    <p>Soft - RiceBack © 2023. Todos os direitos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `,
        });
      } catch (error: any) {
        console.log(error.message);
      }
      return res.status(201).json(Cliente);
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({ message: "Não foi possível cadastrar o usuário" });
    }
  }
}
