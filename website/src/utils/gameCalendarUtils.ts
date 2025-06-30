/**
 * Game Calendar Utilities
 *
 * Consolidated calendar system for the TTRPG website that works with
 * content collections instead of hardcoded data. Combines functionality
 * from calendarUtils.ts and calendarData.ts.
 */

import type { CollectionEntry } from "astro:content";
import { CAMPAIGN_DATE } from "../consts";

// === Type Definitions ===

export interface HarptosMonth {
  id: number;
  name: string;
  commonName: string;
  days: number;
  season: "winter" | "spring" | "summer" | "autumn";
}

export interface HarptosHoliday {
  id: string;
  name: string;
  description: string;
  month?: number;
  day?: number;
  specialDay?: string;
  isRecurring?: boolean;
  leapYearOnly?: boolean;
  type?: "holiday" | "seasonal" | "astronomical" | "religious";
  observance?: "major" | "minor" | "local";
  duration?: number;
  traditions?: string[];
  regions?: string[];
  mechanicalEffects?: string[];
  associatedDeities?: string[];
  rituals?: string[];
  culturalSignificance?: string;
  aliases?: string[];
  origins?: string;
  tags?: string[];
}

export interface HarptosDate {
  year: number;
  month: number;
  day: number;
  season: "winter" | "spring" | "summer" | "autumn";
  isHoliday?: boolean;
  holidayName?: string;
  tenday: number;
  dayOfTenday: number;
  isSpecialDay?: boolean;
  specialDayType?:
    | "midwinter"
    | "greengrass"
    | "midsummer"
    | "shieldmeet"
    | "highharvestide"
    | "feast-of-the-moon";
}

export interface HarptosTime {
  hour: number;
  minute: number;
  formalName: string;
}

export interface MoonPhase {
  phase: string;
  emoji: string;
  description: string;
}

export interface WeatherData {
  condition: string;
  temperature: string;
  description: string;
  emoji: string;
}

export interface SpecialEvent {
  name: string;
  type: "holiday" | "astronomical" | "seasonal" | "custom";
  description: string;
  emoji: string;
}

// Collection type helpers
export type MonthEntry = CollectionEntry<"months">;
export type HolidayEntry = CollectionEntry<"holidays">;
export type SeasonEntry = CollectionEntry<"seasons">;
export type CelestialEntry = CollectionEntry<"celestial">;
export type EventEntry = CollectionEntry<"events">;

// === Data Transformation Functions ===

/**
 * Transform month collection entries into HarptosMonth format
 */
export function transformMonthData(months: MonthEntry[]): HarptosMonth[] {
  return months
    .sort((a, b) => a.data.month_number - b.data.month_number)
    .map((month) => ({
      id: month.data.month_number,
      name: month.data.name,
      commonName: month.data.alias,
      days: 30, // Standard Harptos month length
      season: month.data.season,
    }));
}

/**
 * Transform holiday collection entries into HarptosHoliday format
 */
export function transformHolidayData(
  holidays: HolidayEntry[]
): HarptosHoliday[] {
  return holidays.map((holiday) => {
    const baseHoliday: HarptosHoliday = {
      id: holiday.id,
      name: holiday.data.name,
      description: holiday.data.description,
      isRecurring: holiday.data.recurring,
      type: holiday.data.type,
      observance: holiday.data.observance,
      duration: holiday.data.duration,
      traditions: holiday.data.traditions,
      regions: holiday.data.regions,
      mechanicalEffects: holiday.data.mechanicalEffects,
      associatedDeities: holiday.data.associatedDeities,
      rituals: holiday.data.rituals,
      culturalSignificance: holiday.data.culturalSignificance,
      aliases: holiday.data.aliases,
      origins: holiday.data.origins,
      tags: holiday.data.tags,
    };

    // Handle different date formats
    if ("specialDay" in holiday.data.date) {
      baseHoliday.specialDay = holiday.data.date.specialDay;
      baseHoliday.leapYearOnly = holiday.data.date.specialDay === "shieldmeet";
    } else if ("month" in holiday.data.date && "day" in holiday.data.date) {
      baseHoliday.month = holiday.data.date.month;
      baseHoliday.day = holiday.data.date.day;
    }

    return baseHoliday;
  });
}

