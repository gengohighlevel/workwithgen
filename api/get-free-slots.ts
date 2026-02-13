import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { startDate, endDate, timezone, calendarId } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  const calendar = (calendarId as string) || "jGIhsfyokB3JIAKIiV47";

  try {
    const url = `https://services.leadconnectorhq.com/calendars/${calendar}/free-slots?startDate=${encodeURIComponent(startDate as string)}&endDate=${encodeURIComponent(endDate as string)}${timezone ? `&timezone=${encodeURIComponent(timezone as string)}` : ""}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Version: "2021-04-15",
      },
    });

    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    return res.status(response.status).send(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
