import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for cross-origin requests from Lovable site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.error('Missing GHL_API_KEY or GHL_LOCATION_ID env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const {
      fullName,
      email,
      phone,
      businessName,
      leadSource,
      services,
      ghlStatus,
      projectType,
      timeline,
      description,
    } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone are required' });
    }

    const nameParts = (fullName || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const contactPayload: Record<string, any> = {
      email,
      phone,
      firstName,
      lastName,
      name: fullName || '',
      locationId: GHL_LOCATION_ID,
      source: leadSource || 'Website Form',
      tags: [
        'website-inquiry',
        ...(services || []),
        ...(ghlStatus ? [`ghl-${ghlStatus.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`] : []),
        ...(projectType ? [`project-${projectType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`] : []),
      ],
    };

    if (businessName) {
      contactPayload.companyName = businessName;
    }

    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify(contactPayload),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(201).json({
        success: true,
        contactId: data?.contact?.id,
        message: 'Contact created successfully',
      });
    }

    // Handle duplicate contact
    if (data?.meta?.contactId) {
      return res.status(200).json({
        success: true,
        contactId: data.meta.contactId,
        message: 'Contact already exists',
      });
    }

    console.error('GHL API error:', data);
    return res.status(response.status).json({
      success: false,
      error: data?.message || 'Failed to create contact',
    });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
