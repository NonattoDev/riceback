import db from "@/db/db";
import transporter from "@/utils/NodeMailer/Transporter";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

// Função para gerar um código de 4 ou 5 dígitos
const generateCode = (digits = 4) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, code, newPassword } = req.body;

    if (email && code && !newPassword) {
      const validarToken = await db("clientes")
        .where({
          EMail: email,
          tokenVerificacao: code,
        })
        .first();

      if (!validarToken) {
        return res.status(404).json({ message: "Código inválido" });
      }

      // Obter a data de validade do token
      const tokenValidade = validarToken.tokenData;

      // Obter o momento atual
      const agora = moment();

      if (agora.isBefore(tokenValidade) || agora.isSame(tokenValidade)) {
        return res.status(200).json({ message: "Token válido" });
      } else {
        return res.status(403).json({ message: "Token expirado" });
      }
    }

    if (email && code && newPassword) {
      try {
        const atualizarSenha = await db("Clientes").update({ Chave: newPassword }).where({ EMail: email, tokenVerificacao: code });

        if (!atualizarSenha) {
          return res.status(404).json({ message: "Código inválido" });
        }

        return res.status(200).json({ message: "Senha atualizada com sucesso" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro ao atualizar a senha" });
      }
    }

    // Buscar o usuario no banco de dados
    try {
      const usuario = await db("clientes").where("EMail", email).first();
      if (!usuario) {
        return res.status(404).json({ message: "Email não encontrado" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar o usuário" });
    }

    try {
      // Gerar código
      const verificationCode = generateCode(4); // ou 5 para um código de 5 dígitos
      const inserirToken = await db("clientes")
        .update({
          tokenVerificacao: verificationCode,
          tokenData: moment().add(10, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        })
        .where("EMail", email)
        .returning("CodCli");

      // Enviar email com o código
      transporter.sendMail({
        from: {
          name: "Soft - RiceBack",
          address: process.env.GMAIL_LOGIN as string,
        },
        to: email,
        subject: "Recuperação de Senha",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #4F46E5;">Recuperação de Senha</h2>
              <p>Olá,</p>
              <p>Você solicitou a recuperação de senha na Soft - RiceBack. Use o código abaixo para prosseguir com a redefinição de sua senha:</p>
              <div style="margin: 20px 0; text-align: center;">
                <span style="font-size: 20px; padding: 10px 15px; border: 1px solid #4F46E5; color: #4F46E5; border-radius: 4px;">${verificationCode}</span>
              </div>
              <p>Este código é válido por 10 minutos. Se você não solicitou uma recuperação de senha, por favor, ignore este e-mail.</p>
              <p>Atenciosamente,</p>
              <p><strong>Equipe Soft - RiceBack</strong></p>
            </div>
          `,
      });

      return res.status(200).json({ message: `Email ${email} recebido com sucesso!` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao gerar o token" });
    }
  }
}