// === Calendar Logic Functions ===

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return year % 4 === 0;
}

/**
 * Create a HarptosDate object with calculated properties
 */
export function createHarptosDate(
  year: number,
  month: number,
  day: number,
  monthsData: MonthEntry[],
  holidaysData: HolidayEntry[]
): HarptosDate {
  const monthData = monthsData.find((m) => m.data.month_number === month);
  const season = monthData?.data.season || "spring";

  // Check for holidays
  const holidays = transformHolidayData(holidaysData);
  const holiday = holidays.find((h) => h.month === month && h.day === day);
  const isHoliday = !!holiday;
  const holidayName = holiday ? holiday.name : undefined;

  // Calculate tenday information
  const tenday = Math.floor((day - 1) / 10) + 1;
  const dayOfTenday = ((day - 1) % 10) + 1;

  return {
    year,
    month,
    day,
    season,
    isHoliday,
    holidayName,
    tenday,
    dayOfTenday,
  };
}

/**
 * Create a special day (holiday between months)
 */
export function createSpecialDay(
  year: number,
  specialDayType:
    | "midwinter"
    | "greengrass"
    | "midsummer"
    | "shieldmeet"
    | "highharvestide"
    | "feast-of-the-moon",
  holidaysData: HolidayEntry[]
): HarptosDate {
  const holidays = transformHolidayData(holidaysData);
  const holiday = holidays.find((h) => h.specialDay === specialDayType);

  if (!holiday) {
    throw new Error(`Holiday not found for special day: ${specialDayType}`);
  }

  // Determine season and preceding month for special days
  const specialDayInfo = {
    midwinter: { season: "winter" as const, precedingMonth: 1 },
    greengrass: { season: "spring" as const, precedingMonth: 4 },
    midsummer: { season: "summer" as const, precedingMonth: 7 },
    shieldmeet: { season: "summer" as const, precedingMonth: 7 },
    highharvestide: { season: "autumn" as const, precedingMonth: 9 },
    "feast-of-the-moon": { season: "winter" as const, precedingMonth: 11 },
  };

  const info = specialDayInfo[specialDayType];

  return {
    year,
    month: info.precedingMonth,
    day: 31, // Special days are conceptually "day 31"
    season: info.season,
    isHoliday: true,
    holidayName: holiday.name,
    tenday: 4, // Conceptual tenday for special days
    dayOfTenday: 1, // Conceptual day of tenday
    isSpecialDay: true,
    specialDayType,
  };
}

/**
 * Get special days that occur after a specific month
 */
export function getSpecialDaysForMonth(
  year: number,
  month: number,
  holidaysData: HolidayEntry[]
): HarptosDate[] {
  const specialDays: HarptosDate[] = [];

  // Special days occur AFTER specific months
  const specialDaysByMonth: Record<number, string[]> = {
    1: ["midwinter"],
    4: ["greengrass"],
    7: isLeapYear(year) ? ["midsummer", "shieldmeet"] : ["midsummer"],
    9: ["highharvestide"],
    11: ["feast-of-the-moon"],
  };

  const daysForThisMonth = specialDaysByMonth[month];
  if (daysForThisMonth) {
    for (const dayType of daysForThisMonth) {
      specialDays.push(createSpecialDay(year, dayType as any, holidaysData));
    }
  }

  return specialDays;
}

/**
 * Get current campaign date (configurable)
 */
