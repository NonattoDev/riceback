import { toast } from "react-toastify";

export default function verificarSenha(password: string) {
  // Verifica se a senha tem pelo menos 8 caracteres
  if (password.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres");
  }

  // Verifica se a senha contém pelo menos um número
  if (!/\d/.test(password)) {
    throw new Error("A senha deve ter pelo menos um número");
  }

  // Verifica se a senha contém pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) {
    throw new Error("A senha deve ter pelo menos uma letra maiúscula");
  }

  // Verifica se a senha contém pelo menos uma letra minúscula
  if (!/[a-z]/.test(password)) {
    throw new Error("A senha deve ter pelo menos uma letra minúscula");
  }

  // Verifica se a senha contém pelo menos um caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error("A senha deve ter pelo menos um caractere especial");
  }

  // Se todas as verificações passarem, a senha é válida
  return true;
}
