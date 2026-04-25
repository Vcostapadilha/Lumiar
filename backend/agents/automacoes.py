from fastapi import APIRouter
from services import supabase as db, evolution
from datetime import datetime, timedelta
import os

router = APIRouter()

PROPRIETARIA_NUMBER = os.getenv("PROPRIETARIA_NUMBER")
PIX_CHAVE = os.getenv("PIX_CHAVE", "lumiar.clinica@gmail.com")
GOOGLE_REVIEW_URL = os.getenv("GOOGLE_REVIEW_URL", "https://g.page/r/clinica-lumiar/review")


def _agora() -> datetime:
    return datetime.utcnow()


def _sb():
    return db.get_client()


# ---------------------------------------------------------------------------
# 1. Lembrete 24h antes da consulta
# ---------------------------------------------------------------------------
@router.post("/lembrete-24h")
async def lembrete_24h():
    agora = _agora()
    inicio = (agora + timedelta(hours=23)).isoformat()
    fim = (agora + timedelta(hours=25)).isoformat()

    res = (
        _sb()
        .table("agendamentos")
        .select("id, data_hora, contatos(telefone, nome)")
        .gte("data_hora", inicio)
        .lte("data_hora", fim)
        .in_("status", ["agendado", "confirmado"])
        .eq("lembrete_24h_enviado", False)
        .execute()
    )

    enviados = 0
    for ag in res.data or []:
        contato = ag.get("contatos") or {}
        telefone = contato.get("telefone")
        nome = contato.get("nome") or "familiar"
        if not telefone:
            continue

        hora = _formatar_hora(ag.get("data_hora", ""))
        msg = (
            f"Ola, {nome}! 💛\n\n"
            f"Passando para lembrar que amanha temos consulta na Clinica Lumiar as {hora}.\n\n"
            f"Qualquer duvida e so responder aqui. Ate amanha!"
        )
        enviou = await evolution.enviar_mensagem(telefone, msg)
        if enviou:
            _sb().table("agendamentos").update({"lembrete_24h_enviado": True}).eq("id", ag["id"]).execute()
            enviados += 1

    return {"status": "ok", "enviados": enviados}


# ---------------------------------------------------------------------------
# 2. Lembrete 2h antes da consulta
# ---------------------------------------------------------------------------
@router.post("/lembrete-2h")
async def lembrete_2h():
    agora = _agora()
    inicio = (agora + timedelta(hours=1)).isoformat()
    fim = (agora + timedelta(hours=3)).isoformat()

    res = (
        _sb()
        .table("agendamentos")
        .select("id, data_hora, contatos(telefone, nome)")
        .gte("data_hora", inicio)
        .lte("data_hora", fim)
        .in_("status", ["agendado", "confirmado"])
        .eq("lembrete_2h_enviado", False)
        .execute()
    )

    enviados = 0
    for ag in res.data or []:
        contato = ag.get("contatos") or {}
        telefone = contato.get("telefone")
        nome = contato.get("nome") or "familiar"
        if not telefone:
            continue

        hora = _formatar_hora(ag.get("data_hora", ""))
        msg = (
            f"Ola, {nome}! 🌿\n\n"
            f"Sua consulta na Clinica Lumiar e daqui a pouco, as {hora}.\n\n"
            f"Nos vemos em breve!"
        )
        enviou = await evolution.enviar_mensagem(telefone, msg)
        if enviou:
            _sb().table("agendamentos").update({"lembrete_2h_enviado": True}).eq("id", ag["id"]).execute()
            enviados += 1

    return {"status": "ok", "enviados": enviados}


# ---------------------------------------------------------------------------
# 3. Follow-up lead 48h
# ---------------------------------------------------------------------------
@router.post("/followup-48h")
async def followup_48h():
    agora = _agora()
    inicio = (agora - timedelta(hours=49)).isoformat()
    fim = (agora - timedelta(hours=47)).isoformat()

    res = (
        _sb()
        .table("contatos")
        .select("id, telefone, nome")
        .eq("status", "lead")
        .gte("ultima_mensagem", inicio)
        .lte("ultima_mensagem", fim)
        .execute()
    )

    enviados = 0
    for contato in res.data or []:
        telefone = contato.get("telefone")
        nome = contato.get("nome") or "familiar"
        if not telefone:
            continue

        msg = (
            f"Ola, {nome}! Tudo bem?\n\n"
            f"Vi que conversamos outro dia sobre a Clinica Lumiar e queria saber "
            f"se ainda posso ajudar a encontrar um horario pra sua crianca.\n\n"
            f"Sem pressao, estamos por aqui quando precisar!"
        )
        await evolution.enviar_mensagem(telefone, msg)
        enviados += 1

    return {"status": "ok", "enviados": enviados}


