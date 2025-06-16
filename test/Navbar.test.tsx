import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import Navbar from "../src/components/ui/Navbar";
import { Auth0Context } from "@auth0/auth0-react";
import { ReactElement } from "react";
import { RenderResult } from "@testing-library/react";
import { within as testingLibraryWithin } from "@testing-library/react";

// Utilidad para envolver con un contexto Auth0 falso
interface WithAuthOptions {
  isAuthenticated?: boolean;
}

interface MockAuth0Context {
  isAuthenticated: boolean;
  user?: { name: string };
  loginWithRedirect: () => void;
}

const withAuth = (
  ui: ReactElement,
  { isAuthenticated = false }: WithAuthOptions = {}
): RenderResult => {
  const mockCtx: MockAuth0Context = {
    isAuthenticated,
    user: isAuthenticated ? { name: "Ada" } : undefined,
    loginWithRedirect: vi.fn(),
  };
  return render(
    <Auth0Context.Provider value={mockCtx as any}>{ui}</Auth0Context.Provider>
  );
};

describe("<Navbar />", () => {
  it("muestra el botón “Iniciar sesión” cuando NO hay usuario", () => {
    render(
      <MemoryRouter>
        {" "}
        {/* Envolvemos el componente */}
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  });

  it("no muestra el botón de login si el usuario está autenticado", () => {
    render(
      <MemoryRouter>
        <Auth0Context.Provider
          value={
            {
              isAuthenticated: true,
              user: { name: "Ada" },
              loginWithRedirect: vi.fn(),
            } as any
          }
        >
          <Navbar />
        </Auth0Context.Provider>
        {/* Simulamos el estado autenticado */}
      </MemoryRouter>
    );
    expect(screen.queryByText("Iniciar sesión")).not.toBeInTheDocument();
  });

  it("abre y cierra el panel móvil con el botón hamburguesa", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    /* 1 – abre el menú */
    const openBtn = screen.getByRole("button", { name: /abrir menú/i });
    await user.click(openBtn);

    /* 2 – el panel ‘Menú móvil’ ya existe */
    const mobileNav = await screen.findByRole("navigation", {
      name: /Menú móvil/i,
      hidden: true, // permite encontrarlo aunque esté position:absolute
    });

    /* 3 – cierra el menú pulsando su propio botón */
    const closeBtn = within(mobileNav).getByRole("button", {
      name: /cerrar menú/i,
    });
    await user.click(closeBtn);

    /* 4 – el panel desapareció */
    expect(
      screen.queryByRole("navigation", { name: /Menú móvil/i, hidden: true })
    ).not.toBeInTheDocument();
  });
  function within(mobileNav: HTMLElement) {
    return testingLibraryWithin(mobileNav);
  }
});
