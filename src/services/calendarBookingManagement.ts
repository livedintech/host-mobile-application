import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService, { BASE_URL } from "./apiService";
import { useAuthStore } from "@/store/useAuthStore";
import { getStoredLanguage } from "@/locales/i18n/i18n";

const parseDayRate = (value: unknown): number | undefined => {
  if (value == null || value === '') return undefined;
  const normalized = String(value).replace(/,/g, '');
  const rate = Number(normalized);
  return Number.isFinite(rate) && rate > 0 ? rate : undefined;
};

const parseDayRowRate = (row: any): number | undefined =>
  parseDayRate(row?.rate) ??
  parseDayRate(row?.price) ??
  parseDayRate(row?.daily_rate) ??
  parseDayRate(row?.amount);

const normalizeDateKey = (value: unknown): string | undefined => {
  if (value == null || value === '') return undefined;
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  if (raw.includes('/')) {
    const [month, day, year] = raw.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return raw;
};

type CalendarApiResult = {
  bookings: any[];
  defaultDailyPrice: number;
  cleaningFee: number;
  discount: number;
};

const emptyCalendarResult = (): CalendarApiResult => ({
  bookings: [],
  defaultDailyPrice: 0,
  cleaningFee: 0,
  discount: 0,
});

/** Keep last good payload per listing — parallel refetches sometimes return empty and overwrite 500+ day rows. */
const stickyCalendarByListing: Record<string, CalendarApiResult> = {};

type StickyPriceStore = {
  dailyPriceByDate: Record<string, number>;
  defaultDailyPrice: number;
};

/** Day rates survive separately — bookings can load without wiping prices. */
const stickyPricesByListing: Record<string, StickyPriceStore> = {};

const getDayDateKey = (row: any) =>
  normalizeDateKey(row?.calender_date) ??
  normalizeDateKey(row?.calendar_date) ??
  normalizeDateKey(row?.date);

const isFlatBookingRow = (row: any) =>
  !getDayDateKey(row) &&
  !row?.listing_id &&
  Boolean(row?.start_date || row?.arrival_date);

const getDayRows = (bookings: any[]) =>
  bookings.filter((row) => getDayDateKey(row));

const getFlatBookings = (bookings: any[]) =>
  bookings.filter((row) => isFlatBookingRow(row));

export const getCalendarStickyPrices = (cacheKey: string): StickyPriceStore =>
  stickyPricesByListing[cacheKey] ?? {
    dailyPriceByDate: {},
    defaultDailyPrice: 0,
  };

export const getCachedCalendarResult = (
  cacheKey: string,
): CalendarApiResult | undefined => stickyCalendarByListing[cacheKey];

const dayRowsFromStickyPrices = (cacheKey: string): any[] => {
  const { dailyPriceByDate } = getCalendarStickyPrices(cacheKey);
  return Object.entries(dailyPriceByDate).map(([calender_date, rate]) => ({
    calender_date,
    rate,
    availability: 1,
    bookings: [],
  }));
};

export const seedCalendarListingDefaultPrice = (
  cacheKey: string,
  price: number,
) => {
  if (!price || price <= 0) return;
  const prev = getCalendarStickyPrices(cacheKey);
  stickyPricesByListing[cacheKey] = {
    dailyPriceByDate: prev.dailyPriceByDate,
    defaultDailyPrice:
      prev.defaultDailyPrice > 0 ? prev.defaultDailyPrice : price,
  };
};

const absorbStickyPrices = (cacheKey: string, result: CalendarApiResult) => {
  const prev = getCalendarStickyPrices(cacheKey);
  const dailyPriceByDate = { ...prev.dailyPriceByDate };

  result.bookings.forEach((row) => {
    const date = getDayDateKey(row);
    const rate = parseDayRowRate(row);
    if (date && rate) {
      dailyPriceByDate[date] = rate;
    }
  });

  const sampleRate = Object.values(dailyPriceByDate).find((rate) => rate > 0);
  const defaultDailyPrice =
    result.defaultDailyPrice > 0
      ? result.defaultDailyPrice
      : prev.defaultDailyPrice > 0
        ? prev.defaultDailyPrice
        : sampleRate ?? 0;

  stickyPricesByListing[cacheKey] = { dailyPriceByDate, defaultDailyPrice };
};

const ensureDayRowsFromSticky = (
  cacheKey: string,
  result: CalendarApiResult,
): CalendarApiResult => {
  const existingDayRows = getDayRows(result.bookings);
  const flatBookings = getFlatBookings(result.bookings);
  const stickyDayRows = dayRowsFromStickyPrices(cacheKey);

  if (existingDayRows.length > 0) {
    return {
      ...result,
      bookings: [...existingDayRows, ...flatBookings],
    };
  }

  if (stickyDayRows.length === 0) {
    return result;
  }

  return {
    ...result,
    bookings: [...stickyDayRows, ...flatBookings],
  };
};

const applyStickyPrices = (
  cacheKey: string,
  result: CalendarApiResult,
): CalendarApiResult => {
  absorbStickyPrices(cacheKey, result);
  const sticky = getCalendarStickyPrices(cacheKey);
  const withDayRows = ensureDayRowsFromSticky(cacheKey, result);
  return {
    ...withDayRows,
    defaultDailyPrice:
      withDayRows.defaultDailyPrice || sticky.defaultDailyPrice,
  };
};

const mergeDayRowsByDate = (prevRows: any[], nextRows: any[]) => {
  const byDate = new Map<string, any>();

  [...prevRows, ...nextRows].forEach((row) => {
    const date = getDayDateKey(row);
    if (!date) return;

    const existing = byDate.get(date);
    if (!existing) {
      byDate.set(date, { ...row, calender_date: date });
      return;
    }

    const mergedRate =
      parseDayRowRate(row) ??
      parseDayRowRate(existing) ??
      row?.rate ??
      existing?.rate;

    const mergedBookings = [
      ...(Array.isArray(existing.bookings) ? existing.bookings : []),
      ...(Array.isArray(row.bookings) ? row.bookings : []),
    ];

    byDate.set(date, {
      ...existing,
      ...row,
      calender_date: date,
      rate: mergedRate,
      bookings: mergedBookings,
    });
  });

  return Array.from(byDate.values()).sort((a, b) =>
    String(getDayDateKey(a)).localeCompare(String(getDayDateKey(b))),
  );
};

const mergeCalendarResults = (
  prev: CalendarApiResult,
  next: CalendarApiResult,
): CalendarApiResult => {
  const prevDayRows = getDayRows(prev.bookings);
  const nextDayRows = getDayRows(next.bookings);
  const dayRows = mergeDayRowsByDate(prevDayRows, nextDayRows);

  const flatById = new Map<string, any>();
  [...getFlatBookings(prev.bookings), ...getFlatBookings(next.bookings)].forEach(
    (booking) => {
      const id = String(booking.booking_id ?? booking.id ?? '');
      if (id) flatById.set(id, booking);
    },
  );
  const flatBookings = Array.from(flatById.values());

  const bookings =
    dayRows.length > 0
      ? [...dayRows, ...flatBookings]
      : next.bookings.length >= prev.bookings.length
        ? next.bookings
        : prev.bookings;

  return {
    bookings,
    defaultDailyPrice: next.defaultDailyPrice || prev.defaultDailyPrice,
    cleaningFee: next.cleaningFee || prev.cleaningFee,
    discount: next.discount || prev.discount,
  };
};

const normalizeToArray = (value: unknown): any[] => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length > 0 && keys.every((k) => /^\d+$/.test(k))) {
      return keys
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => obj[k]);
    }
  }
  return [];
};

