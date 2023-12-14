import React, { useState } from "react";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import validarCPF from "@/utils/CadastroCliente/validarCPF";
import verificarSenha from "@/utils/CadastroCliente/verificarSenha";
import buscarEnderecoPorCEP from "@/utils/CEP/BuscaCEP";
import axios from "axios";
import styles from "./ClienteCadastro.module.scss";

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

    if (
      !formData.cpf ||
      !formData.nome ||
      !formData.dataNascimento ||
      !formData.endereco ||
      !formData.numero ||
      !formData.bairro ||
      !formData.cidade ||
      !formData.estado ||
      !formData.cep ||
      !formData.telefone ||
      !formData.email ||
      !formData.senha
    ) {
      setLoading(false);
      toast.error("Preencha todos os campos");
      return;
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
    <form onSubmit={handleSubmit} className="card w-auto bg-base-100 shadow-xl p-8 rounded-lg">
      <h2 className="text-2xl mb-4 text-center">Cadastro de Cliente</h2>
      <div className={styles.FormularioResponsivo}>
        <div>
          <label htmlFor="cpf" className="label">
            <span className="label-text">CPF</span>
          </label>
          <InputMask mask="999999999-99" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="nome" className="label">
            <span className="label-text">Nome</span>
          </label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="senha" className="label">
            <span className="label-text">Senha</span>
          </label>
          <input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} className="input input-bordered" maxLength={10} max={10} />
        </div>
        <div>
          <label htmlFor="dataNascimento" className="label">
            <span className="label-text">Data de Nascimento</span>
          </label>
          <input type="date" name="dataNascimento" id="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="cep" className="label">
            <span className="label-text">CEP</span>
          </label>
          <InputMask
            mask="99999-999"
            name="cep"
            id="cep"
            value={formData.cep}
            onChange={handleChange}
            onBlur={handleCepBlur} // Adiciona o evento onBlur
            className="input input-bordered"
          />
        </div>
        <div>
          <label htmlFor="endereco" className="label">
            <span className="label-text">Endereço</span>
          </label>
          <input type="text" name="endereco" id="endereco" value={formData.endereco} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="bairro" className="label">
            <span className="label-text">Bairro</span>
          </label>
          <input type="text" name="bairro" id="bairro" value={formData.bairro} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="cidade" className="label">
            <span className="label-text">Cidade</span>
          </label>
          <input type="text" name="cidade" id="cidade" value={formData.cidade} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="estado" className="label">
            <span className="label-text">Estado</span>
          </label>
          <input type="text" name="estado" id="estado" value={formData.estado} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="numero" className="label">
            <span className="label-text">Número</span>
          </label>
          <input type="text" name="numero" id="numero" value={formData.numero} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="input input-bordered" />
        </div>
        <div>
          <label htmlFor="telefone" className="label">
            <span className="label-text">Telefone</span>
          </label>
          <InputMask mask="(99)99999-9999" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className="input input-bordered" />
        </div>
        {loading ? (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2 flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </button>
        ) : (
          <button type="submit" className="btn btn-primary col-span-2">
            Cadastrar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClienteCadastro;
