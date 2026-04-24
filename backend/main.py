from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from agents.whatsapp import router as whatsapp_router
from agents.conteudo import router as conteudo_router
from agents.ads import router as ads_router

load_dotenv()

app = FastAPI(title="Lumiar Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(whatsapp_router, prefix="/whatsapp")
app.include_router(conteudo_router, prefix="/conteudo")
app.include_router(ads_router, prefix="/ads")


@app.get("/health")
def health():
    return {"status": "ok"}