const parseJsonBody = (raw: unknown): any | null => {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      return null;
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') return raw;
  return null;
};

const dayRowsHaveBookings = (rows: any[]) =>
  rows.some((row) => Array.isArray(row?.bookings) && row.bookings.length > 0);

const calendarHasBookingData = (result: CalendarApiResult) => {
  const dayRows = getDayRows(result.bookings);
  if (dayRowsHaveBookings(dayRows)) return true;
  if (getFlatBookings(result.bookings).length > 0) return true;
  return result.bookings.some(
    (item) =>
      item?.listing_id &&
      Array.isArray(item?.bookings) &&
      item.bookings.length > 0,
  );
};

/** Match balanced `{`…`}` or `[`…`]` from `start`, respecting JSON strings. */
const extractBalancedJsonSlice = (
  text: string,
  start: number,
  open: '{' | '[',
  close: '}' | ']',
): string | null => {
  if (text[start] !== open) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
};

/** Parse each calendar day object individually — survives when the full data array fails on Hermes. */
const extractDayObjectsFromCalendarText = (text: string): any[] => {
  const rows: any[] = [];
  const seen = new Set<string>();
  const marker = '"calender_date"';
  let searchFrom = 0;

  while (searchFrom < text.length) {
    const dateIdx = text.indexOf(marker, searchFrom);
    if (dateIdx === -1) break;

    let objStart = dateIdx;
    while (objStart > 0 && text[objStart] !== '{') objStart--;
    if (text[objStart] !== '{') {
      searchFrom = dateIdx + marker.length;
      continue;
    }

    const objText = extractBalancedJsonSlice(text, objStart, '{', '}');
    if (!objText) {
      searchFrom = dateIdx + marker.length;
      continue;
    }

    try {
      const obj = JSON.parse(objText);
      const date = getDayDateKey(obj);
      if (date && !seen.has(date)) {
        seen.add(date);
        rows.push(obj);
      }
    } catch {
      // skip malformed object
    }

    searchFrom = objStart + objText.length;
  }

  return rows.sort((a, b) =>
    String(getDayDateKey(a)).localeCompare(String(getDayDateKey(b))),
  );
};

