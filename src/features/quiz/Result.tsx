import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../../services/firebase";
import { updateUserStats } from "../../services/userStats";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth0();

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const localState = location.state || {};
  const [loading, setLoading] = useState(!!id);
  const [resultData, setResultData] = useState<any | null>(null);
  const hasSaved = useRef(false);

  const finalScore = resultData?.score ?? localState.score;
  const finalTotal = resultData?.total ?? localState.total;
  const finalCategory = resultData?.category ?? localState.category;
  const finalSummary = resultData?.summary ?? localState.summary;

  useEffect(() => {
    if (id) {
      setLoading(true);
      const docRef = doc(db, "resultados", id);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setResultData(docSnap.data());
        } else {
          setResultData(null);
        }
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (
      !localState?.fromDashboard &&
      !id &&
      isAuthenticated &&
      user &&
      typeof finalScore === "number" &&
      typeof finalTotal === "number" &&
      finalCategory &&
      !hasSaved.current &&
      finalTotal > 0
    ) {
      hasSaved.current = true;
      const resultado = {
        name: user.name || "",
        email: user.email || "",
        userId: user.sub || "",
        score: finalScore,
        total: finalTotal,
        category: String(finalCategory),
        summary: finalSummary,
        timestamp: new Date().toISOString(),
      };
      addDoc(collection(db, "resultados"), resultado)
        .then(() => console.log("Resultado guardado en Firestore"))
        .catch((e) => {
          alert("Error guardando resultado en ranking: " + e.message);
          console.error("Error guardando resultado en ranking:", e);
        });
    }
  }, [
    isAuthenticated,
    user,
    finalScore,
    finalTotal,
    finalCategory,
    finalSummary,
    localState,
    id,
  ]);

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      typeof finalScore === "number" &&
      typeof finalTotal === "number" &&
      finalCategory
    ) {
      updateUserStats(user, finalCategory, finalScore, finalTotal);
    }
  }, [isAuthenticated, user, finalScore, finalTotal, finalCategory]);

  if (loading) return <p className="p-6 text-center">Cargando resultado...</p>;
  if (!finalScore && !finalTotal) {
    return <p className="p-6 text-center">No hay datos del resultado.</p>;
  }

  const percentage = Math.round((finalScore / finalTotal) * 100);
  const hasSummary = Array.isArray(finalSummary) && finalSummary.length > 0;

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Resultado del test</h2>
      <p className="mb-4">
        Categoría: <strong>{finalCategory}</strong>
      </p>
      <p className="text-xl font-semibold mb-6">
        Has obtenido {finalScore} de {finalTotal} puntos. ({percentage}%)
      </p>

      {hasSummary ? (
        <div className="mt-8 text-left">
          <h3 className="text-lg font-bold mb-2 text-center">
            Resumen de respuestas
          </h3>
          <ul className="space-y-4">
            {finalSummary.map((item: any, index: number) => {
              const userAnswerRaw = item.selectedAnswer ?? item.selected;
              const userAnswerText = Array.isArray(item.options)
                ? item.options[userAnswerRaw] ?? userAnswerRaw
                : userAnswerRaw;
              const correctAnswerText = Array.isArray(item.options)
                ? item.options[item.correctAnswer] ?? item.correctAnswer
                : item.correctAnswer;
              const isCorrect =
                String(userAnswerText) === String(correctAnswerText);

              return (
                <li
                  key={index}
                  className={`border rounded p-4 ${
                    isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <p className="font-semibold mb-2">Pregunta {index + 1}:</p>
                  <p className="mb-1">{item.question}</p>
                  <p>
                    <strong>Tu respuesta:</strong>{" "}
                    <span
                      className={isCorrect ? "text-green-600" : "text-red-600"}
                    >
                      {String(userAnswerText)}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p>
                      <strong>Respuesta correcta:</strong>{" "}
                      <span className="text-green-700">
                        {String(correctAnswerText)}
                      </span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="mt-8 text-center text-red-600 font-semibold">
          No hay detalle de respuestas para este test.
        </div>
      )}

      <div className="flex flex-row flex-wrap gap-3 mt-8 justify-center">
        <button
          onClick={() =>
            navigate("/quiz", { state: { category: finalCategory } })
          }
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
        >
          Repetir Test
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
        >
          Volver al inicio
        </button>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ¿Tienes sugerencias o encontraste un error en alguna pregunta?{" "}
          <Link
            to="/contacto"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Contáctanos aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
