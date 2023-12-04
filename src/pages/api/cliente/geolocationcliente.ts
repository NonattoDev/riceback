import db from "@/db/db";
import { calcularDistancia } from "@/utils/Havershine/havershine";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { latitude, longitude } = req.body;
    // Verificar os restaurantes que estão no perimetro do cliente
    try {
      const restaurantes = await db("clientes").select("CodCli", "Cliente", "Latitude", "Longitude").whereNotNull("Latitude").whereNotNull("Longitude");

      const restaurantesProximos = restaurantes.filter((restaurante) => {
        const distancia = calcularDistancia(latitude, longitude, restaurante.Latitude, restaurante.Longitude);
        return distancia <= 0.05; // Supondo que você quer verificar dentro de 50 metros, que é aproximadamente 0.02 km.
      });

      return res.status(200).json(restaurantesProximos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar restaurantes próximos" });
    }
  }
}
