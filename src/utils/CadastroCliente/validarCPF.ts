function validarCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) {
    throw new Error("O CPF deve ter 11 dígitos");
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(9, 10))) {
    throw new Error("O CPF é inválido");
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(10, 11))) {
    throw new Error("O CPF é inválido");
  }

  return true;
}

export default validarCPF;
