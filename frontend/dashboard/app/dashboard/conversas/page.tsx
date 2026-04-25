"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";

type Contato = {
  id: string;
  telefone: string;
  nome: string | null;
  status: string;
  ultima_mensagem: string | null;
  primeira_mensagem: string | null;
};

type Mensagem = {
  id: string;
  papel: string;
  mensagem: string;
  criado_em: string;
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  lead: { label: "Lead", cls: "bg-orange-50 text-orange-600 border-orange-200" },
  agendado: { label: "Agendado", cls: "bg-sage-500 bg-opacity-10 text-sage-600 border-sage-500 border-opacity-30" },
  paciente_ativo: { label: "Paciente ativo", cls: "bg-blue-50 text-blue-600 border-blue-200" },
  frio: { label: "Inativo", cls: "bg-cream-200 text-stone-mid border-cream-200" },
  inativo: { label: "Inativo", cls: "bg-cream-200 text-stone-mid border-cream-200" },
};

function tempoDecorrido(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}min atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDia(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function ConversasPage() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecionado, setSelecionado] = useState<Contato | null>(null);
  const [historico, setHistorico] = useState<Mensagem[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [busca, setBusca] = useState("");
  const supabase = createClient();

  const fetchContatos = useCallback(async () => {
    const { data } = await supabase
      .from("contatos")
      .select("*")
      .order("ultima_mensagem", { ascending: false });
    setContatos(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchContatos(); }, [fetchContatos]);

  async function abrirConversa(contato: Contato) {
    setSelecionado(contato);
    setLoadingHistorico(true);
    const { data } = await supabase
      .from("conversas")
      .select("*")
      .eq("contato_id", contato.id)
      .order("criado_em", { ascending: true });
    setHistorico(data || []);
    setLoadingHistorico(false);
  }

  const contatosFiltrados = contatos.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      (c.nome?.toLowerCase() || "").includes(termo) ||
      c.telefone.includes(termo)
    );
  });

  return (
    <div className="flex h-screen md:h-[calc(100vh)] overflow-hidden">
      {/* Lista de contatos */}
      <div className={`flex flex-col w-full md:w-80 border-r border-cream-200 bg-white ${selecionado ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-cream-200">
          <h1 className="font-display text-lg text-stone-dark mb-3">Conversas</h1>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou número..."
            className="w-full px-3 py-2 rounded-xl border border-cream-200 bg-cream-50 text-sm font-body text-stone-dark placeholder:text-stone-warm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3">
                  <div className="w-10 h-10 rounded-full bg-cream-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-cream-200 rounded" />
                    <div className="h-3 w-40 bg-cream-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : contatosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-stone-warm text-sm font-body">
              {busca ? "Nenhum contato encontrado" : "Nenhuma conversa ainda"}
            </div>
          ) : (
            contatosFiltrados.map((contato) => {
              const cfg = STATUS_CONFIG[contato.status] || STATUS_CONFIG.inativo;
              const ativo = selecionado?.id === contato.id;
              return (
                <button
                  key={contato.id}
                  onClick={() => abrirConversa(contato)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-cream-100 transition-all ${
                    ativo ? "bg-sage-500 bg-opacity-5" : "hover:bg-cream-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center flex-shrink-0 text-sm font-display text-stone-mid">
                    {(contato.nome || contato.telefone).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-body font-medium text-sm text-stone-dark truncate">
                        {contato.nome || contato.telefone}
                      </p>
                      <span className="text-[10px] text-stone-warm font-body whitespace-nowrap">
                        {tempoDecorrido(contato.ultima_mensagem)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-body font-medium border ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[11px] text-stone-warm font-body truncate">{contato.telefone}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Painel de conversa */}
      <div className={`flex-1 flex flex-col bg-cream-50 ${selecionado ? "flex" : "hidden md:flex"}`}>
        {selecionado ? (
          <>
            {/* Header da conversa */}
            <div className="bg-white border-b border-cream-200 px-4 py-4 flex items-center gap-3">
              <button
                onClick={() => setSelecionado(null)}
                className="md:hidden p-1 text-stone-warm hover:text-stone-dark"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center text-sm font-display text-stone-mid flex-shrink-0">
                {(selecionado.nome || selecionado.telefone).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-body font-medium text-sm text-stone-dark">
                  {selecionado.nome || selecionado.telefone}
                </p>
                <p className="text-xs text-stone-warm font-body">{selecionado.telefone}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-body font-medium border ${
                (STATUS_CONFIG[selecionado.status] || STATUS_CONFIG.inativo).cls
              }`}>
                {(STATUS_CONFIG[selecionado.status] || STATUS_CONFIG.inativo).label}
              </span>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingHistorico ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-stone-warm text-sm font-body">Carregando...</p>
                </div>
              ) : historico.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-stone-warm text-sm font-body">Nenhuma mensagem registrada</p>
                </div>
              ) : (
                historico.map((msg) => {
                  const isBot = msg.papel === "assistente" || msg.papel === "assistant";
                  return (
                    <div key={msg.id} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isBot
                          ? "bg-white border border-cream-200 text-stone-dark rounded-tl-sm"
                          : "bg-sage-500 text-white rounded-tr-sm"
                      }`}>
                        <p className="text-sm font-body leading-relaxed whitespace-pre-line">{msg.mensagem}</p>
                        <p className={`text-[10px] mt-1 ${isBot ? "text-stone-warm" : "text-white text-opacity-70"}`}>
                          {formatDia(msg.criado_em)} {formatHora(msg.criado_em)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 5C4 3.9 4.9 3 6 3H22C23.1 3 24 3.9 24 5V17C24 18.1 23.1 19 22 19H9L4 24V5Z"
                    stroke="#8A8577" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-stone-warm text-sm font-body">Selecione uma conversa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
