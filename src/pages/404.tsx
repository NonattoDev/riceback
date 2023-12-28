import Link from "next/link";
import React from "react";

const Custom404 = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl font-medium text-gray-600">Página Não Encontrada</p>
        <p className="mt-4 text-gray-600">Oops! A página que você está procurando não existe.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
