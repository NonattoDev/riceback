import React, { useState } from "react";
import User from "@/types/User";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/db/db";
import InputMask from "react-input-mask";
import buscarEnderecoPorCEP from "@/utils/CEP/BuscaCEP";
import { toast } from "react-toastify";
import validarCPF from "@/utils/CadastroCliente/validarCPF";
import { FaHeart, FaPencilAlt, FaSave } from "react-icons/fa";
import styles from "./cliente.module.scss";
import axios from "axios";

const ClientePage: React.FC<{ user: string }> = (props) => {
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState<User>(JSON.parse(props.user));

  // Função para lidar com a edição do usuário
  const handleEdit = async () => {
    // Verificar se algum campo está vazio
    if (Object.values(user).some((value) => value === "")) {
      return toast.error("Preencha todos os campos!");
    }

    if (user?.Bairro?.length && user.Bairro.length > 25) return toast.error("Endereço muito longo!");

    const dadosTratados = {
      ...user,
      CPF: user?.CPF?.replace(".", ""),
      Cep: user?.Cep?.replace(".", ""),
      Tel: user?.Tel?.replace(" ", ""),
    };

    try {
      const response = await axios.put(`/api/meuperfil/usuario/usuario`, dadosTratados);
    } catch (error: any) {
      return toast.error(error.message);
    }

    // Lógica para editar o usuário
    toast.success("Dados atualizados com sucesso!");

    setIsEditable(false);
  };

  // Função para lidar com a contribuição para a ONG
  const handleContribuir = () => {
    try {
      const response = axios.post(`/api/solicitar/servicorice`, user);
    } catch (error: any) {
      return toast.error(error.message);
    }
    // Lógica para contribuir com a ONG
    toast.success("Contribuição realizada com sucesso!");
  };

  const handleBlurCep = async (cep: string) => {
    const cpfLimpo = cep.replace(/\D/g, "");
    if (cpfLimpo.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCEP(cpfLimpo);
        if (endereco.erro) return toast.error("CEP não encontrado!");
        setUser((prevUser) => ({ ...prevUser, Endereco: endereco.logradouro, Bairro: endereco.bairro, Cidade: endereco.localidade, Estado: endereco.uf }));
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      return toast.error("CEP inválido!");
    }
  };

  // Função genérica para atualizar o estado do usuário
  const handleInputChange = (propName: keyof User, value: string) => {
    setUser((prevUser) => ({ ...prevUser, [propName]: value }));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className={`${styles.CardDadosCliente}`}>
        <h2 className="text-xl font-semibold mb-4 text-center">Meu Perfil</h2>
        <div className={styles.DadosColunas}>
          <input type="text" value={user.Cliente} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Cliente: e.target.value }))} className={styles.Input} />
          <input type="email" value={user.EMail} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, EMail: e.target.value }))} />
          <InputMask
            mask="999.999.999-99"
            type="text"
            value={user.CPF ? user.CPF : user.CGC}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, CPF: e.target.value }))}
            onBlur={(e) => {
              try {
                validarCPF(e.target.value);
              } catch (error: any) {
                toast.error(error.message);
              }
            }}
          />
          {/* Repetir para os outros campos... */}
          <InputMask
            mask="99999-999"
            type="text"
            value={user.Cep}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Cep: e.target.value }))}
            onBlur={(e) => handleBlurCep(e.target.value)}
          />
          <input type="text" value={user.Endereco} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Endereco: e.target.value }))} />
          <input type="text" value={user.Numero} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Numero: e.target.value }))} />
          {/* Repetir para os outros campos... */}
          <input type="text" value={user.Bairro} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Bairro: e.target.value }))} />
          <input type="text" value={user.Cidade} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Cidade: e.target.value }))} />
          <InputMask
            mask="aa"
            placeholder="UF"
            maskChar={null}
            type="text"
            value={user.Estado}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Estado: e.target.value }))}
          />
          {/* Repetir para os outros campos... */}
          <InputMask mask={"(99) 99999-9999"} type="text" value={user.Tel} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Tel: e.target.value }))} />
        </div>
        <div className={styles.ButtonContainer}>
          {isEditable ? (
            <button onClick={handleEdit} className={styles.Button}>
              <FaSave className={styles.iconButton} />
              Salvar Alterações
            </button>
          ) : (
            <button onClick={() => setIsEditable(!isEditable)} className={styles.Button}>
              <FaPencilAlt className={styles.iconButton} /> {isEditable ? "Salvar Alterações" : "Editar Dados"}
            </button>
          )}
        </div>
      </div>

      {/* Segundo Segmento */}
      <button className="btn-ong bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center" onClick={handleContribuir}>
        <FaHeart className="mr-2" /> Contribuir com a ONG
      </button>

      {/* Terceiro Segmento */}
      <div className="card">
        <h2>Tabela de Dados</h2>
        {/* Tabela de dados aqui */}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  if (session.user?.segmento !== "Consumidor") {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user: User = await db("clientes").where("email", session.user?.email).first();

  return {
    props: {
      user: JSON.stringify(user),
    },
  };
}

export default ClientePage;
