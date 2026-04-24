from fastapi import APIRouter
from services import gemini, evolution
from services.google_ads import buscar_metricas_campanhas, _credentials_configuradas
import os

router = APIRouter()

PROPRIETARIA_NUMBER = os.getenv("PROPRIETARIA_NUMBER")

PROMPT_ADS = """
Voce e um especialista em Google Ads para pequenas clinicas de saude.

Analise as metricas de campanha abaixo dos ultimos 7 dias e entregue:

1. RESUMO: performance geral (gastou quanto, gerou quantas conversoes, qual o CPA medio)
2. ALERTAS: campanhas com CTR abaixo de 1%, CPA acima de R$50 ou zero conversoes com gasto relevante (>R$20)
3. OTIMIZACOES: 3 acoes concretas e priorizadas para melhorar o ROI esta semana
4. PROXIMO PASSO: a acao mais importante para fazer HOJE

Regras:
- Seja direto e pratico, sem jargao tecnico excessivo
- Valores em reais (R$)
- Se nao houver campanhas ativas ou dados, informe claramente
- Tom profissional mas acessivel para quem nao e especialista em ads

Responda em JSON com as chaves: resumo, alertas (lista), otimizacoes (lista de strings), proximo_passo
"""


def _formatar_relatorio_whatsapp(analise: dict, campanhas: list[dict]) -> str:
    total_gasto = sum(c["custo_reais"] for c in campanhas)
    total_conversoes = sum(c["conversoes"] for c in campanhas)
    total_cliques = sum(c["cliques"] for c in campanhas)

    linhas = [
        "*Relatorio Google Ads — ultimos 7 dias*",
        "",
        f"Campanhas ativas: {len(campanhas)}",
        f"Total gasto: R$ {total_gasto:.2f}",
        f"Cliques: {total_cliques}",
        f"Conversoes: {total_conversoes:.0f}",
        "",
        f"*Resumo:* {analise.get('resumo', '')}",
        "",
    ]

    alertas = analise.get("alertas", [])
    if alertas:
        linhas.append("*Alertas:*")
        for alerta in alertas:
            linhas.append(f"- {alerta}")
        linhas.append("")

    otimizacoes = analise.get("otimizacoes", [])
    if otimizacoes:
        linhas.append("*Otimizacoes sugeridas:*")
        for i, acao in enumerate(otimizacoes, 1):
            linhas.append(f"{i}. {acao}")
        linhas.append("")

    proximo_passo = analise.get("proximo_passo", "")
    if proximo_passo:
        linhas.append(f"*Acao de hoje:* {proximo_passo}")

    linhas.append("")
    linhas.append("Acesse o painel para detalhes: lumiar-dashboard.vercel.app")

    return "\n".join(linhas)


@router.post("/analisar")
async def analisar_ads():
    if not _credentials_configuradas():
        return {
            "status": "sem_configuracao",
            "mensagem": "Credenciais Google Ads nao configuradas. Preencha as variaveis de ambiente quando a conta estiver ativa.",
        }

    campanhas = buscar_metricas_campanhas()

    if not campanhas:
        await evolution.enviar_mensagem(
            PROPRIETARIA_NUMBER,
            "Google Ads: nenhuma campanha ativa encontrada nos ultimos 7 dias.",
        )
        return {"status": "sem_campanhas"}

    contexto = f"Metricas das campanhas dos ultimos 7 dias:\n{campanhas}"
    analise = await gemini.gerar_json(PROMPT_ADS, contexto)

    relatorio = _formatar_relatorio_whatsapp(analise, campanhas)
    await evolution.enviar_mensagem(PROPRIETARIA_NUMBER, relatorio)

    return {"status": "ok", "campanhas": len(campanhas), "analise": analise}
