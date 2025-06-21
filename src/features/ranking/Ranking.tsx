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
  const [topCount, setTopCount] = useState(5);
  const [recientesPage, setRecientesPage] = useState(1);
  const [rankingFilter, setRankingFilter] = useState("");
  const [recientesFilter, setRecientesFilter] = useState("");
  const recientesPerPage = 5;
  const recientesTotalPages = Math.ceil(recientes.length / recientesPerPage);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex gap-4 justify-center">
            <button
              className={`px-4 py-2 rounded font-bold border transition ${
                topCount === 5
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
              }`}
              onClick={() => setTopCount(5)}
            >
              Top 5
            </button>
            <button
              className={`px-4 py-2 rounded font-bold border transition ${
                topCount === 10
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
              }`}
              onClick={() => setTopCount(10)}
            >
              Top 10
            </button>
          </div>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full md:w-64"
            placeholder="Filtrar por nombre, categoría o email..."
            value={rankingFilter}
            onChange={(e) => setRankingFilter(e.target.value)}
          />
        </div>
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
              {resultados
                .filter(
                  (res) =>
                    (res.name || res.email)
                      .toLowerCase()
                      .includes(rankingFilter.toLowerCase()) ||
                    res.category
                      .toLowerCase()
                      .includes(rankingFilter.toLowerCase())
                )
                .slice(0, topCount)
                .map((res, i) => (
                  <tr
                    key={i}
                    className={`border-t ${
                      i === 0
                        ? "bg-yellow-100 font-extrabold text-blue-900"
                        : i === 1
                        ? "bg-gray-200 font-bold text-gray-800"
                        : i === 2
                        ? "bg-yellow-300 font-semibold text-yellow-900"
                        : ""
                    }`}
                  >
                    <td className="p-2">
                      {i + 1}
                      {i === 0 && " 🥇"}
                      {i === 1 && " 🥈"}
                      {i === 2 && " 🥉"}
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
        <h3 className="text-lg font-semibold mb-2 text-center">
          🕒 Últimos resultados
        </h3>
        <div className="flex justify-end mb-2">
          <input
            type="text"
            className="border px-3 py-2 rounded w-full md:w-64"
            placeholder="Filtrar por nombre, categoría o email..."
            value={recientesFilter}
            onChange={(e) => setRecientesFilter(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <>
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
                {recientes
                  .filter(
                    (res) =>
                      (res.name || res.email)
                        .toLowerCase()
                        .includes(recientesFilter.toLowerCase()) ||
                      res.category
                        .toLowerCase()
                        .includes(recientesFilter.toLowerCase())
                  )
                  .slice(
                    (recientesPage - 1) * recientesPerPage,
                    recientesPage * recientesPerPage
                  )
                  .map((res, i) => (
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
            {/* Paginación */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
                onClick={() => setRecientesPage((p) => Math.max(1, p - 1))}
                disabled={recientesPage === 1}
              >
                Anterior
              </button>
              <span className="px-2 py-1 font-semibold">
                Página {recientesPage} de {recientesTotalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
                onClick={() =>
                  setRecientesPage((p) => Math.min(recientesTotalPages, p + 1))
                }
                disabled={recientesPage === recientesTotalPages}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
