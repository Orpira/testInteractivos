import { useState } from "react";
import Editor from "react-simple-code-editor";
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

const templates = {
  html: "<h1>Hola Mundo</h1>",
  css: "body { background-color: lightblue; }",
  js: "alert('Hola desde JavaScript!');",
};

export default function CodeEditorPage() {
  //const [language, setLanguage] = useState<"html" | "css" | "js">("html");
  //const [code, setCode] = useState(templates["html"]);
  const { isAuthenticated, user } = useAuth0();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialLang =
    (searchParams.get("language") as "html" | "css" | "js") || "html";
  const initialCode = searchParams.get("code") || templates[initialLang];

  const [language, setLanguage] = useState<"html" | "css" | "js">(initialLang);
  const [code, setCode] = useState(initialCode);

  const fromHistorial = searchParams.has("code");
  const [showNotice, setShowNotice] = useState(fromHistorial);

  useEffect(() => {
    if (fromHistorial) {
      const timer = setTimeout(() => setShowNotice(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [fromHistorial]);

  const handleSave = async () => {
    if (!isAuthenticated || !user) return;

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
    if (language === "js") return `<script>${code}<\/script>`;
    return "";
  };

  {
    showNotice && (
      <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in">
        Código cargado desde historial 📝
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold mb-4">Editor de Código</h2>
        <select
          className="mb-4 border px-3 py-2 rounded"
          value={language}
          onChange={(e) => {
            const lang = e.target.value as "html" | "css" | "js";
            setLanguage(lang);
            setCode(templates[lang]);
          }}
        >
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
        </select>

        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) =>
            highlight(
              code,
              Prism.languages[language === "js" ? "javascript" : language],
              language
            )
          }
          padding={10}
          className="border rounded font-mono min-h-[300px] text-sm bg-gray-100"
        />
      </div>

      {isAuthenticated && (
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar código
        </button>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Vista Previa</h3>
        <iframe
          title="preview"
          className="w-full h-[400px] border"
          srcDoc={renderCode()}
          sandbox="allow-scripts allow-same-origin"
        />
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
