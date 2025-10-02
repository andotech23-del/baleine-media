from typing import Any, Dict, List

import requests

EPM_BASE_URL = "https://api.sandbox.kareo.com"


def fetch_schedule(token: str) -> List[Dict[str, Any]]:
    """Placeholder integration hook for external EPM schedules."""
    try:
        response = requests.get(
            f"{EPM_BASE_URL}/v1/schedule",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        response.raise_for_status()
        return response.json().get("appointments", [])
    except requests.RequestException:
        return []