/** Pull a top-level JSON array for `key` without parsing the full ~50KB payload (Hermes-safe). */
const extractJsonArrayAfterKey = (text: string, key: string): any[] => {
  const marker = `"${key}":`;
  const idx = text.indexOf(marker);
  if (idx === -1) return [];

  const start = text.indexOf('[', idx + marker.length);
  if (start === -1) return [];

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        try {
          const parsed = JSON.parse(text.slice(start, i + 1));
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
    }
  }
  return [];
};

const extractJsonScalar = (text: string, key: string): unknown => {
  const re = new RegExp(`"${key}"\\s*:\\s*([^,}\\]]+)`);
  const match = text.match(re);
  if (!match) return undefined;
  const raw = match[1].trim();
  if (raw === 'null') return null;
  if (raw.startsWith('"')) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw.replace(/^"|"$/g, '');
    }
  }
  const num = Number(raw);
  return Number.isFinite(num) ? num : undefined;
};

/** Last-resort: scrape day rows with rates from raw calendar JSON text. */
const extractDayRowsFromCalendarText = (text: string): any[] => {
  const rows: any[] = [];
  const re =
    /"calender_date":"(\d{4}-\d{2}-\d{2})"[^}]*?"rate":(\d+(?:\.\d+)?)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    rows.push({
      calender_date: match[1],
      rate: Number(match[2]),
      availability: 1,
      bookings: [],
    });
  }
  return rows;
};

const parseCalendarResponseText = (text: string): any | null => {
  const trimmed = text.trim();
  if (!trimmed || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as any;
    const rows = Array.isArray(parsed?.data)
      ? parsed.data
      : normalizeToArray(parsed?.data);
    if (rows.length > 0) {
      return { ...parsed, data: rows };
    }
  } catch {
    // Hermes can fail JSON.parse on large nested calendar payloads — fall through.
  }

  const data = extractJsonArrayAfterKey(trimmed, 'data');
  if (data.length > 0) {
    let finalData = data;
    if (!dayRowsHaveBookings(data)) {
      const individuals = extractDayObjectsFromCalendarText(trimmed);
      if (dayRowsHaveBookings(individuals)) {
        finalData = individuals;
        if (__DEV__) {
          console.log(
            '[Calendar API] upgraded day rows with per-object parse, rows=',
            individuals.length,
            'withBookings=',
            individuals.filter((r) => r.bookings?.length).length,
          );
        }
      } else if (individuals.length > 0) {
        finalData = mergeDayRowsByDate(data, individuals);
      }
    }
    if (__DEV__) {
      console.log(
        '[Calendar API] extracted data array via bracket parse, rows=',
        finalData.length,
        'daysWithBookings=',
        finalData.filter((r) => r.bookings?.length).length,
      );
    }
    return {
      status: 'success',
      data: finalData,
      default_daily_price: extractJsonScalar(trimmed, 'default_daily_price'),
      cleaning_fee: extractJsonScalar(trimmed, 'cleaning_fee') ?? 0,
      discount: extractJsonScalar(trimmed, 'discount') ?? 0,
    };
  }

  const individuals = extractDayObjectsFromCalendarText(trimmed);
  if (individuals.length > 0) {
    if (__DEV__) {
      console.log(
        '[Calendar API] parsed day objects individually, rows=',
        individuals.length,
        'daysWithBookings=',
        individuals.filter((r) => r.bookings?.length).length,
      );
    }
    return {
      status: 'success',
      data: individuals,
      default_daily_price: extractJsonScalar(trimmed, 'default_daily_price'),
      cleaning_fee: extractJsonScalar(trimmed, 'cleaning_fee') ?? 0,
      discount: extractJsonScalar(trimmed, 'discount') ?? 0,
    };
  }

  const scraped = extractDayRowsFromCalendarText(trimmed);
  if (scraped.length > 0) {
    if (__DEV__) {
      console.log('[Calendar API] scraped day rows from text, rows=', scraped.length);
    }
    return {
      status: 'success',
      data: scraped,
      default_daily_price: null,
      cleaning_fee: 0,
      discount: 0,
    };
  }

  return null;
};

