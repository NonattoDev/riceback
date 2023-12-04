import axios from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { FaLeaf, FaUtensils } from "react-icons/fa";
import { useState } from "react";
import moment from "moment";

// Defina uma interface para as props
interface ContribuicoesProps {
  CodCli: number | undefined;
}

interface Contribuicao {
  Lanc: number;
  CodPro: number;
  Data: Date;
  Hora: string;
  CodFor: number;
  CodCli: number;
  NomeRestaurante: string;
  Transito?: string;
}

const fetchContribuicoes = async (CodCli: number, page: number) => {
  try {
    const { data } = await axios.get(`/api/cliente/contribuicoes/${CodCli}?page=${page}&limit=${10}`);
    return data;
  } catch (error) {
    toast.error("Erro ao carregar contribuições");
  }
};

const Contribuicoes: React.FC<ContribuicoesProps> = ({ CodCli }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: response,
    isLoading,
    error,
  } = useQuery(["contribuicoes", CodCli ?? 0, currentPage], () => fetchContribuicoes(CodCli ?? 0, currentPage), {
    enabled: !!CodCli,
    refetchInterval: 10000,
  });

  const contribuicoes: Contribuicao[] = response?.contribuicoes;
  const total = response?.total;
  const totalPages = Math.ceil(total / 10); // Substitua 10 pelo limite de itens por página, se diferente

  if (isLoading) return <span className="loading loading-ring loading-md"></span>;
  if (error) return <div>Erro ao carregar contribuições</div>;

  return (
    <div className="p-4 bg-base-200 rounded-lg shadow mt-5">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-300 text-base-content">
            <th>ID</th>
            <th>Restaurante</th>
            <th>Data</th>
            <th>Produto</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          {contribuicoes?.map((contribuicao) => (
            <tr key={contribuicao.Lanc} className={contribuicao.Transito ? "bg-orange-500" : ""}>
              <td>{contribuicao.Lanc}</td>
              <td>{contribuicao.NomeRestaurante}</td>
              <td>{moment(contribuicao.Data).format("DD/MM/YY")}</td>
              <td>
                {contribuicao.CodPro === 1 ? (
                  <span className="flex items-center gap-2">
                    <FaLeaf className="text-green-500" />
                    Arroz Social
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaUtensils className="text-blue-500" />
                    Outro Produto
                  </span>
                )}
              </td>
              <td>{contribuicao.Transito}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <div className="flex justify-between mt-4">
            <div className="btn-group">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn">
                «
              </button>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="btn">
                »
              </button>
            </div>
          </div>
        </tfoot>
      </table>
    </div>
  );
};

export default Contribuicoes;
