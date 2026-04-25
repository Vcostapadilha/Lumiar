"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Metricas = {
  conversasHoje: number;
  postsPendentes: number;
  leadsSemResposta: number;
  agendamentosHoje: number;
};

type Alerta = {
  tipo: "post" | "lead";
  descricao: string;
};

function MetricaCard({
  label,
  valor,
  cor,
  icon,
}: {
  label: string;
  valor: number;
  cor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cor}`}>
        {icon}
      </div>
      <p className="text-3xl font-display text-stone-dark mb-1">{valor}</p>
      <p className="text-xs font-body text-stone-warm">{label}</p>
    </div>
  );
}

export default function InicioPage() {
  const [metricas, setMetricas] = useState<Metricas>({
    conversasHoje: 0,
    postsPendentes: 0,
    leadsSemResposta: 0,
    agendamentosHoje: 0,
  });
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function carregar() {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);
      const limite48h = new Date(Date.now() - 48 * 60 * 60 * 1000);

      const [msgs, posts, leads, ags] = await Promise.all([
        supabase
          .from("contatos")
          .select("id", { count: "exact", head: true })
          .gte("ultima_mensagem", hoje.toISOString()),
        supabase
          .from("posts_gerados")
          .select("id", { count: "exact", head: true })
          .eq("status", "pendente"),
        supabase
          .from("contatos")
          .select("id", { count: "exact", head: true })
          .eq("status", "lead")
          .lte("ultima_mensagem", limite48h.toISOString()),
        supabase
          .from("agendamentos")
          .select("id", { count: "exact", head: true })
          .gte("data_hora", hoje.toISOString())
          .lt("data_hora", amanha.toISOString()),
      ]);

      setMetricas({
        conversasHoje: msgs.count ?? 0,
        postsPendentes: posts.count ?? 0,
        leadsSemResposta: leads.count ?? 0,
        agendamentosHoje: ags.count ?? 0,
      });

      const novosAlertas: Alerta[] = [];
      if ((posts.count ?? 0) > 0) {
        novosAlertas.push({
          tipo: "post",
          descricao: `${posts.count} post${(posts.count ?? 0) > 1 ? "s" : ""} aguardando sua aprovacao`,
        });
      }
      if ((leads.count ?? 0) > 0) {
        novosAlertas.push({
          tipo: "lead",
          descricao: `${leads.count} lead${(leads.count ?? 0) > 1 ? "s" : ""} sem resposta ha mais de 48h`,
        });
      }
      setAlertas(novosAlertas);
      setLoading(false);
    }

    carregar();
  }, [supabase]);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl text-stone-dark mb-1">{saudacao} 🌿</h1>
        <p className="text-stone-warm text-sm font-body">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-cream-200 p-5 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-cream-200 mb-3" />
              <div className="h-8 w-12 bg-cream-200 rounded mb-1" />
              <div className="h-3 w-24 bg-cream-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricaCard
            label="Conversas hoje"
            valor={metricas.conversasHoje}
            cor="bg-sage-500 bg-opacity-10"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 3C2 2.4 2.4 2 3 2H15C15.6 2 16 2.4 16 3V11C16 11.6 15.6 12 15 12H6L2 16V3Z"
                  stroke="#5B8A6F" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            }
          />
          <MetricaCard
            label="Posts pendentes"
            valor={metricas.postsPendentes}
            cor="bg-amber-50"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#D97706" strokeWidth="1.5" />
                <path d="M9 5V9L11 11" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
          <MetricaCard
            label="Leads sem resposta"
            valor={metricas.leadsSemResposta}
            cor="bg-terra-400 bg-opacity-10"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" stroke="#C4704A" strokeWidth="1.5" />
                <path d="M3 16C3 13.2 5.7 11 9 11C12.3 11 15 13.2 15 16" stroke="#C4704A" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
          <MetricaCard
            label="Agendamentos hoje"
            valor={metricas.agendamentosHoje}
            cor="bg-blue-50"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="3" width="14" height="13" rx="2" stroke="#3B82F6" strokeWidth="1.5" />
                <path d="M2 7H16M6 2V4M12 2V4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      )}

      {/* Alertas */}
      <div>
        <h2 className="font-display text-base text-stone-dark mb-3">Alertas do dia</h2>
        {alertas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-6 text-center">
            <p className="text-stone-warm text-sm font-body">Tudo em dia! Sem alertas por enquanto.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertas.map((alerta, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-body ${
                  alerta.tipo === "post"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-terra-400 bg-opacity-10 border-terra-400 border-opacity-30 text-terra-600"
                }`}
              >
                <span className="text-base">{alerta.tipo === "post" ? "📝" : "👤"}</span>
                {alerta.descricao}
                <a
                  href={alerta.tipo === "post" ? "/dashboard/posts" : "/dashboard/conversas"}
                  className="ml-auto underline text-xs whitespace-nowrap"
                >
                  Ver agora
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
