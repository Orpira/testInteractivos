import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuizStore } from "../../store/quizStore";

type Resultado = {
  name: string;
  email: string;
  score: number;
  total: number;
  category: string;
  timestamp?: string;
};

export default function Ranking() {
  const { isAuthenticated } = useAuth0();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [recientes, setRecientes] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarResultados = async () => {
      const ref = collection(db, "resultados");
      // Mejores puntajes
      const q1 = query(ref, orderBy("score", "desc"), limit(20));
      // Más recientes
      const q2 = query(ref, orderBy("timestamp", "desc"), limit(20));
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      setResultados(snap1.docs.map((doc) => doc.data() as Resultado));
      setRecientes(snap2.docs.map((doc) => doc.data() as Resultado));
      setLoading(false);
    };

    cargarResultados();
  }, []);

  if (!isAuthenticated) {
    return (
      <p className="p-6 text-center text-red-600 font-semibold">
        Debes iniciar sesión para ver el ranking.
      </p>
    );
  }

  const result = useQuizStore((state) => state.result);

  return (
    <>
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Ranking general</h2>
        <h3 className="text-lg font-semibold mb-2 text-center">
          🏆 Mejores puntajes
        </h3>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <table className="w-full table-auto border mb-8">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">#</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Categoría</th>
                <th className="p-2">Puntuación</th>
                <th className="p-2">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((res, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{res.name || res.email}</td>
                  <td className="p-2">{res.category.toUpperCase()}</td>
                  <td className="p-2">
                    {res.score} / {res.total}
                  </td>
                  <td className="p-2">
                    {Math.round((res.score / res.total) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h3 className="text-lg font-semibold mb-2 text-center">
          🕒 Últimos resultados
        </h3>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Fecha</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Categoría</th>
                <th className="p-2">Puntuación</th>
                <th className="p-2">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((res, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    {res.timestamp
                      ? new Date(res.timestamp).toLocaleString()
                      : ""}
                  </td>
                  <td className="p-2">{res.name || res.email}</td>
                  <td className="p-2">{res.category.toUpperCase()}</td>
                  <td className="p-2">
                    {res.score} / {res.total}
                  </td>
                  <td className="p-2">
                    {Math.round((res.score / res.total) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </>
  );
}
