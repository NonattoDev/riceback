import db from "@/db/db";
import transporter from "@/utils/NodeMailer/Transporter";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  try {
    const usuario = await db("Clientes").where("EMail", email).first();

    if (!usuario) {
      return res.status(404).json({ message: "Email não encontrado" });
    }

    try {
      await transporter.sendMail({
        from: {
          name: "Soft - RiceBack",
          address: process.env.GMAIL_LOGIN as string,
        },
        to: email,
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
                     <a href="${process.env.NEXTAUTH_URL}/usuarios/confirmar-cadastro/${usuario.ConfirmationToken}" class="button">Confirmar Cadastro</a>
                   </div>
                   <div class="footer">
                     <p>Soft - RiceBack © 2023. Todos os direitos reservados.</p>
                   </div>
                 </div>
               </body>
               </html>
             `,
      });
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({ message: `Email recebido: ${email}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao reenviar token" });
  }
}
