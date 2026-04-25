import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clínica Lumiar — Especialistas em TEA | Tramandaí RS",
};

const WA_LINK =
  "https://wa.me/5551995012315?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20meu%20filho.";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function WABtn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <img
          src="/images/lumiarlogo.png"
          alt="Clínica Lumiar — Espaço Terapêutico Infantil"
          className="h-11 w-auto object-contain"
        />

        {/* WA #1 */}
        <WABtn className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-body font-bold text-sm rounded-full transition-all shadow-md hover:shadow-lg">
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
    <section className="relative overflow-hidden bg-creme pt-14 pb-20 md:pt-20 md:pb-28">
      {/* Blobs decorativos */}
      <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-lilas opacity-25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[350px] h-[350px] rounded-full bg-amarelo opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[280px] h-[280px] rounded-full bg-verde opacity-15 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lilas/30 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-verde animate-pulse" />
              <span className="text-sm font-body font-semibold text-purple-700">
                Especialistas em TEA · Tramandaí RS
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight text-gray-900 mb-5">
              Você sabe que seu filho precisa de apoio especial.{" "}
              <span className="text-laranja">Aqui, você finalmente vai ser ouvida.</span>
            </h1>

            <p className="text-gray-600 font-body text-lg leading-relaxed mb-8">
              A Clínica Lumiar é especializada em TEA e desenvolvimento infantil. Com escuta ativa, carinho real e
              equipe multidisciplinar, traçamos um caminho de progresso feito para o{" "}
              <em className="font-semibold not-italic text-gray-800">seu</em> filho.
            </p>

            {/* WA #2 */}
            <WABtn className="inline-flex items-center gap-3 px-8 py-4 bg-laranja hover:bg-amber-500 text-white font-display font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 animate-pulse-wa">
              {WA_ICON}
              Quero agendar uma avaliação
            </WABtn>

            <p className="mt-4 text-sm text-gray-400 font-body">
              ✓ Sem burocracia &nbsp;·&nbsp; ✓ Atendimento humanizado &nbsp;·&nbsp; ✓ Equipe especializada em TEA
            </p>
          </div>

          {/* Foto 1 */}
          <div className="relative animate-fade-up-2">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] border-4 border-white shadow-2xl"
              style={{ background: "linear-gradient(135deg, #C9B8E8 0%, #6DBE6D40 50%, #F9D342 100%)" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/espaco1.jpg')" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/75 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs text-gray-500 font-body">
                  📸 espaco1.jpg
                </span>
              </div>
            </div>
            {/* Dots decorativos */}
            <div className="absolute -bottom-5 -left-5 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-laranja opacity-40" />
              ))}
            </div>
            <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-amarelo opacity-70 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Prova — números ───────────────────────────────────────────────────────────
