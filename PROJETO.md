# Lumiar — Sistema de Automação com IA

## Sobre o projeto
Sistema completo de automação para a Clínica Lumiar, espaço terapêutico infantil multidisciplinar localizado em Tramandaí RS. Especializada em neurodesenvolvimento infantil — TEA, integração sensorial, terapia ocupacional, psicologia e psicopedagogia.

---

## Sobre a clínica
- Nome: Clínica Lumiar — Espaco Terapeutico Infantil
- Razão social: Lumiar Espaco Multidisciplinar Ltda
- Endereço: Av. Protásio Alves 2161, Zona Nova Sul, Tramandaí RS
- WhatsApp: +55 51 99501-2315
- Instagram: @clinica.lumiartramandai
- Horários: Seg-Sex 8h-12h e 13h30-18h30 | Sab 8h-12h e 13h30-18h
- Equipe: 8 pessoas, 5 terapeutas
- Sistema atual: Feegow + agenda física
- Pagamentos: PIX

## Especialidades
- Terapia Ocupacional — integração sensorial e autonomia
- Psicologia — suporte emocional e comportamental
- Psicopedagogia — dificuldades de aprendizagem
- Assistente Terapêutico — acompanhamento escolar e familiar
- Jiu-jitsu kids

---

## Stack técnica

| Componente        | Ferramenta          | Onde roda     |
|-------------------|---------------------|---------------|
| WhatsApp          | Evolution API       | Railway       |
| Backend agentes   | Python + FastAPI    | Railway       |
| Banco de dados    | Supabase (Postgres) | Supabase      |
| IA                | Gemini Flash 2.5    | API externa   |
| Landing page      | Next.js             | Vercel        |
| Painel web        | Next.js             | Vercel        |
| Agendamento       | Feegow API          | API externa   |
| Código            | GitHub              | github.com    |

---

## Estrutura de pastas

lumiar/
├── PROJETO.md
├── README.md
├── backend/
│   ├── main.py
│   ├── agents/
│   │   ├── whatsapp.py
│   │   └── conteudo.py
│   ├── services/
│   │   ├── gemini.py
│   │   ├── supabase.py
│   │   ├── feegow.py
│   │   └── evolution.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── landing/
    │   └── app/
    └── dashboard/
        └── app/

---

## Variáveis de ambiente — backend

GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
EVOLUTION_API_URL=
EVOLUTION_API_KEY=
FEEGOW_TOKEN=
WHATSAPP_NUMBER=5551995012315
PROPRIETARIA_NUMBER=55519XXXXXXXX

---

## Sistema 1 — Agente de WhatsApp

Fluxo:
1. Família manda mensagem no WhatsApp da clínica
2. Evolution API captura e manda webhook pro backend
3. Backend busca contato no Supabase pelo número
4. Se não existe — cria contato novo com status lead
5. Busca histórico das últimas 10 mensagens
6. Monta contexto completo e chama Gemini
7. Gemini responde em linguagem natural
8. Salva mensagem no Supabase
9. Manda resposta via Evolution API
10. Se pedir agendamento — consulta Feegow e oferece horários
11. Se caso complexo — notifica proprietária

Regras do agente:
- Nunca faz afirmação clínica ou sugere diagnóstico
- Nunca fala sobre medicação
- Nunca promete resultado terapêutico
- Se não souber responder — acolhe e notifica proprietária
- Tom sempre acolhedor, humano, nunca robótico
- Nunca menciona que é IA a menos que perguntada diretamente

Status dos contatos:
- lead — mandou mensagem, não agendou
- agendado — tem consulta marcada
- paciente_ativo — já em atendimento
- inativo — sem contato há 30 dias ou mais

---

## Sistema 2 — Agente de Conteúdo

Fluxo:
1. Cron job roda todo dia às 8h
2. Busca tendências no Google Trends — termos de TEA no RS
3. Lista materiais ativos no Supabase
4. Analisa conversas dos últimos 7 dias — temas recorrentes
5. Verifica histórico de posts — evita repetir tema em 14 dias
6. Gemini decide o melhor tema e gera 3 entregas
7. Salva no Supabase com status pendente
8. Notifica proprietária no WhatsApp

3 entregas diárias:
1. Reels com ela aparecendo — roteiro cena por cena
2. Reels Canva animado — texto e orientação visual
3. Post estático ou Story — caption completo + orientação Canva

Proteções:
- Só usa informação dos materiais aprovados por ela
- Nunca inventa dado clínico
- Todo post clínico vem com disclaimer sugerido
- Ela aprova antes de qualquer publicação

---

## Sistema 3 — Automações de operação

