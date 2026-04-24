import os
import httpx

FEEGOW_BASE_URL = "https://api.feegow.com/v1/api"
FEEGOW_TOKEN = os.getenv("FEEGOW_TOKEN", "")

HEADERS = {"x-access-token": FEEGOW_TOKEN}


async def buscar_agenda(especialidade: str = "", data: str = "") -> list[dict]:
    params = {}
    if especialidade:
        params["specialty"] = especialidade
    if data:
        params["date"] = data
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(
                f"{FEEGOW_BASE_URL}/search-agenda",
                headers=HEADERS,
                params=params,
            )
            res.raise_for_status()
            return res.json().get("data", [])
    except Exception:
        return []


async def criar_agendamento(payload: dict) -> dict:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(
                f"{FEEGOW_BASE_URL}/new-appoint",
                headers={**HEADERS, "Content-Type": "application/json"},
                json=payload,
            )
            res.raise_for_status()
            return res.json()
    except Exception as e:
        return {"error": str(e)}


async def atualizar_status(feegow_id: str, status: str) -> bool:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(
                f"{FEEGOW_BASE_URL}/statusUpdate",
                headers={**HEADERS, "Content-Type": "application/json"},
                json={"id": feegow_id, "status": status},
            )
            return res.status_code == 200
    except Exception:
        return False
