import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();

  type Lang = "HTML" | "CSS" | "JavaScript";

  const handleCardClick = (category: Lang) => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    goToFirstChallenge(category);
  };

  const goToFirstChallenge = (category: Lang) => {
    // … lógica que ya tenías para localizar el reto …
    navigate(`/editor/${category.toLowerCase()}/${category.toLowerCase()}-01`);
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-brbg-gray-50 bg-opacity-80 p-4 md:p-6">
      {showAuthAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2">Bienvenido</h3>
            <p className="mb-4">
              Para acceder a los retos, debes iniciar sesión.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setShowAuthAlert(false);
                  loginWithRedirect();
                }}
              >
                Iniciar sesión
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowAuthAlert(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* hero */}
      <section className="text-center space-y-6 max-w-3xl bg-gray-200 bg-opacity-80 backdrop-blur-lg rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight text-blue-900 drop-shadow-lg">
          Domina la magía del código,
          <span className="text-green-700"> un Quiz a la vez.</span>
        </h1>
        <p className="text-lg sm:text-xl/relaxed">
          Quizzes y retos interactivos de <strong>HTML, CSS, JavaScript</strong>
          . Compila, valida y comparte tus soluciones al instante.
        </p>
        {/* Botón "¡Empieza ahora!" */}
        <button
          className="mt-16 mb-4 px-6 py-3 bg-yellow-400 text-indigo-900 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition text-lg w-full max-w-xs"
          onClick={() => {
            navigate("/quiz");
          }}
        >
          ¡Empieza ahora!
        </button>
        <br />
      </section>
      <br />

      {/* categorías */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center items-center">
        {["HTML", "CSS", "JavaScript"].map((category) => (
          <motion.article
            key={category}
            onClick={() => handleCardClick(category as Lang)}
            role="button"
            tabIndex={0}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl p-6 bg-gray-50 bg-opacity-80 bg-gray-200/10 shadow-2xl w-full md:w-1/3 transition-transform hover:scale-105"
          >
            <img
              src={`/icons/${category.toLowerCase()}.svg`}
              alt={category}
              className="h-12 mb-4 text-blue-900"
            />
            <h3 className="text-xl text-blue-900 font-bold mb-2">{category}</h3>
            <p className="text-sm text-black/80">
              Desbloquea 50+ retos desde principiante hasta avanzado.
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
