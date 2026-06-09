"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, LayoutDashboard, ListTodo, Kanban, Calendar, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: ListTodo, label: "Tarefas" },
  { href: "/kanban", icon: Kanban, label: "Kanban" },
  { href: "/calendar", icon: Calendar, label: "Calendário" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 py-5 px-3 gap-1 shrink-0">
      <div className="flex items-center gap-2 text-blue-600 font-bold px-2 mb-5">
        <CheckSquare className="w-4 h-4" />
        TaskPRO
      </div>
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${
            pathname === href
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </aside>
  );
}
