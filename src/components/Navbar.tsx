import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserButton from "./UserButton";

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [open, setOpen] = useState(false);

  // 👉 Se reutiliza para cerrar panel tras hacer clic
  const handleMenuClick = () => setOpen(false);

  return (
    /* -------------- NAV -------------- */
    <nav className="relative z-50 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 text-xs sm:text-xl leading-tight text-blue-900 drop-shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / brand */}
        <Link
          to="/"
          className="text-2xl md:text-4xl font-extrabold flex items-center gap-2"
          onClick={handleMenuClick} /* NEW: cierra en móvil */
        >
          <img src="/logo.png" alt="Logo" className="w-12 h-12 inline-block" />
          WebWiz Quiz
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              /* (se verá solo mientras esté abierto → animación ya existe) */
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>

        {/* -------------- PANEL HAMBURGUESA -------------- */}
        <div
          className={`
            fixed top-0 right-0 h-full w-64 p-6 flex flex-col gap-6 text-base
            bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200
            transform transition-transform duration-300 ease-out z-50
            ${open ? "translate-x-0" : "translate-x-full"}
            /* Desktop: se reintegra en el flujo */
            md:static md:translate-x-0 md:h-auto md:w-auto md:flex-row md:p-0 md:bg-transparent
          `}
        >
          {/* ---------- Botón X para cerrar (solo móvil) ---------- */}
          <button
            className="md:hidden absolute top-4 right-4 p-1 focus:outline-none"
            onClick={handleMenuClick} /* NEW */
            aria-label="Cerrar menú"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* ---------- Enlaces ---------- */}
          <Link
            to="/"
            className="hover:text-blue-300 transition"
            onClick={handleMenuClick}
          >
            Home
          </Link>

          {!isAuthenticated && (
            <Link
              to="/quiz"
              className="hover:text-blue-300 transition"
              onClick={handleMenuClick}
            >
              Iniciar Quiz
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="hover:text-blue-300 transition"
              onClick={handleMenuClick}
            >
              Dashboard
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/ranking"
              className="hover:text-blue-300 transition"
              onClick={handleMenuClick}
            >
              Ranking
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/historial"
              className="hover:text-blue-300 transition"
              onClick={handleMenuClick}
            >
              Historial
            </Link>
          )}

          {!isAuthenticated && (
            <button
              className="text-green-900 hover:text-blue-300 transition font-bold"
              onClick={() => {
                loginWithRedirect();
                handleMenuClick(); /* NEW: cierra tras login */
              }}
            >
              Iniciar sesión
            </button>
          )}

          <UserButton />
        </div>
      </div>
    </nav>
  );
}
