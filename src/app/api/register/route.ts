import { validateRegistration } from "@/lib/registration";

export const runtime = "nodejs";

function json(body: { status: "ok" | "error"; message?: string }, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ status: "error", message: "El cuerpo de la solicitud debe ser JSON válido." }, 400);
  }

  const result = validateRegistration(input);
  if (!result.success) {
    return json({ status: "error", message: result.message }, 400);
  }

  const payload = {
    ...result.data,
    timestamp: new Date().toISOString(),
    source: "Landing Page Resiliencia Hidrica",
  };
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    console.info("Registro simulado: N8N_WEBHOOK_URL no está configurada.",
      process.env.NODE_ENV === "production"
        ? { timestamp: payload.timestamp, source: payload.source, personalData: "[REDACTED]" }
        : payload,
    );
    return json({ status: "ok" });
  }

  let url: URL;
  try {
    url = new URL(webhookUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    return json({ status: "error", message: "El servicio de registro no está disponible. Inténtalo más tarde." }, 503);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
      redirect: "error",
      cache: "no-store",
    });
    if (!response.ok) {
      return json({ status: "error", message: "No pudimos completar tu registro. Inténtalo de nuevo." }, 502);
    }
    return json({ status: "ok" });
  } catch {
    return json({ status: "error", message: "No pudimos conectar con el servicio de registro. Inténtalo de nuevo." }, 502);
  }
}
