import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://resiliencia-hidrica.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Resiliencia Hídrica e Impacto Hidrológico Cero | Curso-Taller 2026",
  description:
    "Diseña soluciones basadas en la naturaleza. Curso-taller en línea de 20 horas, del 25 de septiembre al 3 de octubre de 2026. Inscríbete desde el 50%.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Resiliencia Hídrica e Impacto Hidrológico Cero",
    description: "20 horas para transformar tu manera de diseñar con el agua. Curso-taller en línea · Septiembre 2026.",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Resiliencia Hídrica e Impacto Hidrológico Cero — Curso-Taller 2026",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
