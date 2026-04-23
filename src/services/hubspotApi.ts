import { HUBSPOT_ACCESS_TOKEN } from '@env';

export const AGENTS = [
  {
    id: '88880167',
    name: 'Tech Livedin',
    meetingSlug: 'tech-livedin',
    ownerId: '88880167',
  },
];

const BASE_URL = 'https://api.hubapi.com';

const getHeaders = () => ({
  Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
});

// ───────────────── TYPES ─────────────────

export interface HubSpotSlot {
  startTime: number;
  endTime: number;
}

export type Agent = (typeof AGENTS)[0];

export interface AgentWithSlots {
  agent: Agent;
  slots: HubSpotSlot[];
}

export interface LeadInfo {
  fullName: string;
  phone: string; 
  email: string;
  country: string;
  city: string;
  language?: string;
  potentialUnits?: string;
  meetingDate?: string;
}

// ───────────────── HELPER FETCHERS ─────────────────

export const fetchSlotsForDate = async (slug: string, date: string): Promise<HubSpotSlot[]> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();

    const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?startTime=${startOfDay}&endTime=${endOfDay}&timezone=${encodeURIComponent(timezone)}`;
    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!res.ok) return [];

    const data = await res.json();
    const durationMap = data.linkAvailability?.linkAvailabilityByDuration || {};
    const targetKey = durationMap['2700000'] || Object.keys(durationMap)[0];
    const availabilityData = targetKey ? durationMap[targetKey]?.availabilities || [] : [];

    return availabilityData
      .map((slot: any) => ({ startTime: slot.startMillisUtc, endTime: slot.endMillisUtc }))
      .filter((s: any) => new Date(s.startTime).toLocaleDateString('en-CA') === date)
      .sort((a: any, b: any) => a.startTime - b.startTime);
  } catch (error) {
    return [];
  }
};

export const fetchAllAgentsAvailableDates = async (year: number, month: number): Promise<Record<string, boolean>> => {
  const availableDates: Record<string, boolean> = {};
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const startTime = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
  const endTime = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  await Promise.all(AGENTS.map(async agent => {
    try {
      const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${agent.meetingSlug}?startTime=${startTime}&endTime=${endTime}&timezone=${encodeURIComponent(timezone)}`;
      const res = await fetch(url, { method: 'GET', headers: getHeaders() });
      const data = await res.json();
      const durationMap = data.linkAvailability?.linkAvailabilityByDuration || {};
      const targetKey = durationMap['2700000'] || Object.keys(durationMap)[0];
      const availabilities = targetKey ? durationMap[targetKey]?.availabilities || [] : [];
      availabilities.forEach((slot: any) => {
        availableDates[new Date(slot.startMillisUtc).toLocaleDateString('en-CA')] = true;
      });
    } catch (e) {}
  }));
  return availableDates;
};

export const fetchFirstAvailableAgentForDate = async (date: string): Promise<AgentWithSlots | null> => {
  const results = await Promise.all(AGENTS.map(async agent => ({ agent, slots: await fetchSlotsForDate(agent.meetingSlug, date) })));
  return results.find(r => r.slots.length > 0) || null;
};

// ───────────────── HUBSPOT CRM OPERATIONS ─────────────────

export const createHubSpotContact = async (lead: LeadInfo, ownerId: string): Promise<string | null> => {
  try {
    const lastFour = lead.phone.replace(/\D/g, '').slice(-4) || '0000';
    const formattedFirstName = `${lastFour} - ${lead.fullName}`;

    const body = {
      properties: {
        firstname: formattedFirstName,
        lastname: '-',
        email: lead.email,
        phone: lead.phone,
        hubspot_owner_id: ownerId,
        hs_lead_status: 'Meeting Scheduled',
        full_name: lead.fullName,
        city__district: lead.city, 
        number_of_potential_units: lead.potentialUnits, // UPDATED KEY
        lead_source: 'Mobile App',
        language: lead.language || 'English',
        interested_in_str: 'YES',
        business_vertical: 'SaaS',
        meeting_scheduled_date: lead.meetingDate,
      },
    };

    const res = await fetch(`${BASE_URL}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.status === 409) return data?.message?.match(/Existing ID: (\d+)/)?.[1] || null;
    if (!res.ok) {
      console.error('[HubSpot Contact Error]:', data);
      return null;
    }
    return data.id;
  } catch (error) {
    return null;
  }
};

const createHubSpotDeal = async (lead: LeadInfo, ownerId: string, contactId: string): Promise<string | null> => {
  try {
    const lastFour = lead.phone.replace(/\D/g, '').slice(-4) || '0000';
    
    const body = {
      properties: {
        dealname: `${lastFour} - ${lead.fullName} - Deal`,
        
        // --- PIPELINE FIX ---
        // Using the Pipeline ID and Stage ID provided by your HubSpot error
        pipeline: '846163609', 
        dealstage: '1259055478', // This is a valid numeric stage ID from your error logs
        
        hubspot_owner_id: ownerId,
        city__district: lead.city,
        number_of_potential_units: lead.potentialUnits, 
        business_vertical: 'SaaS',
        closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      associations: [{
        to: { id: contactId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
      }],
    };

    const res = await fetch(`${BASE_URL}/crm/v3/objects/deals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[HubSpot Deal Error]:', data);
      return null;
    }
    return data.id;
  } catch (error) {
    return null;
  }
};

// ───────────────── MAIN ORCHESTRATOR ─────────────────

export const submitLeadAndBookMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  agent: Agent,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Create Contact
    const contactId = await createHubSpotContact(lead, agent.ownerId);
    if (!contactId) return { success: false, error: 'Failed to create contact' };

    // 2. Create Deal and link to Contact
    await createHubSpotDeal(lead, agent.ownerId, contactId);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Submission failed' };
  }
};