const extractBookingsArray = (payload: any): any[] => {
  if (typeof payload === 'string') {
    const parsed = parseCalendarResponseText(payload);
    if (parsed?.data) {
      return Array.isArray(parsed.data)
        ? parsed.data
        : normalizeToArray(parsed.data);
    }
    return [];
  }

  const body = parseJsonBody(payload);
  if (!body) return [];
  if (Array.isArray(body)) return body;

  const candidates = [
    body.data,
    body.data?.data,
    body.bookings,
    body.calendar,
    body.days,
    body.result,
    body.result?.data,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) return candidate;
    const arr = normalizeToArray(candidate);
    if (arr.length > 0) return arr;
  }
  return [];
};

const countCalendarRows = (bookings: any[]): number => {
  if (!bookings.length) return 0;
  const dayRows = getDayRows(bookings).length;
  return dayRows > 0 ? dayRows : bookings.length;
};

const finalizeCalendarResult = (
  cacheKey: string,
  result: CalendarApiResult,
): CalendarApiResult => {
  const prev = stickyCalendarByListing[cacheKey];
  const nextCount = countCalendarRows(result.bookings);
  const prevCount = prev ? countCalendarRows(prev.bookings) : 0;

  let merged = result;
  const nextDayCount = getDayRows(result.bookings).length;
  const prevDayCount = prev ? getDayRows(prev.bookings).length : 0;

  if (nextDayCount === 0 && prevDayCount > 0) {
    if (__DEV__) {
      console.warn(
        '[Calendar API] ignoring empty day rows; keeping cached rows=',
        prevDayCount,
        'for',
        cacheKey,
      );
    }
    merged = mergeCalendarResults(prev!, result);
  } else if (prev) {
    merged = mergeCalendarResults(prev, result);
  }

  const enriched = applyStickyPrices(cacheKey, merged);
  stickyCalendarByListing[cacheKey] = enriched;
  return enriched;
};

/** One in-flight request per listing — stops parallel calls racing and overwriting good data. */
const pendingCalendarFetches: Record<string, Promise<CalendarApiResult>> = {};
const recentServicePromises: Record<
  string,
  { at: number; promise: Promise<CalendarApiResult>; hadUsableData: boolean }
> = {};
const lastCompletedFetchAt: Record<string, number> = {};
const RECENT_FETCH_GUARD_MS = 30_000;

/** In-flight HTTP dedup only — do not cache completed empty responses (blocks price recovery). */
const inFlightCalendarHttp: Record<string, Promise<CalendarApiResult>> = {};

let cachedMultiCalendar: { result: CalendarApiResult; ts: number } | null = null;
let pendingMultiCalendarFetch: Promise<CalendarApiResult> | null = null;
const MULTI_CALENDAR_CACHE_MS = 60_000;

const hasUsableCalendarPayload = (
  cacheKey: string,
  result: CalendarApiResult,
) =>
  getDayRows(result.bookings).length > 0 ||
  result.defaultDailyPrice > 0 ||
  Object.keys(getCalendarStickyPrices(cacheKey).dailyPriceByDate).length > 0;

const clearCalendarHttpCaches = (cacheKey?: string) => {
  if (cacheKey) {
    delete inFlightCalendarHttp[cacheKey];
    delete pendingCalendarFetches[cacheKey];
    delete recentServicePromises[cacheKey];
    delete lastCompletedFetchAt[cacheKey];
    return;
  }
  Object.keys(inFlightCalendarHttp).forEach((key) => {
    delete inFlightCalendarHttp[key];
  });
  Object.keys(pendingCalendarFetches).forEach((key) => {
    delete pendingCalendarFetches[key];
  });
  Object.keys(recentServicePromises).forEach((key) => {
    delete recentServicePromises[key];
  });
  Object.keys(lastCompletedFetchAt).forEach((key) => {
    delete lastCompletedFetchAt[key];
  });
};

