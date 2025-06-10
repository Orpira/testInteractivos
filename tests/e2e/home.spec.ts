import { test, expect } from "@playwright/test";

test("la página de inicio muestra el título", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Test Your Knowledge/i)).toBeVisible();
});

test('el botón "Empezar sin cuenta" redirige al quiz', async ({ page }) => {
  await page.goto("/");
  await page.getByText("Empezar sin cuenta").click();
  await expect(page.getByText(/Configuración del Test/i)).toBeVisible();
});
test('el botón "Probar el Editor (requiere cuenta)" redirige al login', async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("Probar el Editor (requiere cuenta)").click();
  await expect(page).toHaveURL(/.*auth0.com/);
});
