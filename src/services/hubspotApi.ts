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

/**
 * Fetches available meeting slots for a specific date from HubSpot.
 * Handles 45-minute durations and fixes the "n-1" pagination bug.
 */
export const fetchSlotsForDate = async (slug: string, date: string): Promise<HubSpotSlot[]> => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const encodedTz = encodeURIComponent(timezone);
    
    // Split date (YYYY-MM-DD) to create local time bounds
    const [year, month, day] = date.split('-').map(Number);

    // Define the window for the specific day
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();

    const allSlots: HubSpotSlot[] = [];
    let cursor = startOfDay;
    let hasMore = true;
    let lastCursor = -1;

    while (hasMore && cursor < endOfDay && cursor !== lastCursor) {
      lastCursor = cursor;

      const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${slug}?startTime=${cursor}&endTime=${endOfDay}&start=${cursor}&end=${endOfDay}&timezone=${encodedTz}`;

      const res = await fetch(url, { 
        method: 'GET', 
        headers: getHeaders() 
      });

      if (!res.ok) {
        console.error(`[HubSpot] API error: ${res.status}`);
        break;
      }

      const data = await res.json();
      const durationMap = data.linkAvailability?.linkAvailabilityByDuration || {};
      
      /**
       * 45 Minutes = 2700000 ms.
       * We look for the 45min key you enabled in your HubSpot settings.
       * Fallback to the first available duration if 45m isn't found.
       */
      const targetDurationKey = durationMap['2700000'] ? '2700000' : Object.keys(durationMap)[0];
      const availabilityData = targetDurationKey ? durationMap[targetDurationKey]?.availabilities || [] : [];

      availabilityData.forEach((slot: any) => {
        // Use 'en-CA' for YYYY-MM-DD format to match the input 'date' string
        const slotDate = new Date(slot.startMillisUtc).toLocaleDateString('en-CA'); 
        
        if (slotDate === date) {
          // Guard against duplicates that can happen when cursor = previousEnd
          const isDuplicate = allSlots.some(s => s.startTime === slot.startMillisUtc);
          if (!isDuplicate) {
            allSlots.push({
              startTime: slot.startMillisUtc,
              endTime: slot.endMillisUtc,
            });
          }
        }
      });

      hasMore = data.linkAvailability?.hasMore ?? false;

      if (hasMore && availabilityData.length > 0) {
        /**
         * FIX: We set the cursor to the EXACT end of the last slot.
         * Using + 1 (the old way) was skipping slots that started 
         * exactly when the previous one ended.
         */
        cursor = availabilityData[availabilityData.length - 1].endMillisUtc;
      } else {
        break;
      }
    }

    // Sort slots by time before returning to the UI
    return allSlots.sort((a, b) => a.startTime - b.startTime);
  } catch (error) {
    console.error('[HubSpot] Slot fetch error', error);
    return [];
  }
};

// ───────────────── FETCH MONTH DATES ─────────────────

export const fetchAllAgentsAvailableDates = async (
  year: number,
  month: number
): Promise<Record<string, boolean>> => {
  const availableDates: Record<string, boolean> = {};
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const encodedTz = encodeURIComponent(timezone);

  const startTime = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
  const endTime = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  await Promise.all(
    AGENTS.map(async (agent) => {
      try {
        const url = `${BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${agent.meetingSlug}?startTime=${startTime}&endTime=${endTime}&timezone=${encodedTz}`;

        const res = await fetch(url, { method: 'GET', headers: getHeaders() });
        if (!res.ok) return;

        const data = await res.json();
        
        // ─── FIX STARTS HERE ───
        const durationMap = data.linkAvailability?.linkAvailabilityByDuration || {};
        
        // Look for 45 mins (2700000). If not found, use 30 mins (1800000) or whatever is first.
        const targetKey = durationMap['2700000'] 
          ? '2700000' 
          : durationMap['1800000'] 
            ? '1800000' 
            : Object.keys(durationMap)[0];

        const availabilities = targetKey ? durationMap[targetKey]?.availabilities || [] : [];
        // ─── FIX ENDS HERE ───

        availabilities.forEach((slot: any) => {
          const d = new Date(slot.startMillisUtc);
          const slotYear = d.getUTCFullYear();
          const slotMonth = d.getUTCMonth() + 1;
          
          // Use 'en-CA' for stable YYYY-MM-DD formatting
          const slotDate = new Date(slot.startMillisUtc).toLocaleDateString('en-CA');

          if (slotMonth === month && slotYear === year) {
            availableDates[slotDate] = true;
          }
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