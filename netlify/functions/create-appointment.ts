import type { Handler } from "@netlify/functions";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

// GHL auto-creates a ghost contact for the calendar's assigned user on every
// appointment booking. Find and delete it so it doesn't pollute the contact list.
const GHOST_EMAIL = "gen.gohighlevel@gmail.com";

async function deleteGhostContact(apiKey: string, locationId: string) {
  try {
    const searchUrl = `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&query=${encodeURIComponent(GHOST_EMAIL)}&limit=1`;
    const res = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        Version: "2021-07-28",
      },
    });
    if (!res.ok) return;
    const data = await res.json();
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

const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!body.calendarId || !body.startTime || !body.contactId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "calendarId, startTime, and contactId are required" }),
    };
  }

  // Compute endTime from startTime preserving the timezone offset
  // startTime format: "2026-02-11T11:00:00+08:00"
  const startTimeStr = body.startTime as string;
  let endTime = body.endTime as string | undefined;

  if (!endTime) {
    // Extract timezone offset from startTime (e.g. "+08:00" or "-05:00")
    const tzMatch = startTimeStr.match(/([+-]\d{2}:\d{2})$/);
    const offsetStr = tzMatch ? tzMatch[1] : "+00:00";
    const sign = offsetStr[0] === "+" ? 1 : -1;
    const [offH, offM] = offsetStr.slice(1).split(":").map(Number);
    const offsetMs = sign * (offH * 60 + offM) * 60000;

    const startDate = new Date(startTimeStr);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    // Shift UTC to the slot's local timezone for formatting
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

    return {
      statusCode: response.status,
      headers,
      body: data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: message }),
    };
  }
};

export { handler };
