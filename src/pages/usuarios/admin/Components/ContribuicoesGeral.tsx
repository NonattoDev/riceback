import axios from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { FaBoxOpen, FaLeaf, FaUtensils } from "react-icons/fa";
import { useState } from "react";
import moment from "moment";

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

const fetchContribuicoes = async (page: number) => {
  try {
    const { data } = await axios.get(`/api/admin/contribuicoes/contribuicoes/?page=${page}&limit=${10}`);
    return data;
  } catch (error) {
    toast.error("Erro ao carregar contribuições");
  }
};

const ContribuicoesGeral: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitoModalOpen, setIsTransitoModalOpen] = useState(false);
  const [transitoText, setTransitoText] = useState("");
  const {
    data: response,
    isLoading,
    error,
  } = useQuery(["contribuicoes", currentPage], () => fetchContribuicoes(currentPage), {
    refetchInterval: 10000,
  });

  const contribuicoes: Contribuicao[] = response?.contribuicoes;
  const total = response?.total;
  const totalPages = Math.ceil(total / 10); // Substitua 10 pelo limite de itens por página, se diferente

  if (isLoading) return <span className="loading loading-ring loading-md"></span>;
  if (error) return <div>Erro ao carregar contribuições</div>;

  const handleOpenTransitoModal = (transitoText: string | undefined) => {
    if (!transitoText) return toast.info("Erro ao carregar transito");
    setTransitoText(transitoText);
    setIsTransitoModalOpen(true);
  };

  return (
    <div className="overflow-x-auto w-full my-2.5">
      {isTransitoModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Motivo do Contestamento</h3>
            <textarea className="textarea textarea-bordered textarea-lg w-full max-w" readOnly>
              {transitoText}
            </textarea>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsTransitoModalOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      <table className="table w-full overflow-x-auto">
        <thead>
          <tr className="bg-base-300 text-base-content">
            <th>ID</th>
            <th>Restaurante</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Produto</th>
            <th>Observação</th>
          </tr>
        </thead>
        {/* Corpo da Tabela */}
        <tbody>
          {contribuicoes?.map((contribuicao) => (
            <tr key={contribuicao.Lanc} className={contribuicao.Transito ? "bg-warning" : ""}>
              <td>{contribuicao.Lanc}</td>
              <td>{contribuicao.NomeRestaurante}</td>
              <td>{moment(contribuicao.Data).format("DD/MM/YY")}</td>
              <td>{moment(contribuicao.Hora, "hh:mm").format("hh:mm")}</td>
              <td>
                {contribuicao.CodPro === 1 ? (
                  <div className="flex items-center gap-2">
                    <FaLeaf className="text-success" />
                    Arroz Social
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaUtensils className="text-primary" />
                    Outro Produto
                  </div>
                )}
              </td>
              <td>{contribuicao.Transito && contribuicao.Transito !== "" && <FaBoxOpen cursor="pointer" onClick={() => handleOpenTransitoModal(contribuicao.Transito)} />}</td>
            </tr>
          ))}
        </tbody>
        {/* Rodapé da Tabela */}
        <tfoot>
          <tr>
            <td colSpan={5}>
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
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ContribuicoesGeral;
