import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clínica Lumiar — Especialistas em TEA | Tramandaí RS",
  description: "Clínica especializada em TEA e desenvolvimento infantil em Tramandaí RS. Equipe multidisciplinar, atendimento humanizado e plano terapêutico individualizado.",
};

const WA_LINK =
  "https://wa.me/5551995012315?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20meu%20filho.";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function WABtn({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="relative w-full">
      <img
        src="/images/bannerlumiarheader.png"
        alt="Clínica Lumiar — Espaço Terapêutico Infantil"
        className="w-full block"
        style={{ height: "clamp(160px, 35vw, 520px)" }}
      />
      <div className="absolute top-2 right-3 sm:top-4 sm:right-6 md:top-6 md:right-8">
        <WABtn className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-body font-bold text-xs md:text-sm rounded-full transition-all shadow-md hover:shadow-lg">
          {WA_ICON}
          <span className="hidden sm:block">Falar no WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </WABtn>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28" style={{
      background: "linear-gradient(160deg, #F0E4D0 0%, #F5EAD8 30%, #EDE8F0 60%, #F0F5E8 100%)",
    }}>
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #C9B8E8, transparent)" }} />
      <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #6DBE6D, transparent)" }} />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(201,184,232,0.3)", border: "1px solid rgba(201,184,232,0.5)" }}>
              <span className="w-2 h-2 rounded-full bg-verde animate-pulse" />
              <span className="text-sm font-body font-semibold" style={{ color: "#5b4a8a" }}>
                Especialistas em TEA · Tramandaí RS
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight text-gray-900 mb-5">
              Seu filho tem um jeito único de aprender.{" "}
              <span style={{ background: "linear-gradient(90deg, #F5A623, #F9D342)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                A Lumiar sabe como caminhar com ele.
              </span>
            </h1>

            <p className="text-gray-600 font-body text-lg leading-relaxed mb-8">
              Somos especializados em TEA e desenvolvimento infantil. Com escuta real, carinho genuíno e equipe multidisciplinar integrada, traçamos um caminho de evolução feito para o seu filho.
            </p>

            <WABtn className="inline-flex items-center gap-3 px-8 py-4 text-white font-display font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5" style={{ background: "#F5A623" }}>
              {WA_ICON}
              Quero agendar uma avaliação
            </WABtn>

            <p className="mt-4 text-sm text-gray-400 font-body">
              Sem burocracia &nbsp;·&nbsp; Atendimento humanizado &nbsp;·&nbsp; Equipe especializada em TEA
            </p>
          </div>

          <div className="relative">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] border-4 border-white shadow-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C9B8E840 0%, #6DBE6D30 50%, #F9D34240 100%)" }}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/heroimage.png')" }} />
            </div>
            <div className="absolute -bottom-4 -left-4 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-laranja opacity-40" />
              ))}
            </div>
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-amarelo opacity-70 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Depoimento imediato ───────────────────────────────────────────────────────
function DepoimentoHero() {
  return (
    <section className="bg-white py-8 border-y border-gray-100">
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-white text-xl" style={{ background: "linear-gradient(135deg, #F5A623, #F9D342)" }}>
          C
        </div>
        <div>
          <div className="text-amarelo text-sm mb-1">★★★★★</div>
          <p className="font-body text-gray-700 leading-relaxed italic">
            "Meu filho chegou sem falar quase nada. Hoje ele corre pra me contar o que fez na terapia. A Lumiar mudou a nossa família."
          </p>
          <p className="text-xs text-gray-400 font-body mt-1">Camila R. — mãe do Lorenzo, 5 anos · Google</p>
        </div>
      </div>
    </section>
  );
}

// ── Vídeo ─────────────────────────────────────────────────────────────────────
function Video() {
  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">Conheça a Lumiar</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
              Veja como é um dia aqui dentro
            </h2>
            <p className="text-gray-500 font-body text-lg leading-relaxed">
              Um espaço pensado para crianças, com cor, cuidado e profissionais que amam o que fazem. Veja a experiência de estar na Lumiar.
            </p>
          </div>
          <div className="flex justify-center">
            <div
              className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center flex-col gap-3"
              style={{
                width: "260px",
                aspectRatio: "9/16",
                background: "linear-gradient(135deg, #F5A62330, #C9B8E840, #6DBE6D30)",
              }}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/video-thumb.jpg')" }} />
              <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#F5A623">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <span className="relative z-10 text-xs text-gray-500 bg-white/70 rounded-lg px-2 py-1 font-body">Vídeo do espaço</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Números ───────────────────────────────────────────────────────────────────
function Numeros() {
  const nums = [
    { valor: "300", sufixo: "+", label: "Crianças atendidas", bg: "bg-laranja/10", text: "text-orange-700" },
    { valor: "5", sufixo: "+", label: "Especialistas", bg: "bg-verde/20", text: "text-green-700" },
    { valor: "5", sufixo: " anos", label: "de experiência", bg: "bg-lilas/30", text: "text-purple-700" },
    { valor: "5.0", sufixo: " ⭐", label: "Avaliação Google", bg: "bg-amarelo/40", text: "text-yellow-700" },
  ];

  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nums.map((n, i) => (
            <div key={i} className={`rounded-2xl p-5 text-center ${n.bg} ${n.text}`}>
              <p className="font-display font-bold text-3xl mb-1 counter" data-target={n.valor} data-sufixo={n.sufixo}>
                {n.valor}{n.sufixo}
              </p>
              <p className="font-body text-sm opacity-80">{n.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Especialidades ────────────────────────────────────────────────────────────
function Especialidades() {
  const items = [
    {
      titulo: "Avaliação de TEA",
      desc: "Diagnóstico humanizado e completo, com orientação clara para toda a família em cada etapa.",
      bg: "bg-lilas/20 hover:bg-lilas/35",
      iconColor: "#5b4a8a",
      icon: <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44l-1.5-7.5A2.5 2.5 0 0 1 8 9h1.5M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44l1.5-7.5A2.5 2.5 0 0 0 16 9h-1.5" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Terapia Ocupacional",
      desc: "Autonomia, coordenação e independência nas atividades do dia a dia, com leveza e propósito.",
      bg: "bg-verde/15 hover:bg-verde/30",
      iconColor: "#2d7a2d",
      icon: <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Integração Sensorial",
      desc: "Entendemos e respeitamos o sistema nervoso único de cada criança, no ritmo dela.",
      bg: "bg-amarelo/20 hover:bg-amarelo/35",
      iconColor: "#7a6200",
      icon: <><circle cx="12" cy="12" r="3" strokeWidth="2" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" /></>,
    },
    {
      titulo: "Psicologia Infantil",
      desc: "Apoio emocional e comportamental com escuta especializada, lúdica e acolhedora.",
      bg: "bg-laranja/10 hover:bg-laranja/20",
      iconColor: "#a05000",
      icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Fonoaudiologia",
      desc: "Comunicação, linguagem e oralidade para que sua criança se expresse com confiança.",
      bg: "bg-lilas/15 hover:bg-lilas/30",
      iconColor: "#5b4a8a",
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Psicopedagogia",
      desc: "Aprendizagem e desenvolvimento cognitivo com estratégias feitas para o seu filho.",
      bg: "bg-verde/10 hover:bg-verde/25",
      iconColor: "#2d7a2d",
      icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeWidth="2" strokeLinecap="round" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="2" strokeLinecap="round" /></>,
    },
  ];

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">O que oferecemos</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3 leading-tight">
            Cada criança tem um caminho.<br />Nós ajudamos a traçá-lo.
          </h2>
          <p className="text-gray-500 font-body text-lg max-w-xl mx-auto">
            Especialidades integradas que trabalham juntas pelo desenvolvimento do seu filho.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className={`rounded-2xl p-6 transition-all ${item.bg}`}>
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke={item.iconColor} width="22" height="22">
                  {item.icon}
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{item.titulo}</h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Espaço ────────────────────────────────────────────────────────────────────
function Espaco() {
  const placeholders = [
    { label: "Sala de atendimento", grad: "from-verde/30 to-lilas/30" },
    { label: "Área de integração sensorial", grad: "from-amarelo/30 to-laranja/20" },
    { label: "Recepção", grad: "from-lilas/30 to-blue-200/40" },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">Nosso espaço</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3 leading-tight">
            Um lugar criado para a sua criança
          </h2>
          <p className="text-gray-500 font-body text-lg max-w-xl mx-auto">
            Cada detalhe foi pensado para acolher com segurança, cor e cuidado.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {placeholders.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br ${p.grad} border-2 border-gray-100 shadow-md flex items-center justify-center`}
            >
              <span className="text-xs text-gray-400 font-body">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Diferenciais ──────────────────────────────────────────────────────────────
function Diferenciais() {
  const items = [
    {
      titulo: "Resposta em até 1 hora",
      desc: "Sem formulários. Uma mensagem no WhatsApp e nosso time já está com você.",
      iconBg: "bg-laranja/10",
      iconColor: "#a05000",
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Equipe integrada",
      desc: "Nossos profissionais conversam entre si. O progresso do seu filho é acompanhado por todos.",
      iconBg: "bg-verde/15",
      iconColor: "#2d7a2d",
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" strokeWidth="2" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" /></>,
    },
    {
      titulo: "Plano individualizado",
      desc: "Cada criança é única. O plano do seu filho é feito só para ele, não para um protocolo.",
      iconBg: "bg-lilas/25",
      iconColor: "#5b4a8a",
      icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Ambiente sensorial",
      desc: "Espaço pensado para crianças com necessidades especiais, com recursos sensoriais e segurança.",
      iconBg: "bg-amarelo/20",
      iconColor: "#7a6200",
      icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" /><polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" /></>,
    },
    {
      titulo: "Família sempre informada",
      desc: "Você acompanha cada passo do progresso. Comunicação clara e frequente com os pais.",
      iconBg: "bg-laranja/10",
      iconColor: "#a05000",
      icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.42 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" />,
    },
    {
      titulo: "Atendimento humanizado",
      desc: "Tratamos seu filho e você com o cuidado e a empatia que vocês merecem.",
      iconBg: "bg-verde/15",
      iconColor: "#2d7a2d",
      icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" strokeLinecap="round" />,
    },
  ];

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">Por que a Lumiar</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">
            O que torna nossa abordagem diferente
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                <svg viewBox="0 0 24 24" fill="none" stroke={item.iconColor} width="22" height="22">
                  {item.icon}
                </svg>
              </div>
              <h3 className="font-display font-bold text-base text-gray-900 mb-2">{item.titulo}</h3>
              <p className="font-body text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Depoimentos ───────────────────────────────────────────────────────────────
function Depoimentos() {
  const deps = [
    {
      inicial: "C",
      nome: "Camila R.",
      info: "Mãe do Lorenzo, 5 anos",
      texto: "Meu filho chegou sem falar quase nada. Hoje ele corre pra me contar o que fez na terapia. A Lumiar mudou a nossa família.",
      grad: "from-laranja to-amarelo",
    },
    {
      inicial: "A",
      nome: "Ana Paula M.",
      info: "Mãe da Sofia, 4 anos",
      texto: "Desde o primeiro dia me senti acolhida. Não apenas meu filho, eu também. É raro encontrar isso numa clínica.",
      grad: "from-lilas to-verde",
    },
    {
      inicial: "F",
      nome: "Fernanda L.",
      info: "Mãe do Pedro, 7 anos",
      texto: "A equipe é integrada de verdade. Todo mundo sabe o que o outro está fazendo com meu filho. Isso faz toda a diferença.",
      grad: "from-verde to-lilas",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">O que as famílias dizem</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 leading-tight">
            Histórias reais de quem<br />já caminhou com a gente
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deps.map((d, i) => (
            <div key={i} className="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-amarelo text-sm mb-4">★★★★★</div>
              <p className="font-body text-gray-700 leading-relaxed italic mb-6 text-sm">
                "{d.texto}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${d.grad} flex items-center justify-center font-display font-bold text-white text-base flex-shrink-0`}>
                  {d.inicial}
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900 text-sm">{d.nome}</p>
                  <p className="text-xs text-gray-400 font-body">{d.info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Convênios ─────────────────────────────────────────────────────────────────
function Convenios() {
  const lista = ["Unimed", "Bradesco Saúde", "Postal Saúde", "Cabergs", "CASSI"];
  return (
    <section className="bg-creme py-12 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-2 block">Rede credenciada</span>
          <h2 className="font-display font-bold text-2xl text-gray-900">Convênios aceitos</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {lista.map((c, i) => (
            <div key={i} className="bg-white rounded-xl px-5 py-3 text-sm font-body font-semibold text-gray-600 border border-gray-200 shadow-sm">
              {c}
            </div>
          ))}
          <div className="bg-white rounded-xl px-5 py-3 text-sm font-body font-semibold text-gray-400 border border-gray-200 shadow-sm">
            + outros
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA Meio ──────────────────────────────────────────────────────────────────
function CTAMeio() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "#FEF3C7", border: "1px solid #F9D342" }}>
          <span className="w-2 h-2 rounded-full bg-laranja animate-pulse" />
          <span className="text-sm font-body font-semibold" style={{ color: "#92400E" }}>
            Agenda individualizada — vagas limitadas por criança
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
          Pronto para dar o primeiro passo?
        </h2>
        <p className="text-gray-500 font-body text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Cada criança recebe atenção exclusiva. Por isso não conseguimos atender a todos ao mesmo tempo. Garanta a vaga do seu filho agora.
        </p>
        <WABtn className="inline-flex items-center gap-3 px-8 py-4 text-white font-display font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5" style={{ background: "#25D366" }}>
          {WA_ICON}
          Garantir minha vaga no WhatsApp
        </WABtn>
        <p className="mt-4 text-sm text-gray-400 font-body">Resposta em menos de 1 hora · Sem compromisso</p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const perguntas = [
    {
      q: "Meu filho precisa ter diagnóstico de TEA para começar?",
      a: "Não. Muitas crianças chegam à Lumiar ainda em processo de investigação. Nossa avaliação ajuda justamente a entender o que seu filho precisa, com ou sem diagnóstico prévio.",
    },
    {
      q: "Como funciona a primeira consulta?",
      a: "A primeira consulta é uma avaliação completa. Ouvimos você, observamos seu filho em um ambiente lúdico e acolhedor e ao final explicamos tudo o que identificamos, com o plano que recomendamos.",
    },
    {
      q: "Vocês atendem plano de saúde?",
      a: "Entre em contato pelo WhatsApp para verificarmos se o seu plano tem cobertura para os atendimentos que seu filho precisa. Atendemos vários convênios.",
    },
    {
      q: "Com que frequência acontecem as sessões?",
      a: "A frequência é definida no plano terapêutico individualizado, conforme a necessidade de cada criança. Na avaliação inicial explicamos tudo com detalhes.",
    },
  ];

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">Dúvidas frequentes</span>
          <h2 className="font-display font-bold text-3xl text-gray-900">Tire suas dúvidas antes de agendar</h2>
        </div>
        <div className="space-y-3">
          {perguntas.map((p, i) => (
            <details key={i} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-display font-bold text-gray-900 list-none select-none">
                <span>{p.q}</span>
                <svg
                  width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className="flex-shrink-0 transition-transform duration-300 group-open:rotate-180 text-gray-400"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-3 text-gray-600 font-body leading-relaxed border-t border-gray-100 text-sm">
                {p.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Localização ───────────────────────────────────────────────────────────────
function Localizacao() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-body font-semibold uppercase tracking-widest text-laranja mb-3 block">Onde estamos</span>
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-8">Como nos encontrar</h2>
            <div className="space-y-5">
              {[
                { iconBg: "bg-laranja/10", iconColor: "#a05000", titulo: "Endereço", texto: "Av. Protásio Alves 2161, Zona Nova Sul\nTramandaí RS", icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" /><circle cx="12" cy="10" r="3" strokeWidth="2" /></> },
                { iconBg: "bg-verde/15", iconColor: "#2d7a2d", titulo: "Horários", texto: "Seg a Sex: 8h às 12h e 13h30 às 18h30\nSábado: 8h às 12h e 13h30 às 18h", icon: <><circle cx="12" cy="12" r="10" strokeWidth="2" /><polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" /></> },
                { iconBg: "bg-lilas/25", iconColor: "#5b4a8a", titulo: "WhatsApp", texto: "(51) 9 9501-2315", icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" /> },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={item.iconColor} width="20" height="20">{item.icon}</svg>
                  </div>
                  <div>
                    <p className="font-body font-semibold text-gray-900 mb-0.5 text-sm">{item.titulo}</p>
                    <p className="font-body text-gray-500 text-sm whitespace-pre-line">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden h-64 border-2 border-gray-100 shadow-md">
            <iframe
              src="https://maps.google.com/maps?q=Av.+Prot%C3%A1sio+Alves+2161,+Tramanda%C3%AD,+RS,+Brasil&output=embed&z=16"
              width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Clínica Lumiar"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA Final ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{
      background: "linear-gradient(135deg, rgba(201,184,232,0.3) 0%, #FDF9F0 40%, rgba(249,211,66,0.2) 100%)",
    }}>
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: "#6DBE6D" }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" style={{ background: "#F5A623" }} />
      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-5 leading-tight">
          Seu filho merece um{" "}
          <span style={{ background: "linear-gradient(90deg, #F5A623, #F9D342)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            começo luminoso.
          </span>
        </h2>
        <p className="text-gray-600 font-body text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Não deixe para amanhã. Cada dia importa no desenvolvimento da sua criança. A equipe da Lumiar está pronta para ouvir você, sem julgamentos e sem burocracia.
        </p>
        <WABtn className="inline-flex items-center gap-3 px-10 py-5 text-white font-display font-bold text-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1" style={{ background: "#F5A623" }}>
          {WA_ICON}
          Falar com a Clínica Lumiar
        </WABtn>
        <p className="mt-5 text-sm text-gray-400 font-body">
          Avaliação inicial acolhedora · Sem compromisso · Resposta em até 1h
        </p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <img src="/images/lumiarlogo.png" alt="Clínica Lumiar" className="h-12 w-auto object-contain mx-auto mb-3 rounded-xl" style={{ mixBlendMode: "screen" }} />
        <p className="text-xs font-body">Av. Protásio Alves 2161, Zona Nova Sul — Tramandaí RS</p>
        <p className="text-xs font-body mt-1">© {new Date().getFullYear()} Clínica Lumiar. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

// ── Floating WA ───────────────────────────────────────────────────────────────
function FloatingWA() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3.5 text-white rounded-full shadow-2xl transition-all hover:scale-105 animate-pulse-wa"
      style={{ background: "#25D366" }}
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="font-display font-bold text-sm hidden sm:block">Falar agora</span>
    </a>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-creme font-body">
      <Header />
      <main>
        <Hero />
        <DepoimentoHero />
        <Video />
        <Numeros />
        <Especialidades />
        <Espaco />
        <Diferenciais />
        <Depoimentos />
        <Convenios />
        <CTAMeio />
        <FAQ />
        <Localizacao />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}