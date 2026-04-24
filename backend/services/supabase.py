import os
import json
from supabase import create_client, Client
from datetime import datetime, timedelta

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_KEY"],
        )
    return _client


async def get_or_create_contato(telefone: str) -> dict:
    sb = get_client()
    res = sb.table("contatos").select("*").eq("telefone", telefone).single().execute()
    if res.data:
        return res.data
    novo = sb.table("contatos").insert({
        "telefone": telefone,
        "status": "lead",
        "primeira_mensagem": datetime.utcnow().isoformat(),
        "ultima_mensagem": datetime.utcnow().isoformat(),
    }).execute()
    return novo.data[0]


async def salvar_mensagem(contato_id: str, telefone: str, papel: str, mensagem: str):
    get_client().table("conversas").insert({
        "contato_id": contato_id,
        "telefone": telefone,
        "papel": papel,
        "mensagem": mensagem,
    }).execute()


async def get_historico(contato_id: str, limite: int = 10) -> list[dict]:
    res = (
        get_client()
        .table("conversas")
        .select("papel, mensagem")
        .eq("contato_id", contato_id)
        .order("criado_em", desc=True)
        .limit(limite)
        .execute()
    )
    return list(reversed(res.data or []))


async def atualizar_ultima_mensagem(contato_id: str):
    get_client().table("contatos").update({
        "ultima_mensagem": datetime.utcnow().isoformat()
    }).eq("id", contato_id).execute()


async def get_materiais_ativos() -> list[dict]:
    res = get_client().table("knowledge_base").select("*").eq("ativo", True).execute()
    return res.data or []


async def get_insights_semana() -> list[dict]:
    semana = (datetime.utcnow() - timedelta(days=7)).date().isoformat()
    res = (
        get_client()
        .table("conversas_insights")
        .select("tema_identificado, frequencia")
        .gte("semana", semana)
        .order("frequencia", desc=True)
        .limit(5)
        .execute()
    )
    return res.data or []


async def get_posts_recentes(dias: int = 14) -> list[dict]:
    desde = (datetime.utcnow() - timedelta(days=dias)).isoformat()
    res = (
        get_client()
        .table("posts_gerados")
        .select("tema")
        .gte("criado_em", desde)
        .execute()
    )
    return res.data or []


async def salvar_post(dados: dict) -> dict:
    res = get_client().table("posts_gerados").insert({
        "tema": dados.get("tema"),
        "tipo": "pack_diario",
        "texto_gerado": json.dumps(dados, ensure_ascii=False),
        "hashtags": dados.get("hashtags", ""),
        "status": "pendente",
    }).execute()
    return res.data[0] if res.data else {}
