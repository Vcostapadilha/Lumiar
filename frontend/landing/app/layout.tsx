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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}