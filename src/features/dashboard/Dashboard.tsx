import { useAuth0 } from "@auth0/auth0-react";
import { useUserHistory } from "@/hooks/useUserHistory";
import PerformanceChart from "./PerformanceChart"; // Placeholder para el gráfico
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../../utils/exportCSV"; // Asegúrate de tener esta función implementada
import Achievements from "@/components/Achievements"; // Componente no encontrado, import eliminado
import { calculateAchievements } from "../../utils/achievements";

export default function Dashboard() {
  const { user } = useAuth0();
  const { history, loading } = useUserHistory();
  const navigate = useNavigate();

  const totalTests = history.length;
  const averageScore = history.length
    ? (
        history.reduce((acc, h) => acc + h.score / h.total, 0) / history.length
      ).toFixed(2)
    : 0;
  const lastTest = history[0];

  const averagesByCategory = history.reduce((acc, h) => {
    if (!acc[h.category]) {
      acc[h.category] = { total: 0, count: 0 };
    }
    acc[h.category].total += h.score / h.total;
    acc[h.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(averagesByCategory).map(
    ([category, { total, count }]) => ({
      category,
      average: Number(((total / count) * 10).toFixed(2)), // Escalado a 10
    })
  );

  const lastFive = [...history]
    .sort((a, b) => b.timestamp - a.timestamp) // ordena de más reciente a más antiguo
    .slice(0, 5);

  // Adaptar los datos de history (Firestore) al tipo TestResult para calculateAchievements
  const testResults = history.map((h) => ({
    userId: h.userId || "",
    date: h.timestamp || h.createdAt || "",
    score: h.score,
    total: h.total,
    category: h.category,
  }));

  const userAchievements = calculateAchievements(testResults);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Tu Dashboard</h1>

      {/* Bienvenida */}
      <div className="mb-6 text-center">
        <p className="text-lg">
          Bienvenido/a, <strong>{user?.name || "usuario"}</strong>
        </p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card title="Tests Realizados" value={totalTests} color="indigo" />
        <Card title="Promedio" value={`${averageScore} pts`} color="green" />
        <Card
          title="Último Test"
          value={lastTest?.category ?? "—"}
          color="blue"
        />
        <Card
          title="Última puntuación"
          value={lastTest ? `${lastTest.score}/${lastTest.total}` : "—"}
          color="yellow"
        />
      </div>

      {/* (Placeholder) Aquí irá el gráfico y resumen más adelante */}
      <h2 className="text-2xl font-bold mb-4">Rendimiento por Categoría</h2>
      <PerformanceChart data={chartData} />
      {/* Últimos 5 tests */}
      <section className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">🕒 Últimos 5 tests</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b font-medium">
              <th className="p-2">Categoría</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Puntaje</th>
              <th className="p-2">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {lastFive.map((entry, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{entry.category}</td>
                <td className="p-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="p-2">
                  {entry.score} / {entry.total}
                </td>
                <td className="p-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => navigate(`/result?id=${entry.id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/* Ejemplo de logros, reemplaza esto con la lógica real si la tienes */}
      <Achievements achievements={userAchievements} />
      <button
        onClick={() => exportToCSV(history, "historial_test")}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Exportar historial (.CSV)
      </button>
    </div>
  );
}

type CardProps = {
  title: string;
  value: string | number;
  color: string;
};

function Card({ title, value, color }: CardProps) {
  return (
    <div
      className={`bg-${color}-100 text-${color}-800 p-4 rounded shadow text-center`}
    >
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