export function getCurrentCampaignDate(): HarptosDate {
  // Determine season based on month
  const getSeasonForMonth = (
    month: number
  ): "winter" | "spring" | "summer" | "autumn" => {
    if (month >= 1 && month <= 3) return "winter";
    if (month >= 4 && month <= 6) return "spring";
    if (month >= 7 && month <= 9) return "summer";
    return "autumn";
  };

  // Calculate tenday information
  const tenday = Math.floor((CAMPAIGN_DATE.day - 1) / 10) + 1;
  const dayOfTenday = ((CAMPAIGN_DATE.day - 1) % 10) + 1;

  return {
    year: CAMPAIGN_DATE.year,
    month: CAMPAIGN_DATE.month,
    day: CAMPAIGN_DATE.day,
    season: getSeasonForMonth(CAMPAIGN_DATE.month),
    tenday,
    dayOfTenday,
  };
}

/**
 * Get current campaign time (configurable)
 */
export function getCurrentCampaignTime(): HarptosTime {
  return createHarptosTime(CAMPAIGN_DATE.hour, CAMPAIGN_DATE.minute);
}

/**
 * Create a HarptosTime object with formal name
 */
export function createHarptosTime(
  hour: number,
  minute: number = 0
): HarptosTime {
  let formalName = "";
  if (hour === 12) formalName = "Highsun";
  else if (hour < 6) formalName = "Dawn";
  else if (hour < 12) formalName = "Morning";
  else if (hour < 18) formalName = "Afternoon";
  else if (hour < 21) formalName = "Sunset";
  else formalName = "Night";

  return { hour, minute, formalName };
}

// === Formatting Functions ===

/**
 * Format a HarptosDate as a string
 */
export function formatHarptosDate(
  date: HarptosDate,
  monthsData: MonthEntry[],
  style: "short" | "long" | "formal" | "conversational" = "long"
): string {
  const monthData = monthsData.find((m) => m.data.month_number === date.month);
  const monthName = monthData?.data.name || "Unknown";
  const commonName = monthData?.data.alias || monthName;

  if (style === "short") return `${date.day}/${date.month}/${date.year}`;
  if (style === "formal") return `${date.day} ${monthName}, ${date.year} DR`;

  return `${date.day} ${commonName}, ${date.year}`;
}

/**
 * Format a HarptosTime as a string
 */
export function formatHarptosTime(
  time: HarptosTime,
  style: "short" | "long" | "formal" = "long"
): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (style === "short") return `${pad(time.hour)}:${pad(time.minute)}`;
  if (style === "formal")
    return `${pad(time.hour)}:${pad(time.minute)} (${time.formalName})`;

  return `${pad(time.hour)}:${pad(time.minute)} ${time.formalName}`;
}

// === Astronomical Functions ===

/**
 * Calculate moon phase for a given date
 */
export function getMoonPhase(
  date: HarptosDate,
  celestialData?: CelestialEntry[]
): MoonPhase {
  // Find primary moon from celestial data
  const primaryMoon = celestialData?.find(
    (c) =>
      c.data.type === "moon" && c.data.name.toLowerCase().includes("selune")
  );

  // Use cycle data if available, otherwise use default 29-day cycle
  const cycleLength = primaryMoon?.data.cycles?.phases || 29;

  // Simple 8-phase moon cycle
  const phases = [
    { phase: "New Moon", emoji: "🌑", description: "New Moon" },
    { phase: "Waxing Crescent", emoji: "🌒", description: "Waxing Crescent" },
    { phase: "First Quarter", emoji: "🌓", description: "First Quarter" },
    { phase: "Waxing Gibbous", emoji: "🌔", description: "Waxing Gibbous" },
    { phase: "Full Moon", emoji: "🌕", description: "Full Moon" },
    { phase: "Waning Gibbous", emoji: "🌖", description: "Waning Gibbous" },
    { phase: "Last Quarter", emoji: "🌗", description: "Last Quarter" },
    { phase: "Waning Crescent", emoji: "🌘", description: "Waning Crescent" },
  ];

  const dayOfCycle = (date.day + date.month * 3) % cycleLength;
  const phaseIdx = Math.floor((dayOfCycle / cycleLength) * 8) % 8;

  return phases[phaseIdx];
}

