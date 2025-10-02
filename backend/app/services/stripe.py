from typing import Any, Dict

import stripe

PLAN_CONFIG = {
    "basic": {"name": "Basic", "price_id": "price_basic", "seat_limit": 1},
    "team": {"name": "Team", "price_id": "price_team", "seat_limit": 5},
    "enterprise": {"name": "Enterprise", "price_id": "price_enterprise", "seat_limit": None},
}


def init(api_key: str) -> None:
    stripe.api_key = api_key


def create_customer(email: str, name: str) -> stripe.Customer:
    return stripe.Customer.create(email=email, name=name)


def create_subscription(customer_id: str, plan_key: str, quantity: int = 1) -> Dict[str, Any]:
    plan = PLAN_CONFIG[plan_key]
    subscription = stripe.Subscription.create(
        customer=customer_id,
        items=[{"price": plan["price_id"], "quantity": quantity}],
        payment_behavior="default_incomplete",
        expand=["latest_invoice.payment_intent"],
    )
    return subscription
