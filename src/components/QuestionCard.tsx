import React from "react";

type QuestionProps = {
  category: string;
  question: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  correctAnswer: string;
  showFeedback: boolean;
};

export const QuestionCard = ({
  category,
  question,
  options,
  selected,
  onSelect,
  correctAnswer,
  showFeedback,
  number,
  total,
  onPrev,
}: QuestionProps & {
  number?: number;
  total?: number;
  onPrev?: () => void;
}) => {
  // Letras para las opciones
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Colores para letras y bordes (A, B, C, D)
  const letterColors = [
    {
      bg: "bg-blue-900",
      border: "border-blue-900",
      text: "text-blue-900",
      ring: "ring-blue-900",
    },
    {
      bg: "bg-blue-400",
      border: "border-blue-400",
      text: "text-blue-600",
      ring: "ring-blue-400",
    },
    {
      bg: "bg-yellow-500",
      border: "border-yellow-500",
      text: "text-yellow-700",
      ring: "ring-yellow-500",
    },
    {
      bg: "bg-cyan-500",
      border: "border-cyan-500",
      text: "text-cyan-700",
      ring: "ring-cyan-500",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px] py-8 px-2 md:px-0 w-full max-w-[1100px] mx-auto">
      {/* Contenedor pregunta + número */}
      <div className="flex items-center justify-center w-full mb-12 relative z-10">
        {/* Número de pregunta grande flotante, en círculo y fuera del cuadro principal */}
        {typeof number === "number" && (
          <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-blue-300 text-blue-900 text-6xl font-extrabold drop-shadow-2xl select-none z-30 border-8 border-white shadow-2xl mr-6">
            {number}
          </div>
        )}
        {/* Enunciado flotante */}
        <div className="shadow-2xl rounded-2xl bg-white border-4 border-blue-200 px-8 py-6 max-w-3xl w-full text-center text-blue-900 text-xl font-semibold">
          {category === "javascript" ? (
            <pre
              className={`flex-1 text-left px-4 py-3 flex items-center text-sm md:text-base bg-transparent z-10 `}
            >
              {question}{" "}
            </pre>
          ) : (
            <>{question}</>
          )}
        </div>
      </div>
      {/* Opciones flotantes con letra separada y diagonal */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]">
        {options.map((option, idx) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;
          const color = letterColors[idx % 4];
          // Por defecto, sin borde de color
          let optionClass = `relative flex items-stretch px-0 py-0 rounded-2xl border-4 border-transparent cursor-pointer transition duration-300 text-lg font-medium shadow-2xl bg-white hover:scale-105 overflow-hidden group`;
          // Efecto hundido si está seleccionada
          const pressedClass =
            isSelected && !showFeedback
              ? "translate-y-1 scale-95 shadow-inner ring-4 " + color.ring
              : "";

          return (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              className={optionClass + " " + pressedClass}
              disabled={showFeedback}
              style={{ minHeight: 80 }}
            >
              {/* Letra de opción en cuadrado separado con corte diagonal */}
              <div
                className={`relative flex-shrink-0 w-20 h-full flex items-center justify-center bg-white z-10`}
              >
                y
                <div
                  className={`absolute left-0 top-0 w-full h-full ${color.bg} clip-diagonal`}
                  style={{ zIndex: 1 }}
                ></div>
                <span
                  className={`relative z-10 text-3xl font-extrabold text-white drop-shadow-lg ${
                    showFeedback ? "font-black" : ""
                  }`}
                  style={{
                    WebkitTextStroke: "2px #1e293b",
                  }}
                >
                  {letters[idx]}
                </span>
              </div>
              {/* Texto de la opción */}
              <span
                className={`flex-1 text-left px-4 py-3 flex items-center text-sm md:text-base bg-transparent z-10 `}
              >
                {option}
              </span>
              {/* Diagonal visual */}
              <div
                className="absolute left-20 top-0 h-full w-4 bg-white z-20"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              ></div>
            </button>
          );
        })}
      </div>

      {/* Estilo para el corte diagonal */}
      <style>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;
