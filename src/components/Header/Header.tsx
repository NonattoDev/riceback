// Header.tsx
import React from "react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../../public/logo.png";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="navbar bg-base-100 z-50 relative">
        <span className="loading loading-ring loading-md"></span>
      </div>
    );

  return (
    <div className="navbar bg-base-100 z-50 relative">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link href={`/`}>Página Inicial</Link>
            </li>
            <li>
              <Link href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_RECEIVER}`}>Contato</Link>
            </li>
            <li>
              <Link href={"/sobre"}>Sobre</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center flex items-center">
        <Link href={`/`} style={{ margin: "-15px" }}>
          <Image src={logo} alt="Riceback" width={80} height={80} />
        </Link>
      </div>
      <div className="navbar-end">
        <label className="cursor-pointer grid place-items-center mr-4 ">
          <input type="checkbox" value="synthwave" className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2" />
          <svg
            className="col-start-1 row-start-1 stroke-base-100 fill-base-100"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <svg
            className="col-start-2 row-start-1 stroke-base-100 fill-base-100"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
        {status === "authenticated" && (
          <button onClick={() => signOut()}>
            <FaSignOutAlt size={20} className="mr-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
