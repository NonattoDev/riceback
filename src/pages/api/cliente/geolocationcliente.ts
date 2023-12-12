import db from "@/db/db";
import { calcularDistancia } from "@/utils/Havershine/havershine";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { latitude, longitude } = req.body;
    // Verificar os restaurantes que estão no perimetro do cliente
    try {
      const restaurantes = await db("clientes")
        .select(
          "clientes.CodCli",
          "clientes.Cliente",
          "clientes.CodPro1",
          "clientes.Preco as ValorProduto1",
          "clientes.Percentual as PercentualProduto1",
          "clientes.CodPro2",
          "clientes.Preco2 as ValorProduto2",
          "clientes.Percentual2 as PercentualProduto2",
          "clientes.CodPro3",
          "clientes.Preco3 as ValorProduto3",
          "clientes.Percentual3 as PercentualProduto3",
          "clientes.CodPro4",
          "clientes.Preco4 as ValorProduto4",
          "clientes.Percentual4 as PercentualProduto4",
          "clientes.CodPro5",
          "clientes.Preco5 as ValorProduto5",
          "clientes.Percentual5 as PercentualProduto5",
          "clientes.Latitude",
          "clientes.Longitude",
          "produto.Produto as Produto1"
        )
        .leftJoin("Produto as produto", "clientes.CodPro1", "produto.CodPro")
        .whereNotNull("clientes.Latitude");

      const restaurantesProximos = restaurantes.filter((restaurante) => {
        const distancia = calcularDistancia(latitude, longitude, restaurante.Latitude, restaurante.Longitude);
        return distancia <= 0.05; // Supondo que você quer verificar dentro de 50 metros, que é aproximadamente 0.05 km.
      });

      return res.status(200).json(restaurantesProximos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar restaurantes próximos" });
    }
  }
}
