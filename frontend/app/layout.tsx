import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "fotonIA Analytics",
  description: "Análisis exploratorio de datos energéticos"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
