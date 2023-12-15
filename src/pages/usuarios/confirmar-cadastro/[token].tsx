// pages/confirmar-cadastro.tsx
import db from "@/db/db";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

// Tipagem para as props do componente
interface ConfirmarCadastroProps {
  confirmacaoStatus: {
    success: boolean;
    message: string;
  };
}

const ConfirmarCadastroPage: NextPage<ConfirmarCadastroProps> = ({ confirmacaoStatus }) => {
  const router = useRouter();

  if (confirmacaoStatus.success) {
    toast.success(confirmacaoStatus.message);
    setTimeout(() => {
      router.push("/auth/login");
    }, 5000);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Confirmar Cadastro</h2>
          {confirmacaoStatus.success ? (
            <p className="text-success">Sua conta foi confirmada com sucesso! Você será redirecionado para a página de login em breve.</p>
          ) : (
            <p className="text-error">Ocorreu um erro ao confirmar sua conta: {confirmacaoStatus.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token as string;

  if (!token) {
    return {
      props: {
        confirmacaoStatus: {
          success: false,
          message: "Token não fornecido!",
        },
      },
    };
  }

  const verificarToken = await db("Clientes").where("ConfirmationToken", token).first();

  if (!verificarToken) {
    return {
      props: {
        confirmacaoStatus: {
          success: false,
          message: "Token inválido ou expirado!",
        },
      },
    };
  }

  await db("Clientes").where("ConfirmationToken", token).update({
    ContaConfirmada: "T",
    ConfirmationToken: null,
  });

  return {
    props: {
      confirmacaoStatus: {
        success: true,
        message: "Conta confirmada com sucesso!",
      },
    },
  };
};

export default ConfirmarCadastroPage;
