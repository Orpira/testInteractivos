import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { useQuestions } from "@/hooks/useQuestions";
import { db } from "../../services/firebase";
import QuestionCard from "@/components/ui/QuestionCard";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type AnswerSummary = {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string;
};

export default function QuizRunner() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const count = Number(searchParams.get("count")) || 5;

  // Ensure category is a string
  if (!category) {
    return <p className="p-6 text-center">Categoría no especificada.</p>;
  }

  // Use useQuestions only for loading/initial state, but manage questions locally for API/Firebase logic
  const { questions: initialQuestions, loading: initialLoading } = useQuestions(
    category,
    count
  );

  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions || []
  );
  const [loading, setLoading] = useState(initialLoading);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  //const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<AnswerSummary[]>([]);

  // Utilidad para mezclar un array aleatoriamente
  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  useEffect(() => {
    let isMounted = true;
    // Ejemplo: usar Axios para obtener preguntas de una API externa
    if (category === "api") {
      import("axios").then(({ default: axios }) => {
        axios
          .get("https://quizapi.io/api/v1/questions", {
            params: {
              category: "linux", // Puedes parametrizar esto si lo deseas
              limit: count,
              difficulty: "Easy",
            },
            headers: {
              "X-Api-Key": import.meta.env.VITE_QUIZAPI_KEY,
            },
          })
          .then((response) => {
            const questions = response.data.map((q: any) => {
              const options = Object.values(q.answers).filter(Boolean);
              const correctKey = Object.entries(q.correct_answers)
                .find(([_, v]) => v === "true")?.[0]
                ?.replace("_correct", "");
              const correctAnswer =
                q.answers[correctKey ? correctKey : ""] || "";
              return {
                question: q.question,
                options,
                correctAnswer,
              };
            });
            if (isMounted) setQuestions(questions);
          })
          .catch((error) => {
            console.error("Error cargando preguntas desde la API:", error);
          })
          .finally(() => {
            if (isMounted) setLoading(false);
          });
      });
    } else {
      // Lógica original para Firebase
      const loadQuestions = async () => {
        try {
          const col = collection(db, "questions");
          const q = query(col, where("category", "==", category)); // Quitar limit aquí
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => doc.data()) as any[];
          // Barajar y tomar las primeras N
          const shuffled = shuffleArray(data).slice(0, count);
          setQuestions(shuffled);
        } catch (error) {
          console.error("Error cargando preguntas:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      loadQuestions();
    }
    return () => {
      isMounted = false;
    };
  }, [category, count, setQuestions]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    setSelected(option);
    // Comparar por texto real, no por valor crudo
    let selectedText = option;
    let correctText = currentQuestion.correctAnswer;
    if (typeof option === "number" && Array.isArray(currentQuestion.options)) {
      selectedText = currentQuestion.options[option] ?? option;
    }
    if (
      typeof currentQuestion.correctAnswer === "number" &&
      Array.isArray(currentQuestion.options)
    ) {
      correctText =
        currentQuestion.options[currentQuestion.correctAnswer] ??
        currentQuestion.correctAnswer;
    }
    const isReallyCorrect = String(selectedText) === String(correctText);
    if (isReallyCorrect) {
      setScore((prev) => prev + 1);
    }
    setSummaryData((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        selectedAnswer: option,
      },
    ]);
    // Avanzar automáticamente
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        const summaryCopy = [
          ...summaryData,
          {
            question: currentQuestion.question,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.correctAnswer,
            selectedAnswer: option,
          },
        ];
        // Mostrar resultado automáticamente al terminar
        navigate("/result", {
          state: {
            score: isReallyCorrect ? score + 1 : score,
            total: questions.length,
            category,
            summary: summaryCopy,
          },
        });
        // No limpiar el estado aquí, para que el usuario pueda ver el resultado y navegar correctamente
      }
    }, 300); // Pequeño delay para UX
  };

  if (loading) return <p className="p-6 text-center">Cargando preguntas...</p>;
  if (!currentQuestion)
    return <p className="p-6 text-center">No se encontraron preguntas.</p>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 ">
      <QuestionCard
        category={category}
        question={currentQuestion.question}
        options={currentQuestion.options}
        selected={selected}
        onSelect={handleSelect}
        correctAnswer={currentQuestion.correctAnswer}
        showFeedback={false}
        number={currentIndex + 1}
        total={questions.length}
        onPrev={undefined}
      />
    </div>
  );
}
