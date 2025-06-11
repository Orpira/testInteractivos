// src/test/Result.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Result from "../features/quiz/Result";
import "@testing-library/jest-dom";

describe("Result page", () => {
  it("muestra el resultado correctamente", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/result",
            state: {
              score: 7,
              total: 10,
              category: "HTML",
            },
          } as any,
        ]}
      >
        <Result />
      </MemoryRouter>
    );

    expect(screen.getByText(/Resultado del test/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Has obtenido 7 de 10 puntos/i)
    ).toBeInTheDocument();
  });
});
