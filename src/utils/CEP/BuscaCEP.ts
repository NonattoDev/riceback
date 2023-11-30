import axios from "axios";

export default async function buscarEnderecoPorCEP(cep: string): Promise<any> {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar endereço");
  }
}
