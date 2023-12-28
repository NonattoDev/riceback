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

const AdminDados: React.FC<UsuarioProps> = ({ Usuario }) => {
  const { data: session, status } = useSession();
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState<User>(Usuario);

  // Função para lidar com a edição do usuário
  const handleEdit = async () => {
    // Verificar se algum campo está vazio

    if (!user?.Usuario || !user?.Senha || !user?.Email) return toast.error("Preencha todos os campos!");

    try {
      const response = await axios.put(`/api/meuperfil/usuario/usuario`, user);

      //Verificar se o email mudou, se mudou, forcar logout
      if (session?.user?.name !== user?.Usuario) {
        toast.info("Por motivos de segurança, você será deslogado!");
        signOut();
        return;
      }
    } catch (error: any) {
      return toast.error(error.message);
    }

    // Lógica para editar o usuário
    toast.success("Dados atualizados com sucesso!");

    setIsEditable(false);
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
            <span className="label-text">Usuário</span>
          </label>
          <input type="text" className="input input-bordered w-full" value={user?.Usuario} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Usuario: e.target.value }))} />
          <label className="label">
            <span className="label-text">Senha</span>
          </label>
          <input type="password" className="input input-bordered w-full" value={user?.Senha} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Senha: e.target.value }))} />
          <div className="label">
            <span className="label-text-alt">A senha deve conter pelo menos 1 letra maiúscula e 1 caractere especial</span>
          </div>
        </div>
        {/* Coluna 2*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" className="input input-bordered w-full" value={user?.Email} disabled={!isEditable} onChange={(e) => setUser((prevUser) => ({ ...prevUser, Email: e.target.value }))} />
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

export default AdminDados;