// === Weather Functions ===

/**
 * Get weather for a specific date based on month data
 */
export function getWeatherForDate(
  date: HarptosDate,
  monthsData: MonthEntry[]
): WeatherData {
  const monthData = monthsData.find((m) => m.data.month_number === date.month);

  if (!monthData) {
    return {
      condition: "Unknown",
      temperature: "Mild",
      description: "Weather data unavailable",
      emoji: "🌫️",
    };
  }

  // Extract weather information from month data
  const weatherArray = monthData.data.weather;
  let temperature = "Mild";
  let precipitation = "Clear";
  let description = monthData.data.Description;

  // Parse weather data structure
  for (const weatherItem of weatherArray) {
    if (typeof weatherItem === "object") {
      if ("temperature" in weatherItem) {
        temperature = weatherItem.temperature;
      }
      if ("precipitation" in weatherItem) {
        precipitation = weatherItem.precipitation;
      }
      if ("description" in weatherItem) {
        description = weatherItem.description;
      }
    }
  }

  // Generate weather emoji based on season and conditions
  const seasonEmojis = {
    winter: "❄️",
    spring: "🌸",
    summer: "☀️",
    autumn: "🍂",
  };

  return {
    condition: precipitation,
    temperature,
    description,
    emoji: seasonEmojis[date.season],
  };
}

// === Event Functions ===

/**
 * Get special events for a date
 */
export function getSpecialEvents(
  date: HarptosDate,
  holidaysData: HolidayEntry[],
  eventsData: EventEntry[] = []
): SpecialEvent[] {
  const events: SpecialEvent[] = [];

  // Check for holidays
  const holidays = transformHolidayData(holidaysData);
  const holiday = holidays.find(
    (h) => h.month === date.month && h.day === date.day
  );

  if (holiday) {
    events.push({
      name: holiday.name,
      type: "holiday",
      description: holiday.description,
      emoji: getEventEmoji(holiday.type || "holiday"),
    });
  }

  // Check for start of tenday
  if (date.dayOfTenday === 1) {
    events.push({
      name: `${getTendayOrdinal(date.tenday)} Tenday Begins`,
      type: "seasonal",
      description: "Start of a new tenday",
      emoji: "📅",
    });
  }

  // Check for campaign events
  for (const event of eventsData) {
    const eventDate = new Date(event.data.eventDate);
    if (
      eventDate.getFullYear() === date.year &&
      eventDate.getMonth() + 1 === date.month &&
      eventDate.getDate() === date.day
    ) {
      events.push({
        name: event.data.title,
        type: "custom",
        description: event.data.description,
        emoji: "⚔️",
      });
    }
  }

  return events;
}

/**
 * Get emoji for event type
 */
function getEventEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    holiday: "🎉",
    seasonal: "🌟",
    astronomical: "🌙",
    religious: "⛪",
    custom: "📖",
  };
  return emojiMap[type] || "📅";
}

/**
 * Get ordinal name for tenday
 */
export function getTendayOrdinal(tenday: number): string {
  return tenday === 1 ? "First" : tenday === 2 ? "Second" : "Third";
}

// === Holiday Functions ===

/**
 * Find holidays for a specific month
 */
export function getHolidaysForMonth(
  holidays: HolidayEntry[],
  monthNumber: number
): HolidayEntry[] {
  return holidays.filter((holiday) => {
    if ("month" in holiday.data.date) {
      return holiday.data.date.month === monthNumber;
    }
    return false;
  });
}

/**
 * Find special day holidays that occur between months
 */
export function getSpecialDayHolidays(
  holidays: HolidayEntry[]
): HolidayEntry[] {
  return holidays.filter((holiday) => "specialDay" in holiday.data.date);
}

