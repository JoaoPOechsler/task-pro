import Link from "next/link";
import {
  CheckSquare,
  ArrowRight,
  Kanban,
  Calendar,
  BarChart3,
  CheckCircle2,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Organize. Priorize. Entregue.
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 max-w-3xl leading-tight mb-5">
          Gerencie suas tarefas com{" "}
          <span className="text-blue-600">TaskPRO</span>
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
          Crie tarefas, gerencie prazos, acompanhe progresso no Kanban e
          visualize tudo em um calendário interativo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-sm shadow-blue-200"
          >
            Começar grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Mockup do sistema */}
      <section className="px-4 pb-16 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-gray-50">
          {/* Barra do browser */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
              taskpro.vercel.app/dashboard
            </div>
          </div>

          {/* Conteúdo do mockup */}
          <div className="flex h-[360px]">
            {/* Sidebar mockup */}
            <div className="w-44 bg-white border-r border-gray-200 p-3 shrink-0 hidden sm:flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold px-2 mb-4 text-sm">
                <CheckSquare className="w-3.5 h-3.5" />
                TaskPRO
              </div>
              {[
                { icon: BarChart3, label: "Dashboard", active: true },
                { icon: CheckSquare, label: "Tarefas", active: false },
                { icon: Kanban, label: "Kanban", active: false },
                { icon: Calendar, label: "Calendário", active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${
                    active
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </div>

            {/* Dashboard mockup */}
            <div className="flex-1 p-4 overflow-hidden">
              <p className="text-xs font-semibold text-gray-700 mb-3">Dashboard</p>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Pendentes", value: "8", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Concluídas", value: "12", color: "text-green-600", bg: "bg-green-50" },
                  { label: "Vencidas", value: "2", color: "text-red-500", bg: "bg-red-50" },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-lg p-2 border border-gray-200 flex items-center gap-1.5">
                    <div className={`w-6 h-6 ${m.bg} rounded flex items-center justify-center shrink-0`}>
                      <div className={`w-2 h-2 rounded-sm ${m.color.replace("text-", "bg-")}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                      <p className="text-[10px] text-gray-400">{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gráfico mockup */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <p className="text-[10px] text-gray-500 mb-2">Por Status</p>
                  <div className="flex items-end justify-center gap-1.5 h-12">
                    <div className="w-6 bg-blue-400 rounded-t" style={{ height: "60%" }} />
                    <div className="w-6 bg-yellow-400 rounded-t" style={{ height: "35%" }} />
                    <div className="w-6 bg-green-400 rounded-t" style={{ height: "80%" }} />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <p className="text-[10px] text-gray-500 mb-2">Por Prioridade</p>
                  <div className="space-y-1.5 mt-1">
                    {[
                      { label: "Alta", pct: 40, color: "bg-red-400" },
                      { label: "Média", pct: 35, color: "bg-yellow-400" },
                      { label: "Baixa", pct: 25, color: "bg-green-400" },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center gap-1.5">
                        <span className="text-[9px] text-gray-400 w-8">{p.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista de tarefas mockup */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-3 py-1.5 border-b border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-600">Tarefas recentes</p>
                </div>
                {[
                  { title: "Reunião de planejamento", status: "doing", color: "bg-blue-400" },
                  { title: "Relatório mensal", status: "todo", color: "bg-gray-300" },
                  { title: "Revisão de código", status: "done", color: "bg-green-400" },
                ].map((t) => (
                  <div key={t.title} className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-50 last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${t.color} shrink-0`} />
                    <span className={`text-[10px] ${t.status === "done" ? "line-through text-gray-400" : "text-gray-600"}`}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
            Tudo que você precisa
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">
            Uma plataforma completa para organizar sua vida profissional e pessoal.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <CheckSquare className="w-5 h-5 text-blue-600" />,
                title: "Gestão de tarefas",
                desc: "Crie, edite e organize tarefas com sub-tarefas e barra de progresso automática.",
              },
              {
                icon: <Kanban className="w-5 h-5 text-purple-600" />,
                title: "Quadro Kanban",
                desc: "Mova tarefas entre colunas com drag and drop e visualize o fluxo de trabalho.",
              },
              {
                icon: <Calendar className="w-5 h-5 text-green-600" />,
                title: "Calendário interativo",
                desc: "Visualize todos os seus prazos em um calendário com clique para detalhes.",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-orange-500" />,
                title: "Dashboard com gráficos",
                desc: "Métricas e gráficos para acompanhar sua produtividade em tempo real.",
              },
              {
                icon: <Clock className="w-5 h-5 text-red-500" />,
                title: "Prioridades e prazos",
                desc: "Defina prioridade baixa, média ou alta e receba alertas de vencimento.",
              },
              {
                icon: <Shield className="w-5 h-5 text-blue-600" />,
                title: "Login seguro",
                desc: "Entre com e-mail, Google ou GitHub com verificação de email.",
              },
              {
                icon: <Users className="w-5 h-5 text-teal-600" />,
                title: "Log de trabalho",
                desc: "Adicione comentários e logs em cada tarefa para acompanhar o histórico.",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
                title: "Acessibilidade",
                desc: "VLibras, modo escuro, alto contraste e ajuste de fonte incluídos.",
              },
              {
                icon: <ArrowRight className="w-5 h-5 text-blue-600" />,
                title: "100% na nuvem",
                desc: "Dados sincronizados em tempo real com Firebase. Acesse de qualquer lugar.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="mb-3 w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Pronto para ser mais produtivo?</h2>
        <p className="text-blue-100 text-sm mb-7 max-w-md mx-auto">
          Junte-se a centenas de pessoas que já organizam suas tarefas com o TaskPRO.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-md"
        >
          Criar conta gratuita
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
