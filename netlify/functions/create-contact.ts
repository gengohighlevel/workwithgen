import type { Handler } from "@netlify/functions";

const GHL_API_URL = "https://services.leadconnectorhq.com/contacts/";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server configuration error" }),
    };
  }

  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    leadSource?: string;
    services?: string[];
    ghlStatus?: string;
    projectType?: string;
    timeline?: string;
    description?: string;
  };

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid JSON body" }),
    };
  }

  if (!body.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Email is required" }),
    };
  }

  try {
    const response = await fetch(GHL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
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
          { id: "y9Lyv8PhmusMEFhZHsEr", value: (body.services || []).join(", ") },
          { id: "yFLW0YKN2Qr9htx5oJ5d", value: body.ghlStatus || "" },
          { id: "5eg1MnLggnCrgH9eDQe0", value: body.projectType || "" },
          { id: "d9EEIcFiJ1YdG7bUK6Qm", value: body.timeline || "" },
          { id: "sdBj2f1FCLqJAraea06O", value: body.description || "" },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      try {
        const parsed = JSON.parse(errorData);
        if (parsed.meta?.contactId) {
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, contactId: parsed.meta.contactId }),
          };
        }
      } catch {
        /* not JSON, fall through */
      }
      return {
        statusCode: response.status,
        body: JSON.stringify({ success: false, error: errorData }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, contactId: data.contact?.id }),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: message }),
    };
  }
};

export { handler };
