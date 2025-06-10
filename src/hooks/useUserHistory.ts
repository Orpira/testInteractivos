// src/hooks/useUserHistory.ts
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth0 } from "@auth0/auth0-react";

type HistoryItem = { id: string; [key: string]: any };

export function useUserHistory() {
  const { user } = useAuth0();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.sub) return;

    const loadHistory = async () => {
      const q = query(
        collection(db, "resultados"), // Asegúrate de que la colección es 'resultados'
        where("userId", "==", user.sub),
        orderBy("timestamp", "desc") // Usa el campo correcto para la fecha
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
      setLoading(false);
    };

    loadHistory();
  }, [user?.sub]);

  return { history, loading };
}
