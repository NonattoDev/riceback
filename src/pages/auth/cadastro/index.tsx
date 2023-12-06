import React, { useState } from "react";
import ClienteCadastro from "./cliente/ClienteCadastro";
import RestauranteCadastro from "./restaurante/RestauranteCadastro";

const CadastroPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card bordered">
        <div className="card-body">
          <div className="flex justify-center">
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="cadastroOption" className="radio radio-primary" value="cliente" checked={selectedOption === "cliente"} onChange={() => handleOptionChange("cliente")} />
                <span className="label-text ml-2">Cliente</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="cadastroOption"
                  className="radio radio-primary"
                  value="restaurante"
                  checked={selectedOption === "restaurante"}
                  onChange={() => handleOptionChange("restaurante")}
                />
                <span className="label-text ml-2">Restaurante</span>
              </label>
            </div>
          </div>
          {selectedOption === "cliente" && <ClienteCadastro />}
          {selectedOption === "restaurante" && <RestauranteCadastro />}
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;