export const clearCalendarStickyCache = (listingId?: string) => {
  cachedMultiCalendar = null;
  pendingMultiCalendarFetch = null;
  if (listingId) {
    const key = String(listingId);
    delete stickyCalendarByListing[key];
    delete stickyPricesByListing[key];
    clearCalendarHttpCaches(key);
    delete stickyCalendarByListing['all'];
    delete stickyPricesByListing['all'];
    clearCalendarHttpCaches('all');
    return;
  }
  Object.keys(stickyCalendarByListing).forEach((k) => {
    delete stickyCalendarByListing[k];
  });
  Object.keys(stickyPricesByListing).forEach((k) => {
    delete stickyPricesByListing[k];
  });
  clearCalendarHttpCaches();
};

const mapCalendarResponse = (raw: any): CalendarApiResult => {
  const parsed =
    typeof raw === 'string' ? parseCalendarResponseText(raw) : parseJsonBody(raw) ?? raw;

  const bookings = extractBookingsArray(parsed ?? raw);
  const firstDayRate = bookings
    .map((d: any) => parseDayRowRate(d))
    .find((rate): rate is number => rate != null);

  const metaSource =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};

  if (__DEV__) {
    const dayCount = getDayRows(bookings).length;
    console.log(
      '[Calendar API] parsed rows=',
      bookings.length,
      'dayRows=',
      dayCount,
      'defaultDailyPrice=',
      parseDayRate(metaSource?.default_daily_price) ?? firstDayRate ?? 0,
    );
  }

  return {
    bookings,
    defaultDailyPrice:
      parseDayRate(metaSource?.default_daily_price) ??
      parseDayRate(metaSource?.defaultDailyPrice) ??
      parseDayRate(metaSource?.weekday_price) ??
      firstDayRate ??
      0,
    cleaningFee: metaSource?.cleaning_fee ?? 0,
    discount: metaSource?.discount ?? 0,
  };
};

/** Native fetch — large calendar JSON must be parsed via bracket/scrape fallback on Hermes. */
const fetchCalendarResponseText = async (
  listingId: string,
): Promise<string | null> => {
  const id = String(listingId);
  const path = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_DATA.replace(
    '{listing_id}',
    id,
  );
  const base = BASE_URL.replace(/\/$/, '');
  const url = `${base}/${path.replace(/^\//, '')}?t=${Date.now()}`;
  const token = useAuthStore.getState()?.token;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Accept-Language': getStoredLanguage(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await response.text();

  if (__DEV__) {
    console.log(
      '[Calendar API] fetch',
      path,
      'status=',
      response.status,
      'bytes=',
      text.length,
    );
  }

  if (!response.ok) return null;
  return text;
};

const fetchCalendarByListingIdOnce = async (
  listingId: string,
): Promise<CalendarApiResult> => {
  const id = String(listingId);

  if (inFlightCalendarHttp[id]) {
    if (__DEV__) {
      console.log('[Calendar API] HTTP dedup in-flight for listing', id);
    }
    return inFlightCalendarHttp[id];
  }

  const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_DATA.replace(
    '{listing_id}',
    id,
  );

  const promise = (async () => {
    const textBody = await fetchCalendarResponseText(id);
    if (textBody) {
      return mapCalendarResponse(textBody);
    }

    const { ok, data, status } = await apiService.get(baseUrl, {
      t: Date.now(),
    });
    if (!ok || data == null) {
      if (__DEV__) {
        console.warn(
          '[Calendar API] failed',
          baseUrl,
          'ok=',
          ok,
          'status=',
          status,
        );
      }
      return emptyCalendarResult();
    }

    return mapCalendarResponse(data);
  })();

  inFlightCalendarHttp[id] = promise;

  try {
    return await promise;
  } finally {
    delete inFlightCalendarHttp[id];
  }
};

const fetchCalendarByListingId = async (
  listingId: string,
): Promise<CalendarApiResult> => {
  const id = String(listingId);
  const result = await fetchCalendarByListingIdOnce(id);
  const rowCount = countCalendarRows(result.bookings);

  if (__DEV__) {
    const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_DATA.replace(
      '{listing_id}',
      id,
    );
    console.log(
      '[Calendar API]',
      baseUrl,
      'days=',
      rowCount,
      'defaultDailyPrice=',
      result.defaultDailyPrice,
    );
    if (rowCount === 0) {
      console.warn('[Calendar API] empty day rows for listing', id);
    }
  }

  return result;
};