# ---------------------------------------------------------------------------
# 4. Follow-up lead 7 dias
# ---------------------------------------------------------------------------
@router.post("/followup-7dias")
async def followup_7dias():
    agora = _agora()
    inicio = (agora - timedelta(days=7, hours=1)).isoformat()
    fim = (agora - timedelta(days=6, hours=23)).isoformat()

    res = (
        _sb()
        .table("contatos")
        .select("id, telefone, nome")
        .eq("status", "lead")
        .gte("ultima_mensagem", inicio)
        .lte("ultima_mensagem", fim)
        .execute()
    )

    enviados = 0
    for contato in res.data or []:
        telefone = contato.get("telefone")
        nome = contato.get("nome") or "familiar"
        if not telefone:
            continue

        msg = (
            f"Ola, {nome}! 🌸\n\n"
            f"Faz um tempo desde nosso ultimo contato e queria deixar uma mensagem carinhosa.\n\n"
            f"A Clinica Lumiar continua aqui, com todo o cuidado que sua crianca merece. "
            f"Quando sentir que e o momento certo, estamos prontos para recebe-los!"
        )
        await evolution.enviar_mensagem(telefone, msg)
        _sb().table("contatos").update({"status": "frio"}).eq("id", contato["id"]).execute()
        enviados += 1

    return {"status": "ok", "enviados": enviados}


# ---------------------------------------------------------------------------
# 5. Lembrete de pagamento
# ---------------------------------------------------------------------------
@router.post("/lembrete-pagamento")
async def lembrete_pagamento():
    agora = _agora()
    ontem_inicio = (agora - timedelta(hours=25)).isoformat()
    ontem_fim = (agora - timedelta(hours=23)).isoformat()

    res = (
        _sb()
        .table("agendamentos")
        .select("id, valor, contatos(telefone, nome)")
        .gte("data_hora", ontem_inicio)
        .lte("data_hora", ontem_fim)
        .eq("status", "aguardando_pagamento")
        .execute()
    )

    enviados = 0
    for ag in res.data or []:
        contato = ag.get("contatos") or {}
        telefone = contato.get("telefone")
        nome = contato.get("nome") or "familiar"
        valor = ag.get("valor")
        if not telefone:
            continue

        valor_str = f"R$ {valor:.2f}".replace(".", ",") if valor else ""
        valor_texto = f" no valor de {valor_str}" if valor_str else ""
        msg = (
            f"Ola, {nome}! Tudo bem?\n\n"
            f"Passando para lembrar sobre o pagamento da consulta de ontem{valor_texto}.\n\n"
            f"Nossa chave PIX: {PIX_CHAVE}\n\n"
            f"Qualquer duvida e so falar aqui. Obrigada!"
        )
        await evolution.enviar_mensagem(telefone, msg)
        enviados += 1

    return {"status": "ok", "enviados": enviados}


# ---------------------------------------------------------------------------
# 6. Pedido de feedback Google
# ---------------------------------------------------------------------------
@router.post("/feedback-google")
async def feedback_google():
    agora = _agora()
    inicio = (agora - timedelta(hours=25)).isoformat()
    fim = (agora - timedelta(hours=23)).isoformat()

    res = (
        _sb()
        .table("agendamentos")
        .select("id, contatos(telefone, nome)")
        .gte("data_hora", inicio)
        .lte("data_hora", fim)
        .eq("status", "realizado")
        .eq("feedback_enviado", False)
        .execute()
    )

    enviados = 0
    for ag in res.data or []:
        contato = ag.get("contatos") or {}
        telefone = contato.get("telefone")
        nome = contato.get("nome") or "familiar"
        if not telefone:
            continue

        msg = (
            f"Ola, {nome}! 💛\n\n"
            f"Esperamos que a consulta de ontem na Clinica Lumiar tenha sido uma "
            f"experiencia acolhedora para voce e sua crianca.\n\n"
            f"Se quiser compartilhar como foi, sua avaliacao no Google nos ajuda muito "
            f"a alcançar outras familias que precisam de apoio:\n"
            f"{GOOGLE_REVIEW_URL}\n\n"
            f"Obrigada pela confianca!"
        )
        enviou = await evolution.enviar_mensagem(telefone, msg)
        if enviou:
            _sb().table("agendamentos").update({"feedback_enviado": True}).eq("id", ag["id"]).execute()
            enviados += 1

    return {"status": "ok", "enviados": enviados}


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def _formatar_hora(iso: str) -> str:
    if not iso:
        return ""
    try:
        return datetime.fromisoformat(iso).strftime("%H:%M")
    except Exception:
        return iso