function ProvaNumeros() {
  const nums = [
    { valor: "5+", label: "Especialistas", bg: "bg-laranja/10", text: "text-orange-700" },
    { valor: "+300", label: "Crianças atendidas", bg: "bg-verde/20", text: "text-green-700" },
    { valor: "5 anos", label: "de experiência", bg: "bg-lilas/30", text: "text-purple-700" },
    { valor: "⭐ 5.0", label: "avaliação Google", bg: "bg-amarelo/40", text: "text-yellow-700" },
  ];

  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {nums.map((n, i) => (
            <div key={i} className={`rounded-2xl p-5 text-center ${n.bg} ${n.text}`}>
              <p className="font-display font-bold text-3xl mb-1">{n.valor}</p>
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
      icon: "🧩",
      titulo: "Avaliação de TEA",
      desc: "Diagnóstico humanizado e completo, com orientação para toda a família.",
      bg: "bg-lilas/20 hover:bg-lilas/40",
    },
    {
      icon: "🤲",
      titulo: "Terapia Ocupacional",
      desc: "Desenvolvemos autonomia, coordenação e independência nas atividades do dia a dia.",
      bg: "bg-verde/20 hover:bg-verde/40",
    },
    {
      icon: "🌀",
      titulo: "Integração Sensorial",
      desc: "Entendemos e respeitamos o sistema nervoso único de cada criança.",
      bg: "bg-amarelo/20 hover:bg-amarelo/40",
    },
    {
      icon: "💙",
      titulo: "Psicologia Infantil",
      desc: "Apoio emocional e comportamental com escuta especializada e lúdica.",
      bg: "bg-blue-100 hover:bg-blue-200",
    },
    {
      icon: "🗣️",
      titulo: "Fonoaudiologia",
      desc: "Comunicação, linguagem e oralidade para sua criança se expressar.",
      bg: "bg-laranja/10 hover:bg-laranja/20",
    },
    {
      icon: "📚",
      titulo: "Psicopedagogia",
      desc: "Aprendizagem e desenvolvimento cognitivo com estratégias individualizadas.",
      bg: "bg-pink-100 hover:bg-pink-200",
    },
  ];

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">
            Sua criança está em boas mãos
          </h2>
          <p className="text-gray-500 font-body text-lg max-w-xl mx-auto">
            Cuidamos de cada aspecto do desenvolvimento infantil com especialização real.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div key={i} className={`rounded-2xl p-6 transition-all ${item.bg}`}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{item.titulo}</h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Espaço — fotos ────────────────────────────────────────────────────────────
function Espaco() {
  const fotos = [
    { src: "/images/espaco1.jpg", label: "espaco1.jpg", grad: "from-verde/30 to-lilas/30" },
    { src: "/images/espaco2.jpg", label: "espaco2.jpg", grad: "from-amarelo/30 to-laranja/20" },
    { src: "/images/espaco3.jpg", label: "espaco3.jpg", grad: "from-lilas/30 to-blue-200/40" },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">
            Um espaço criado para crianças — e para famílias
          </h2>
          <p className="text-gray-500 font-body text-lg max-w-xl mx-auto">
            Cada detalhe foi pensado para acolher sua criança com segurança, cor e cuidado.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {fotos.map((foto, i) => (
            <div
              key={i}
              className={`relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br ${foto.grad} border-2 border-gray-100 shadow-md`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${foto.src}')` }}
              />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="bg-white/75 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs text-gray-500 font-body">
                  📸 {foto.label}
                </span>
              </div>
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
      icon: "💬",
      titulo: "Agendamento rápido pelo WhatsApp",
      desc: "Sem formulários complicados. Uma mensagem e nosso time responde em até 1 hora.",
    },
    {
      icon: "👥",
      titulo: "Equipe integrada e multidisciplinar",
      desc: "Nossos profissionais trabalham juntos — comunicação constante pelo bem do seu filho.",
    },
    {
      icon: "🎯",
      titulo: "Plano terapêutico individualizado",
      desc: "Cada criança é única. O plano do seu filho é feito só para ele, não para um protocolo.",
    },
    {
      icon: "🏠",
      titulo: "Ambiente acolhedor e seguro",
      desc: "Espaço pensado para crianças com necessidades especiais, com recursos sensoriais.",
    },
    {
      icon: "📲",
      titulo: "Família sempre informada",
      desc: "Você acompanha cada passo do progresso. Comunicação clara e frequente com os pais.",
    },
    {
      icon: "💛",
      titulo: "Atendimento humanizado",
      desc: "Tratamos seu filho — e você — com o cuidado, paciência e empatia que vocês merecem.",
    },
  ];

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">
            Por que as famílias escolhem a Lumiar
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-display font-bold text-base text-gray-900 mb-2">{item.titulo}</h3>
              <p className="font-body text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Depoimento ────────────────────────────────────────────────────────────────
function Depoimento() {
  return (
    <section className="bg-laranja py-16 md:py-20 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white opacity-5 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white opacity-5 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <div className="font-display text-7xl text-white opacity-30 leading-none mb-2">&ldquo;</div>
        <p className="font-body text-xl md:text-2xl text-white leading-relaxed mb-8 italic">
          Eu estava desesperada, sem saber por onde começar. A equipe da Lumiar me acolheu de um jeito que nenhum
          lugar tinha feito antes. Meu filho mudou muito em poucos meses de terapia.
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-white text-lg">
            M
          </div>
          <div className="text-left">
            <p className="font-display font-bold text-white">Mariana S.</p>
            <p className="text-white/70 text-sm font-body">Mãe do Miguel, 4 anos</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA do meio ───────────────────────────────────────────────────────────────
function CTAMeio() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-sm font-body font-semibold text-red-600">
            Vagas limitadas — agenda individualizada
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
          Pronto para dar o primeiro passo?
        </h2>
        <p className="text-gray-500 font-body text-lg mb-8 max-w-xl mx-auto">
          Cada criança recebe atenção individualizada — e por isso não conseguimos atender a todos ao mesmo tempo.
          Garante a vaga do seu filho agora.
        </p>
        {/* WA #3 */}
        <WABtn className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-display font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
          {WA_ICON}
          Garantir minha vaga no WhatsApp
        </WABtn>
        <p className="mt-4 text-sm text-gray-400 font-body">Resposta geralmente em menos de 1 hora</p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const perguntas = [
    {
      q: "Meu filho precisa ter diagnóstico de TEA para começar?",
      a: "Não! Muitas crianças chegam à Clínica Lumiar ainda em processo de investigação. Nossa avaliação ajuda justamente a entender o que seu filho precisa — com ou sem diagnóstico prévio.",
    },
    {
      q: "Como funciona a primeira consulta?",
      a: "A primeira consulta é uma avaliação completa. Ouvimos você, observamos seu filho em um ambiente lúdico e acolhedor, e ao final explicamos tudo o que identificamos e o plano que recomendamos.",
    },
    {
      q: "Vocês atendem plano de saúde?",
      a: "Entre em contato com a gente pelo WhatsApp para verificarmos se o seu plano tem cobertura para os atendimentos que seu filho precisa.",
    },
    {
      q: "Com que frequência acontecem as sessões?",
      a: "A frequência é definida no plano terapêutico individualizado, conforme a necessidade de cada criança. Na avaliação inicial, explicamos tudo com detalhes.",
    },
  ];

  return (
    <section className="bg-creme py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Perguntas frequentes</h2>
          <p className="text-gray-500 font-body">Tire suas dúvidas antes de agendar</p>
        </div>
        <div className="space-y-4">
          {perguntas.map((perg, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-display font-bold text-gray-900 list-none hover:bg-gray-50 transition-colors select-none">
                {perg.q}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-2 text-gray-600 font-body leading-relaxed border-t border-gray-100">
                {perg.a}
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
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-8">Como nos encontrar</h2>
            <div className="space-y-5">
              {[
                {
                  icon: "📍",
                  bg: "bg-laranja/10",
                  titulo: "Endereço",
                  texto: "Av. Protásio Alves 2161, Zona Nova Sul\nTramandaí RS",
                },
                {
                  icon: "🕐",
                  bg: "bg-verde/20",
                  titulo: "Horários de atendimento",
                  texto: "Seg–Sex: 8h–12h e 13h30–18h30\nSábado: 8h–12h e 13h30–18h",
                },
                {
                  icon: "💬",
                  bg: "bg-lilas/30",
                  titulo: "WhatsApp",
                  texto: "(51) 9 9501-2315",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 text-lg`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-gray-900 mb-0.5">{item.titulo}</p>
                    <p className="font-body text-gray-600 text-sm whitespace-pre-line">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa Google Maps embed */}
          <div className="rounded-3xl overflow-hidden h-64 border-2 border-gray-100 shadow-md">
            <iframe
              src="https://maps.google.com/maps?q=Av.+Prot%C3%A1sio+Alves+2161,+Tramanda%C3%AD,+RS,+Brasil&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Clínica Lumiar"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA final ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-gradient-to-br from-lilas/30 via-creme to-amarelo/20 py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-verde opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-laranja opacity-10 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <div className="text-5xl mb-5">🌱</div>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900 mb-5 leading-tight">
          Seu filho merece o melhor começo.
        </h2>
        <p className="text-gray-600 font-body text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Não deixe para amanhã. Cada dia importa no desenvolvimento da sua criança. Dê o primeiro passo agora
          — a equipe da Lumiar está pronta para ouvir você.
        </p>
        {/* WA #4 */}
        <WABtn className="inline-flex items-center gap-3 px-10 py-5 bg-laranja hover:bg-amber-500 text-white font-display font-bold text-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
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
        <div className="flex items-center justify-center mb-3">
          <img
            src="/images/lumiarlogo.png"
            alt="Clínica Lumiar"
            className="h-10 w-auto object-contain rounded-lg"
          />
        </div>
        <p className="text-xs font-body">Av. Protásio Alves 2161, Zona Nova Sul — Tramandaí RS</p>
        <p className="text-xs font-body mt-1">
          © {new Date().getFullYear()} Clínica Lumiar. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

// ── Botão flutuante WhatsApp ──────────────────────────────────────────────────
function FloatingWA() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3.5 bg-[#25D366] hover:bg-[#1ebe5c] text-white rounded-full shadow-2xl transition-all hover:scale-105 animate-pulse-wa"
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
        <ProvaNumeros />
        <Especialidades />
        <Espaco />
        <Diferenciais />
        <Depoimento />
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
