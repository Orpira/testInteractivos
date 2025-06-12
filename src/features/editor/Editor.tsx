import { useState } from "react";
import SimpleCodeEditor from "react-simple-code-editor";
import { highlight } from "prismjs";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useAuth0 } from "@auth0/auth0-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type EditorProps = {
  starterCode?: string;
  categoryFromChallenge?: string;
  initialCode?: string;
  expectedOutput?: string;
};

export default function Editor({
  starterCode,
  categoryFromChallenge,
  expectedOutput,
}: EditorProps) {
  const templates: Record<"html" | "css" | "javascript", string> = {
    html: "<h1>Hola Mundo</h1>",
    css: "body { background-color: lightblue; }",
    javascript: "alert('Hola desde JavaScript!');",
  };

  const [language, setLanguage] = useState<"html" | "css" | "javascript">(
    (categoryFromChallenge?.toLowerCase() as "html" | "css" | "javascript") ||
      "html"
  );

  const [code, setCode] = useState(() => {
    return starterCode ?? templates[language];
  });

  const { isAuthenticated, user } = useAuth0();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromHistorial = searchParams.has("code");
  const [showNotice, setShowNotice] = useState(fromHistorial);

  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (fromHistorial) {
      const timer = setTimeout(() => setShowNotice(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [fromHistorial]);

  const handleSave = async () => {
    if (!isAuthenticated || !user) return;

    const handleValidate = () => {
      if (!expectedOutput) return;

      const normalizedUserCode = code.trim().replace(/\s+/g, "");
      const normalizedExpected = expectedOutput.trim().replace(/\s+/g, "");

      if (normalizedUserCode === normalizedExpected) {
        setIsCorrect(true);
        setResultMessage("✅ ¡Código correcto!");
      } else {
        setIsCorrect(false);
        setResultMessage("❌ El código no cumple con lo esperado.");
      }
    };

    const entry = {
      userId: user.sub,
      name: user.name || "",
      email: user.email || "",
      language,
      code,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "envios_codigo"), entry);
      alert("Código guardado correctamente ✅");
    } catch (error) {
      console.error("Error al guardar código:", error);
      alert("Hubo un error al guardar el código ❌");
    }
  };

  const renderCode = () => {
    if (language === "html") return code;
    if (language === "css") return `<style>${code}</style>`;
    if (language === "javascript") return `<script>${code}<\/script>`;
    return "";
  };

  {
    showNotice && (
      <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in">
        Código cargado desde historial 📝
      </div>
    );
  }

  function handleValidate(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    if (!expectedOutput) return;

    const normalizedUserCode = code.trim().replace(/\s+/g, "");
    const normalizedExpected = expectedOutput.trim().replace(/\s+/g, "");

    console.log("Código del usuario:", normalizedUserCode);
    console.log("Código esperado:", normalizedExpected);
    // Normalizar espacios y saltos de línea

    if (normalizedUserCode === normalizedExpected) {
      setIsCorrect(true);
      setResultMessage("✅ ¡Código correcto!");
    } else {
      setIsCorrect(false);
      setResultMessage("❌ El código no cumple con lo esperado.");
    }
  }
  return (
    <div className="p-6 max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
      <div>
        <SimpleCodeEditor
          value={code}
          onValueChange={setCode}
          highlight={(code) =>
            highlight(
              code,
              Prism.languages[
                language === "javascript" ? "javascript" : language
              ],
              language
            )
          }
          padding={10}
          className="border rounded font-mono min-h-[300px] text-sm bg-gray-100"
        />
      </div>

      {isAuthenticated && (
        <>
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar código
          </button>
        </>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">Vista Previa</h3>
          <button
            onClick={handleValidate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verificar solución
          </button>
        </div>
        <iframe
          title="preview"
          className="w-full h-[400px] border"
          srcDoc={renderCode()}
          sandbox="allow-scripts allow-same-origin"
        />
        {/* Mensaje de validación SOLO aquí */}
        <div className="mt-4 flex gap-3 items-center">
          {resultMessage && (
            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
              {resultMessage}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
