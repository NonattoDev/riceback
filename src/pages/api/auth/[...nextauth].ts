import db from "@/db/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

declare module "next-auth" {
  interface User {
    admin?: boolean;
    CodSeg?: string;
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
          return user;
        }

        user = await db("clientes").where({ EMail: login, Chave: senha }).first();

        if (user) {
          return user;
        }

        return null;
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
            token.seguimento = "Consumidor";
            break;
          case 2:
            token.seguimento = "Restaurante";
            break;
          default:
            token.seguimento = "Desconhecido";
            break;
        }
      }

      //Administrador
      if (user && user.CodUsu) {
        token.admin = true;
        token.id = user.CodUsu;
        token.name = user.Usuario;
        token.email = user.EMail;
        token.seguimento = "Administrador";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Adicionar informações personalizadas à sessão
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.admin = token.admin;
      session.user.seguimento = token.seguimento;
      // Adicione outras propriedades personalizadas conforme necessário
      return session;
    },
  },
};

export default NextAuth(authOptions);
