import React, { useEffect, useState } from "react";
import User from "@/types/User";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

interface UsuarioProps {
  Usuario: User;
}

const Contribuir: React.FC<UsuarioProps> = ({ Usuario }) => {
  const [user, setUser] = useState<User>(Usuario);
  const [restaurantesProximos, setRestaurantesProximos] = useState<User[]>([]); // Estado para armazenar os restaurantes próximos
  const [restauranteSelecionado, setRestauranteSelecionado] = useState(""); // Estado para armazenar o restaurante selecionado
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.post(`/api/cliente/geolocationcliente`, { latitude, longitude });
            setRestaurantesProximos(response.data); // Armazenando os restaurantes próximos no estado
          } catch (error: any) {
            toast.error("Erro ao obter restaurantes próximos: " + error.message);
          }
        },
        (error) => {
          toast.error("Erro ao obter localização: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocalização não é suportada por este navegador.");
    }
  }, []);

  // Função para lidar com o pedido social
  const handleContribuir = async () => {
    if (!restauranteSelecionado) {
      return toast.error("Selecione um restaurante primeiro!");
    }

    const userData = {
      ...user,
      restauranteId: restauranteSelecionado, // Supondo que você está enviando o ID do restaurante
    };

    try {
      const response = await axios.post(`/api/solicitar/servicorice`, userData);

      if (response.status === 200) {
        setRestauranteSelecionado("");
        toast.success(`Contribuição enviada com sucesso 🎉`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <div className="form-control w-full max-w-xs m-5">
        <select value={restauranteSelecionado} onChange={(e) => setRestauranteSelecionado(e.target.value)} className="select select-bordered select-primary w-full max-w-xs">
          <option value="">Selecione um restaurante</option>
          {restaurantesProximos.map((restaurante) => (
            <option key={restaurante.CodCli} value={restaurante.CodCli}>
              {restaurante.Cliente}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary gap-2" onClick={handleContribuir}>
        <FaHeart className="text-red-500" /> Solicitar porção social
      </button>
    </>
  );
};

export default Contribuir;
