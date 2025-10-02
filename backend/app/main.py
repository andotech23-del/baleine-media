from fastapi import FastAPI
from .api.routes import router as api_router

app = FastAPI(
    title="Cordia Core API",
    version="0.1.0",
    description="Backend gateway for Cordia healthcare automation suite.",
)

app.include_router(api_router)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
