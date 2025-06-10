import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../../services/firebase";
import { updateUserStats } from "../../services/userStats";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth0();
  const { score, total, category, summary } = location.state || {};

  // Evitar guardar varias veces si el usuario recarga
  const hasSaved = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      typeof score === "number" &&
      typeof total === "number" &&
      category &&
      !hasSaved.current &&
      total > 0
    ) {
      hasSaved.current = true;
      const resultado = {
        name: user.name || "",
        email: user.email || "",
        userId: user.sub || "",
        score,
        total,
        category: String(category),
        timestamp: new Date().toISOString(),
      };
      addDoc(collection(db, "resultados"), resultado)
        .then(() => console.log("Resultado guardado en Firestore"))
        .catch((e) => {
          alert("Error guardando resultado en ranking: " + e.message);
          console.error("Error guardando resultado en ranking:", e);
        });
    }
  }, [isAuthenticated, user, score, total, category]);

  if (!score && !total) {
    return <p className="p-6 text-center">No hay datos del resultado.</p>;
  }

  const percentage = Math.round((score / total) * 100);

  // Actualizar estadísticas del usuario
  // Solo si el usuario está autenticado y los datos son válidos
  // Esto se hace para evitar llamadas innecesarias a la base de datos
  useEffect(() => {
    if (isAuthenticated && user) {
      updateUserStats(user, category, score, total);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Resultado del test</h2>
      <p className="mb-4">
        Categoría: <strong>{category}</strong>
      </p>
      <p className="text-xl font-semibold mb-6">
        Has obtenido {score} de {total} puntos. ({percentage}%)
      </p>

      <div className="flex flex-row flex-wrap gap-3 mt-6 justify-center">
        <button
          onClick={() => navigate("/quiz", { state: { category } })}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
        >
          Repetir Test
        </button>

        {isAuthenticated && (
          <button
            onClick={() => navigate("/ranking")}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Ver ranking
          </button>
        )}

        {summary && (
          <button
            onClick={() => navigate("/summary", { state: { summary } })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
          >
            Ver respuestas
          </button>
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ¿Tienes sugerencias o encontraste un error en alguna pregunta?{" "}
          <a
            href="/contacto"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Contáctanos aquí
          </a>
        </p>
      </div>
    </div>
  );
}
