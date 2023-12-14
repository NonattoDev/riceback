import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PasswordResetModal from "./Components/RecuperarSenha";

const LoginPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      if (session?.user?.admin) {
        router.push("/usuarios/administrador");
      } else if (session?.user?.segmento === "Restaurante") {
        router.push("/usuarios/restaurante");
      } else if (session?.user?.segmento === "Consumidor") {
        router.push("/usuarios/consumidor");
      }
    }
  }, [session, router, status]);

  const handleLogin = async () => {
    if (!login || !password) return toast.warn("Preencha todos os campos");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      login: login,
      senha: password,
    });

    if (result?.error) {
      setLoading(false);
      if (result?.error === "Por favor confirme a sua conta no seu email!") return toast.info(result?.error);

      return toast.error(result?.error);
    } else {
      toast.success("Login realizado com sucesso");
      return;
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Faça login</h2>
            <form>
              <div className="form-control">
                <label className="label" htmlFor="login">
                  <span className="label-text">Email</span>
                </label>
                <input type="text" id="login" className="input input-bordered" value={login} onChange={(e) => setLogin(e.target.value)} />
              </div>
              <div className="form-control mt-4">
                <label className="label" htmlFor="password">
                  <span className="label-text">Digite sua senha</span>
                </label>
                <input type="password" id="password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-control mt-6">
                {loading ? (
                  <button type="button" className="btn btn-primary" disabled>
                    <span className="loading loading-ring loading-md"></span>
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={handleLogin}>
                    Login
                  </button>
                )}
              </div>
            </form>
            <div className="flex justify-center mt-4 gap-4">
              <Link className="link link-primary" href={`/auth/cadastro`}>
                Criar conta
              </Link>
              <p className="link link-primary" onClick={openModal}>
                Esqueci minha senha
              </p>
            </div>
          </div>
        </div>
      </div>
      <PasswordResetModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default LoginPage;
