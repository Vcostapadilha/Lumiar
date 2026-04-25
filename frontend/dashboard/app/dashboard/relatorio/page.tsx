"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Insight = {
  tema_identificado: string;
  frequencia: number;
};

type HoraData = {
  hora: number;
  count: number;
};

type Relatorio = {
  totalContatos: number;
  convertidos: number;
  taxaConversao: number;
  totalMensagens: number;
  mensagensPorHora: HoraData[];
  insights: Insight[];
};

function BarraHorizontal({ valor, max, label }: { valor: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((valor / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-body text-stone-warm w-8 text-right flex-shrink-0">{label}</span>
      <div className="flex-1 bg-cream-200 rounded-full h-2">
        <div
          className="bg-sage-500 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-body text-stone-mid w-6 flex-shrink-0">{valor}</span>
    </div>
  );
}

export default function RelatorioPage() {
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function carregar() {
      const [contatos, mensagens, insights] = await Promise.all([
        supabase.from("contatos").select("status"),
        supabase.from("conversas").select("criado_em").order("criado_em", { ascending: false }).limit(1000),
        supabase
          .from("conversas_insights")
          .select("tema_identificado, frequencia")
          .order("frequencia", { ascending: false })
          .limit(10),
      ]);

      const total = contatos.data?.length ?? 0;
      const convertidos = contatos.data?.filter(
        (c) => c.status === "agendado" || c.status === "paciente_ativo"
      ).length ?? 0;
      const taxa = total > 0 ? Math.round((convertidos / total) * 100) : 0;

      // Agrupa mensagens por hora
      const byHora = Array(24).fill(0);
      for (const msg of mensagens.data || []) {
        const h = new Date(msg.criado_em).getHours();
        byHora[h]++;
      }
      const mensagensPorHora: HoraData[] = byHora
        .map((count, hora) => ({ hora, count }))
        .filter((h) => h.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      setRelatorio({
        totalContatos: total,
        convertidos,
        taxaConversao: taxa,
        totalMensagens: mensagens.data?.length ?? 0,
        mensagensPorHora,
        insights: insights.data || [],
      });
      setLoading(false);
    }

    carregar();
  }, [supabase]);

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-stone-dark mb-1">Relatório</h1>
        <p className="text-stone-warm text-sm font-body">Dados reais das conversas e contatos</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-cream-200 p-6 animate-pulse">
              <div className="h-4 w-32 bg-cream-200 rounded mb-4" />
              <div className="h-8 w-16 bg-cream-200 rounded" />
            </div>
          ))}
        </div>
      ) : relatorio ? (
        <div className="space-y-6">
          {/* Taxa de conversão */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-6">
            <h2 className="font-display text-base text-stone-dark mb-4">Taxa de conversão</h2>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-5xl font-display text-sage-500">{relatorio.taxaConversao}%</span>
              <span className="text-stone-warm text-sm font-body mb-2">de leads agendados</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-body">
              <div>
                <span className="text-stone-warm">Total de contatos: </span>
                <span className="text-stone-dark font-medium">{relatorio.totalContatos}</span>
              </div>
              <div>
                <span className="text-stone-warm">Convertidos: </span>
                <span className="text-sage-600 font-medium">{relatorio.convertidos}</span>
              </div>
            </div>
            {relatorio.totalContatos === 0 && (
              <p className="text-xs text-stone-warm font-body mt-3 italic">Nenhum contato registrado ainda</p>
            )}
          </div>

          {/* Total de mensagens */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-6">
            <h2 className="font-display text-base text-stone-dark mb-2">Mensagens processadas</h2>
            <p className="text-4xl font-display text-stone-dark">
              {relatorio.totalMensagens.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-stone-warm font-body mt-1">últimas 1.000 mensagens analisadas</p>
          </div>

          {/* Horários mais ativos */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-6">
            <h2 className="font-display text-base text-stone-dark mb-4">Horários com mais mensagens</h2>
            {relatorio.mensagensPorHora.length === 0 ? (
              <p className="text-sm text-stone-warm font-body">Nenhuma mensagem registrada ainda</p>
            ) : (
              <div className="space-y-3">
                {relatorio.mensagensPorHora.map((h) => {
                  const max = Math.max(...relatorio.mensagensPorHora.map((x) => x.count));
                  return (
                    <BarraHorizontal
                      key={h.hora}
                      valor={h.count}
                      max={max}
                      label={`${String(h.hora).padStart(2, "0")}h`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Temas recorrentes */}
          <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-6">
            <h2 className="font-display text-base text-stone-dark mb-4">Temas recorrentes nas conversas</h2>
            {relatorio.insights.length === 0 ? (
              <p className="text-sm text-stone-warm font-body">Nenhum insight registrado ainda</p>
            ) : (
              <div className="space-y-3">
                {relatorio.insights.map((ins, i) => {
                  const max = relatorio.insights[0].frequencia;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-body font-medium text-stone-mid w-5 flex-shrink-0">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-body text-stone-dark truncate">{ins.tema_identificado}</p>
                          <span className="text-xs font-body text-stone-warm ml-2 flex-shrink-0">{ins.frequencia}x</span>
                        </div>
                        <div className="bg-cream-200 rounded-full h-1.5">
                          <div
                            className="bg-sage-500 h-1.5 rounded-full"
                            style={{ width: `${Math.round((ins.frequencia / max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
