import type { VercelRequest, VercelResponse } from "@vercel/node";

const GHL_API_URL = "https://services.leadconnectorhq.com/contacts/";

function buildContactPayload(body: Record<string, unknown>, locationId: string) {
  return {
    firstName: body.firstName || "",
    lastName: body.lastName || "",
    name: [body.firstName, body.lastName].filter(Boolean).join(" "),
    email: body.email,
    phone: body.phone || "",
    companyName: body.businessName || "",
    locationId,
    source: "website form",
    customFields: [
      { id: "crkMxg5CdJqBfizIWiwr", value: body.businessName || "" },
      { id: "rkFsKxzDjlAmITs3H23E", value: body.leadSource || "" },
      { id: "y9Lyv8PhmusMEFhZHsEr", value: (Array.isArray(body.services) ? body.services : []).join(", ") },
      { id: "yFLW0YKN2Qr9htx5oJ5d", value: body.ghlStatus || "" },
      { id: "5eg1MnLggnCrgH9eDQe0", value: body.projectType || "" },
      { id: "d9EEIcFiJ1YdG7bUK6Qm", value: body.timeline || "" },
      { id: "sdBj2f1FCLqJAraea06O", value: body.description || "" },
    ],
  };
}

function ghlHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    Version: "2021-07-28",
  };
}

// Search for an existing contact by email to avoid GHL's phone-based duplicate matching
async function findContactByEmail(apiKey: string, locationId: string, email: string): Promise<string | null> {
  const url = `${GHL_API_URL}search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers: ghlHeaders(apiKey) });
  if (!res.ok) return null;
  const data = await res.json();
  return data.contact?.id || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return res.status(500).json({ success: false, error: "Server configuration error" });
  }

  const body = req.body || {};

  if (!body.email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  const payload = buildContactPayload(body, locationId);

  try {
    // Step 1: Check if a contact with this exact email already exists
    const existingId = await findContactByEmail(apiKey, locationId, body.email as string);

    if (existingId) {
      // Update the existing contact with the latest form data
      await fetch(`${GHL_API_URL}${existingId}`, {
        method: "PUT",
        headers: ghlHeaders(apiKey),
        body: JSON.stringify(payload),
      });
      return res.status(200).json({ success: true, contactId: existingId });
    }

    // Step 2: No existing contact with this email — create new
    const response = await fetch(GHL_API_URL, {
      method: "POST",
      headers: ghlHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ success: false, error: errorData });
    }

    const data = await response.json();
    return res.status(201).json({ success: true, contactId: data.contact?.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ success: false, error: message });
  }
}
