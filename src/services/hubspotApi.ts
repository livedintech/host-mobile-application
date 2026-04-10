// ⚠️ TEMP ONLY — MOVE TO BACKEND LATER
import { HUBSPOT_ACCESS_TOKEN } from '@env';

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

// ───────────────── 1️⃣ GENERATE SLOTS ─────────────────
const generateSlots = (
  startTime: number, // local ms
  endTime: number,   // local ms
  busyTimes: { start: number; end: number }[], // UTC from API
  meetingDuration: number
): HubSpotSlot[] => {
  const slots: HubSpotSlot[] = [];
  let cursor = startTime;

  while (cursor + meetingDuration <= endTime) {
    const slotEnd = cursor + meetingDuration;

    // The API sends busyTimes in UTC, ensure comparison is accurate
    const isBusy = busyTimes.some(
      (busy) =>
        (cursor >= busy.start && cursor < busy.end) || // Slot starts during busy time
        (slotEnd > busy.start && slotEnd <= busy.end) || // Slot ends during busy time
        (cursor <= busy.start && slotEnd >= busy.end)    // Slot covers busy time
    );

    if (!isBusy) {
      slots.push({ startTime: cursor, endTime: slotEnd });
    }

    cursor += meetingDuration; // Move to next potential slot
  }

  return slots;
};

// ───────────────── 2️⃣ FETCH SLOTS FOR DATE ─────────────────

