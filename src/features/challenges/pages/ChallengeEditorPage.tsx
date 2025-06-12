import { useParams } from "react-router-dom";
import Editor from "@/features/editor/Editor";
import { useEffect, useState } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function ChallengeEditorPage() {
  const { id, categoria } = useParams();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenge() {
      setLoading(true);
      const challengeId = `${id}`;
      if (!challengeId || !categoria) {
        setChallenge(null);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "challenges"),
          where("id", "==", challengeId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const found = snapshot.docs[0].data();
          setChallenge(found);
        } else {
          setChallenge(null);
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    }
    // Verifica que categoria e id estén definidos antes de hacer la consulta
    if (categoria && id) {
      fetchChallenge();
    }
  }, [categoria, id]);

  if (loading) return <p className="p-6 text-center">Cargando reto...</p>;
  if (!challenge) return <p className="p-6 text-center">Reto no encontrado.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
      <pre className="mb-4 text-gray-700">{challenge.instructions}</pre>
      <Editor
        starterCode={challenge.initialCode ?? challenge.starterCode}
        categoryFromChallenge={challenge.category}
        expectedOutput={challenge.expectedOutput}
      />
    </div>
  );
}
