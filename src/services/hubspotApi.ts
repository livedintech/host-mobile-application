import { HUBSPOT_ACCESS_TOKEN} from '@env';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Fill these with your real values
// ─────────────────────────────────────────────────────────────────────────────


// 4 Agents — replace slugs and ownerIds with real values
// meetingSlug → last part of https://meetings.hubspot.com/YOUR-SLUG
// ownerId     → HubSpot Settings → Users & Teams → click user → number in URL
export const AGENTS = [
 {
    id: '88880167',
    name: 'Tech Livedin',
    meetingSlug: 'tech-livedin',
    ownerId: '88880167',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const MEETING_DURATION_MS = 30 * 60 * 1000; // 30 minutes — change if needed
const BASE_URL = 'https://api.hubapi.com';

const getHeaders = () => ({
  Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HubSpotSlot {
  startMilliseconds: number;
  endMilliseconds: number;
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
}

// ─── Helper: Try multiple endpoints (HubSpot has different versions) ──────────
const fetchAvailableTimes = async (
  slug: string,
  startTime: number,
  endTime: number
): Promise<HubSpotSlot[]> => {
  // Endpoints to try in order
  const endpoints = [
    // Option 1 — newer public API
    `${BASE_URL}/meetings/v1/meetings/${slug}/available-times?startTime=${startTime}&endTime=${endTime}`,
    // Option 2 — scheduler v3 (original)
    `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/${slug}/available-times?startTime=${startTime}&endTime=${endTime}`,
    // Option 3 — v2 variant
    `${BASE_URL}/meetings/v2/meetings/${slug}/available-times?startTime=${startTime}&endTime=${endTime}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        // Different endpoints return different shapes
        return (
          data.availabilities ||
          data.availability ||
          data.times ||
          data.slots ||
          []
        );
      }
      console.log(`[HubSpot] ${res.status} for: ${url}`);
    } catch (e) {
      console.log(`[HubSpot] Error for: ${url}`, e);
    }
  }

  return [];
};

// ─── 1. Fetch available DATES for one agent in a month ───────────────────────
const fetchAgentAvailableDatesForMonth = async (
  slug: string,
  year: number,
  month: number
): Promise<Record<string, boolean>> => {
  try {
    const startTime = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
    const endTime = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    const slots = await fetchAvailableTimes(slug, startTime, endTime);

    const map: Record<string, boolean> = {};
    slots.forEach((slot: HubSpotSlot) => {
      const key = new Date(slot.startMilliseconds).toISOString().split('T')[0];
      map[key] = true;
    });

    return map;
  } catch {
    return {};
  }
};

// ─── 2. Fetch slots for one agent on a specific date ─────────────────────────
const fetchAgentSlotsForDate = async (
  slug: string,
  date: string // 'YYYY-MM-DD'
): Promise<HubSpotSlot[]> => {
  try {
    const startTime = new Date(date + 'T00:00:00').getTime();
    const endTime = new Date(date + 'T23:59:59').getTime();
    return await fetchAvailableTimes(slug, startTime, endTime);
  } catch {
    return [];
  }
};

// ─── 3. All 4 agents — merged available dates for calendar ───────────────────
// Date shows as available if AT LEAST ONE agent is free
export const fetchAllAgentsAvailableDates = async (
  year: number,
  month: number
): Promise<Record<string, boolean>> => {
  const results = await Promise.all(
    AGENTS.map((agent) =>
      fetchAgentAvailableDatesForMonth(agent.meetingSlug, year, month)
    )
  );

  const merged: Record<string, boolean> = {};
  results.forEach((agentDates) => {
    Object.keys(agentDates).forEach((date) => {
      merged[date] = true;
    });
  });

  return merged;
};

// ─── 4. For selected date — find first available agent + their slots ──────────
// Round-robin: Agent 1 → 2 → 3 → 4 (first with free slots wins)
export const fetchFirstAvailableAgentForDate = async (
  date: string
): Promise<AgentWithSlots | null> => {
  const results = await Promise.all(
    AGENTS.map(async (agent) => {
      const slots = await fetchAgentSlotsForDate(agent.meetingSlug, date);
      return { agent, slots };
    })
  );

  return results.find((r) => r.slots.length > 0) || null;
};

// ─── 5. Create Contact (Lead) in HubSpot CRM ─────────────────────────────────
const createHubSpotContact = async (
  lead: LeadInfo,
  agentOwnerId: string
): Promise<string | null> => {
  try {
    const nameParts = lead.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '-';

    const body = {
      properties: {
        firstname: firstName,
        lastname: lastName,
        email: lead.email,
        phone: lead.phone,
        country: lead.country,
        city: lead.city,
        hubspot_owner_id: agentOwnerId, // Auto-assign to available agent
        hs_lead_status: 'NEW',
      },
    };

    const res = await fetch(`${BASE_URL}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    // 409 = contact already exists with this email
    if (res.status === 409) {
      const err = await res.json();
      const existingId = err?.message?.match(/ID: (\d+)/)?.[1];
      return existingId || null;
    }

    if (!res.ok) return null;

    const data = await res.json();
    return data?.id || null;
  } catch {
    return null;
  }
};

// ─── 6. Book meeting via HubSpot (auto-adds to agent's Google Calendar) ───────
const bookHubSpotMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  agentSlug: string,
  contactId: string | null
): Promise<boolean> => {
  try {
    const nameParts = lead.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '-';

    const body = {
      slug: agentSlug,
      startTime: slot.startMilliseconds,
      endTime: slot.startMilliseconds + MEETING_DURATION_MS,
      firstName,
      lastName,
      email: lead.email,
      phone: lead.phone,
      locale: 'en-us',
      formFields: [
        { name: 'country', value: lead.country },
        { name: 'city', value: lead.city },
        // If HubSpot contact ID exists, link meeting to contact
        ...(contactId ? [{ name: 'hs_contact_id', value: contactId }] : []),
      ],
    };

    const res = await fetch(
      `${BASE_URL}/scheduler/v3/meetings/meeting-links/book`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }
    );

    return res.ok;
  } catch {
    return false;
  }
};

// ─── 7. MAIN FUNCTION — Call this from CalendarScreenContainer ────────────────
// Step 1: Create contact/lead in HubSpot CRM
// Step 2: Book meeting on agent's link (Google Calendar event auto-created)
// Both linked together, agent gets assigned automatically
export const submitLeadAndBookMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  agent: Agent
): Promise<{ success: boolean; error?: string }> => {
  // Step 1 — Create contact in HubSpot (assigned to this agent)
  const contactId = await createHubSpotContact(lead, agent.ownerId);

  // Step 2 — Book meeting on agent's HubSpot link
  // This automatically creates Google Calendar event for the agent
  const meetingBooked = await bookHubSpotMeeting(
    lead,
    slot,
    agent.meetingSlug,
    contactId
  );

  if (!meetingBooked) {
    return { success: false, error: 'Meeting booking failed. Please try again.' };
  }

  return { success: true };
};