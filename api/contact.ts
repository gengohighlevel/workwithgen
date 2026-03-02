import type { VercelRequest, VercelResponse } from '@vercel/node';

// GHL custom field IDs mapped to form fields
const CUSTOM_FIELD_IDS = {
  businessName: 'crkMxg5CdJqBfizIWiwr',
  leadSource: 'rkFsKxzDjlAmITs3H23E',
  services: 'y9Lyv8PhmusMEFhZHsEr',
  ghlStatus: 'yFLW0YKN2Qr9htx5oJ5d',
  projectType: '5eg1MnLggnCrgH9eDQe0',
  timeline: 'd9EEIcFiJ1YdG7bUK6Qm',
  description: 'sdBj2f1FCLqJAraea06O',
};

function pick(body: any, ...keys: string[]) {
  for (const k of keys) {
    if (body[k] !== undefined && body[k] !== '' && body[k] !== null) return body[k];
  }
  return undefined;
}

const VALUE_MAPS: Record<string, Record<string, string>> = {
  leadSource: {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    upwork: 'Upwork',
    onlinejobsph: 'OnlineJobsPH',
    referral: 'Referral',
  },
  projectType: {
    hourly: 'Hourly',
    'project-based': 'Project Based / Fixed',
    'setup-retainer': 'One Time Setup + Monthly Retainer',
  },
  timeline: {
    asap: 'ASAP',
    '1-2weeks': '1-2 Weeks',
    '1month': 'Within a Month',
    flexible: 'Flexible',
  },
};

function normalize(field: string, value: string | undefined): string | undefined {
  if (!value) return value;
  const map = VALUE_MAPS[field];
  if (!map) return value;
  if (Object.values(map).includes(value)) return value;
  return map[value.toLowerCase()] || value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  if (!locationId) {
    return res.status(500).json({ error: 'Location ID not configured' });
  }

  const body = req.body;

  console.log('contact.ts received body:', JSON.stringify(body));

  const fullName = pick(body, 'fullName', 'full_name', 'name', 'firstName');
  const email = pick(body, 'email', 'emailAddress', 'email_address');
  const phone = pick(body, 'phone', 'phoneNumber', 'phone_number');

  const businessName = pick(body, 'businessName', 'business_name', 'business', 'companyName', 'company_name', 'company');
  const leadSource = normalize('leadSource', pick(body, 'leadSource', 'lead_source', 'source', 'howDidYouFindUs'));
  const services = pick(body, 'services', 'servicesNeeded', 'services_needed', 'selectedServices');

  const GHL_STATUS_VALUES = ['Yes, actively', 'Yes, but not fully set up', 'No, not yet'];
  let ghlStatus = pick(body, 'ghlStatus', 'ghl_status', 'goHighLevel', 'goHighLevelStatus', 'useGHL', 'useGoHighLevel');
  if (!ghlStatus) {
    for (const [, val] of Object.entries(body)) {
      if (typeof val === 'string' && GHL_STATUS_VALUES.includes(val)) {
        ghlStatus = val;
        break;
      }
    }
  }

  const projectType = normalize('projectType', pick(body, 'projectType', 'project_type', 'projectKind'));
  const timeline = normalize('timeline', pick(body, 'timeline', 'howSoon', 'how_soon', 'timeframe'));
  const description = pick(body, 'description', 'mainGoal', 'main_goal', 'goal', 'message', 'notes', 'details');

  const firstName = fullName?.split?.(' ')[0] || body.firstName || '';
  const lastName = fullName?.split?.(' ').slice(1).join(' ') || body.lastName || '';

  // Build custom fields array for GHL
  const customFields: { id: string; field_value: any }[] = [];

  if (businessName) customFields.push({ id: CUSTOM_FIELD_IDS.businessName, field_value: businessName });
  if (leadSource) customFields.push({ id: CUSTOM_FIELD_IDS.leadSource, field_value: leadSource });
  if (services && (Array.isArray(services) ? services.length > 0 : true)) {
    customFields.push({ id: CUSTOM_FIELD_IDS.services, field_value: Array.isArray(services) ? services : [services] });
  }
  if (ghlStatus) customFields.push({ id: CUSTOM_FIELD_IDS.ghlStatus, field_value: ghlStatus });
  if (projectType) customFields.push({ id: CUSTOM_FIELD_IDS.projectType, field_value: projectType });
  if (timeline) customFields.push({ id: CUSTOM_FIELD_IDS.timeline, field_value: timeline });
  if (description) customFields.push({ id: CUSTOM_FIELD_IDS.description, field_value: description });

  console.log('contact.ts customFields:', JSON.stringify(customFields));

  try {
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        locationId,
        companyName: businessName || undefined,
        source: leadSource || 'Website Form',
        tags: ['website-inquiry', 'portfolio-website'],
        customFields,
      }),
    });

    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    if (!contactId) {
      console.error('Failed to upsert contact:', contactData);
      return res.status(502).json({ error: 'Failed to create contact in GHL', details: contactData });
    }

    return res.status(200).json({
      success: true,
      contactId,
      email,
    });
  } catch (err) {
    console.error('GHL contact proxy error:', err);
    return res.status(502).json({ error: 'Failed to create contact in GHL' });
  }
}