/**
 * Get the special day holiday that occurs after a given month
 */
export function getSpecialDayAfterMonth(
  holidays: HolidayEntry[],
  monthNumber: number
): HolidayEntry | null {
  const specialDayMapping: Record<number, string> = {
    1: "midwinter",
    4: "greengrass",
    7: "midsummer",
    9: "highharvestide",
    11: "feast-of-the-moon",
  };

  const specialDayName = specialDayMapping[monthNumber];
  if (!specialDayName) return null;

  return (
    holidays.find((holiday) => {
      return (
        "specialDay" in holiday.data.date &&
        holiday.data.date.specialDay === specialDayName
      );
    }) || null
  );
}

/**
 * Get all holidays for a year, including special days
 */
export function getAllHolidaysForYear(
  holidays: HolidayEntry[],
  year: number
): Array<{
  holiday: HolidayEntry;
  date: { month?: number; day?: number; specialDay?: string };
  isLeapYear?: boolean;
}> {
  const leapYear = isLeapYear(year);

  return holidays
    .filter((holiday) => {
      // Include Shieldmeet only in leap years
      if (
        "specialDay" in holiday.data.date &&
        holiday.data.date.specialDay === "shieldmeet"
      ) {
        return leapYear;
      }
      return true;
    })
    .map((holiday) => ({
      holiday,
      date: holiday.data.date,
      isLeapYear:
        leapYear &&
        "specialDay" in holiday.data.date &&
        holiday.data.date.specialDay === "shieldmeet",
    }));
}

// === Utility Functions ===

/**
 * Get season emoji
 */
export function getSeasonEmoji(season: HarptosDate["season"]): string {
  const seasonEmojis = {
    winter: "❄️",
    spring: "🌸",
    summer: "☀️",
    autumn: "🍂",
  };
  return seasonEmojis[season];
}

/**
 * Get season text color
 */
export function getSeasonTextColor(season: HarptosDate["season"]): string {
  const seasonColors = {
    winter: "text-blue-600 dark:text-blue-400",
    spring: "text-green-600 dark:text-green-400",
    summer: "text-yellow-600 dark:text-yellow-400",
    autumn: "text-orange-600 dark:text-orange-400",
  };
  return seasonColors[season];
}

/**
 * Get detailed information about a day
 */
export function getDayDetails(
  date: HarptosDate,
  monthsData: MonthEntry[]
): {
  monthProgress: number;
  yearProgress: number;
  seasonProgress: number;
  tendayProgress: number;
  timeOfDay: string;
  dayType: "weekday" | "holiday" | "special";
} {
  const monthProgress = (date.day / 30) * 100;
  const yearProgress = (((date.month - 1) * 30 + date.day) / 360) * 100;

  // Calculate season progress
  const seasonMonths = monthsData
    .filter((m) => m.data.season === date.season)
    .sort((a, b) => a.data.month_number - b.data.month_number);

  const seasonDayCount = seasonMonths.length * 30; // Assuming 30 days per month
  let currentSeasonDay = 0;

  for (const month of seasonMonths) {
    if (month.data.month_number < date.month) {
      currentSeasonDay += 30;
    } else if (month.data.month_number === date.month) {
      currentSeasonDay += date.day;
      break;
    }
  }

  const seasonProgress = (currentSeasonDay / seasonDayCount) * 100;
  const tendayProgress = (date.dayOfTenday / 10) * 100;

  // Determine time of day based on day number (simple pattern)
  const timePatterns = [
    "dawn",
    "morning",
    "midday",
    "afternoon",
    "evening",
    "night",
  ];
  const timeOfDay = timePatterns[date.day % timePatterns.length];

  const dayType = date.isHoliday
    ? "holiday"
    : [1, 10, 20, 30].includes(date.day)
    ? "special"
    : "weekday";

  return {
    monthProgress,
    yearProgress,
    seasonProgress,
    tendayProgress,
    timeOfDay,
    dayType,
  };
}

