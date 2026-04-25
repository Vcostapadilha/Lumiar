"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase";

type Material = {
  id: string;
  titulo: string;
  categoria: string;
  arquivo_url: string | null;
  ativo: boolean;
  criado_em: string;
};

const CATEGORIAS = [
  "TEA e Autismo",
  "Integração Sensorial",
  "Terapia Ocupacional",
  "Psicologia Infantil",
  "Psicopedagogia",
  "Alimentação e Seletividade",
  "Família e Parentalidade",
  "Escola e Inclusão",
  "Desenvolvimento Motor",
  "Comunicação e Linguagem",
];

export default function MateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [drag, setDrag] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchMateriais = useCallback(async () => {
    const { data } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("criado_em", { ascending: false });
    setMateriais(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMateriais(); }, [fetchMateriais]);

  function onFileSelect(file: File) {
    if (!file.name.endsWith(".pdf")) {
      setUploadMsg("Apenas arquivos PDF são aceitos.");
      return;
    }
    setArquivo(file);
    setTitulo(file.name.replace(".pdf", "").replace(/_/g, " "));
    setUploadMsg("");
  }

  async function handleUpload() {
    if (!arquivo || !titulo.trim()) return;
    setUploading(true);
    setUploadMsg("");

    const ext = arquivo.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from("knowledge-base")
      .upload(path, arquivo, { contentType: "application/pdf" });

    if (storageErr) {
      setUploadMsg("Erro ao enviar arquivo. Verifique se o bucket existe.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("knowledge-base").getPublicUrl(path);

    const { error: dbErr } = await supabase.from("knowledge_base").insert({
      titulo: titulo.trim(),
      categoria,
      arquivo_url: urlData.publicUrl,
      ativo: true,
    });

    if (dbErr) {
      setUploadMsg("Arquivo enviado mas erro ao salvar no banco.");
    } else {
      setUploadMsg("Material salvo com sucesso!");
      setArquivo(null);
      setTitulo("");
      setCategoria(CATEGORIAS[0]);
      await fetchMateriais();
    }

    setUploading(false);
    setTimeout(() => setUploadMsg(""), 4000);
  }

  async function toggleAtivo(id: string, atual: boolean) {
    await supabase.from("knowledge_base").update({ ativo: !atual }).eq("id", id);
    setMateriais((prev) => prev.map((m) => (m.id === id ? { ...m, ativo: !atual } : m)));
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-stone-dark mb-1">Materiais</h1>
        <p className="text-stone-warm text-sm font-body">
          PDFs que a IA usa como base para gerar conteúdo
        </p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-6 mb-8">
        <h2 className="font-display text-base text-stone-dark mb-4">Adicionar material</h2>

        {/* Drag and drop */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-4 ${
            drag ? "border-sage-500 bg-sage-500 bg-opacity-5" : "border-cream-200 hover:border-sage-400 hover:bg-cream-50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const file = e.dataTransfer.files[0];
            if (file) onFileSelect(file);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
          {arquivo ? (
            <div className="flex items-center justify-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 2H12L18 8V18C18 18.6 17.6 19 17 19H4C3.4 19 3 18.6 3 18V3C3 2.4 3.4 2 4 2Z"
                  fill="#5B8A6F" fillOpacity="0.15" stroke="#5B8A6F" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 2V8H18" stroke="#5B8A6F" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-body text-sage-600 font-medium">{arquivo.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setArquivo(null); setTitulo(""); }}
                className="text-stone-warm hover:text-terra-500 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3 text-stone-warm">
                <path d="M16 4V20M16 4L10 10M16 4L22 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 26H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-body text-stone-mid mb-1">Arraste um PDF aqui ou clique para selecionar</p>
              <p className="text-xs font-body text-stone-warm">Apenas arquivos .pdf</p>
            </>
          )}
        </div>

        {arquivo && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-1.5">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-sm font-body text-stone-dark focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-stone-mid uppercase tracking-wider mb-1.5">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-sm font-body text-stone-dark focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || !titulo.trim()}
              className="w-full py-2.5 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-400 text-white font-body font-medium text-sm rounded-xl shadow-warm transition-all"
            >
              {uploading ? "Salvando..." : "Salvar material"}
            </button>
          </div>
        )}

        {uploadMsg && (
          <p className={`text-sm font-body mt-3 ${uploadMsg.includes("sucesso") ? "text-sage-500" : "text-terra-500"}`}>
            {uploadMsg}
          </p>
        )}
      </div>

      {/* Lista */}
      <h2 className="font-display text-base text-stone-dark mb-4">
        Materiais cadastrados
        {!loading && <span className="text-stone-warm font-body text-sm font-normal ml-2">({materiais.length})</span>}
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-cream-200 p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-cream-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-cream-200 rounded" />
                  <div className="h-3 w-24 bg-cream-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : materiais.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card border border-cream-200 p-10 text-center">
          <p className="text-stone-warm text-sm font-body">Nenhum material cadastrado ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materiais.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-card border border-cream-200 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M4 2H12L18 8V18C18 18.6 17.6 19 17 19H4C3.4 19 3 18.6 3 18V3C3 2.4 3.4 2 4 2Z"
                    stroke="#8A8577" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 2V8H18" stroke="#8A8577" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-sm text-stone-dark truncate">{m.titulo}</p>
                <p className="text-xs text-stone-warm font-body">{m.categoria}</p>
              </div>
              {m.arquivo_url && (
                <a
                  href={m.arquivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sage-500 hover:text-sage-600 font-body underline flex-shrink-0"
                >
                  Ver PDF
                </a>
              )}
              <button
                onClick={() => toggleAtivo(m.id, m.ativo)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all border ${
                  m.ativo
                    ? "bg-sage-500 bg-opacity-10 text-sage-600 border-sage-500 border-opacity-20 hover:bg-opacity-20"
                    : "bg-cream-100 text-stone-warm border-cream-200 hover:bg-cream-200"
                }`}
              >
                {m.ativo ? "Ativo" : "Pausado"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
