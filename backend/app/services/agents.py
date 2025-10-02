from __future__ import annotations

import os
from typing import Any, Dict

import requests

AGENT_BASE_URLS = {
    "scribe": os.getenv("SCRIBE_AGENT_URL", "http://localhost:8010"),
    "billing": os.getenv("BILLING_AGENT_URL", "http://localhost:8011"),
    "vision": os.getenv("VISION_AGENT_URL", "http://localhost:8012"),
    "care": os.getenv("CARE_AGENT_URL", "http://localhost:8013"),
}


def invoke_agent(agent_key: str, payload: Dict[str, Any]) -> Any:
    base_url = AGENT_BASE_URLS[agent_key]
    response = requests.post(f"{base_url}/run", json=payload, timeout=15)
    response.raise_for_status()
    return response.json()
