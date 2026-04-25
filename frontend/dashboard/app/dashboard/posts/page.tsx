"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  tema: string | null;
  tipo: string | null;
  texto_gerado: string | null;
  horario_sugerido: string | null;
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
  const map: Record<string, { label: string; cls: string }> = {
    pendente: { label: "Aguardando aprovação", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    aprovado: { label: "Aprovado", cls: "bg-sage-500 bg-opacity-10 text-sage-600 border-sage-500 border-opacity-20" },
    descartado: { label: "Descartado", cls: "bg-terra-500 bg-opacity-10 text-terra-600 border-terra-500 border-opacity-20" },
  };
  const s = map[status] || map.pendente;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: string | null }) {
  const label =
    tipo === "reels_com_ela" ? "Reels" :
    tipo === "reels_canva" ? "Canva" :
    tipo === "post_story" ? "Story" :
    tipo || "Post";
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-body font-medium bg-cream-200 text-stone-mid uppercase tracking-wider">
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
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
      .limit(50);
    setPosts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function atualizarStatus(id: string, status: string) {
    await supabase.from("posts_gerados").update({ status }).eq("id", id);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function gerarConteudo() {
    setGenerating(true);
    setGenerateMsg("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/conteudo/gerar`,
        { method: "POST" }
      );
      if (res.ok) {
        setGenerateMsg("Conteúdo gerado com sucesso!");
        await fetchPosts();
      } else {
        setGenerateMsg("Erro ao gerar conteúdo. Tente novamente.");
      }
    } catch {
      setGenerateMsg("Erro de conexão. Tente novamente.");
    } finally {
      setGenerating(false);
      setTimeout(() => setGenerateMsg(""), 4000);
    }
  }

  const pendentes = posts.filter((p) => p.status === "pendente").length;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-stone-dark mb-1">Conteúdo Instagram</h1>
          <p className="text-stone-warm text-sm font-body">
            {pendentes > 0
              ? `${pendentes} post${pendentes > 1 ? "s" : ""} aguardando aprovação`
              : "Tudo aprovado por hoje"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={gerarConteudo}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-400 text-white font-body font-medium text-sm rounded-xl shadow-warm transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={generating ? "animate-spin" : ""}>
              {generating ? (
                <path d="M8 2V4M8 12V14M2 8H4M12 8H14M3.5 3.5L5 5M11 11L12.5 12.5M3.5 12.5L5 11M11 5L12.5 3.5"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8M8 2L10 4M8 2L6 4"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
            {generating ? "Gerando..." : "Gerar conteúdo"}
          </button>
          {generateMsg && (
            <p className={`text-xs font-body ${generateMsg.includes("sucesso") ? "text-sage-500" : "text-terra-500"}`}>
              {generateMsg}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-cream-200 p-6 animate-pulse">
              <div className="flex gap-3">
                <div className="h-6 w-20 bg-cream-200 rounded-full" />
                <div className="h-6 w-48 bg-cream-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 6H24M4 12H18M4 18H14" stroke="#8A8577" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-stone-dark mb-2">Nenhum post ainda</h3>
          <p className="text-stone-warm text-sm font-body mb-6">
            Clique em &quot;Gerar conteúdo&quot; para criar o primeiro post com IA
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
            const preview = conteudo.reels_com_ela || conteudo.post_story || conteudo.reels_canva || "";

            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-card border border-cream-200 overflow-hidden">
                <div
                  className="px-6 py-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedId(expanded ? null : post.id)}
                >
                  <StatusBadge status={post.status} />
                  <TipoBadge tipo={post.tipo} />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-stone-dark truncate">
                      {conteudo.tema || post.tema || "Sem tema"}
                    </p>
                    {!expanded && preview && (
                      <p className="text-xs text-stone-warm font-body truncate mt-0.5">{preview}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {post.horario_sugerido && (
                      <span className="text-xs text-stone-warm font-body hidden sm:block">{post.horario_sugerido}</span>
                    )}
                    <span className="text-xs text-stone-warm font-body hidden sm:block">{formatDate(post.criado_em)}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                      className={`text-stone-warm transition-transform ${expanded ? "rotate-180" : ""}`}>
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-cream-200">
                    <div className="px-6 py-5 space-y-4">
                      {conteudo.reels_com_ela && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">Reels com você</p>
                          <p className="text-sm font-body text-stone-dark leading-relaxed whitespace-pre-line bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                            {conteudo.reels_com_ela}
                          </p>
                        </div>
                      )}
                      {conteudo.reels_canva && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">Reels Canva</p>
                          <p className="text-sm font-body text-stone-dark leading-relaxed whitespace-pre-line bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                            {conteudo.reels_canva}
                          </p>
                        </div>
                      )}
                      {conteudo.post_story && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">Post / Story</p>
                          <p className="text-sm font-body text-stone-dark leading-relaxed whitespace-pre-line bg-cream-50 rounded-xl px-4 py-3 border border-cream-200">
                            {conteudo.post_story}
                          </p>
                        </div>
                      )}
                      {conteudo.hashtags && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">Hashtags</p>
                          <p className="text-sm font-body text-sage-600 bg-sage-500 bg-opacity-5 rounded-xl px-4 py-3 border border-sage-500 border-opacity-20">
                            {conteudo.hashtags}
                          </p>
                        </div>
                      )}
                      {conteudo.disclaimer && (
                        <div>
                          <p className="text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-2">Disclaimer</p>
                          <p className="text-xs font-body text-stone-warm italic leading-relaxed px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                            {conteudo.disclaimer}
                          </p>
                        </div>
                      )}
                    </div>

                    {post.status === "pendente" && (
                      <div className="px-6 pb-5 flex gap-3">
                        <button
                          onClick={() => atualizarStatus(post.id, "aprovado")}
                          className="flex-1 py-2.5 bg-sage-500 hover:bg-sage-600 text-white font-body font-medium text-sm rounded-xl shadow-warm transition-all"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => atualizarStatus(post.id, "descartado")}
                          className="flex-1 py-2.5 bg-white hover:bg-cream-100 text-terra-500 border border-terra-500 border-opacity-30 font-body font-medium text-sm rounded-xl transition-all"
                        >
                          Descartar
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