const fetchMultiCalendar = async (): Promise<CalendarApiResult> => {
  if (
    cachedMultiCalendar &&
    Date.now() - cachedMultiCalendar.ts < MULTI_CALENDAR_CACHE_MS
  ) {
    return cachedMultiCalendar.result;
  }

  if (pendingMultiCalendarFetch) {
    return pendingMultiCalendarFetch;
  }

  pendingMultiCalendarFetch = (async () => {
    const baseUrl = SERVICE_CONFIG_URLS.APP.BOOKING_MULTI_CALENDAR;
    const { ok, data, status } = await apiService.get(baseUrl, {
      t: Date.now(),
    });

    if (!ok || !data) {
      if (__DEV__) {
        console.warn('[Calendar API] multicalendar failed', 'status=', status);
      }
      return emptyCalendarResult();
    }

    const result = mapCalendarResponse(data);
    cachedMultiCalendar = { result, ts: Date.now() };

    if (__DEV__) {
      console.log(
        '[Calendar API]',
        baseUrl,
        'groups=',
        result.bookings.length,
        'status=',
        status,
      );
    }

    return result;
  })().finally(() => {
    pendingMultiCalendarFetch = null;
  });

  return pendingMultiCalendarFetch;
};

const pickListingFromMultiCalendar = (
  groups: any[],
  listingId: string,
): { bookings: any[]; group?: any } => {
  const id = String(listingId);
  const group = groups.find(
    (item) =>
      String(item?.listing_id) === id ||
      String(item?.id) === id ||
      String(item?.apartment) === id,
  );
  if (!group) return { bookings: [] };

  const bookings = Array.isArray(group.bookings) ? group.bookings : [];
  return { bookings, group };
};

/**
 * Single listing: GET api/v2/calendar/{listing_id}
 * Falls back to bookingsmulticalendar for that property when day rows are empty.
 * All properties: GET api/v2/bookingsmulticalendar
 */
const fetchCalendarData = async (
  listingId?: string,
): Promise<CalendarApiResult> => {
  const isSingleListing = Boolean(listingId && listingId !== '');
  const cacheKey = listingId || 'all';

  if (!isSingleListing) {
    const multi = await fetchMultiCalendar();
    return finalizeCalendarResult(cacheKey, multi);
  }

  const calendarResult = await fetchCalendarByListingId(listingId!);
  const calendarDayRows = getDayRows(calendarResult.bookings);
  const hasDayRows = calendarDayRows.length > 0;
  const hasBookingData = calendarHasBookingData(calendarResult);

  if (hasDayRows && hasBookingData) {
    return finalizeCalendarResult(cacheKey, calendarResult);
  }

  const multiResult = await fetchMultiCalendar();
  const { bookings: fallbackBookings, group } = pickListingFromMultiCalendar(
    multiResult.bookings,
    listingId!,
  );

  if (fallbackBookings.length > 0) {
    if (__DEV__) {
      console.log(
        '[Calendar API] merging multicalendar bookings for listing',
        listingId,
        'bookings=',
        fallbackBookings.length,
        hasDayRows ? '(keeping day rates)' : '(no day rows)',
      );
    }

    const sticky = stickyCalendarByListing[cacheKey];
    const stickyDayRows = getDayRows(sticky?.bookings ?? []);
    const stickyPriceRows = dayRowsFromStickyPrices(cacheKey);
    const dayRows =
      calendarDayRows.length > 0
        ? calendarDayRows
        : stickyDayRows.length > 0
          ? stickyDayRows
          : stickyPriceRows;

    const merged: CalendarApiResult = {
      ...calendarResult,
      bookings:
        dayRows.length > 0
          ? [...dayRows, ...fallbackBookings]
          : fallbackBookings,
      defaultDailyPrice:
        calendarResult.defaultDailyPrice ||
        sticky?.defaultDailyPrice ||
        multiResult.defaultDailyPrice ||
        0,
      cleaningFee: calendarResult.cleaningFee || multiResult.cleaningFee,
      discount: calendarResult.discount || multiResult.discount,
    };
    return finalizeCalendarResult(cacheKey, merged);
  }

  if (hasDayRows) {
    return finalizeCalendarResult(cacheKey, calendarResult);
  }

  if (group) {
    return finalizeCalendarResult(cacheKey, {
      ...calendarResult,
      defaultDailyPrice:
        calendarResult.defaultDailyPrice || multiResult.defaultDailyPrice || 0,
    });
  }

  return finalizeCalendarResult(cacheKey, calendarResult);
};

