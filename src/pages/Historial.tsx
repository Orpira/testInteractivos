import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

// Tipos para ambos historiales

type Envio = {
  code: string;
  language: string;
  timestamp: string;
};

type Test = {
  category: string;
  score: number;
  total: number;
  timestamp: string;
};

export default function Historial() {
  const { isAuthenticated, user } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [tipo, setTipo] = useState<"test" | "codigo" | null>(null);
  const [testPage, setTestPage] = useState(1);
  const testsPerPage = 5;
  const testTotalPages = Math.ceil(tests.length / testsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !tipo) return;
    setLoading(true);
    if (tipo === "codigo") {
      const cargarEnvios = async () => {
        const ref = collection(db, "envios_codigo");
        const q = query(
          ref,
          where("userId", "==", user.sub),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data() as Envio);
        setEnvios(data);
        setLoading(false);
      };
      cargarEnvios();
    } else if (tipo === "test") {
      const cargarTests = async () => {
        const ref = collection(db, "resultados");
        const q = query(
          ref,
          where("userId", "==", user.sub),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data() as Test);
        setTests(data);
        setLoading(false);
      };
      cargarTests();
    }
  }, [user, tipo]);

  if (!isAuthenticated) {
    return (
      <p className="p-6 text-center">
        Debes iniciar sesión para ver tu historial.
      </p>
    );
  }

  if (!tipo) {
    return (
      <section className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-6">¿Qué historial deseas ver?</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            onClick={() => setTipo("test")}
          >
            Historial de Quiz
          </button>
          <button
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
            onClick={() => setTipo("codigo")}
          >
            Historial de Código
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {tipo === "test" ? "Historial de Quizzes" : "Historial de Código"}
        </h2>
        <div className="flex justify-center mb-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 mr-2"
            onClick={() => setTipo(null)}
          >
            Cambiar tipo de historial
          </button>
        </div>
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : tipo === "codigo" ? (
          envios.length === 0 ? (
            <p className="text-center">Aún no has guardado ningún código.</p>
          ) : (
            <ul className="space-y-4">
              {envios.map((e, i) => (
                <li key={i} className="border p-4 rounded bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(e.timestamp).toLocaleString()} —{" "}
                    {e.language?.toUpperCase()}
                  </p>
                  <pre className="bg-white p-2 rounded text-sm overflow-auto max-h-40">
                    {e.code}
                  </pre>
                  <div className="mt-2 text-right">
                    <a
                      href={`/editor?language=${
                        e.language
                      }&code=${encodeURIComponent(e.code)}`}
                      className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                      Abrir en editor
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : tests.length === 0 ? (
          <p className="text-center">Aún no has guardado ningún test.</p>
        ) : (
          <ul className="space-y-4">
            {tests
              .slice((testPage - 1) * testsPerPage, testPage * testsPerPage)
              .map((t, i) => (
                <li key={i} className="border p-4 rounded bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(t.timestamp).toLocaleString()}
                  </p>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-semibold">
                      Categoría: {t.category || "N/A"}
                    </span>
                    <span className="font-semibold">
                      Puntaje: {t.score ?? "-"} / {t.total ?? "-"}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        )}
        {/* Paginación para historial de tests */}
        {tipo === "test" && testTotalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
              onClick={() => setTestPage((p) => Math.max(1, p - 1))}
              disabled={testPage === 1}
            >
              Anterior
            </button>
            <span className="px-2 py-1 font-semibold">
              Página {testPage} de {testTotalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
              onClick={() =>
                setTestPage((p) => Math.min(testTotalPages, p + 1))
              }
              disabled={testPage === testTotalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </>
  );
}
