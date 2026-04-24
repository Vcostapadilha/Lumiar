"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha incorretos. Tente novamente.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      {/* Fundo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sage-500 opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-terra-500 opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sage-400 opacity-[0.03]" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage-500 mb-5 shadow-warm">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C14 4 8 8 8 14C8 18.4 10.8 22 14 22C17.2 22 20 18.4 20 14C20 8 14 4 14 4Z" fill="white" fillOpacity="0.9"/>
              <path d="M14 8C14 8 10 11 10 15C10 17.8 11.8 20 14 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl text-stone-dark mb-1">Lumiar</h1>
          <p className="text-stone-warm text-sm font-body">Painel da Clinica</p>
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-card p-8 border border-cream-200">
          <h2 className="font-display text-xl text-stone-dark mb-1">Bem-vinda</h2>
          <p className="text-stone-warm text-sm mb-7 font-body">
            Acesse seu painel de gestao
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 font-body text-stone-dark placeholder:text-stone-warm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 font-body text-stone-dark placeholder:text-stone-warm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {error && (
              <p className="text-terra-500 text-sm font-body bg-terra-400 bg-opacity-10 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-400 text-white font-body font-medium rounded-xl shadow-warm transition-all mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-warm text-xs font-body mt-6">
          Clinica Lumiar — Tramandai RS
        </p>
      </div>
    </div>
  );
}