export const getCalendarBookingManagementListingsApi = async (
  listingId?: string,
): Promise<CalendarApiResult> => {
  const normalizedId =
    listingId != null && String(listingId) !== '' ? String(listingId) : '';
  const cacheKey = normalizedId || 'all';
  const now = Date.now();

  if (pendingCalendarFetches[cacheKey]) {
    if (__DEV__) {
      console.log('[Calendar API] deduped in-flight request for', cacheKey);
    }
    return pendingCalendarFetches[cacheKey];
  }

  const recent = recentServicePromises[cacheKey];
  if (
    recent &&
    now - recent.at < RECENT_FETCH_GUARD_MS &&
    recent.hadUsableData
  ) {
    if (__DEV__) {
      console.log('[Calendar API] coalesced duplicate service call for', cacheKey);
    }
    return recent.promise;
  }

  const promise = fetchCalendarData(normalizedId || undefined)
    .then((result) => {
      const hadUsableData = hasUsableCalendarPayload(cacheKey, result);
      recentServicePromises[cacheKey] = { at: Date.now(), promise, hadUsableData };
      return result;
    })
    .finally(() => {
      delete pendingCalendarFetches[cacheKey];
      lastCompletedFetchAt[cacheKey] = Date.now();
    });

  pendingCalendarFetches[cacheKey] = promise;
  return promise;
};

/**
 * 2. FETCH PROPERTY LIST (For the Dropdown)
 */
export const getUserListingsApi = async (userId: string | number) => {
  const url = SERVICE_CONFIG_URLS.APP.GET_USER_LISTINGS_BY_USER_ID.replace('{user}', String(userId));
  const { ok, data } = await apiService.get(url);

  if (ok && data?.data) {
    const listings = data.data.map((item: any) => {
      const prices = item.prices || {};
      const listingJson =
        typeof item.listing_json === 'string'
          ? (() => {
              try {
                return JSON.parse(item.listing_json);
              } catch {
                return {};
              }
            })()
          : item.listing_json || {};
      const listingRates = listingJson?.rooms?.rates;
      const channexRate = Array.isArray(listingRates)
        ? listingRates
            .map((rate: any) =>
              parseDayRate(rate?.price ?? rate?.amount ?? rate?.default_price),
            )
            .find((rate): rate is number => rate != null)
        : undefined;

      const weekdayPrice =
        parseDayRate(prices.weekday_price) ??
        parseDayRate(prices.weekday) ??
        parseDayRate(item.weekday_price) ??
        parseDayRate(listingJson?.pricing?.weekday_price) ??
        parseDayRate(listingJson?.pricing?.weekday) ??
        parseDayRate(listingJson?.weekday_price) ??
        parseDayRate(item.default_daily_price) ??
        channexRate ??
        0;

      return {
        label: item.title || item.name || 'Unknown Listing',
        value: String(item.listing_id),
        weekdayPrice,
      };
    });

    return [{ label: 'All Properties', value: '' }, ...listings];
  }
  return [{ label: "All Properties", value: "" }];
};

/**
 * 3. FETCH BOOKINGS BY SPECIFIC LISTING ID
 */
export const getCalendarBookingsByListingIdApi = async (listingIds: string | string[]) => {
  const ids = Array.isArray(listingIds) ? listingIds : [listingIds];
  try {
    const fetchPromises = ids.map(async (id) => {
      const url = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS_LISTING_ID.replace('{listing_id}', id);
      const { ok, data } = await apiService.get(url);
      return ok ? (data?.data || []) : [];
    });

    const results = await Promise.all(fetchPromises);
    return results.flat();
  } catch (error) {
    console.error('Error fetching multiple listings:', error);
    return [];
  }
};

/**
 * 4. FETCH RESERVATIONS (For the Reservation Tab)
 */

export const getReservationsApi = async (listingIds?: string, status?: string) => {
  const baseUrl = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS;
  const params = new URLSearchParams();

  // Just take the single status passed from the container
  if (status && status !== 'all') {
    params.append('status', status);
  }

  if (listingIds) {
    params.append('apartment_id', listingIds);
  }

  const queryString = params.toString();
  const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

  const { ok, data } = await apiService.get(url);
  return ok ? data?.data || [] : [];
};
/**
 * HELPER: Format Date
 */
