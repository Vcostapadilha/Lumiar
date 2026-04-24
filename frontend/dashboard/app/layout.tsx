import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumiar — Painel",
  description: "Painel de gestão da Clínica Lumiar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
