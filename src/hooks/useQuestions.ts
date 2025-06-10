
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../services/firebase";

export function useQuestions(category: string, count: number = 10) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "questions"), where("category", "==", category), limit(count));
        const snapshot = await getDocs(q);
        setQuestions(snapshot.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error("Error cargando preguntas:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, count]);

  return { questions, loading };
}
