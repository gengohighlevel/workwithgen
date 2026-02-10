import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  const { startDate, endDate, timezone } = event.queryStringParameters || {};
  if (!startDate || !endDate) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "startDate and endDate are required" }),
    };
  }

  const calendarId = event.queryStringParameters?.calendarId || "6fQ7GJMol3Wcl8o7DSHX";

  try {
    const url = `https://services.leadconnectorhq.com/calendars/${calendarId}/free-slots?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}${timezone ? `&timezone=${encodeURIComponent(timezone)}` : ""}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Version: "2021-04-15",
      },
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    };
  }
};

export { handler };
