import type { HarptosDate } from "../../utils/gameCalendarUtils";
import type { CollectionEntry } from "astro:content";

// Extended calendar day data with collection-based information
export interface CalendarDayData extends HarptosDate {
  weather: {
    condition: string;
    temperature: string;
    description: string;
    emoji: string;
  };
  events: Array<{
    name: string;
    description: string;
    emoji: string;
    type?: string;
  }>;
  details: {
    monthInfo?: CollectionEntry<"months">;
    holidayInfo?: CollectionEntry<"holidays">;
    seasonInfo?: CollectionEntry<"seasons">;
    celestialInfo?: CollectionEntry<"celestial">;
  };
  moon: {
    description: string;
    emoji: string;
    phase: string;
  };
  isToday: boolean;
  holidayDetails?: {
    name: string;
    traditions: string[];
    culturalSignificance?: string;
    mechanicalEffects?: string[];
    associatedDeities?: string[];
  };
}

export interface CalendarGridProps {
  calendarDays: CalendarDayData[];
  specialDays: CalendarDayData[];
  displayYear: number;
  displayMonth: number;
  selectedDate: string | null;
  compact: boolean;
  onDayClick: (day: number) => void;
  onSpecialDayClick: (specialDay: CalendarDayData) => void;
  months: CollectionEntry<"months">[];
}

// Props for calendar components that need collection data
export interface CalendarDataProps {
  months: CollectionEntry<"months">[];
  holidays: CollectionEntry<"holidays">[];
  seasons: CollectionEntry<"seasons">[];
  celestial: CollectionEntry<"celestial">[];
  events?: CollectionEntry<"events">[];
}

// Weather widget props interface
export interface WeatherWidgetProps {
  selectedDay: CalendarDayData | null;
  currentDate: HarptosDate;
  months: CollectionEntry<"months">[];
  compact?: boolean;
  showExtendedForecast?: boolean;
  showHistoricalWeather?: boolean;
}

// Extended weather forecast data
export interface WeatherForecastData {
  date: HarptosDate;
  weather: {
    condition: string;
    temperature: string;
    description: string;
    emoji: string;
    temperatureRange?: {
      min: number;
      max: number;
    };
    precipitation?: {
      chance: number;
      type: string;
    };
    wind?: {
      speed: string;
      direction: string;
    };
    humidity?: number;
    visibility?: string;
  };
  moon: {
    description: string;
    emoji: string;
    phase: string;
  };
  alerts?: Array<{
    type: "weather" | "astronomical" | "magical";
    severity: "low" | "moderate" | "high" | "extreme";
    message: string;
    emoji: string;
  }>;
}
