import React, { useState } from "react";
import ClienteCadastro from "./cliente/ClienteCadastro";
import RestauranteCadastro from "./restaurante/RestauranteCadastro";

const CadastroPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Cadastro</h1>
        <div className="flex mb-4 justify-center">
          <div className="mr-4">
            <input type="radio" id="cliente" name="cadastroOption" value="cliente" checked={selectedOption === "cliente"} onChange={() => handleOptionChange("cliente")} />
            <label htmlFor="cliente" className="ml-2">
              Cliente
            </label>
          </div>
          <div>
            <input type="radio" id="restaurante" name="cadastroOption" value="restaurante" checked={selectedOption === "restaurante"} onChange={() => handleOptionChange("restaurante")} />
            <label htmlFor="restaurante" className="ml-2">
              Restaurante
            </label>
          </div>
        </div>
        {selectedOption === "cliente" && <ClienteCadastro />}
        {selectedOption === "restaurante" && <RestauranteCadastro />}
      </div>
    </div>
  );
};

export default CadastroPage;
