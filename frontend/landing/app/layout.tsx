import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clínica Lumiar — Especialistas em TEA e Desenvolvimento Infantil | Tramandaí RS",
  description:
    "Especialistas em TEA, terapia ocupacional, integração sensorial e desenvolvimento infantil em Tramandaí RS. Agende a avaliação do seu filho pelo WhatsApp.",
  openGraph: {
    title: "Clínica Lumiar — Especialistas em TEA | Tramandaí RS",
    description:
      "Equipe multidisciplinar especializada em TEA e desenvolvimento infantil. Atendimento humanizado em Tramandaí RS.",
    type: "website",
  },
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
