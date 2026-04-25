from fastapi import APIRouter, Request
from services import supabase as db, gemini, evolution, feegow
import os

router = APIRouter()

PROPRIETARIA_NUMBER = os.getenv("PROPRIETARIA_NUMBER")

SYSTEM_PROMPT = """
Voce e a Lumi, responsavel pelo primeiro atendimento da Clinica Lumiar, espaco terapeutico infantil em Tramandai RS.

QUEM VOCE E:
Voce nao e um robo. Voce e uma pessoa calorosa, paciente e acolhedora que entende que a familia que esta entrando em contato provavelmente esta passando por um momento de preocupacao com o filho. Trate cada conversa como unica. Nunca soe como FAQ ou menu de opcoes.

ESPECIALIDADES DA CLINICA:
- Terapia Ocupacional
- Psicologia Infantil
- Psicopedagogia
- Assistente Terapeutico (AT)
- Jiu-jitsu kids

FUNCIONAMENTO:
- Segunda a sexta: 8h as 12h e 13h30 as 18h30
- Sabado: 8h as 12h e 13h30 as 18h
- Endereco: Av. Protasio Alves 2161, Zona Nova Sul, Tramandai RS

REGRAS ABSOLUTAS — NUNCA VIOLE:
1. Jamais sugira, confirme ou descarte diagnosticos (TEA, TDAH, dislexia, etc.)
2. Jamais fale sobre medicamentos, doses ou efeitos
3. Jamais prometa resultado ou prazo terapeutico
4. Jamais invente informacao sobre a clinica, profissionais ou precos
5. Se nao souber responder algo, seja honesta: diga que vai verificar com a equipe
6. Nunca mencione que e IA. Se perguntada diretamente: "Sou a Lumi, responsavel pelo primeiro contato aqui na Lumiar. Questoes clinicas sao sempre respondidas pelos nossos profissionais, combinado?"
7. Nunca fale sobre sistemas, software, tecnologia ou ferramentas internas
8. Nunca use listas numeradas ou bullet points — escreva em texto corrido, como numa conversa

TOM E ESCRITA:
- Portugues brasileiro correto, sem erros de ortografia ou pontuacao
- Use virgulas onde necessario, nunca troque virgula por traco
- Tom caloroso, como uma amiga que entende do assunto — nao formal, nao tecnico
- Frases curtas e diretas, sem enrolacao
- Pode usar no maximo um emoji por mensagem quando ajudar no tom
- Nunca use: "Ola!", "Claro!", "Com certeza!", "Fico feliz em ajudar" — soa robotico

FLUXO DE AGENDAMENTO:
Antes de mostrar horarios, colete naturalmente, um por vez, sem parecer formulario:
1. Nome da crianca
2. Idade da crianca
3. Especialidade desejada (se a familia nao souber, ajude a entender — sem diagnosticar)

So marque precisa_horarios como true quando tiver as 3 informacoes confirmadas.

QUANDO ESCALAR PARA A EQUIPE (intencao complexo):
- Familia descrevendo situacao clinica detalhada que exige avaliacao profissional
- Crianca em situacao de risco ou urgencia
- Familia muito angustiada ou em crise emocional
- Pergunta sobre valor, convenio ou pagamento
- Qualquer situacao que voce nao se sinta segura em responder
- Reclamacao ou insatisfacao

Ao escalar sempre diga algo como: "Vou pedir para nossa equipe entrar em contato com voce, combinado? Retornamos em breve."

Responda SEMPRE em JSON valido com exatamente estas chaves:
{
  "resposta": "sua resposta em linguagem natural aqui",
  "intencao": "agendamento" ou "informacao" ou "complexo",
  "precisa_horarios": true ou false
}

Use "agendamento" quando a familia mencionar: agendar, marcar, consulta, horario, vaga, disponibilidade, quero comecar, primeira consulta.
Use "complexo" quando nao souber responder, for caso clinico, situacao emocional intensa, pergunta sobre valores ou exigir julgamento humano.
Use "informacao" para qualquer outra interacao.
Use "precisa_horarios": true somente quando ja tiver nome da crianca, idade e especialidade confirmados.
"""


