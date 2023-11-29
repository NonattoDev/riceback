import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";

const LoginPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      if (session?.user?.admin) {
        router.push("/usuarios/admin");
      } else if (session?.user?.seguimento === "Restaurante") {
        router.push("/usuarios/restaurante");
      } else if (session?.user?.seguimento === "Consumidor") {
        router.push("/usuarios/cliente");
      }
    }
  }, [session, router, status]);

  const handleLogin = async () => {
    if (!login || !password) return toast.warn("Preencha todos os campos");

    const result = await signIn("credentials", {
      redirect: false,
      login: login,
      senha: password,
    });

    if (result?.error) {
      return toast.error(result.error);
    } else {
      toast.success("Login realizado com sucesso");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Faça login</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="login" className="block mb-2 font-medium">
              Email ou Usuário
            </label>
            <input type="text" id="login" className="w-full border border-gray-300 rounded px-3 py-2" value={login} onChange={(e) => setLogin(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              Digite sua senha
            </label>
            <input type="password" id="password" className="w-full border border-gray-300 rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="button" className="bg-blue-500 text-white rounded px-4 py-2" onClick={handleLogin}>
              Login
            </button>
            <Link href={`/auth/cadastro`}>Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
