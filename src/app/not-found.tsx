import Link from "next/link";
import { CheckSquare, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-8">
        <CheckSquare className="w-5 h-5" />
        TaskPRO
      </div>
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Página não encontrada</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>
    </div>
  );
}
