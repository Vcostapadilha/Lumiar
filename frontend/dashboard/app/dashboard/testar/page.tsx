"use client";

import { useState, useRef, useEffect } from "react";

type Mensagem = {
  de: "voce" | "lumi";
  texto: string;
};

const TELEFONE_TESTE = "5500000000000";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lumiar-production.up.railway.app";

export default function TestarLumiPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { de: "lumi", texto: "Oi! Sou a Lumi da Clínica Lumiar. Como posso ajudar você hoje?" },
  ]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar() {
    const texto = input.trim();
    if (!texto || enviando) return;

    setInput("");
    setMensagens((prev) => [...prev, { de: "voce", texto }]);
    setEnviando(true);

    try {
      const payload = {
        event: "messages.upsert",
        data: {
          key: { remoteJid: `${TELEFONE_TESTE}@s.whatsapp.net`, fromMe: false },
          message: { conversation: texto },
        },
      };

      const res = await fetch(`${BACKEND}/whatsapp/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const resposta = data.resposta || "Sem resposta.";
        setMensagens((prev) => [...prev, { de: "lumi", texto: resposta }]);
      } else {
        setMensagens((prev) => [...prev, { de: "lumi", texto: "Erro ao conectar com o backend." }]);
      }
    } catch {
      setMensagens((prev) => [...prev, { de: "lumi", texto: "Erro de conexão com o backend." }]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-white font-display font-bold">
          L
        </div>
        <div>
          <p className="font-display font-medium text-stone-dark text-sm">Lumi — Clínica Lumiar</p>
          <p className="text-xs text-stone-warm font-body">Teste real com Gemini · Número fictício</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-sage-500 font-body">
          <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
          ao vivo
        </span>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-cream-100">
        {mensagens.map((msg, i) => (
          <div key={i} className={`flex ${msg.de === "voce" ? "justify-end" : "justify-start"}`}>
            {msg.de === "lumi" && (
              <div className="w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center text-white text-xs font-display font-bold mr-2 flex-shrink-0 mt-1">
                L
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed whitespace-pre-line ${
                msg.de === "voce"
                  ? "bg-sage-500 text-white rounded-tr-sm"
                  : "bg-white text-stone-dark border border-cream-200 rounded-tl-sm shadow-card"
              }`}
            >
              {msg.texto}
            </div>
          </div>
        ))}

        {enviando && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center text-white text-xs font-display font-bold mr-2 flex-shrink-0">
              L
            </div>
            <div className="bg-white border border-cream-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card flex gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-warm animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-stone-warm animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-stone-warm animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-cream-200 px-4 py-3 flex gap-3 items-end flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          placeholder="Digite uma mensagem como se fosse uma mãe no WhatsApp..."
          rows={2}
          className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-sm font-body text-stone-dark placeholder:text-stone-warm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        />
        <button
          onClick={enviar}
          disabled={enviando || !input.trim()}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-sage-500 hover:bg-sage-600 disabled:bg-sage-400 text-white flex items-center justify-center transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 8L2 2L5 8L2 14L14 8Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <p className="text-center text-[10px] text-stone-warm font-body py-2 bg-white border-t border-cream-100">
        Teste interno · As mensagens são salvas no banco real
      </p>
    </div>
  );
}
