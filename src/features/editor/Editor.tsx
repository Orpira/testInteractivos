import { useState } from "react";
import SimpleCodeEditor from "react-simple-code-editor";
import { highlight } from "prismjs";
import * as Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useAuth0 } from "@auth0/auth0-react";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validarHTML } from "../../utils/validadorHTML";

type EditorProps = {
  starterCode?: string;
  categoryFromChallenge?: string;
  initialCode?: string;
  expectedOutput?: string;
  validationRules?: string[];
};

function Evaluador({
  respuestaUsuario,
  reto,
  onNext,
}: {
  respuestaUsuario: string;
  reto: { title: string; expectedOutput: string };
  onNext?: () => void;
}) {
  const esCorrecto = validarHTML(respuestaUsuario, reto.expectedOutput);

  return (
    <div>
      <h2>{reto.title}</h2>
      {esCorrecto ? (
        <div>
          <p style={{ color: "green" }}>✅ ¡Respuesta correcta!</p>
          {onNext && (
            <button
              onClick={onNext}
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Avanzar al siguiente reto
            </button>
          )}
        </div>
      ) : (
        <p style={{ color: "red" }}>❌ La estructura HTML no es correcta.</p>
      )}
    </div>
  );
}

export default function Editor({
  starterCode,
  categoryFromChallenge,
  expectedOutput: expectedOutputProp,
  validationRules,
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
  const [expectedOutput, setExpectedOutput] = useState<string | undefined>(
    expectedOutputProp
  );

  // Normalizar espacios y saltos de línea
  // Esto es para comparar el código del usuario con el resultado esperado
  // sin importar espacios adicionales o saltos de línea
  const normalize = (str: string) => str.replace(/\s+/g, "").toLowerCase();

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

  function validateCode(
    user: string,
    rules: string[] | undefined,
    expected?: string
  ) {
    const userNorm = normalize(user);

    //Si hay validationRules, tómalas como referencia
    if (rules && rules.length) {
      return rules.every((fragment) => userNorm.includes(normalize(fragment)));
    }

    // Si no hay reglas, cae al expectedOutput
    // y verifica si el código del usuario contiene el resultado esperado
    if (expected) {
      return userNorm.includes(normalize(expected));
    }

    return false;
  }

  function handleValidate(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    if (!expectedOutput) return;

    const esCorrecto = validarHTML(code, expectedOutput);

    console.log("Resultado de la validación:", esCorrecto);
    // Renderiza el componente Evaluador basado en el resultado
    const evaluador = (
      <Evaluador
        respuestaUsuario={code}
        reto={{ title: "Validación HTML", expectedOutput }}
      />
    );

    console.log(evaluador);
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {" "}
      {/* Contenedor principal más ancho */}
      <div className="grid gap-6 md:grid-cols-2">
        {" "}
        {/* Grid para editor y vista previa */}
        {/* Columna Izquierda: Editor de Código */}
        <div>
          {/* Aquí podrías añadir un título como "Editor de Código" si quieres */}
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
            className="border rounded font-mono min-h-[300px] md:min-h-[calc(400px+theme(spacing.12)+theme(spacing.4))] text-sm bg-gray-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            // Ajuste de altura para igualar la vista previa
          />
        </div>
        {/* Columna Derecha: Vista Previa y Verificación */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold dark:text-slate-100">
              Vista Previa
            </h3>
            {/* <button
              onClick={handleValidate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              // Mantenemos el tamaño actual para "Verificar solución"
            >
              Verificar solución
            </button> */}
          </div>
          <iframe
            title="preview"
            className="w-full h-[400px] border dark:border-slate-700"
            srcDoc={renderCode()}
            sandbox="allow-scripts allow-same-origin"
          />
          {/* Mensaje de validación */}
          <div className="mt-4 flex gap-3 items-center">
            {resultMessage && (
              <span
                className={`${
                  isCorrect
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                } font-medium`}
              >
                {resultMessage}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Sección de Botones Inferiores */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* {isAuthenticated && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            // Botón "Guardar código" con el mismo padding que "Verificar"
            // y responsive en ancho
          >
            Guardar código
          </button>
        )} Botón "Guardar código" comentado, puedes descomentar si es necesario*/}{" "}
        {/* Botón "Volver al inicio" */}
        {/*  <button
          onClick={() => navigate("/")} // Asumo que quieres mantener el botón de volver
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto"
        >
          Volver al inicio
        </button> */}
      </div>
      {showNotice && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in">
          Código cargado desde historial 📝
        </div>
      )}
      {/* Renderiza el componente Evaluador directamente en el JSX principal */}
      {expectedOutput && (
        <Evaluador
          respuestaUsuario={code}
          reto={{ title: "Validación HTML", expectedOutput }}
          onNext={async () => {
            const nextChallenge = await obtenerSiguienteRetoFirebase(
              expectedOutput
            ); // Busca el siguiente reto en Firebase
            if (nextChallenge) {
              setCode(nextChallenge.code); // Actualiza el código del editor con el nuevo reto
              setExpectedOutput(nextChallenge.expectedOutput); // Actualiza el resultado esperado
            } else {
              console.log("No hay más retos disponibles.");
            }
          }}
        />
      )}
    </div>
  );
}

// Función para obtener el siguiente reto desde Firebase
async function obtenerSiguienteRetoFirebase(currentExpectedOutput: string) {
  try {
    const retosRef = collection(db, "challenges");
    const q = query(
      retosRef,
      where("expectedOutput", "!=", currentExpectedOutput),
      orderBy("expectedOutput"),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const retoDoc = snapshot.docs[0];
      return retoDoc.data();
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo el siguiente reto desde Firebase:", error);
    return null;
  }
}

// import Prism from "prismjs";

function highlightCode(
  code: string | undefined,
  language: string | undefined
): string {
  if (!code || !language) {
    console.warn(
      "El texto o el lenguaje para resaltar están vacíos o no definidos."
    );
    return ""; // Devuelve un texto vacío si el código o el lenguaje no están definidos
  }

  return Prism.highlight(code, Prism.languages[language], language);
}

// Uso en el renderizado
const code: string = ""; // Inicializa `code` como una cadena vacía
const language: string = "html"; // Inicializa `language` con el valor predeterminado "html"

// Usa las variables en la función highlightCode
const highlightedCode = highlightCode(code, language);
