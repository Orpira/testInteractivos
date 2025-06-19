import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import AuthModal from "@/components/ui/AuthModal";
import ChallengeCategories from "../challenges/pages/ChallengeCategories";

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  // Para manejar el modal de autenticación
  const [showAuth, setShowAuth] = useState(false);
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
    <>
      <section className="bg-blue-100 w-full min-h-screen flex flex-col items-center justify-start px-4 pt-10">
        <div className="flex flex-col items-center justify-center w-full mx-auto">
          <div className="flex flex-col items-center justify-between w-full">
            <p className="font-intro text-lg sm:text-xl max-w-xl text-center">
              Quizzes y retos interactivos de{" "}
              <strong>HTML, CSS, JavaScript</strong>. <br />
              Construye, valida y comparte tus soluciones al instante.
            </p>
            <motion.img
              src="/languajes.png"
              alt="Lenguajes de Programación"
              className="hidden sm:block w-64 md:w-80 lg:w-96 h-auto object-contain mt-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </div>
          <button
            className="mt-6 px-6 py-3 bg-gray-800 text-white text-base font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
            onClick={() => {
              navigate("/quiz");
            }}
          >
            ¡Empieza ahora!
            <motion.div
              animate={{
                x: [0, 3, 0], // Mueve 3px a la derecha y vuelve a 0
              }}
              transition={{
                duration: 1.5, // Duración de un ciclo de animación
                repeat: Infinity, // Repetir infinitamente
                repeatType: "loop", // Tipo de repetición
                ease: "easeInOut", // Suavizado de la animación
              }}
              className="inline-block" // Para que motion.div se comporte como un span
            >
              <ArrowRight className="ml-2" />
            </motion.div>
          </button>
        </div>

        {/* categorías */}
        <div className="mt-12 mb-16 flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center items-center">
          {showAuthAlert && (
            <AuthModal
              open={showAuthAlert}
              onLogin={() => {
                setShowAuthAlert(false);
                loginWithRedirect();
              }}
              onClose={() => setShowAuthAlert(false)}
            />
          )}
          <ChallengeCategories
            isAuthenticated={isAuthenticated}
            onSelectCategory={handleCardClick}
          />
        </div>
      </section>
    </>
  );
}
