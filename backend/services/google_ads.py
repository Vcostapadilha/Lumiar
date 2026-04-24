import os
from datetime import date, timedelta

DEVELOPER_TOKEN = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN", "")
CLIENT_ID = os.getenv("GOOGLE_ADS_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("GOOGLE_ADS_CLIENT_SECRET", "")
REFRESH_TOKEN = os.getenv("GOOGLE_ADS_REFRESH_TOKEN", "")
CUSTOMER_ID = os.getenv("GOOGLE_ADS_CUSTOMER_ID", "")
LOGIN_CUSTOMER_ID = os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "")

QUERY_CAMPANHAS = """
    SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_per_conversion
    FROM campaign
    WHERE segments.date DURING LAST_7_DAYS
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
"""


def _credentials_configuradas() -> bool:
    return all([DEVELOPER_TOKEN, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, CUSTOMER_ID])


def buscar_metricas_campanhas() -> list[dict]:
    """Busca metricas dos ultimos 7 dias de todas as campanhas ativas."""
    if not _credentials_configuradas():
        return []

    try:
        from google.ads.googleads.client import GoogleAdsClient

        config = {
            "developer_token": DEVELOPER_TOKEN,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "refresh_token": REFRESH_TOKEN,
            "use_proto_plus": True,
        }
        if LOGIN_CUSTOMER_ID:
            config["login_customer_id"] = LOGIN_CUSTOMER_ID

        client = GoogleAdsClient.load_from_dict(config)
        service = client.get_service("GoogleAdsService")

        customer_id = CUSTOMER_ID.replace("-", "")
        response = service.search(customer_id=customer_id, query=QUERY_CAMPANHAS)

        campanhas = []
        for row in response:
            custo_reais = row.metrics.cost_micros / 1_000_000
            cpc_reais = row.metrics.average_cpc / 1_000_000
            cpa_reais = (
                row.metrics.cost_per_conversion / 1_000_000
                if row.metrics.conversions > 0
                else None
            )
            roi = (
                round((row.metrics.conversions / custo_reais) * 100, 2)
                if custo_reais > 0
                else 0
            )

            campanhas.append(
                {
                    "id": str(row.campaign.id),
                    "nome": row.campaign.name,
                    "status": row.campaign.status.name,
                    "impressoes": row.metrics.impressions,
                    "cliques": row.metrics.clicks,
                    "ctr": round(row.metrics.ctr * 100, 2),
                    "custo_reais": round(custo_reais, 2),
                    "cpc_reais": round(cpc_reais, 2),
                    "conversoes": row.metrics.conversions,
                    "cpa_reais": round(cpa_reais, 2) if cpa_reais else None,
                    "roi_conversoes_por_real": roi,
                }
            )

        return campanhas

    except Exception as e:
        print(f"[google_ads] Erro ao buscar metricas: {e}")
        return []
