import { Link } from "react-router-dom";

const categories = ["HTML", "CSS", "JavaScript"];

export default function ChallengeCategories() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Selecciona una categoría
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/editor/${cat.toLowerCase()}/0`}
            className="p-4 bg-blue-100 rounded hover:bg-blue-200 transition"
          >
            <h2 className="text-xl font-semibold text-center">{cat}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
