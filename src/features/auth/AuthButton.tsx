import { useAuth0 } from "@auth0/auth0-react";

export default function AuthButton() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return isAuthenticated ? (
    <div className="flex items-center gap-2">
      <span className="text-gray-700 font-medium">
        {user?.name || user?.email}
      </span>
      <button
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
    </div>
  ) : (
    <button
      onClick={() => loginWithRedirect()}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Iniciar sesión
    </button>
  );
}
