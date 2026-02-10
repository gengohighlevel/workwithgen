/**
 * Fetches GHL custom field IDs for the contact model.
 *
 * Usage:
 *   GHL_API_KEY=<key> GHL_LOCATION_ID=<id> npx tsx scripts/get-custom-fields.ts
 */

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!API_KEY || !LOCATION_ID) {
  console.error("Set GHL_API_KEY and GHL_LOCATION_ID environment variables.");
  process.exit(1);
}

const TARGET_FIELDS = [
  "business_name",
  "lead_source",
  "services_needed",
  "do_you_currently_use_gohighlevel",
  "what_type_of_project_are_you_looking_for",
  "how_soon_do_you_need_this_service",
  "briefly_describe_your_main_goal_or_problem",
];

async function main() {
  // Try v2 with locations/customFields.readonly scope first,
  // then fall back to v1 custom-values endpoint
  const url = `https://services.leadconnectorhq.com/locations/${LOCATION_ID}/customFields?model=contact`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      Version: "2021-07-28",
    },
  });

  if (!res.ok) {
    // Fallback: try v2 custom-fields via different scope
    console.log(`V2 customFields failed (${res.status}), trying v1...`);
    const v1Res = await fetch(`https://rest.gohighlevel.com/v1/custom-fields/`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!v1Res.ok) {
      // Try with location-based v2 endpoint
      console.log(`V1 also failed (${v1Res.status}), trying locations customValues...`);
      const v2Alt = await fetch(
        `https://services.leadconnectorhq.com/locations/${LOCATION_ID}/customFields`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: "application/json",
            Version: "2021-07-28",
          },
        }
      );
      if (!v2Alt.ok) {
        console.error(`All attempts failed. Last error ${v2Alt.status}:`, await v2Alt.text());
        process.exit(1);
      }
      const altData = await v2Alt.json();
      console.log("Raw response:", JSON.stringify(altData, null, 2));
      process.exit(0);
    }
    const v1Data = await v1Res.json();
    console.log("Raw v1 response:", JSON.stringify(v1Data, null, 2));
    process.exit(0);
  }

  if (!res.ok) {
    console.error(`API error ${res.status}:`, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const fields: { id: string; name: string; fieldKey: string }[] =
    data.customFields || [];

  console.log("\n=== Matching Custom Fields ===\n");

  for (const target of TARGET_FIELDS) {
    const match = fields.find(
      (f) =>
        f.fieldKey === `contact.${target}` ||
        f.fieldKey === target ||
        f.name.toLowerCase().replace(/[\s?]/g, "_") === target
    );

    if (match) {
      console.log(`{{ contact.${target} }}`);
      console.log(`  id:       ${match.id}`);
      console.log(`  name:     ${match.name}`);
      console.log(`  fieldKey: ${match.fieldKey}`);
      console.log();
    } else {
      console.log(`{{ contact.${target} }}  — NOT FOUND`);
      console.log();
    }
  }

  console.log("=== All Contact Custom Fields ===\n");
  for (const f of fields) {
    console.log(`  ${f.id}  ${f.fieldKey}  "${f.name}"`);
  }
}

main();
