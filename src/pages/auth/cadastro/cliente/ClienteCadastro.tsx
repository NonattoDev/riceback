import React, { useState } from "react";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import validarCPF from "@/utils/CadastroCliente/validarCPF";
import verificarSenha from "@/utils/CadastroCliente/verificarSenha";
import buscarEnderecoPorCEP from "@/utils/CEP/BuscaCEP";
import axios from "axios";
import { useRouter } from "next/router";
const ClienteCadastro: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    dataNascimento: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (Object.values(formData).some((value) => !value)) {
      setLoading(false);
      return toast.warn("Preencha todos os campos");
    }
    try {
      validarCPF(formData.cpf);
      verificarSenha(formData.senha);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message);
      return;
    }

    try {
      // Inserindo usuario no banco de dados
      const { data } = await axios.post("/api/cadastro/usuario", formData);
      console.log(data);
    } catch (error: any) {
      setLoading(false);
      return toast.error(error?.response.data.message);
    }

    setFormData({
      cpf: "",
      nome: "",
      dataNascimento: "",
      numero: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      email: "",
      senha: "",
    });
    setLoading(false);
    toast.success("Cadastro realizado com sucesso");
    return router.push("/auth/login");
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/[^0-9]/g, ""); // Remove caracteres não numéricos
    if (cep.length === 8) {
      try {
        const endereco = await buscarEnderecoPorCEP(cep);
        setFormData({
          ...formData,
          endereco: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          estado: endereco.uf,
        });
      } catch (error) {
        toast.error("Erro ao buscar endereço. Verifique o CEP.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4 text-center">Cadastro de Cliente</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <InputMask mask="999999999-99" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" maxLength={10} max={10} />
        </div>

        <div>
          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input type="date" name="dataNascimento" id="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
            CEP
          </label>
          <InputMask
            mask="99999-999"
            name="cep"
            id="cep"
            value={formData.cep}
            onChange={handleChange}
            onBlur={handleCepBlur} // Adiciona o evento onBlur
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
            Bairro
          </label>
          <input type="text" name="bairro" id="bairro" value={formData.bairro} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <input type="text" name="estado" id="estado" value={formData.estado} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <input type="text" name="numero" id="numero" value={formData.numero} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <InputMask mask="(99)99999-9999" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
        </div>

        {loading ? (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2 flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </button>
        ) : (
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2">
            Cadastrar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClienteCadastro;
