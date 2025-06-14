import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Quiz() {
  const [category, setCategory] = useState<string>("");
  const [count, setCount] = useState<number>(10);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!category) return;
    navigate(`/quiz/${category}?count=${count}`);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 space-y-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Configura tu Quiz
      </h2>

      {/* Categorías */}
      <div>
        <h3 className="text-lg font-medium mb-2">Selecciona una categoría:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "html", label: "HTML", icon: "🌐" },
            { key: "css", label: "CSS", icon: "🎨" },
            { key: "javascript", label: "JavaScript", icon: "🧠" },
            { key: "form", label: "Formularios", icon: "📝" },
            { key: "responsive", label: "Responsive", icon: "📱" },
            { key: "api", label: "Linux", icon: "🐧" },
          ].map(({ key, label, icon }) => (
            <motion.button
              key={key}
              onClick={() => setCategory(key)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`p-4 border rounded-xl text-center transition ${
                category === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-semibold">{label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cantidad */}
      <div>
        <h3 className="text-lg font-medium mb-2">Número de preguntas:</h3>
        <select
          className="w-full border p-2 rounded-lg"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num} preguntas
            </option>
          ))}
        </select>
      </div>

      {/* Botón */}
      <div className="text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleStart}
          disabled={!category}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          Empezar test
        </motion.button>
      </div>
    </motion.div>
  );
}
