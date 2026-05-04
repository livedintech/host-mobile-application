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
const MEETINGS_PUBLIC_URL = 'https://api.hubspot.com/meetings-public/v3/book';

const getDeviceTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const getHeaders = () => {
  if (!HUBSPOT_ACCESS_TOKEN) {
    console.error('[HubSpot] HUBSPOT_ACCESS_TOKEN is undefined — check your .env file and rebuild');
  }
  return {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
};

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
  potentialUnits?: number;
  meetingDate?: string;
}

// ───────────────── HELPERS ─────────────────

const formatToLocalDate = (timestamp: number, timezone: string) => {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  }).format(new Date(timestamp));
};

const getMonthOffset = (year: number, month: number) => {
  const now = new Date();
  return (year - now.getFullYear()) * 12 + (month - (now.getMonth() + 1));
};

// ───────────────── API FUNCTIONS ─────────────────

export const fetchAllAgentsAvailableDates = async (year: number, month: number): Promise<Record<string, boolean>> => {
  const availableDates: Record<string, boolean> = {};
  const timezone = getDeviceTimezone();
  const monthOffset = getMonthOffset(year, month);

  await Promise.all(AGENTS.map(async agent => {
    try {
      const url = `${MEETINGS_PUBLIC_URL}/availability-page?monthOffset=${monthOffset}&slug=${agent.meetingSlug}&timezone=${encodeURIComponent(timezone)}`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) return;

      const data = await res.json();
      const durationMap = data.linkAvailability?.linkAvailabilityByDuration || {};
      const availabilityData = durationMap['2700000']?.availabilities || [];

      availabilityData.forEach((slot: any) => {
        availableDates[formatToLocalDate(slot.startMillisUtc, timezone)] = true;
      });
    } catch (e) {
      console.error("[fetchAllAgentsAvailableDates Error]:", e);
    }
  }));
  return availableDates;
};

export const fetchSlotsForDate = async (slug: string, date: string): Promise<HubSpotSlot[]> => {
  try {
    const [year, month] = date.split('-').map(Number);
    const timezone = getDeviceTimezone();
    const monthOffset = getMonthOffset(year, month);

    const url = `${MEETINGS_PUBLIC_URL}/availability-page?monthOffset=${monthOffset}&slug=${slug}&timezone=${encodeURIComponent(timezone)}`;

    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();

    const durationMap = data.linkAvailability?.linkAvailabilityByDuration || {};
    const availabilityData = durationMap['2700000']?.availabilities || [];

    return availabilityData
      .filter((slot: any) => formatToLocalDate(slot.startMillisUtc, timezone) === date)
      .map((slot: any) => ({
        startTime: slot.startMillisUtc,
        endTime: slot.endMillisUtc,
      }))
      .sort((a: HubSpotSlot, b: HubSpotSlot) => a.startTime - b.startTime);
  } catch (error) {
    console.error("[fetchSlotsForDate Error]:", error);
    return [];
  }
};

export const fetchFirstAvailableAgentForDate = async (date: string): Promise<AgentWithSlots | null> => {
  const results = await Promise.all(AGENTS.map(async agent => ({ 
    agent, 
    slots: await fetchSlotsForDate(agent.meetingSlug, date) 
  })));
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
        number_of_potential_units: lead.potentialUnits,
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
      console.error('[createHubSpotContact] API error:', res.status, JSON.stringify(data));
      return null;
    }
    return data.id;
  } catch (error) {
    console.error('[createHubSpotContact] Exception:', error);
    return null;
  }
};

const createHubSpotDeal = async (lead: LeadInfo, ownerId: string, contactId: string): Promise<string | null> => {
  try {
    const lastFour = lead.phone.replace(/\D/g, '').slice(-4) || '0000';
    const body = {
      properties: {
        dealname: `${lastFour} - ${lead.fullName} - Deal`,
        pipeline: '846163609', 
        dealstage: '1259055478',
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
    if (!res.ok) return null;
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
    const contactId = await createHubSpotContact(lead, agent.ownerId);
    if (!contactId) return { success: false, error: 'Failed to create contact' };
    await createHubSpotDeal(lead, agent.ownerId, contactId);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Submission failed' };
  }
};
