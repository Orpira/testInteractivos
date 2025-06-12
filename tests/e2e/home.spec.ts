import { test, expect } from "@playwright/test";

test("la página de inicio muestra el título", async ({ page }) => {
  await page.goto("/");
  // Usa getByRole para evitar ambigüedad
  await expect(
    page.getByRole("heading", { name: /WebWiz Quiz/i })
  ).toBeVisible();
});

test('el botón "Empezar sin cuenta" redirige al quiz', async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Empezar sin cuenta/i }).click();
  await expect(
    page.getByRole("heading", { name: /Configura tu Test/i })
  ).toBeVisible();
});
test('el botón "Iniciar test" redirige al quiz', async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Iniciar test/i }).click();
  // Usa getByRole para asegurar que encuentra el heading
  await expect(
    page.getByRole("heading", { name: /Configura tu Test/i })
  ).toBeVisible();
});
test('el botón "Probar editor" redirige al editor', async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Probar editor/i }).click();
  await expect(
    page.getByRole("heading", { name: /Editor de Código/i })
  ).toBeVisible();
});
test('el botón "Iniciar sesión" redirige a Auth0', async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Iniciar sesión/i }).click();
  // Verifica que la URL cambie a Auth0
  await expect(page).toHaveURL(/auth0/);
});
