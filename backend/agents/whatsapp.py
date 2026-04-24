from fastapi import APIRouter, Request
from services import supabase as db, gemini, evolution, feegow
import os

router = APIRouter()

PROPRIETARIA_NUMBER = os.getenv("PROPRIETARIA_NUMBER")

SYSTEM_PROMPT = """
Voce e a assistente virtual da Clinica Lumiar, espaco terapeutico infantil em Tramandai RS.
Especialidades: Terapia Ocupacional, Psicologia, Psicopedagogia, Assistente Terapeutico e Jiu-jitsu kids.

Regras obrigatorias:
- Tom sempre acolhedor, humano, nunca robotico
- Nunca faz afirmacao clinica ou sugere diagnostico
- Nunca fala sobre medicacao
- Nunca promete resultado terapeutico
- Nunca menciona que e IA, a menos que perguntada diretamente
- Horarios de funcionamento: Seg-Sex 8h-12h e 13h30-18h30 | Sab 8h-12h e 13h30-18h

Quando a familia quiser agendar, pergunte nome da crianca, idade e qual especialidade antes de mostrar horarios.

Responda SEMPRE em JSON valido com exatamente estas chaves:
{
  "resposta": "sua resposta em linguagem natural aqui",
  "intencao": "agendamento" ou "informacao" ou "complexo",
  "precisa_horarios": true ou false
}

Use "agendamento" quando a familia mencionar: agendar, marcar, consulta, horario, vaga, disponibilidade, quero comecar, primeira consulta.
Use "complexo" quando nao souber responder, for caso clinico que precisa da equipe, ou a situacao exigir julgamento humano.
Use "informacao" para qualquer outra interacao.
Use "precisa_horarios": true somente quando a familia ja informou a especialidade desejada e quer ver horarios.
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

    return {"status": "ok"}
