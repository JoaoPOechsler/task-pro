"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LayoutDashboard, LogOut, CheckSquare, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
            <CheckSquare className="w-5 h-5" />
            TaskPRO
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/tasks" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Tarefas</Link>
                <Link href="/kanban" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Kanban</Link>
                <Link href="/calendar" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Calendário</Link>
                <button onClick={logout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link href="/tasks" className="block py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Tarefas</Link>
              <Link href="/kanban" className="block py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Kanban</Link>
              <Link href="/calendar" className="block py-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>Calendário</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left py-2 text-sm text-red-500">Sair</button>
            </>
          ) : (
            <Link href="/login" className="block py-2 text-sm text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>Entrar</Link>
          )}
        </div>
      )}
    </nav>
  );
}
