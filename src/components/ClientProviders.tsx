"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import VLibras from "@/components/VLibras";
import AccessibilityBar from "@/components/AccessibilityBar";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="top-right" />
      {/* VLibras — tradução em LIBRAS obrigatória */}
      <VLibras />
      {/* Barra de acessibilidade: tema, fonte, contraste */}
      <AccessibilityBar />
    </AuthProvider>
  );
}
