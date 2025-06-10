import AuthButton from "../auth/AuthButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const handleEditorAccess = () => {
    if (isAuthenticated) {
      navigate("/editor");
    } else {
      loginWithRedirect({
        appState: { returnTo: "/editor" },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ minHeight: "100vh" }}>
      <div className="flex-1 flex items-center justify-center bg-gray-50 bg-opacity-80">
        <main className="flex-1 flex flex-col items-start justify-center p-12 text-left">
          <h6 className="text-lg mb-6 max-w-xl">
            Plataforma de cuestionarios y práctica interactiva en HTML, CSS y
            JavaScript.
          </h6>
          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/quiz")}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Iniciar test
                </button>
                <button
                  onClick={handleEditorAccess}
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition"
                >
                  Probar editor
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/quiz")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Empezar sin cuenta
              </button>
            )}
          </div>
        </main>
        <div className="hidden md:flex flex-1 items-center justify-center h-full">
          <img
            src="/logo.png"
            alt="Fondo"
            className="max-h-[400px] w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
