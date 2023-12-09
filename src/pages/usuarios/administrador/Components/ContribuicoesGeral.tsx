import axios from "axios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { FaBoxOpen, FaExclamationTriangle, FaLeaf, FaUtensils } from "react-icons/fa";
import { useState } from "react";
import moment from "moment";
import { FaSearch } from "react-icons/fa";

interface Contribuicao {
  Lanc: number;
  CodPro: number;
  Data: Date;
  Hora: string;
  CodFor: number;
  CodCli: number;
  NomeRestaurante: string;
  NomeCliente: string;
  Transito?: string;
}

const ContribuicoesGeral: React.FC = () => {
  // Estados para os filtros
  const [filterCliente, setFilterCliente] = useState("");
  const [filterRestaurante, setFilterRestaurante] = useState("");
  const [filterData, setFilterData] = useState("");
  const [filterProduto, setFilterProduto] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitoModalOpen, setIsTransitoModalOpen] = useState(false);
  const [transitoText, setTransitoText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lancamentoId, setLancamentoId] = useState<number | null>(null);
  const {
    data: response,
    isLoading,
    error,
  } = useQuery(["contribuicoes", currentPage], () => fetchContribuicoes(currentPage), {
    refetchInterval: 5000,
  });
  const [contestacao, setContestacao] = useState("");
  const contribuicoes: Contribuicao[] = response?.contribuicoes;
  const total = response?.total;
  const totalPages = Math.ceil(total / 10); // Substitua 10 pelo limite de itens por página.

  const fetchContribuicoes = async (page: number) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      cliente: filterCliente,
      restaurante: filterRestaurante,
      data: filterData,
      produto: filterProduto,
    });
    try {
      const { data } = await axios.get(`/api/admin/contribuicoes/contribuicoes/?${query.toString()}`);
      return data;
    } catch (error) {
      toast.error("Erro ao carregar contribuições");
    }
  };

  if (isLoading) return <span className="loading loading-ring loading-md m-5"></span>;
  if (error) return <div>Erro ao carregar contribuições</div>;

  const handleOpenTransitoModal = (transitoText: string | undefined) => {
    if (!transitoText) return toast.info("Erro ao carregar transito");
    setTransitoText(transitoText);
    setIsTransitoModalOpen(true);
  };

  const handleContestar = (lancId: number) => {
    setLancamentoId(lancId);
    setIsModalOpen(true);
  };

  const handleConfirmarContestacao = async () => {
    setIsModalOpen(false);
    try {
      const response = await axios.put(`/api/restaurante/contestar/${lancamentoId}`, { contestacao });
      toast.success("Pagamento contestado com sucesso");
      return;
    } catch (error) {
      toast.error("Erro ao contestar pagamento");
      return;
    }
  };

  return (
    <div className="overflow-x-auto w-full my-2.5">
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Contestar Pagamento ID: {lancamentoId}</h3>
            <textarea className="textarea textarea-bordered w-full mt-4" placeholder="Motivo da contestação" value={contestacao} onChange={(e) => setContestacao(e.target.value)} />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleConfirmarContestacao}>
                Confirmar
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
      {/* Filtros do ADM */}
      <div className="flex flex-wrap gap-4 m-5">
        <input type="text" placeholder="Cliente" value={filterCliente} onChange={(e) => setFilterCliente(e.target.value)} className="input input-bordered w-full max-w-xs" />
        <input type="text" placeholder="Restaurante" value={filterRestaurante} onChange={(e) => setFilterRestaurante(e.target.value)} className="input input-bordered w-full max-w-xs" />
        <input type="date" placeholder="Data" value={filterData} onChange={(e) => setFilterData(e.target.value)} className="input input-bordered w-full max-w-xs" />
        <select value={filterProduto} onChange={(e) => setFilterProduto(e.target.value)} className="select select-bordered w-full max-w-xs">
          <option value="">Todos os Produtos</option>
          <option value={1}>Arroz Social</option>
          {/* Adicione mais opções conforme necessário */}
        </select>

        {/* Botão para aplicar filtros */}
        <button onClick={() => setCurrentPage(1)} className="btn btn-square btn-ghost">
          <FaSearch />
        </button>
      </div>

      <table className="table w-full overflow-x-auto">
        <thead>
          <tr className="bg-base-300 text-base-content">
            <th className="text-center align-middle">ID</th>
            <th className="text-center align-middle">Restaurante</th>
            <th className="text-center align-middle">Cliente</th>
            <th className="text-center align-middle">Data</th>
            <th className="text-center align-middle">Hora</th>
            <th className="text-center align-middle">Produto</th>
            <th className="text-center align-middle">Valor</th>
            <th className="text-center align-middle">Observação</th>
            <th className="text-center align-middle">Ações</th>
          </tr>
        </thead>
        {/* Corpo da Tabela */}
        <tbody>
          {contribuicoes?.map((contribuicao) => (
            <tr key={contribuicao.Lanc} className={`align-middle ${contribuicao.Transito ? "bg-warning" : ""}`}>
              <td className="text-center align-middle">{contribuicao.Lanc}</td>
              <td className="text-center align-middle">{contribuicao.NomeRestaurante}</td>
              <td className="text-center align-middle">{contribuicao.NomeCliente}</td>
              <td className="text-center align-middle">{moment.utc(contribuicao.Data).format("DD/MM/YY")}</td>
              <td className="text-center align-middle">{moment(contribuicao.Hora, "HH:mm").format("HH:mm")}</td>
              {contribuicao.CodPro === 1 ? (
                <td className="text-center align-middle">Arroz Social</td>
              ) : (
                <td className="flex items-center gap-2">
                  <FaUtensils className="text-primary" />
                  Outro Produto
                </td>
              )}
              <td className="text-center align-middle">10,00</td>

              <td className="text-center align-middle">
                {contribuicao.Transito && contribuicao.Transito !== "" && (
                  <button>
                    <FaBoxOpen cursor="pointer" onClick={() => handleOpenTransitoModal(contribuicao.Transito)} />
                  </button>
                )}
              </td>

              <td className="flex justify-center items-center">
                <button>
                  <FaExclamationTriangle className="cursor-pointer" onClick={() => handleContestar(contribuicao.Lanc)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
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
