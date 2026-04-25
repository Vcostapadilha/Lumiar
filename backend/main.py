from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
import pytz

from agents.whatsapp import router as whatsapp_router
from agents.conteudo import router as conteudo_router
from agents.ads import router as ads_router
from agents.automacoes import router as automacoes_router
import agents.conteudo as conteudo_agent
import agents.automacoes as automacoes_agent

load_dotenv()

scheduler = AsyncIOScheduler()
brasilia = pytz.timezone("America/Sao_Paulo")


async def _job_conteudo():
    await conteudo_agent.gerar_conteudo()


async def _job_insights():
    await conteudo_agent.gerar_insights()


async def _job_automacoes():
    await automacoes_agent.lembrete_24h()
    await automacoes_agent.lembrete_2h()
    await automacoes_agent.followup_48h()
    await automacoes_agent.followup_7dias()
    await automacoes_agent.lembrete_pagamento()
    await automacoes_agent.feedback_google()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Conteudo — todo dia as 08:00 horario de Brasilia
    scheduler.add_job(
        _job_conteudo,
        CronTrigger(hour=8, minute=0, timezone=brasilia),
        id="conteudo_diario",
        replace_existing=True,
    )
    # Insights — todo domingo as 22:00 horario de Brasilia
    scheduler.add_job(
        _job_insights,
        CronTrigger(day_of_week="sun", hour=22, minute=0, timezone=brasilia),
        id="insights_semanais",
        replace_existing=True,
    )
    # Automacoes — a cada hora
    scheduler.add_job(
        _job_automacoes,
        IntervalTrigger(hours=1),
        id="automacoes_horarias",
        replace_existing=True,
    )
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(title="Lumiar Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(whatsapp_router, prefix="/whatsapp")
app.include_router(conteudo_router, prefix="/conteudo")
app.include_router(ads_router, prefix="/ads")
app.include_router(automacoes_router, prefix="/automacoes")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"},
    )


@app.get("/health")
def health():
    return {"status": "ok"}