const formatDate = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('/')) return dateStr;
  const [month, day, year] = dateStr.split('/');
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * 5. CREATE DIRECT BOOKING
 */
export const createDirectBookingApi = async (payload: any) => {
  const formattedPayload = {
    ...payload,
    start_date: formatDate(payload.start_date),
    end_date: formatDate(payload.end_date),
  };

  const url = SERVICE_CONFIG_URLS.APP.GET_CALENDAR_BOOKINGS;
  const response = await apiService.post(url, formattedPayload);
  console.log("responsebookij",response)

  if (response.ok) {
    return response.data?.data || response.data;
  }

  const error: any = new Error(response.data?.message || 'Request failed');
  console.log("errormmm",error)
  error.data = response.data;
  error.status = response.status;

  throw error;
};


/**
 * 6. UPDATE CALENDAR PRICING
 */
export const updateCalendarPricingApi = async (payload: {
  listing_id: string | number;
  price: number | string;
  start_date: string;
  end_date: string;
}) => {
  const formattedPayload = {
    ...payload,
    start_date: formatDate(payload.start_date),
    end_date: formatDate(payload.end_date),
  };

  const url = SERVICE_CONFIG_URLS.APP.SET_CALENDAR_PRICING;
  const { ok, data, status } = await apiService.post(url, formattedPayload);

  if (ok) return data;

  // 🔥 THROW instead of returning null
  const error: any = new Error(data?.message || 'Request failed');
  error.data = data;
  error.status = status;

  throw error;
};

/**
 * 7. FETCH SPECIFIC BOOKING DETAILS
 */

export const getBookingDetailsApi = async (bookingId: string | number) => {
  const url = SERVICE_CONFIG_URLS.APP.GET_BOOKINGS_DETAILS.replace('{booking_id}', String(bookingId));

  const { ok, data, response } = await apiService.get(url);

  if (ok) {
    return data; 
  }

  throw response;
};


/**
 * 8. SUBMIT BOOKING REQUEST (Accept / Decline)
 */
// export const submitBookingRequestApi = async (payload: {
//   thread_id: string | number;
//   action_type: 'accept_request' | 'decline_request';
//   reason?: string;
// }) => {
//   const url = SERVICE_CONFIG_URLS.APP.BOOKING_REQUEST_SUBMIT;

//   const { ok, data, response } = await apiService.post(url, payload);

//   if (ok) {
//     return data?.data || data;
//   }

//   // throw error so caller can handle (like toast / UI)
//   throw response || data || response;
// };

export const submitBookingRequestApi = async (payload: {
  thread_id: string | number;
  accept: boolean;
  reason: string | null;
  decline_message_to_guest: string | null;
  decline_message_to_airbnb: string | null;
}) => {
  const url = SERVICE_CONFIG_URLS.APP.BOOKING_REQUEST_SUBMIT;

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};

//GET LISTING
export const getListing = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_LISTING_TASK_MANAGEMENT,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

/**
 * 9. CHANGE RESERVATION
 */
export const changeReservationApi = async (payload: {
  booking_id: number | string;
  listing_id: number | string;
  start_date: string;
  end_date: string;
  amount: number | string;
}) => {
  const formattedPayload = {
    ...payload,
    start_date: formatDate(payload.start_date),
    end_date: formatDate(payload.end_date),
  };

  // const url = 'api/v2/bookings/reservation/change';
  const url = SERVICE_CONFIG_URLS.APP.CHANGE_RESERVATION

  const { ok, data, response } = await apiService.post(url, formattedPayload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};


/**
 * 10. CANCEL OTA BOOKING
 */
export const cancelOtaBookingApi = async (
  bookingId: string | number,
  payload: {
    reason: string;
    sub_reason: string;
    message_to_guest: string;
    message_to_airbnb: string;
  }
) => {
  const url = SERVICE_CONFIG_URLS.APP.CANCEL_OTA_BOOKING.replace(
    '{id}',
    String(bookingId)
  );

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};

/**
 * CANCEL DIRECT BOOKING (HOST)
 * Use this for platform === 'host' | 'host_booking' | 'direct'
 */
export const cancelDirectBookingApi = async (
  bookingId: string | number,
  payload: { reason: string }
) => {
  const url = SERVICE_CONFIG_URLS.APP.CANCEL_DIRECT_BOOKING.replace(
    '{id}',
    String(bookingId)
  );

  const { ok, data, response } = await apiService.post(url, payload);

  if (ok) {
    return data?.data || data;
  }

  throw response || data;
};
