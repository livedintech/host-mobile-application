// ⚠️ TEMP ONLY — MOVE TO BACKEND LATER
export const HUBSPOT_ACCESS_TOKEN = 'pat-na1-0d3ea7c2-bcdf-44d7-851d-b641dc84a4c4';


// Slug for https://meetings.hubspot.com/SLUG
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
}

// ───────────────── 1️⃣ FETCH SLOTS ─────────────────
// IMPORTANT:
// availability-page returns workingHours + busyTimes
// It does NOT return ready-made slots.
// We generate simple 30-min slots from workingHours.

const MEETING_DURATION_MS = 30 * 60 * 1000;

const generateSlots = (
  startTime: number,
  endTime: number,
  busyTimes: { start: number; end: number }[]
): HubSpotSlot[] => {
  const slots: HubSpotSlot[] = [];

  for (
    let time = startTime;
    time + MEETING_DURATION_MS <= endTime;
    time += MEETING_DURATION_MS
  ) {
    const slotEnd = time + MEETING_DURATION_MS;

    const isBusy = busyTimes.some(
      (busy) =>
        (time >= busy.start && time < busy.end) ||
        (slotEnd > busy.start && slotEnd <= busy.end)
    );

    if (!isBusy) {
      slots.push({
        startTime: time,
        endTime: slotEnd,
      });
    }
  }

  return slots;
};

const fetchSlotsForDate = async (
  slug: string,
  date: string
): Promise<HubSpotSlot[]> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startTime = new Date(date + 'T09:00:00').getTime();
    const endTime = new Date(date + 'T18:00:00').getTime();

    const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?startTime=${startTime}&endTime=${endTime}&timezone=${timezone}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!res.ok) {
      console.error('[HubSpot] Slot fetch failed', await res.text());
      return [];
    }

    const data = await res.json();

    const busyTimes = data.busyTimes || [];

    return generateSlots(startTime, endTime, busyTimes);
  } catch (error) {
    console.error('[HubSpot] Slot error', error);
    return [];
  }
};

// ───────────────── FETCH ALL AGENTS AVAILABLE DATES (FOR CALENDAR) ─────────────────

export const fetchAllAgentsAvailableDates = async (
  year: number,
  month: number
): Promise<Record<string, boolean>> => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startTime = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
  const endTime = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  const results = await Promise.all(
    AGENTS.map(async (agent) => {
      const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${agent.meetingSlug}?startTime=${startTime}&endTime=${endTime}&timezone=${timezone}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return [];

      const data = await res.json();
      return data.busyTimes || [];
    })
  );

  // Generate available dates (basic 9am–6pm logic)
  const availableDates: Record<string, boolean> = {};

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month - 1, day)
      .toISOString()
      .split('T')[0];

    availableDates[dateStr] = true; // basic assumption
  }

  return availableDates;
};

// ───────────────── 2️⃣ FIND FIRST AVAILABLE AGENT ─────────────────

export const fetchFirstAvailableAgentForDate = async (
  date: string
): Promise<AgentWithSlots | null> => {
  const results = await Promise.all(
    AGENTS.map(async (agent) => {
      const slots = await fetchSlotsForDate(agent.meetingSlug, date);
      return { agent, slots };
    })
  );

  return results.find((r) => r.slots.length > 0) || null;
};

// ───────────────── 3️⃣ CREATE CONTACT ─────────────────

const createHubSpotContact = async (
  lead: LeadInfo,
  ownerId: string
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
        hubspot_owner_id: ownerId,
      },
    };

    const res = await fetch(`${BASE_URL}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (res.status === 409) {
      const err = await res.json();
      const match = err?.message?.match(/Existing ID: (\d+)/);
      return match?.[1] || null;
    }

    if (!res.ok) {
      console.error('[HubSpot] Contact creation failed');
      return null;
    }

    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error('[HubSpot] Contact error', error);
    return null;
  }
};

// ───────────────── 4️⃣ BOOK MEETING ─────────────────

const bookHubSpotMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  slug: string
): Promise<boolean> => {
  try {
    const nameParts = lead.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '-';

    const body = {
      slug,
      startTime: slot.startTime,
      endTime: slot.endTime,
      firstName,
      lastName,
      email: lead.email,
      phone: lead.phone,
      locale: 'en',
    };

    const res = await fetch(
      `${BASE_URL}/scheduler/v3/meetings/meeting-links/book`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      console.error('[HubSpot] Booking failed', await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('[HubSpot] Booking error', error);
    return false;
  }
};

// ───────────────── 5️⃣ MAIN FUNCTION ─────────────────

export const submitLeadAndBookMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  agent: Agent
): Promise<{ success: boolean; error?: string }> => {
  const contactId = await createHubSpotContact(lead, agent.ownerId);

  const success = await bookHubSpotMeeting(
    lead,
    slot,
    agent.meetingSlug
  );

  if (!success) {
    return { success: false, error: 'Meeting booking failed' };
  }

  return { success: true };
};