Lembrete de consulta:
- 24h antes — confirmação via WhatsApp
- 2h antes — lembrete final
- Se não confirmar em 4h — notifica proprietária

Follow-up de lead perdido:
- 48h sem agendamento — mensagem suave
- 7 dias sem resposta — mensagem de reativação

Lembrete de pagamento:
- 1 dia antes do vencimento — lembrete com chave PIX
- 1 dia após vencimento sem pagamento — notifica proprietária

Pedido de feedback:
- 24h após primeira consulta — pede avaliação Google

---

## Banco de dados — Supabase SQL

create table contatos (
  id uuid default gen_random_uuid() primary key,
  telefone text unique not null,
  nome text,
  status text default 'lead',
  primeira_mensagem timestamp,
  ultima_mensagem timestamp,
  criado_em timestamp default now()
);

create table conversas (
  id uuid default gen_random_uuid() primary key,
  contato_id uuid references contatos(id),
  telefone text not null,
  papel text not null,
  mensagem text not null,
  criado_em timestamp default now()
);

create table knowledge_base (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  categoria text not null,
  arquivo_url text,
  texto_extraido text,
  ativo boolean default true,
  criado_em timestamp default now()
);

create table posts_gerados (
  id uuid default gen_random_uuid() primary key,
  tema text,
  categoria text,
  tipo text,
  texto_gerado text,
  orientacao_canva text,
  horario_sugerido text,
  hashtags text,
  status text default 'pendente',
  criado_em timestamp default now()
);

create table conversas_insights (
  id uuid default gen_random_uuid() primary key,
  tema_identificado text,
  frequencia integer default 1,
  exemplo_anonimizado text,
  virou_post boolean default false,
  semana date,
  criado_em timestamp default now()
);

create table agendamentos (
  id uuid default gen_random_uuid() primary key,
  contato_id uuid references contatos(id),
  feegow_id text,
  data_hora timestamp,
  profissional text,
  especialidade text,
  status text default 'agendado',
  lembrete_24h_enviado boolean default false,
  lembrete_2h_enviado boolean default false,
  criado_em timestamp default now()
);

---

## Painel web

URL: lumiar-dashboard.vercel.app (migrar pra conta dela depois)
Acesso: login com email e senha via Supabase Auth
Só ela acessa — não é sistema dos terapeutas

Abas:
1. Início — resumo do dia e alertas
2. Posts — gerados pela IA, ela aprova
3. Conversas — histórico WhatsApp
4. Materiais — upload de PDFs
5. Relatório — métricas semanais

---

## Landing page

URL: lumiar-landing.vercel.app — depois clinicalumiar.com.br
Objetivo: uma página, um botão, uma ação — mandar mensagem no WhatsApp

Seções:
1. Hero — frase que conecta a mãe
2. Trust bar — equipe, especialidades, avaliação
3. Especialidades — 4 cards
4. Fotos do espaço
5. Diferenciais — 3 itens
6. Depoimento
7. CTA — botão WhatsApp fixo na tela
8. Endereço e horários

---

## Integrações externas

Evolution API:
- Roda no Railway via Docker
- Conecta ao WhatsApp via QR code
- Webhook aponta pro backend FastAPI

Feegow API:
- Base URL: https://api.feegow.com/v1/api
- Auth: header x-access-token
- Endpoints: search agenda, new-appoint, statusUpdate
- Token gerado pela proprietária no painel Feegow

Google Trends:
- Biblioteca: pytrends
- Termos: autismo, TEA, integração sensorial, terapia ocupacional infantil
- Região: BR-RS

Gemini Flash 2.5:
- Free tier: 1500 req/dia
- Fallback: mensagem fixa se API cair

---

## Decisões técnicas

1. Cal.com removido — agendamento via Feegow API direto
2. Evolution API no lugar de Zapi — gratuita e open source
3. Sem CrewAI ou LangChain — Python puro
4. RAG não necessário agora — contexto dos PDFs via leitura direta
5. Vercel na conta pessoal do dev — migrar pra conta dela depois
6. RLS do Supabase desativado agora — ativar em produção
7. Google Meu Negócio — configurar presencialmente domingo

---

## Acessos

Gmail técnico: lumiar.clinica.tech@gmail.com
Supabase: lumiar.clinica.tech@gmail.com — projeto lumiar
Railway: lumiar.clinica.tech@gmail.com
Vercel: conta pessoal do dev — migrar depois
GitHub: conta pessoal do dev — repo lumiar
Google AI Studio: conta pessoal do dev — API key Gemini já tem

---

## Como usar esse arquivo

Toda sessão nova do Claude Code começa com:
"Lê o PROJETO.md e vamos continuar de onde paramos."
