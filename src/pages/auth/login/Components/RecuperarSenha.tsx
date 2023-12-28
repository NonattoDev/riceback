import verificarSenha from "@/utils/CadastroCliente/verificarSenha";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const PasswordResetModal: React.FC<Props> = ({ isOpen, closeModal }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async () => {
    if (!email) return toast.warn("Preencha o campo de e-mail");
    if (!email.includes("@")) return toast.warn("Preencha um e-mail válido");

    // Lógica de envio de código para o e-mail
    try {
      const response = await axios.post("/api/usuarios/recuperarsenha/email", { email });
      toast.success("Código enviado para o e-mail cadastrado");
    } catch (error: any) {
      return toast.error(error.response.data.message);
    }

    setStep(2);
  };

  const handleCodeConfirmation = async () => {
    if (!code) return toast.warn("Preencha o campo de código");
    // Validar Código no backend
    try {
      const response = await axios.post("/api/usuarios/recuperarsenha/email", { email, code });
      toast.success(response.data.message);
      setStep(3);
    } catch (error: any) {
      if (error.response.data.message === "Token expirado") {
        setStep(1);
        resetStates();
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.response.data.message);
      return;
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      return toast.warn("As senhas não coincidem");
    }
    try {
      verificarSenha(newPassword);
    } catch (error: any) {
      return toast.warn(error.message);
    }

    try {
      const response = await axios.post("/api/usuarios/recuperarsenha/email", { email, code, newPassword });
      toast.success("Senha alterada com sucesso");
      closeModal();
      resetStates();
    } catch (error: any) {
      return toast.error(error.response.data.message);
    }
  };

  const resetStates = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        {step === 1 && (
          <>
            <h3 className="font-bold text-lg">Recuperação de Senha</h3>
            <p className="py-4">Insira seu e-mail para recuperar a senha.</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="modal-action">
                <button className="btn btn-primary" onClick={handleEmailSubmit}>
                  Enviar
                </button>
                <button className="btn" onClick={closeModal}>
                  Fechar
                </button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="font-bold text-lg">Confirmação de Código</h3>
            <p className="py-4">Digite o código enviado para seu e-mail.</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Código</span>
              </label>
              <input type="text" className="input input-bordered" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleCodeConfirmation}>
                Confirmar
              </button>
              <button className="btn" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h3 className="font-bold text-lg">Defina Nova Senha</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nova Senha</span>
              </label>
              <input type="password" className="input input-bordered" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <div className="label">
                <span className="label-text-alt">A senha deve conter pelo menos 1 letra maiúscula e 1 caractere especial</span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirme a Senha</span>
              </label>
              <input type="password" className="input input-bordered" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handlePasswordUpdate}>
                Atualizar Senha
              </button>
              <button className="btn" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
