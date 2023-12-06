import React, { useState } from "react";
import User from "@/types/User";
import InputMask from "react-input-mask";
import buscarEnderecoPorCEP from "@/utils/CEP/BuscaCEP";
import { toast } from "react-toastify";
import validarCPF from "@/utils/CadastroCliente/validarCPF";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";

interface UsuarioProps {
  Usuario: User;
}

const ClienteDados: React.FC<UsuarioProps> = ({ Usuario }) => {
  const { data: session, status } = useSession();
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState<User>(Usuario);

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

      //Verificar se o email mudou, se mudou, forcar logout
      if (session?.user?.email !== user?.EMail) {
        toast.info("Por motivos de segurança, você será deslogado!");
        signOut();
      }
    } catch (error: any) {
      return toast.error(error.message);
    }

    // Lógica para editar o usuário
    toast.success("Dados atualizados com sucesso!");

    setIsEditable(false);
  };

  const handleBlurCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCEP(cepLimpo);
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
    <div className="p-4 bg-base-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coluna 1*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Cliente</span>
          </label>
          <input type="text" className="input input-bordered w-full" value={user?.Cliente} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Cliente: e.target.value }))} />
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" className="input input-bordered w-full" value={user?.EMail} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, EMail: e.target.value }))} />
          <label className="label">
            <span className="label-text">CPF</span>
          </label>
          <InputMask
            mask="999.999.999-99"
            className="input input-bordered w-full"
            type="text"
            value={user.CPF}
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
          <label className="label">
            <span className="label-text">Bairro</span>
          </label>
          <input type="text" className="input input-bordered w-full" value={user?.Bairro} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Bairro: e.target.value }))} />
          <label className="label">
            <span className="label-text">Cidade</span>
          </label>
          <input type="text" className="input input-bordered w-full" value={user?.Cidade} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Cidade: e.target.value }))} />
        </div>
        {/* Coluna 2*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text">CEP</span>
          </label>
          <InputMask
            mask="99999-999"
            className="input input-bordered w-full"
            type="text"
            value={user?.Cep}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Cep: e.target.value }))}
            onBlur={(e) => handleBlurCep(e.target.value)}
          />
          <label className="label">
            <span className="label-text">Endereço</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={user?.Endereco}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Endereco: e.target.value }))}
          />
          <label className="label">
            <span className="label-text">Número</span>
          </label>
          <input type="text" className="input input-bordered w-full" value={user?.Numero} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Numero: e.target.value }))} />
          <label className="label">
            <span className="label-text">Estado</span>
          </label>
          <InputMask
            mask="aa"
            className="input input-bordered w-full"
            placeholder="UF"
            maskChar={null}
            type="text"
            value={user?.Estado}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Estado: e.target.value }))}
          />
          <label className="label">
            <span className="label-text">Telefone</span>
          </label>
          <InputMask
            mask={"(99) 99999-9999"}
            className="input input-bordered w-full"
            type="text"
            value={user?.Tel}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Tel: e.target.value }))}
          />
          <label className="label">
            <span className="label-text">Senha</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="password"
            value={user?.Chave}
            disabled={!isEditable}
            onChange={(e) => setUser((prevUser) => ({ ...prevUser, Chave: e.target.value }))}
            maxLength={10}
          />
        </div>
      </div>
      <div className="mt-4">
        {isEditable ? (
          <button className="btn btn-success" onClick={handleEdit}>
            <FaSave /> Salvar Alterações
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setIsEditable(!isEditable)}>
            <FaPencilAlt /> Editar
          </button>
        )}
      </div>
    </div>
  );
};

export default ClienteDados;
