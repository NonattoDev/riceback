import React from "react";
import { FaSeedling } from "react-icons/fa"; // Exemplo de ícone, pode ser substituído por um mais adequado

const Sobre: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <FaSeedling className="text-6xl mx-auto text-green-600" />
        <h1 className="text-4xl font-bold my-4">Sobre a Riceback</h1>
      </div>
      <p className="text-lg leading-relaxed">
        A <span className="font-semibold">Riceback</span> é um aplicativo que propõe vender uma porção social de arroz em restaurantes participantes. O valor arrecadado com a venda dessa porção social
        é revertido em dinheiro para os restaurantes.
      </p>
      <p className="text-lg leading-relaxed">
        Essa abordagem visa combater o desperdício de alimentos, especificamente o desperdício de arroz, ao mesmo tempo em que apoia os restaurantes e gera impacto social.
      </p>
      <p className="text-lg leading-relaxed">É uma iniciativa interessante que busca criar um modelo de negócio sustentável e ao mesmo tempo contribuir para a comunidade.</p>
      {/* Adicione mais conteúdo conforme necessário */}
    </div>
  );
};

export default Sobre;
