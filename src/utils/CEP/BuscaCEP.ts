import axios from "axios";

export default async function buscarEnderecoPorCEP(cep: string): Promise<any> {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    throw error;
  }
}
