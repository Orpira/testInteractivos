import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserButton from "./UserButton";
import { ArrowRight } from "lucide-react";

/* ——— helpers ——— */
const desktopLink =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-indigo-500 after:transition-all text-xl hover:after:w-full";
const desktopDashboard =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-indigo-500 after:transition-all text-xl hover:after:w-full font-semibold text-indigo-600 dark:text-indigo-400";
const mobileLink = "text-slate-100 hover:text-indigo-300 transition";
const mobileDashboard = "text-slate-100 hover:text-indigo-300 transition";

export default function Navbar() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    /* ---------- NAV ---------- */
    <nav
      className="
        sticky top-0 z-50 w-full
        bg-gradient-to-r from-white/70 via-white/60 to-white/30
        dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/60
        backdrop-blur-md ring-1 ring-slate-900/5 dark:ring-slate-50/10
        shadow-md transition-colors
      "
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* ---------- LOGO ---------- */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-lg sm:text-2xl text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          onClick={close}
        >
          <img src="/logo.png" alt="Logo" className="w-24 h-24" />
          WebWiz&nbsp;Quiz
        </Link>

        {/* ---------- LINKS DESKTOP ---------- */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
          <li>
            <Link to="/" className={desktopLink}>
              Inicio
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li></li>
              <li>
                <Link to="/dashboard" className={desktopDashboard}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/historial" className={desktopLink}>
                  Historial
                </Link>
              </li>
              <li>
                <Link to="/ranking" className={desktopLink}>
                  Ranking
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/contacto" className={desktopLink}>
              Contactenos
            </Link>
          </li>
        </ul>

        {/* ---------- CTA DESKTOP ---------- */}
        {!isAuthenticated && (
          <button
            onClick={() => loginWithRedirect()}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition"
          >
            Iniciar&nbsp;sesión
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {isAuthenticated && (
          <div className="hidden md:inline-flex">
            <UserButton />
          </div>
        )}

        {/* ---------- HAMBURGER ---------- */}
        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-700 dark:text-slate-200"
        >
          {open ? (
            <svg
              className="w-7 h-7"
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
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ---------- PANEL MOBILE ---------- */}
      {open && (
        <nav
          aria-label="Menú móvil" // Texto accesible para el contenedor
          data-testid="mobile-nav" // Identificador para pruebas
          className="md:hidden absolute top-full left-0 w-full z-40 bg-slate-800/95 dark:bg-slate-950 backdrop-blur-md shadow-xl"
        >
          <button
            aria-label="Cerrar menú" // Texto accesible para el botón
            onClick={() => setOpen(false)}
            className="p-2 text-white hover:text-gray-300"
          >
            Cerrar
          </button>
          <div className="flex flex-col items-center gap-4 py-6">
            {/* enlaces */}
            <Link to="/" onClick={close} className={mobileLink}>
              Inicio
            </Link>
            <Link to="/contacto" onClick={close} className={mobileLink}>
              Contactenos
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  onClick={close}
                  className={mobileDashboard}
                >
                  Dashboard
                </Link>
                <Link to="/historial" onClick={close} className={mobileLink}>
                  Historial
                </Link>
                <Link to="/ranking" onClick={close} className={mobileLink}>
                  Ranking
                </Link>
              </>
            )}

            {/* CTA / User */}
            {isAuthenticated ? (
              <div className="mt-auto">
                <UserButton />
              </div>
            ) : (
              <button
                onClick={() => {
                  loginWithRedirect();
                  close();
                }}
                className="mt-auto px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </nav>
      )}
    </nav>
  );
}
