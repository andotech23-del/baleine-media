import Stripe from "stripe";
import { env } from "../config/env.js";

export const stripeClient = new Stripe(env.stripeSecret, { apiVersion: "2023-10-16" });

export default stripeClient;
