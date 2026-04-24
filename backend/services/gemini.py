import os
import json
import google.generativeai as genai

_model = None
FALLBACK_MSG = "Oi! Recebi sua mensagem e vou verificar com nossa equipe. Em breve retornamos. Obrigada pelo contato com a Clinica Lumiar!"


def _get_model():
    global _model
    if _model is None:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        _model = genai.GenerativeModel("gemini-2.5-flash")
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
        return {"tema": "erro", "erro": str(e)}
