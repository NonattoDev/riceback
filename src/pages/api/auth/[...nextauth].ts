import db from "@/db/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultSession } from "next-auth";
import transporter from "@/utils/NodeMailer/Transporter";

declare module "next-auth" {
  interface User {
    admin?: boolean;
    segmento?: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        login: { label: "Login", type: "text", placeholder: "Login" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        const { login, senha } = credentials;

        let user = await db("senha").where({ Usuario: login, Senha: senha }).first();

        if (user) {
          try {
            await transporter.sendMail({
              from: {
                name: "Soft - RiceBack",
                address: process.env.GMAIL_LOGIN as string,
              },
              to: user.EMail,
              subject: "Login Efetuado",
              html: `
              <!DOCTYPE html>
              <html lang="pt-br">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; }
                  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; }
                  .header { background-color: #4CAF50; padding: 20px; text-align: center; }
                  .header h1 { color: #ffffff; margin: 0; }
                  .content { padding: 30px 20px; text-align: center; }
                  .content p { color: #555555; line-height: 1.5; font-size: 16px; }
                  .button { background-color: #008CBA; color: #ffffff; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; margin: 20px auto; cursor: pointer; border-radius: 5px; border: none; transition: background-color 0.3s; }
                  .button:hover { background-color: #005f73; }
                  .footer { background-color: #f1f1f1; padding: 15px 20px; text-align: center; }
                  .footer p { color: #555555; font-size: 14px; margin: 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Seu Login no RiceBack</h1>
                  </div>
                  <div class="content">
                    <p>Olá, ${user.Usuario}</p>
                    <p>Seu login foi realizado com sucesso. Se você não reconhece essa atividade, por favor entre em contato conosco imediatamente.</p>
                    <a href="#" class="button">Verificar Atividade</a>
                    <p>Cuide da sua segurança - nunca compartilhe suas credenciais de login.</p>
                  </div>
                  <div class="footer">
                    <p>Soft - RiceBack © 2023. Todos os direitos reservados.</p>
                  </div>
                </div>
              </body>
              </html>              
                `,
            });
            console.log("Email enviado com sucesso");
          } catch (error) {
            console.log(error);
          }
          return user;
        }

        user = await db("clientes").where({ EMail: login, Chave: senha }).first();

        if (user) {
          // Verifica se o usuario confirmou o cadastro
          if (user.ContaConfirmada === "F") {
            throw new Error("Por favor confirme a sua conta no seu email!");
          }

          try {
            await transporter.sendMail({
              from: {
                name: "Soft - RiceBack",
                address: process.env.GMAIL_LOGIN as string,
              },
              to: user.EMail,
              subject: "Login Efetuado",
              html: `
              <!DOCTYPE html>
              <html lang="pt-br">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; }
                  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; }
                  .header { background-color: #4CAF50; padding: 20px; text-align: center; }
                  .header h1 { color: #ffffff; margin: 0; }
                  .content { padding: 30px 20px; text-align: center; }
                  .content p { color: #555555; line-height: 1.5; font-size: 16px; }
                  .button { background-color: #008CBA; color: #ffffff; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; margin: 20px auto; cursor: pointer; border-radius: 5px; border: none; transition: background-color 0.3s; }
                  .button:hover { background-color: #005f73; }
                  .footer { background-color: #f1f1f1; padding: 15px 20px; text-align: center; }
                  .footer p { color: #555555; font-size: 14px; margin: 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Seu Login no RiceBack</h1>
                  </div>
                  <div class="content">
                    <p>Olá, ${user.Cliente}</p>
                    <p>Seu login foi realizado com sucesso. Se você não reconhece essa atividade, por favor entre em contato conosco imediatamente.</p>
                    <a href="#" class="button">Verificar Atividade</a>
                    <p>Cuide da sua segurança - nunca compartilhe suas credenciais de login.</p>
                  </div>
                  <div class="footer">
                    <p>Soft - RiceBack © 2023. Todos os direitos reservados.</p>
                  </div>
                </div>
              </body>
              </html>              
                `,
            });
            console.log("Email enviado com sucesso");
          } catch (error) {
            console.log(error);
          }
          return user;
        }

        throw new Error("Usuário ou senha inválidos");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Cliente ou Restaurante
      if (user && user.CodCli) {
        token.id = user.CodUsu ? user.CodUsu : user.CodCli;
        token.name = user.Usuario ? user.Usuario : user.Cliente;
        token.email = user.EMail;
        switch (user.CodSeg) {
          case 1:
            token.segmento = "Consumidor";
            break;
          case 2:
            token.segmento = "Restaurante";
            break;
          default:
            token.segmento = "Desconhecido";
            break;
        }
      }

      //Administrador
      if (user && user.CodUsu) {
        token.admin = true;
        token.id = user.CodUsu;
        token.name = user.Usuario;
        token.email = user.EMail;
        token.segmento = "Administrador";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Adicionar informações personalizadas à sessão
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.admin = token.admin;
      session.user.segmento = token.segmento;
      // Adicione outras propriedades personalizadas conforme necessário
      return session;
    },
  },
};

export default NextAuth(authOptions);