/**
 * Generate calendar data for a month or year
 */
export function generateCalendarData(
  year: number,
  monthsData: MonthEntry[],
  holidaysData: HolidayEntry[],
  eventsData: EventEntry[] = [],
  celestialData: CelestialEntry[] = [],
  month?: number
) {
  const isFullYear = !month;
  const months = transformMonthData(monthsData);

  if (isFullYear) {
    return months.map((monthData) => ({
      month: monthData,
      days: Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const date = createHarptosDate(
          year,
          monthData.id,
          day,
          monthsData,
          holidaysData
        );
        return {
          ...date,
          weather: getWeatherForDate(date, monthsData),
          events: getSpecialEvents(date, holidaysData, eventsData),
          details: getDayDetails(date, monthsData),
          moon: getMoonPhase(date, celestialData),
        };
      }),
    }));
  } else {
    const monthData = months.find((m) => m.id === month);
    if (!monthData) {
      throw new Error(`Month ${month} not found`);
    }

    return {
      month: monthData,
      days: Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const date = createHarptosDate(
          year,
          month,
          day,
          monthsData,
          holidaysData
        );
        return {
          ...date,
          weather: getWeatherForDate(date, monthsData),
          events: getSpecialEvents(date, holidaysData, eventsData),
          details: getDayDetails(date, monthsData),
          moon: getMoonPhase(date, celestialData),
        };
      }),
    };
  }
}

// === Collection Utility Functions ===

/**
 * Get month details including extended information
 */
export function getMonthDetails(month: MonthEntry) {
  return {
    name: month.data.name,
    commonName: month.data.alias,
    monthNumber: month.data.month_number,
    season: month.data.season,
    days: 30, // Standard Harptos month
    weather: month.data.weather,
    Description: month.data.Description,
    activities: month.data.activities,
    agriculture: month.data.agriculture,
    economy: month.data.economy,
    culturalSignificance: month.data.cultural_significance,
    travel: month.data.travel,
    adventureHooks: month.data.adventure_hooks,
    tags: month.data.tags,
  };
}

/**
 * Get holiday details including extended information
 */
export function getHolidayDetails(holiday: HolidayEntry) {
  return {
    name: holiday.data.name,
    description: holiday.data.description,
    type: holiday.data.type,
    observance: holiday.data.observance,
    duration: holiday.data.duration,
    traditions: holiday.data.traditions || [],
    regions: holiday.data.regions || [],
    mechanicalEffects: holiday.data.mechanicalEffects || [],
    associatedDeities: holiday.data.associatedDeities || [],
    rituals: holiday.data.rituals || [],
    culturalSignificance: holiday.data.culturalSignificance,
    aliases: holiday.data.aliases || [],
    origins: holiday.data.origins,
    tags: holiday.data.tags || [],
  };
}

/**
 * Get season information
 */
export function getSeasonDetails(season: SeasonEntry) {
  return {
    name: season.data.name,
    months: season.data.months,
    description: season.data.description,
    characteristics: season.data.characteristics,
    tags: season.data.tags || [],
  };
}

/**
 * Get celestial body information
 */
export function getCelestialDetails(celestial: CelestialEntry) {
  return {
    name: celestial.data.name,
    type: celestial.data.type,
    subtype: celestial.data.subtype,
    aliases: celestial.data.aliases || [],
    physical: celestial.data.physical,
    orbital: celestial.data.orbital,
    visibility: celestial.data.visibility,
    cycles: celestial.data.cycles,
    cultural: celestial.data.cultural,
    inhabited: celestial.data.inhabited,
    inhabitants: celestial.data.inhabitants || [],
    settlements: celestial.data.settlements || [],
    special: celestial.data.special,
    game: celestial.data.game,
    tags: celestial.data.tags || [],
    sources: celestial.data.sources || [],
  };
}
