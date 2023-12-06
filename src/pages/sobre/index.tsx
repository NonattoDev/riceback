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
        A <span className="font-semibold">Riceback</span> é uma organização não governamental que tem como objetivo gerar renda através da redução do desperdício de arroz. Nossa missão é evitar o
        descarte desnecessário desse alimento essencial, transformando-o em oportunidades para aqueles que mais precisam.
      </p>
      {/* Adicione mais conteúdo conforme necessário */}
    </div>
  );
};

export default Sobre;
