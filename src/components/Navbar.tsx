import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserButton from "./UserButton";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="w-full shadow px-4 md:px-6 py-3"
      style={{ backgroundColor: "#f5f6fa" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl text-blue-700">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-24 h-24 inline-block"
              />
              <p className="text-2xl font-bold text-blue-700 ml-2 font-mono">
                WebWiz Quiz
              </p>
            </div>
          </Link>
        </div>
        {/* Botón hamburguesa siempre visible en móvil */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/historial" className="text-gray-700 hover:text-blue-700">
              Historial
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/ranking" className="text-gray-700 hover:text-blue-700">
              Ranking
            </Link>
          )}
          {isAuthenticated && user && (
            <span className="text-gray-700 font-medium truncate max-w-[120px]">
              {user.name || user.email}
            </span>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => loginWithRedirect()}
              className="p-2 text-green-600 hover:bg-green-50 hover:shadow-lg transition flex items-center bg-transparent border-none outline-none"
              style={{ boxShadow: "0 2px 8px 0 rgba(22,163,74,0.10)" }}
              title="Iniciar sesión"
            >
              {/* Icono de entrada verde */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="w-7 h-7"
                fill="none"
              >
                <g>
                  <rect
                    x="28"
                    y="8"
                    width="28"
                    height="48"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M28 32H12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <polyline
                    points="16,24 8,32 16,40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
          )}
        </div>
      </div>
      {/* Menú móvil hamburguesa para todas las opciones */}
      {open && (
        <div className="flex flex-col gap-4 mt-2 md:hidden animate-fade-in items-end pr-2">
          <Link
            to="/quiz"
            className="text-gray-700 hover:text-blue-700 w-fit"
            onClick={() => setOpen(false)}
          >
            Iniciar Test
          </Link>
          {isAuthenticated && (
            <Link
              to="/ranking"
              className="text-gray-700 hover:text-blue-700 w-fit"
              onClick={() => setOpen(false)}
            >
              Ranking
            </Link>
          )}
          {isAuthenticated && user && (
            <span className="text-gray-700 font-medium truncate max-w-[150px] w-fit">
              {user.name || user.email}
            </span>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => {
                setOpen(false);
                loginWithRedirect();
              }}
              className="p-2 text-green-600 hover:bg-green-50 hover:shadow-lg transition flex items-center bg-transparent border-none outline-none"
              style={{ boxShadow: "0 2px 8px 0 rgba(22,163,74,0.10)" }}
              title="Iniciar sesión"
            >
              {/* Icono de entrada verde */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="w-7 h-7"
                fill="none"
              >
                <g>
                  <rect
                    x="28"
                    y="8"
                    width="28"
                    height="48"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M28 32H12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <polyline
                    points="16,24 8,32 16,40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
          )}
        </div>
      )}
      <UserButton />
    </nav>
  );
}
