import os
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from firebase_admin import auth, credentials, initialize_app

if not auth._auth_client:  # type: ignore[attr-defined]
    firebase_project_id = os.getenv("FIREBASE_PROJECT_ID", "cordia-dev")
    cred = credentials.ApplicationDefault()
    initialize_app(cred, {"projectId": firebase_project_id})


async def authenticate(request: Request) -> Annotated[str, None]:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    token = auth_header.split(" ", 1)[1]
    try:
        decoded = auth.verify_id_token(token)
    except Exception as exc:  # pragma: no cover - network errors
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    request.state.user = decoded
    return decoded.get("uid", "unknown")
