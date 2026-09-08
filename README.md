# Resiliencia Hídrica e Impacto Hidrológico Cero

Landing page de inscripción para el curso-taller 2026 de ANPROGERI.

## Qué es

Página de una sola pantalla construida con Next.js 15 App Router, TypeScript, Tailwind CSS, Lucide React y React Hook Form. Está optimizada para captar registros de leads y enviarlos a un webhook de n8n.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Scripts útiles

- `npm run dev` — desarrollo con recarga en caliente.
- `npm run build` — genera el sitio optimizado para producción.
- `npm run start` — inicia el servidor de producción.
- `npm run lint` — revisa el código con ESLint.
- `npm run typecheck` — verifica tipos con TypeScript.
- `npm test` — ejecuta las pruebas de Playwright.

## Variables de entorno

Crea un archivo `.env.local` con la URL del webhook de n8n:

```env
N8N_WEBHOOK_URL=https://tu-instancia.n8n.io/webhook/...
```

Si `N8N_WEBHOOK_URL` no está configurada, el formulario simula un envío exitoso sin guardar datos. Eso sirve para probar la interfaz, pero **no** para recibir inscripciones reales.

## Estructura importante

- `src/app/page.tsx` — contenido principal de la landing.
- `src/components/registration-form.tsx` — formulario de registro con validación.
- `src/app/api/register/route.ts` — recibe el formulario y lo reenvía al webhook.
- `src/lib/registration.ts` — validación compartida entre cliente y servidor.
- `public/og-image.webp` — imagen Open Graph.

## Cómo conectar n8n

1. Crea un webhook en tu flujo de n8n.
2. Copia la URL del webhook.
3. Configura `N8N_WEBHOOK_URL` en Vercel o en `.env.local`.
4. Redespliega o reinicia el servidor.

El payload que recibe n8n es:

```json
{
  "fullName": "Nombre del participante",
  "email": "correo@ejemplo.com",
  "phone": "5512345678",
  "profession": "Ingeniero civil",
  "isAssociate": false,
  "timestamp": "2026-09-07T00:00:00.000Z",
  "source": "Landing Page Resiliencia Hidrica"
}
```

## Pruebas

Las pruebas usan Playwright. Antes de ejecutarlas instala los navegadores:

```bash
npx playwright install chromium
```

Luego:

```bash
npm test
```

Las pruebas cubren la validación del formulario, el reenvío al webhook, el manejo de errores, el timeout y la experiencia en móvil y escritorio.

## Despliegue en Vercel

Este proyecto está listo para Vercel. Solo conecta el repositorio, configura la variable de entorno `N8N_WEBHOOK_URL` y despliega.

## Notas

- No se usa base de datos ni autenticación.
- La URL del webhook nunca llega al navegador; se maneja solo en el servidor.
- Los errores del webhook se muestran de forma genérica al usuario para no exponer detalles internos.
