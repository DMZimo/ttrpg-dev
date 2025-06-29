/**
 * Calendar data utilities for working with content collections
 * This module provides functions to work with dynamic calendar data
 * from the timekeeping content collections.
 */

import type { CollectionEntry } from "astro:content";

// Re-export types that external modules expect
export type {
  HarptosDate,
  HarptosTime,
  HarptosMonth,
  HarptosHoliday,
  MoonPhase,
} from "./calendarUtils";

// Collection type helpers
export type MonthEntry = CollectionEntry<"months">;
export type HolidayEntry = CollectionEntry<"holidays">;
export type SeasonEntry = CollectionEntry<"seasons">;
export type CelestialEntry = CollectionEntry<"celestial">;
export type EventEntry = CollectionEntry<"events">;

/**
 * Transform month collection entries into HarptosMonth format
 */
export function transformMonthData(
  months: MonthEntry[]
): import("./calendarUtils").HarptosMonth[] {
  return months
    .sort((a, b) => a.data.monthNumber - b.data.monthNumber)
    .map((month) => ({
      id: month.data.monthNumber,
      name: month.data.name,
      commonName: month.data.commonName,
      days: month.data.days,
      season: month.data.season,
    }));
}

/**
 * Transform holiday collection entries into HarptosHoliday format
 */
export function transformHolidayData(
  holidays: HolidayEntry[]
): import("./calendarUtils").HarptosHoliday[] {
  return holidays.map((holiday) => {
    const baseHoliday: import("./calendarUtils").HarptosHoliday = {
      id: holiday.id,
      name: holiday.data.name,
      description: holiday.data.description,
      isRecurring: holiday.data.isRecurring,
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

/**
 * Get holiday details including extended information
 */
export function getHolidayDetails(holiday: HolidayEntry) {
  return {
    name: holiday.data.name,
    description: holiday.data.description,
    type: holiday.data.type,
    season: holiday.data.season,
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
 * Get month details including weather and activities
 */
export function getMonthDetails(month: MonthEntry) {
  return {
    name: month.data.name,
    commonName: month.data.commonName,
    monthNumber: month.data.monthNumber,
    season: month.data.season,
    days: month.data.days,
    weather: month.data.weather,
    significance: month.data.significance,
    activities: month.data.activities,
    festivals: month.data.festivals || [],
    celestialEvents: month.data.celestialEvents || [],
    tags: month.data.tags || [],
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
    celestialType: celestial.data.celestialType,
    appearance: celestial.data.appearance,
    size: celestial.data.size,
    color: celestial.data.color,
    brightness: celestial.data.brightness,
    cycle: celestial.data.cycle,
    mythology: celestial.data.mythology,
    magicalProperties: celestial.data.magicalProperties || [],
    tags: celestial.data.tags || [],
  };
}

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
    1: "midwinter", // After Hammer (month 1)
    4: "greengrass", // After Tarsakh (month 4)
    7: "midsummer", // After Flamerule (month 7)
    9: "highharvestide", // After Eleint (month 9)
    11: "feast-of-the-moon", // After Uktar (month 11)
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
  const isLeapYear = year % 4 === 0;

  return holidays
    .filter((holiday) => {
      // Include Shieldmeet only in leap years
      if (
        "specialDay" in holiday.data.date &&
        holiday.data.date.specialDay === "shieldmeet"
      ) {
        return isLeapYear;
      }
      return true;
    })
    .map((holiday) => ({
      holiday,
      date: holiday.data.date,
      isLeapYear:
        isLeapYear &&
        "specialDay" in holiday.data.date &&
        holiday.data.date.specialDay === "shieldmeet",
    }));
}

/**
 * Filter holidays by season
 */
export function getHolidaysBySeason(
  holidays: HolidayEntry[],
  season: string
): HolidayEntry[] {
  return holidays.filter((holiday) => holiday.data.season === season);
}

/**
 * Filter holidays by observance level
 */
export function getHolidaysByObservance(
  holidays: HolidayEntry[],
  observance: string
): HolidayEntry[] {
  return holidays.filter((holiday) => holiday.data.observance === observance);
}
