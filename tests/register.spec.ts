import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

const registration = {
  fullName: "María González",
  email: "maria@example.com",
  phone: "5512345678",
  profession: "Ingeniera civil",
  isAssociate: false,
};
const successMessage = /¡Registro exitoso!\s*En breve te enviaremos la información bancaria y de acceso a tu correo\./;
const configuredEndpoint = "http://127.0.0.1:3001/api/register";

async function fillRegistration(page: Page) {
  await page.getByLabel("Nombre completo").fill(registration.fullName);
  await page.getByLabel("Correo electrónico").fill(registration.email);
  await page.getByLabel("Teléfono / WhatsApp").fill(registration.phone);
  await page.getByLabel("Profesión / Cargo").fill(registration.profession);
  await page.getByLabel("¿Es asociado de ANPROGERI?").selectOption("no");
}

test.describe("API de registro", () => {
  test("acepta un registro sin webhook configurado", async ({ request }) => {
    const response = await request.post("/api/register", { data: registration });
    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"]).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
  });

  test("acepta profesión omitida y asociación afirmativa", async ({ request }) => {
    const response = await request.post("/api/register", {
      data: { fullName: "  María  ", email: "  maria@example.com  ", phone: "0012345678", isAssociate: true },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  const invalidCases: [string, unknown][] = [
    ["nombre ausente", { ...registration, fullName: undefined }],
    ["nombre vacío", { ...registration, fullName: "   " }],
    ["nombre demasiado largo", { ...registration, fullName: "a".repeat(121) }],
    ["nombre no textual", { ...registration, fullName: 42 }],
    ["correo ausente", { ...registration, email: undefined }],
    ["correo inválido", { ...registration, email: "maria@example" }],
    ["correo con espacios", { ...registration, email: "mar ia@example.com" }],
    ["correo demasiado largo", { ...registration, email: `${"a".repeat(243)}@example.com` }],
    ["teléfono ausente", { ...registration, phone: undefined }],
    ["teléfono corto", { ...registration, phone: "123456789" }],
    ["teléfono largo", { ...registration, phone: "12345678901" }],
    ["teléfono numérico", { ...registration, phone: 5512345678 }],
    ["teléfono con separadores", { ...registration, phone: "55-1234567" }],
    ["teléfono con salto de línea", { ...registration, phone: "5512345678\n" }],
    ["profesión demasiado larga", { ...registration, profession: "a".repeat(121) }],
    ["profesión no textual", { ...registration, profession: null }],
    ["asociación ausente", { ...registration, isAssociate: undefined }],
    ["asociación textual", { ...registration, isAssociate: "false" }],
    ["asociación numérica", { ...registration, isAssociate: 0 }],
    ["objeto vacío", {}],
    ["lista", []],
  ];

  for (const [name, data] of invalidCases) {
    test(`rechaza ${name}`, async ({ request }) => {
      const response = await request.post("/api/register", { data });
      expect(response.status()).toBe(400);
      expect(await response.json()).toMatchObject({ status: "error", message: expect.any(String) });
    });
  }

  test("rechaza JSON malformado y null", async ({ request }) => {
    for (const data of ['{"fullName":', "null"]) {
      const response = await request.post("/api/register", {
        data,
        headers: { "Content-Type": "application/json" },
      });
      expect(response.status()).toBe(400);
      expect(await response.json()).toMatchObject({ status: "error", message: expect.any(String) });
    }
  });

  test("normaliza y envía solo campos permitidos con origen y fecha del servidor", async ({ request }) => {
    const email = `forward-${randomUUID()}@example.com`;
    const before = Date.now();
    const response = await request.post(configuredEndpoint, {
      data: {
        ...registration,
        fullName: "  María González  ",
        email: `  ${email}  `,
        profession: "  Ingeniera civil  ",
        source: "Origen manipulado",
        timestamp: "1999-01-01T00:00:00.000Z",
        secret: "no reenviar",
      },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    const captured = await request.get(`http://127.0.0.1:4318/requests?email=${encodeURIComponent(email)}`);
    const entries = await captured.json();
    expect(entries).toHaveLength(1);
    expect(entries[0].contentType).toBe("application/json");
    expect(entries[0].body).toEqual({
      ...registration,
      email,
      source: "Landing Page Resiliencia Hidrica",
      timestamp: expect.any(String),
    });
    const timestamp = entries[0].body.timestamp;
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
    expect(Date.parse(timestamp)).toBeGreaterThanOrEqual(before);
    expect(Date.parse(timestamp)).toBeLessThanOrEqual(Date.now());
  });

  test("no sigue redirecciones ni filtra los datos a su destino", async ({ request }) => {
    const email = `redirect-${randomUUID()}@example.com`;
    const response = await request.post(configuredEndpoint, { data: { ...registration, email } });
    expect(response.status()).toBe(502);
    expect(await response.json()).toMatchObject({ status: "error", message: expect.any(String) });
    const captured = await request.get(`http://127.0.0.1:4318/requests?email=${encodeURIComponent(email)}`);
    const entries = await captured.json();
    expect(entries).toHaveLength(1);
    expect(entries[0].path).toBe("/webhook");
  });

  test("oculta los errores privados del webhook", async ({ request }) => {
    const response = await request.post(configuredEndpoint, {
      data: { ...registration, email: `failure-${randomUUID()}@example.com` },
    });
    expect(response.status()).toBe(502);
    expect(await response.json()).toEqual({ status: "error", message: "No pudimos completar tu registro. Inténtalo de nuevo." });
    expect(await response.text()).not.toContain("secret-webhook-token");
  });

  test("interrumpe un webhook que no responde", async ({ request }) => {
    const response = await request.post(configuredEndpoint, {
      data: { ...registration, email: `timeout-${randomUUID()}@example.com` },
      timeout: 12_000,
    });
    expect(response.status()).toBe(502);
    expect(await response.json()).toEqual({ status: "error", message: "No pudimos conectar con el servicio de registro. Inténtalo de nuevo." });
  });
});

test.describe("Formulario de registro", () => {
  test("muestra errores locales antes de enviar", async ({ page }) => {
    await page.goto("/");
    let requests = 0;
    await page.route("**/api/register", async route => {
      requests += 1;
      await route.fulfill({ json: { status: "ok" } });
    });
    await page.getByRole("button", { name: "Registrarme e Inscribirme" }).click();
    await expect(page.getByLabel("Nombre completo")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Correo electrónico")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Teléfono / WhatsApp")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("¿Es asociado de ANPROGERI?")).toHaveAttribute("aria-invalid", "true");
    expect(requests).toBe(0);
  });

  test("rechaza correo inválido y teléfono incompleto", async ({ page }) => {
    await page.goto("/");
    await fillRegistration(page);
    await page.getByLabel("Correo electrónico").fill("correo-invalido");
    await page.getByLabel("Teléfono / WhatsApp").fill("12345");
    await page.getByRole("button", { name: "Registrarme e Inscribirme" }).click();
    await expect(page.getByText("Escribe un correo electrónico válido.")).toBeVisible();
    await expect(page.getByText("Ingresa exactamente 10 dígitos.")).toBeVisible();
  });

  test("los enlaces llevan al programa y al registro, y las preguntas se abren", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Ver Programa Completo" }).click();
    await expect(page).toHaveURL(/#programa$/);
    await page.getByRole("link", { name: "Quiero inscribirme", exact: true }).click();
    await expect(page).toHaveURL(/#registro$/);
    await page.getByText("¿Cómo aparto mi lugar?", { exact: true }).click();
    await expect(page.getByText("Completa el formulario y te enviaremos", { exact: false })).toBeVisible();
  });

  test("completa un registro y confirma el éxito", async ({ page }) => {
    await page.goto("/");
    await fillRegistration(page);
    const responsePromise = page.waitForResponse("**/api/register");
    await page.getByRole("button", { name: "Registrarme e Inscribirme" }).click();
    expect((await responsePromise).status()).toBe(200);
    await expect(page.getByRole("status")).toContainText(successMessage);
  });

  test("bloquea envíos duplicados durante la carga y permite reintentar un error", async ({ page }) => {
    await page.goto("/");
    await fillRegistration(page);
    let release = () => {};
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/api/register", async route => {
      await gate;
      await route.fulfill({ status: 502, json: { status: "error", message: "No pudimos completar tu registro. Inténtalo de nuevo." } });
    });
    const button = page.locator('button[type="submit"]');
    await button.click();
    try {
      await expect(button).toBeDisabled();
      await expect(button).toContainText("Enviando");
    } finally {
      release();
    }
    await expect(page.locator("form").getByRole("alert")).toContainText("No pudimos completar tu registro");
    await expect(button).toBeEnabled();
    await expect(page.getByLabel("Nombre completo")).toHaveValue(registration.fullName);
    await page.unroute("**/api/register");
    await button.click();
    await expect(page.getByRole("status")).toContainText(successMessage);
  });

  test("no desborda horizontalmente y guarda una captura", async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".hero-artwork")).toHaveJSProperty("complete", true);
    expect(await page.locator(".hero-artwork").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`landing-${testInfo.project.name}.png`), fullPage: true });
    await page.locator(".hero").screenshot({ path: testInfo.outputPath(`hero-${testInfo.project.name}.png`) });
    await page.locator("form").screenshot({ path: testInfo.outputPath(`form-${testInfo.project.name}.png`) });
    expect(errors).toEqual([]);
  });
});
