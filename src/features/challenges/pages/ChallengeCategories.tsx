import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

const categories = ["HTML", "CSS", "JavaScript"];

export default function ChallengeCategories() {
  const [firstChallenges, setFirstChallenges] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    async function fetchFirstChallenges() {
      const results: { [key: string]: string } = {};
      for (const category of categories) {
        const q = query(
          collection(db, "challenges"),
          where("category", "==", category.toLowerCase()),
          limit(1)
        );
        const snapshot = await getDocs(q);
        const doc = snapshot.docs[0];
        if (doc) {
          const data = doc.data();
          results[category.toLowerCase()] = data.id; // <-- ID necesario para construir la ruta
        }
      }
      setFirstChallenges(results);
    }
    fetchFirstChallenges();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Selecciona una categoría
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/editor/${cat.toLowerCase()}/${
              firstChallenges[cat.toLowerCase()] || 0
            }`}
            className="p-4 bg-blue-100 rounded hover:bg-blue-200 transition"
          >
            <h2 className="text-xl font-semibold text-center">{cat}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
