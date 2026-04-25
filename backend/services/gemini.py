import os
import json
import httpx
import google.generativeai as genai

_model = None
FALLBACK_MSG = "Oi! Recebi sua mensagem e vou verificar com nossa equipe. Em breve retornamos. Obrigada pelo contato com a Clinica Lumiar!"


def _get_model():
    global _model
    if _model is None:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        _model = genai.GenerativeModel("gemini-2.0-flash")
    return _model


async def responder(system_prompt: str, historico: list[dict], mensagem: str) -> str:
    try:
        model = _get_model()
        partes = [system_prompt, "\n\n--- Historico da conversa ---\n"]
        for msg in historico:
            papel = "Familia" if msg["papel"] == "user" else "Assistente"
            partes.append(f"{papel}: {msg['mensagem']}")
        partes.append(f"\nFamilia: {mensagem}\nAssistente:")
        prompt = "\n".join(partes)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return FALLBACK_MSG


async def gerar_json_com_pdfs(system_prompt: str, contexto: str, pdf_urls: list[str]) -> dict:
    try:
        model = _get_model()
        partes = []

        # Baixa e sobe cada PDF pro Gemini Files API
        async with httpx.AsyncClient(timeout=30) as client:
            for url in pdf_urls:
                try:
                    res = await client.get(url)
                    if res.status_code == 200:
                        uploaded = genai.upload_file(
                            res.content,
                            mime_type="application/pdf",
                        )
                        partes.append(uploaded)
                except Exception:
                    continue

        prompt = f"{system_prompt}\n\nContexto adicional:\n{contexto}\n\nResponda apenas com JSON valido."
        partes.append(prompt)

        response = model.generate_content(partes)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        print(f"[gemini] gerar_json_com_pdfs erro: {e}")
        return {"tema": "erro", "erro": str(e)}


async def gerar_json(system_prompt: str, contexto: str) -> dict:
    try:
        model = _get_model()
        prompt = f"{system_prompt}\n\nContexto:\n{contexto}\n\nResponda apenas com JSON valido."
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        print(f"[gemini] gerar_json erro: {e}")
        return {"tema": "erro", "erro": str(e)}
