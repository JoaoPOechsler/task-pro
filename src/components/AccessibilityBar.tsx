"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, ZoomIn, ZoomOut, Contrast, RotateCcw } from "lucide-react";

type FontSize = "normal" | "lg" | "xl";
type Theme = "light" | "dark";

export default function AccessibilityBar() {
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    const savedFont = (localStorage.getItem("fontsize") as FontSize) || "normal";
    const savedContrast = localStorage.getItem("contrast") === "high";
    setTheme(savedTheme);
    setFontSize(savedFont);
    setHighContrast(savedContrast);
    applyTheme(savedTheme);
    applyFont(savedFont);
    applyContrast(savedContrast);
  }, []);

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute("data-theme", t);
  }

  function applyFont(f: FontSize) {
    document.documentElement.setAttribute("data-fontsize", f);
  }

  function applyContrast(c: boolean) {
    document.documentElement.setAttribute("data-contrast", c ? "high" : "normal");
  }

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  function increaseFontSize() {
    const next: FontSize = fontSize === "normal" ? "lg" : "xl";
    if (next === fontSize) return;
    setFontSize(next);
    localStorage.setItem("fontsize", next);
    applyFont(next);
  }

  function decreaseFontSize() {
    const next: FontSize = fontSize === "xl" ? "lg" : "normal";
    if (next === fontSize) return;
    setFontSize(next);
    localStorage.setItem("fontsize", next);
    applyFont(next);
  }

  function toggleContrast() {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("contrast", next ? "high" : "normal");
    applyContrast(next);
  }

  function resetAll() {
    setTheme("light");
    setFontSize("normal");
    setHighContrast(false);
    localStorage.removeItem("theme");
    localStorage.removeItem("fontsize");
    localStorage.removeItem("contrast");
    applyTheme("light");
    applyFont("normal");
    applyContrast(false);
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir barra de acessibilidade"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors text-lg font-bold"
        title="Acessibilidade"
      >
        A
      </button>

      {open && (
        <div
          role="region"
          aria-label="Controles de acessibilidade"
          className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex flex-col gap-2 min-w-[190px]"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Acessibilidade
          </p>

          {/* Tema */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            {theme === "light" ? "Modo escuro" : "Modo claro"}
          </button>

          {/* Alto contraste */}
          <button
            onClick={toggleContrast}
            aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors py-1"
          >
            <Contrast className="w-4 h-4" />
            {highContrast ? "Contraste normal" : "Alto contraste"}
          </button>

          {/* Tamanho da fonte */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 flex-1">Tamanho da fonte</span>
            <button
              onClick={decreaseFontSize}
              aria-label="Diminuir tamanho da fonte"
              disabled={fontSize === "normal"}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={increaseFontSize}
              aria-label="Aumentar tamanho da fonte"
              disabled={fontSize === "xl"}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          {/* Resetar */}
          <button
            onClick={resetAll}
            aria-label="Restaurar configurações padrão de acessibilidade"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors pt-1 border-t border-gray-100 mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar padrões
          </button>
        </div>
      )}
    </div>
  );
}