def _extrair_texto(message_data: dict) -> str:
    msg = message_data.get("message", {})
    return (
        msg.get("conversation")
        or msg.get("extendedTextMessage", {}).get("text")
        or msg.get("imageMessage", {}).get("caption")
        or ""
    )


def _formatar_horarios(horarios: list[dict]) -> str:
    if not horarios:
        return ""
    linhas = ["Horarios disponiveis:"]
    for h in horarios[:5]:
        data = h.get("date") or h.get("data", "")
        hora = h.get("time") or h.get("hora", "")
        prof = (h.get("professional") or {}).get("name") or h.get("profissional", "")
        if data and hora:
            linha = f"- {data} as {hora}"
            if prof:
                linha += f" com {prof}"
            linhas.append(linha)
    return "\n".join(linhas) if len(linhas) > 1 else ""


@router.post("/webhook")
async def webhook(request: Request):
    data = await request.json()

    try:
        message_data = data.get("data", {})
        key = message_data.get("key", {})
        phone = (
            key.get("remoteJid", "")
            .replace("@s.whatsapp.net", "")
            .replace("@c.us", "")
        )
        text = _extrair_texto(message_data)
        from_me = key.get("fromMe", False)

        if from_me or not text or not phone:
            return {"status": "ignored"}
    except Exception:
        return {"status": "error", "detail": "invalid payload"}

    # Busca ou cria contato
    contato = await db.get_or_create_contato(phone)
    contato_id = contato["id"]

    # Salva mensagem recebida
    await db.salvar_mensagem(contato_id, phone, "user", text)

    # Busca historico das ultimas 10 mensagens
    historico = await db.get_historico(contato_id, limite=10)

    # Monta contexto com historico para o Gemini
    historico_text = "\n".join(
        f"{'Familia' if m['papel'] == 'user' else 'Assistente'}: {m['mensagem']}"
        for m in historico[:-1]
    )
    contexto = f"Historico da conversa:\n{historico_text}\n\nMensagem atual da familia: {text}"

    # Chama Gemini com resposta estruturada
    resultado = await gemini.gerar_json(SYSTEM_PROMPT, contexto)

    resposta = resultado.get("resposta", "")
    intencao = resultado.get("intencao", "informacao")
    precisa_horarios = resultado.get("precisa_horarios", False)

    # Fallback se Gemini falhar
    if not resposta:
        resposta = "Oi! Recebi sua mensagem e vou verificar com nossa equipe. Em breve retornamos. Obrigada pelo contato com a Clinica Lumiar!"
        intencao = "complexo"

    # Busca horarios do Feegow quando familia quer agendar
    if intencao == "agendamento" and precisa_horarios:
        horarios = await feegow.buscar_agenda()
        slots = _formatar_horarios(horarios)
        if slots:
            resposta += f"\n\n{slots}"
        elif not horarios:
            resposta += "\n\nPara ver os horarios disponiveis, nossa equipe vai entrar em contato para confirmar."
            intencao = "complexo"

    # Salva resposta da assistente
    await db.salvar_mensagem(contato_id, phone, "assistant", resposta)

    # Envia resposta para a familia
    await evolution.enviar_mensagem(phone, resposta)

    # Atualiza timestamp do contato
    await db.atualizar_ultima_mensagem(contato_id)

    # Notifica proprietaria em casos complexos
    if intencao == "complexo" and PROPRIETARIA_NUMBER:
        aviso = f"Atencao necessaria\nNumero: +{phone}\nMensagem: {text}\nResposta enviada: {resposta}"
        await evolution.enviar_mensagem(PROPRIETARIA_NUMBER, aviso)

    return {"status": "ok", "resposta": resposta}


@router.get("/ultima-resposta/{telefone}")
async def ultima_resposta(telefone: str):
    sb = db.get_client()
    contato = sb.table("contatos").select("id").eq("telefone", telefone).single().execute()
    if not contato.data:
        return {"resposta": None}
    res = (
        sb.table("conversas")
        .select("mensagem")
        .eq("contato_id", contato.data["id"])
        .eq("papel", "assistant")
        .order("criado_em", desc=True)
        .limit(1)
        .execute()
    )
    resposta = res.data[0]["mensagem"] if res.data else None
    return {"resposta": resposta}
