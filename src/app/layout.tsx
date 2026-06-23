import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskPRO — Gestão de Tarefas",
  description: "Gerencie suas tarefas com eficiência usando TaskPRO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Skip to content — acessibilidade */}
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>

        <ClientProviders>
          <main id="main-content">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
