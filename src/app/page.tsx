import Link from "next/link";
import { CheckSquare, ArrowRight, Kanban, Calendar, BarChart3, CheckCircle2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight mb-4">
          Organize suas tarefas com <span className="text-blue-600">TaskPRO</span>
        </h1>
        <p className="text-gray-500 text-base max-w-md mb-8">
          Crie tarefas, gerencie prazos, acompanhe progresso no Kanban e visualize tudo em um calendário.
        </p>
        <div className="flex gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Começar grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Tudo que você precisa
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <CheckSquare className="w-5 h-5 text-blue-600" />,
                title: "Gestão de tarefas",
                desc: "Crie, edite e organize tarefas com sub-tarefas e barra de progresso.",
              },
              {
                icon: <Kanban className="w-5 h-5 text-blue-600" />,
                title: "Quadro Kanban",
                desc: "Mova tarefas entre colunas com drag and drop.",
              },
              {
                icon: <Calendar className="w-5 h-5 text-blue-600" />,
                title: "Calendário",
                desc: "Visualize todos os seus prazos em um calendário interativo.",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
                title: "Dashboard",
                desc: "Gráficos e métricas para acompanhar sua produtividade.",
              },
              {
                icon: <Clock className="w-5 h-5 text-blue-600" />,
                title: "Prioridades",
                desc: "Defina prioridade baixa, média ou alta para cada tarefa.",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
                title: "Login seguro",
                desc: "Entre com e-mail, Google ou GitHub.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
