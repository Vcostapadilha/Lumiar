import os
import httpx

EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "")
INSTANCE_NAME = "lumiar"


async def enviar_mensagem(telefone: str, mensagem: str) -> bool:
    if not EVOLUTION_API_URL or not telefone:
        return False
    url = f"{EVOLUTION_API_URL}/message/sendText/{INSTANCE_NAME}"
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
    payload = {
        "number": telefone,
        "text": mensagem,
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(url, json=payload, headers=headers)
            return res.status_code == 201
    except Exception:
        return False
