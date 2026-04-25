import os
import json
import io
from google import genai
from google.genai import types

_client = None
FALLBACK_MSG = "Oi! Recebi sua mensagem e vou verificar com nossa equipe. Em breve retornamos. Obrigada pelo contato com a Clinica Lumiar!"
MODEL = "gemini-3.1-flash-lite-preview"


def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    return _client


async def gerar_json(system_prompt: str, contexto: str) -> dict:
    try:
        client = _get_client()
        prompt = f"{system_prompt}\n\nContexto:\n{contexto}\n\nResponda apenas com JSON valido."
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        print(f"[gemini] gerar_json erro: {e}")
        return {}


async def gerar_json_com_pdfs(system_prompt: str, contexto: str, pdf_urls: list[str]) -> dict:
    import httpx
    try:
        client = _get_client()
        partes = []

        async with httpx.AsyncClient(timeout=30) as http:
            for url in pdf_urls:
                try:
                    res = await http.get(url)
                    if res.status_code == 200:
                        uploaded = client.files.upload(
                            file=io.BytesIO(res.content),
                            config=types.UploadFileConfig(mime_type="application/pdf"),
                        )
                        partes.append(uploaded)
                except Exception:
                    continue

        prompt = f"{system_prompt}\n\nContexto adicional:\n{contexto}\n\nResponda apenas com JSON valido."
        partes.append(prompt)

        response = client.models.generate_content(model=MODEL, contents=partes)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        print(f"[gemini] gerar_json_com_pdfs erro: {e}")
        return {}
