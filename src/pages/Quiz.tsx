import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JavaScript", value: "javascript" },
  { label: "Responsive", value: "responsive" },
  { label: "API (quizapi)", value: "api" }, // Nueva opción para API externa
];
const QUESTION_COUNTS = [5, 10, 15, 20];

export default function Quiz() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("html");
  const [count, setCount] = useState(10);

  const handleStart = () => {
    navigate(`/quiz/${category}?count=${count}`);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
      <h2 className="text-3xl font-bold mb-4">Configuración del Test</h2>

      <div className="mb-4">
        <label className="block mb-2 text-lg font-semibold">
          Selecciona una categoría:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold">
          Cantidad de preguntas:
        </label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          {QUESTION_COUNTS.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleStart}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Iniciar cuestionario
      </button>
    </section>
  );
}
