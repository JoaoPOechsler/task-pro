"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckSquare, User, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterFormData } from "@/types/user";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter letra maiúscula")
      .regex(/[0-9]/, "Deve conter número")
      .regex(/[^A-Za-z0-9]/, "Deve conter caractere especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const { registerWithEmail, resendVerificationEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch("password", "");

  const passwordChecks = [
    { label: "8+ caracteres", ok: passwordValue.length >= 8 },
    { label: "Maiúscula", ok: /[A-Z]/.test(passwordValue) },
    { label: "Número", ok: /[0-9]/.test(passwordValue) },
    { label: "Especial", ok: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerWithEmail(data.name, data.email, data.password);
      setCredentials({ email: data.email, password: data.password });
      setRegistered(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta.";
      toast.error(msg.includes("email-already-in-use") ? "Este e-mail já está cadastrado." : msg);
    }
  }

  async function handleResend() {
    if (!credentials) return;
    setResending(true);
    try {
      await resendVerificationEmail(credentials.email, credentials.password);
      setResent(true);
      toast.success("E-mail reenviado! Verifique sua caixa de entrada e o spam.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao reenviar.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm text-center bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Conta criada!</h2>
          <p className="text-gray-400 text-sm mb-1">
            Enviamos um e-mail de verificação para:
          </p>
          <p className="text-blue-600 text-sm font-medium mb-6">
            {credentials?.email}
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Confirme o link no e-mail para ativar sua conta. Verifique também a caixa de spam.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
            >
              Ir para o Login
            </Link>
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {resent ? "E-mail reenviado" : "Reenviar e-mail"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold text-xl">
            <CheckSquare className="w-5 h-5" />
            TaskPRO
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Criar conta</h1>
          <p className="text-gray-400 text-sm mt-1">Comece gratuitamente</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="João Silva"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              {passwordValue && (
                <div className="mt-2 flex gap-3 flex-wrap">
                  {passwordChecks.map((c) => (
                    <div key={c.label} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${c.ok ? "bg-green-500" : "bg-gray-200"}`} />
                      <span className={`text-xs ${c.ok ? "text-green-600" : "text-gray-400"}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar conta
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
