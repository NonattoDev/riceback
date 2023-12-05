import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { CNPJ } = req.query;

    try {
      const { data } = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${CNPJ}`);
      return res.status(200).json(data);
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({ error: "CNPJ não encontrado" });
    }
  }
}
