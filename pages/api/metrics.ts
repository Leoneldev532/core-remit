import type { NextApiRequest, NextApiResponse } from "next";
import { register, Counter } from "prom-client";

const abandonmentCounter =
  (register.getSingleMetric("remittance_flow_abandonment_total") as Counter) ||
  new Counter({
    name: "remittance_flow_abandonment_total",
    help: "Total number of users who abandoned the flow at Step 2 (timeout)",
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    res.setHeader("Content-Type", register.contentType);
    return res.status(200).send(await register.metrics());
  }

  if (req.method === "POST") {
    abandonmentCounter.inc();
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
