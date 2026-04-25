from fastapi import APIRouter
from services import supabase as db, gemini, evolution
from pytrends.request import TrendReq
import os
from datetime import datetime, timedelta

router = APIRouter()

TERMOS_TRENDS = ["autismo", "TEA", "integracao sensorial", "terapia ocupacional infantil"]
PROPRIETARIA_NUMBER = os.getenv("PROPRIETARIA_NUMBER")

PROMPT_CONTEUDO = """
Voce e um especialista em marketing para clinicas terapeuticas infantis.

Com base nos temas recorrentes nas conversas, tendencias de busca e materiais aprovados,
gere 3 entregas de conteudo para a Clinica Lumiar:

1. REELS COM ELA: roteiro cena por cena (maximo 60 segundos), tom acolhedor, educativo
2. REELS CANVA: texto animado com orientacao visual detalhada para montar no Canva
3. POST/STORY: caption completo com orientacao visual para Canva + hashtags sugeridas

Regras:
- Usa apenas informacoes dos materiais aprovados fornecidos
- Nunca inventa dado clinico
- Inclui disclaimer sugerido em posts clinicos
- Tom que conecta com maes e familias, nao tecnico
- PROIBIDO usar expressoes estigmatizantes ou reduccionistas sobre comportamento infantil como: "nao para quieto", "mundo da lua", "agitado demais", "lerdo", "bagunceiro", "fora do ritmo" — essas frases rotulam a crianca e afastam a mae
- Fala sempre da perspectiva do cuidado e do potencial da crianca, nunca do problema ou do deficit

Responda em JSON com as chaves: tema, reels_com_ela, reels_canva, post_story, hashtags, disclaimer
"""


@router.post("/gerar")
async def gerar_conteudo():
    # Tendencias Google Trends
    trends = _buscar_trends()

    # Materiais ativos
    materiais = await db.get_materiais_ativos()

    # Insights das conversas dos ultimos 7 dias
    insights = await db.get_insights_semana()

    # Historico de posts — evita repetir tema em 14 dias
    posts_recentes = await db.get_posts_recentes(dias=14)
    temas_usados = [p.get("tema", "") for p in posts_recentes]

    pdf_urls = [m.get("arquivo_url") for m in materiais if m.get("arquivo_url")]

    contexto = f"""
Tendencias de busca no RS esta semana: {trends}
Temas recorrentes nas conversas: {insights}
Temas ja usados nos ultimos 14 dias (nao repetir): {temas_usados}
Materiais aprovados: {[m.get('titulo') for m in materiais]}
"""

    if pdf_urls:
        resultado = await gemini.gerar_json_com_pdfs(PROMPT_CONTEUDO, contexto, pdf_urls)
    else:
        resultado = await gemini.gerar_json(PROMPT_CONTEUDO, contexto)

    # Salva no Supabase
    post = await db.salvar_post(resultado)

    # Notifica proprietaria
    msg = f"Novo conteudo gerado pela IA!\nTema: {resultado.get('tema')}\nAcesse o painel para aprovar: lumiar-dashboard.vercel.app"
    await evolution.enviar_mensagem(PROPRIETARIA_NUMBER, msg)

    return {"status": "ok", "post_id": post.get("id")}


PROMPT_INSIGHTS = """
Analise as mensagens abaixo enviadas por familias para uma clinica de terapia infantil.
Identifique os temas mais recorrentes e retorne JSON com a chave "insights" contendo lista de objetos:
- "tema": nome curto do tema (ex: "suspeita de autismo", "dificuldade escolar", "agendamento")
- "frequencia": numero de vezes que o tema apareceu (inteiro >= 1)

Maximo 10 temas, ordenados do mais ao menos frequente.
Responda APENAS com JSON valido: {"insights": [{"tema": "...", "frequencia": N}]}
"""


@router.post("/insights")
async def gerar_insights():
    conversas = await db.get_conversas_semana()
    if not conversas:
        return {"status": "sem_dados", "insights": 0}

    texto = "\n".join(f"- {m['mensagem']}" for m in conversas)
    resultado = await gemini.gerar_json(PROMPT_INSIGHTS, texto)

    insights = resultado.get("insights", [])
    if insights:
        await db.salvar_insights(insights)

    return {"status": "ok", "insights": len(insights)}


def _buscar_trends() -> list[str]:
    try:
        pytrends = TrendReq(hl="pt-BR", tz=180)
        pytrends.build_payload(TERMOS_TRENDS, geo="BR-RS", timeframe="now 7-d")
        data = pytrends.interest_over_time()
        if data.empty:
            return TERMOS_TRENDS
        top = data.mean().sort_values(ascending=False)
        return top.index.tolist()
    except Exception:
        return TERMOS_TRENDS
