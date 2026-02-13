import type { VercelRequest, VercelResponse } from "@vercel/node";

// GHL auto-creates a ghost contact for the calendar's assigned user on every
// appointment booking. Find and delete it so it doesn't pollute the contact list.
const GHOST_EMAIL = "gen.gohighlevel@gmail.com";

async function deleteGhostContact(apiKey: string, locationId: string) {
  try {
    const searchUrl = `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&query=${encodeURIComponent(GHOST_EMAIL)}&limit=1`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        Version: "2021-07-28",
      },
    });
    if (!searchRes.ok) return;
    const data = await searchRes.json();
    const ghost = data.contacts?.[0];
    if (ghost?.id && ghost.email === GHOST_EMAIL) {
      await fetch(`https://services.leadconnectorhq.com/contacts/${ghost.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          Version: "2021-07-28",
        },
      });
    }
  } catch {
    // Non-critical — don't block the appointment response
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const body = req.body || {};

  if (!body.calendarId || !body.startTime || !body.contactId) {
    return res.status(400).json({ error: "calendarId, startTime, and contactId are required" });
  }

  // Compute endTime from startTime preserving the timezone offset
  const startTimeStr = body.startTime as string;
  let endTime = body.endTime as string | undefined;

  if (!endTime) {
    const tzMatch = startTimeStr.match(/([+-]\d{2}:\d{2})$/);
    const offsetStr = tzMatch ? tzMatch[1] : "+00:00";
    const sign = offsetStr[0] === "+" ? 1 : -1;
    const [offH, offM] = offsetStr.slice(1).split(":").map(Number);
    const offsetMs = sign * (offH * 60 + offM) * 60000;

    const startDate = new Date(startTimeStr);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    const localEnd = new Date(endDate.getTime() + offsetMs + endDate.getTimezoneOffset() * 60000);
    const pad = (n: number) => String(n).padStart(2, "0");
    endTime = `${localEnd.getUTCFullYear()}-${pad(localEnd.getUTCMonth() + 1)}-${pad(localEnd.getUTCDate())}T${pad(localEnd.getUTCHours())}:${pad(localEnd.getUTCMinutes())}:${pad(localEnd.getUTCSeconds())}${offsetStr}`;
  }

  try {
    const response = await fetch(
      "https://services.leadconnectorhq.com/calendars/events/appointments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Version: "2021-04-15",
        },
        body: JSON.stringify({
          ...body,
          endTime,
          locationId,
        }),
      }
    );

    const data = await response.text();

    // Clean up the ghost contact GHL auto-creates for the assigned calendar user
    if (response.ok) {
      deleteGhostContact(apiKey, locationId);
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(response.status).send(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
