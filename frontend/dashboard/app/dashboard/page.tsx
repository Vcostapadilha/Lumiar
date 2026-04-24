"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  tema: string | null;
  tipo: string | null;
  texto_gerado: string | null;
  status: string;
  criado_em: string;
};

type PostConteudo = {
  tema?: string;
  reels_com_ela?: string;
  reels_canva?: string;
  post_story?: string;
  hashtags?: string;
  disclaimer?: string;
};

function parseConteudo(texto: string | null): PostConteudo {
  if (!texto) return {};
  try {
    return JSON.parse(texto);
  } catch {
    return { post_story: texto };
  }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    pendente: { label: "Aguardando aprovacao", class: "bg-amber-50 text-amber-700 border-amber-200" },
    aprovado: { label: "Aprovado", class: "bg-sage-500 bg-opacity-10 text-sage-600 border-sage-500 border-opacity-20" },
    rejeitado: { label: "Rejeitado", class: "bg-terra-500 bg-opacity-10 text-terra-600 border-terra-500 border-opacity-20" },
  };
  const s = map[status] || map.pendente;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body font-medium border ${s.class}`}>
      {s.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from("posts_gerados")
      .select("*")
      .order("criado_em", { ascending: false })
      .limit(30);
    setPosts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function atualizarStatus(id: string, status: string) {
    await supabase.from("posts_gerados").update({ status }).eq("id", id);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function gerarConteudo() {
    setGenerating(true);
    setGenerateMsg("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://lumiar-production.up.railway.app"}/conteudo/gerar`,
        { method: "POST" }
      );
      if (res.ok) {
        setGenerateMsg("Conteudo gerado com sucesso!");
        await fetchPosts();
      } else {
        setGenerateMsg("Erro ao gerar conteudo. Tente novamente.");
      }
    } catch {
      setGenerateMsg("Erro de conexao. Tente novamente.");
    } finally {
      setGenerating(false);
      setTimeout(() => setGenerateMsg(""), 4000);
    }
  }

  const pendentes = posts.filter((p) => p.status === "pendente").length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-stone-dark mb-1">
            Conteudo Instagram
          </h1>
          <p className="text-stone-warm text-sm font-body">
            {pendentes > 0
              ? `${pendentes} post${pendentes > 1 ? "s" : ""} aguardando sua aprovacao`
              : "Tudo aprovado por hoje"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={gerarConteudo}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-400 text-white font-body font-medium text-sm rounded-xl shadow-warm transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={generating ? "animate-spin" : ""}>
              {generating ? (
                <path d="M8 2V4M8 12V14M2 8H4M12 8H14M3.5 3.5L5 5M11 11L12.5 12.5M3.5 12.5L5 11M11 5L12.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              ) : (
                <>
                  <path d="M8 2L8 6M8 6L6 4M8 6L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 9C2 11.8 4.2 14 7 14C9 14 10.8 12.8 11.6 11M14 7C14 4.2 11.8 2 9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              )}
            </svg>
            {generating ? "Gerando..." : "Gerar novo conteudo"}
          </button>
          {generateMsg && (
            <p className={`text-xs font-body ${generateMsg.includes("sucesso") ? "text-sage-500" : "text-terra-500"}`}>
              {generateMsg}
            </p>
          )}
        </div>
      </div>

      {/* Lista de posts */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-warm font-body text-sm">Carregando posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C14 4 8 8 8 14C8 18.4 10.8 22 14 22C17.2 22 20 18.4 20 14C20 8 14 4 14 4Z" fill="#5B8A6F" fillOpacity="0.3"/>
            </svg>
          </div>
          <h3 className="font-display text-lg text-stone-dark mb-2">Nenhum post ainda</h3>
          <p className="text-stone-warm text-sm font-body mb-6">
            Clique em "Gerar novo conteudo" para criar o primeiro post com IA
          </p>
          <button
            onClick={gerarConteudo}
            disabled={generating}
            className="px-6 py-2.5 bg-sage-500 hover:bg-sage-600 text-white font-body font-medium text-sm rounded-xl shadow-warm transition-all"
          >
            {generating ? "Gerando..." : "Gerar agora"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const conteudo = parseConteudo(post.texto_gerado);
            const expanded = expandedId === post.id;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-card border border-cream-200 overflow-hidden"
              >
                {/* Header do card */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <StatusBadge status={post.status} />
                    <h3 className="font-display text-base text-stone-dark truncate">
                      {conteudo.tema || post.tema || "Sem tema"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="text-xs text-stone-warm font-body hidden sm:block">
                      {formatDate(post.criado_em)}
                    </span>
                    <button
                      onClick={() => setExpandedId(expanded ? null : post.id)}
                      className="text-stone-warm hover:text-stone-dark transition-colors p-1"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Conteudo expandido */}
                {expanded && (
                  <div className="border-t border-cream-200">
                    <div className="px-6 py-5 space-y-5">
                      {conteudo.reels_com_ela && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                            Reels com voce
                          </p>
                          <p className="text-sm font-body text-stone-dark leading-relaxed whitespace-pre-line bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                            {conteudo.reels_com_ela}
                          </p>
                        </div>
                      )}
                      {conteudo.reels_canva && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                            Reels Canva
                          </p>
                          <p className="text-sm font-body text-stone-dark leading-relaxed whitespace-pre-line bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                            {conteudo.reels_canva}
                          </p>
                        </div>
                      )}
                      {conteudo.post_story && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                            Post / Story
                          </p>
                          <p className="text-sm font-body text-stone-dark leading-relaxed whitespace-pre-line bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                            {conteudo.post_story}
                          </p>
                        </div>
                      )}
                      {conteudo.hashtags && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                            Hashtags
                          </p>
                          <p className="text-sm font-body text-sage-600 bg-sage-500 bg-opacity-5 rounded-xl px-4 py-3 border border-sage-500 border-opacity-20">
                            {conteudo.hashtags}
                          </p>
                        </div>
                      )}
                      {conteudo.disclaimer && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">
                            Disclaimer sugerido
                          </p>
                          <p className="text-xs font-body text-stone-warm italic leading-relaxed px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                            {conteudo.disclaimer}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Acoes */}
                    {post.status === "pendente" && (
                      <div className="px-6 pb-5 flex gap-3">
                        <button
                          onClick={() => atualizarStatus(post.id, "aprovado")}
                          className="flex-1 py-2.5 bg-sage-500 hover:bg-sage-600 text-white font-body font-medium text-sm rounded-xl shadow-warm transition-all"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => atualizarStatus(post.id, "rejeitado")}
                          className="flex-1 py-2.5 bg-white hover:bg-cream-100 text-terra-500 border border-terra-500 border-opacity-30 font-body font-medium text-sm rounded-xl transition-all"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                    {post.status !== "pendente" && (
                      <div className="px-6 pb-5">
                        <button
                          onClick={() => atualizarStatus(post.id, "pendente")}
                          className="text-xs text-stone-warm hover:text-stone-dark font-body underline transition-colors"
                        >
                          Desfazer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
