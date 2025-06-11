import { useParams } from "react-router-dom";
import Editor from "@/features/editor/Editor"; // o la ruta donde esté tu Editor.tsx
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export default function ChallengeEditorPage() {
  const { categoria, id } = useParams();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenge() {
      setLoading(true);
      const q = query(
        collection(db, "challenges"),
        where("category", "==", categoria)
      );
      const snapshot = await getDocs(q);
      const challengeList = snapshot.docs.map((doc) => doc.data());
      const found = challengeList[parseInt(id || "0")];
      setChallenge(found || null);
      setLoading(false);
    }
    if (categoria) fetchChallenge();
  }, [categoria, id]);

  if (loading) return <p className="p-6 text-center">Cargando reto...</p>;
  if (!challenge) return <p className="p-6 text-center">Reto no encontrado.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
      <p className="mb-4 text-gray-700">{challenge.instructions}</p>
      {/* Si Editor no acepta props, solo renderiza el componente sin props */}
      <Editor />
    </div>
  );
}
