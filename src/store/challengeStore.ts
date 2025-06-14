import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

export type Challenge = {
  id: string;
  title: string;
  instructions: string;
  category: string;
  starterCode?: string;
  initialCode?: string;
  expectedOutput?: string;
  [key: string]: any;
};

interface ChallengeStore {
  challenges: Challenge[];
  loading: boolean;
  fetchChallenges: () => Promise<void>;
  getChallengeById: (id: string) => Challenge | undefined;
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  challenges: [],
  loading: false,
  fetchChallenges: async () => {
    set({ loading: true });
    const snapshot = await getDocs(collection(db, "challenges"));
    const challenges = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title ?? "",
        instructions: data.instructions ?? "",
        category: data.category ?? "",
        starterCode: data.starterCode,
        initialCode: data.initialCode,
        expectedOutput: data.expectedOutput,
        ...data,
      } as Challenge;
    });
    set({ challenges, loading: false });
  },
  getChallengeById: (id) => {
    return get().challenges.find((c) => c.id === id);
  },
}));