export const fetchSlotsForDate = async (slug: string, date: string): Promise<HubSpotSlot[]> => {
  try {
    // 1. Get and Encode Timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const encodedTz = encodeURIComponent(timezone);

    const [year, month, day] = date.split('-').map(Number);
    
    const startOfDay = Date.UTC(year, month - 1, day, 0, 0, 0);
    const endOfDay = Date.UTC(year, month - 1, day, 23, 59, 59, 999);

    const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?startTime=${startOfDay}&endTime=${endOfDay}&start=${startOfDay}&end=${endOfDay}&timezone=${encodedTz}`;

    const res = await fetch(url, { method: 'GET', headers: getHeaders() });
    console.log('OH NO....', res)
    if (!res.ok) return [];

    const data = await res.json();
    
    const availabilityData = data.linkAvailability?.linkAvailabilityByDuration?.['1800000']?.availabilities || [];
    
    const filteredSlots = availabilityData.filter((slot: any) => {
      const slotDate = new Date(slot.startMillisUtc).toISOString().split('T')[0];
      return slotDate === date; 
    });

    return filteredSlots.map((slot: any) => ({
      startTime: slot.startMillisUtc,
      endTime: slot.endMillisUtc
    }));
  } catch (error) {
    console.error('[HubSpot] Slot fetch error', error);
    return [];
  }
};

// ───────────────── 3️⃣ FETCH ALL AGENTS AVAILABLE DATES ─────────────────

// export const fetchAllAgentsAvailableDates = async (
//   year: number,
//   month: number
// ): Promise<Record<string, boolean>> => {
//   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//   const startTime = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
//   const endTime = new Date(year, month, 0, 23, 59, 59, 999).getTime();

//   const results = await Promise.all(
//     AGENTS.map(async (agent) => {
//       const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${agent.meetingSlug}?startTime=${startTime}&endTime=${endTime}&timezone=${timezone}`;

//       const res = await fetch(url, { method: 'GET', headers: getHeaders() });
//       if (!res.ok) return [];

//       const data = await res.json();
//       return data.busyTimes || [];
//     })
//   );

//   const availableDates: Record<string, boolean> = {};
//   const daysInMonth = new Date(year, month, 0).getDate();

//   for (let day = 1; day <= daysInMonth; day++) {
//     const dateStr = new Date(year, month - 1, day)
//       .toISOString()
//       .split('T')[0];
//     availableDates[dateStr] = true;
//   }

//   return availableDates;
// };
// export const fetchAllAgentsAvailableDates = async (
//   year: number,
//   month: number
// ): Promise<Record<string, boolean>> => {
//   const availableDates: Record<string, boolean> = {};
//   const daysInMonth = new Date(year, month, 0).getDate();
//   const today = new Date().toISOString().split('T')[0];

//   // Har din ke liye parallel check karo
//   const dateChecks = await Promise.all(
//     Array.from({ length: daysInMonth }, async (_, i) => {
//       const day = i + 1;
//       const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

//       // Past dates skip karo
//       if (dateStr < today) return { dateStr, available: false };

//       // Saudi weekend skip karo (Fri=5, Sat=6)
//       const dayOfWeek = new Date(year, month - 1, day).getDay();
//       if (dayOfWeek === 5 || dayOfWeek === 6) return { dateStr, available: false };

//       // Kisi bhi agent ke paas slots hain?
//       const agentResults = await Promise.all(
//         AGENTS.map(agent => fetchSlotsForDate(agent.meetingSlug, dateStr))
//       );

//       const hasSlots = agentResults.some(slots => slots.length > 0);
//       return { dateStr, available: hasSlots };
//     })
//   );

//   dateChecks.forEach(({ dateStr, available }) => {
//     availableDates[dateStr] = available;
//   });

//   return availableDates;
// };

export const fetchAllAgentsAvailableDates = async (
  year: number,
  month: number
): Promise<Record<string, boolean>> => {
  const availableDates: Record<string, boolean> = {};
  const timezone = encodeURIComponent(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );

  const startTime = new Date(year, month - 1, 1, 0, 0, 0).getTime();
  const endTime = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  await Promise.all(
    AGENTS.map(async (agent) => {
      try {
        const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${agent.meetingSlug}?startTime=${startTime}&endTime=${endTime}&timezone=${timezone}`;

        const res = await fetch(url, { method: 'GET', headers: getHeaders() });
        if (!res.ok) return;

        const data = await res.json();

        const availabilities =
          data.linkAvailability?.linkAvailabilityByDuration?.['1800000']
            ?.availabilities || [];

        // HubSpot ne jo dates di hain sirf wahi true karo
        availabilities.forEach((slot: any) => {
          const slotDate = new Date(slot.startMillisUtc)
            .toISOString()
            .split('T')[0];
          availableDates[slotDate] = true;
        });
      } catch (e) {
        console.error('[HubSpot] Month fetch error', e);
      }
    })
  );

  return availableDates;
};

// ───────────────── 4️⃣ FETCH FIRST AVAILABLE AGENT ─────────────────

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

// ───────────────── 5️⃣ CREATE HUBSPOT CONTACT ─────────────────

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

// ───────────────── 6️⃣ BOOK MEETING ─────────────────

const bookHubSpotMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  slug: string
): Promise<boolean> => {
  try {
    const nameParts = lead.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '-';
    const duration = slot.endTime - slot.startTime;
    
    const body = {
      slug,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration,
      firstName,
      lastName,
      email: lead.email,
      phone: lead.phone,
      locale: 'en',
    };
    const res = await fetch(`${BASE_URL}/scheduler/v3/meetings/meeting-links/book`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

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

// ───────────────── 7️⃣ MAIN FUNCTION ─────────────────

export const submitLeadAndBookMeeting = async (
  lead: LeadInfo,
  slot: HubSpotSlot,
  agent: Agent
): Promise<{ success: boolean; error?: string }> => {
  const contactId = await createHubSpotContact(lead, agent.ownerId);
  if (!contactId) return { success: false, error: 'Failed to create contact' };

  // Stop calendar invite for the time being.
  // const success = await bookHubSpotMeeting(
  //   lead,
  //   slot,
  //   agent.meetingSlug
  // );

  // if (!success) {
  //   return { success: false, error: 'Meeting booking failed' };
  // }

  return { success: true };
};