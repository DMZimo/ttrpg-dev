import type { HarptosDate, HarptosTime } from "../utils/calendarUtils";
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

// Props for CurrentDateWidget component
export interface CurrentDateWidgetProps {
  currentDate: HarptosDate;
  currentTime: HarptosTime;
  months: CollectionEntry<"months">[];
  holidays: CollectionEntry<"holidays">[];
  celestial: CollectionEntry<"celestial">[];
  events?: CollectionEntry<"events">[];
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

// Enhanced weather widget props
export interface EnhancedWeatherWidgetProps extends WeatherWidgetProps {
  regionName?: string;
  showRegionalVariations?: boolean;
  showWeatherTrends?: boolean;
  showGameplayEffects?: boolean;
  forecastDays?: number;
}

// Enhanced weather data
export interface EnhancedWeatherData {
  date: HarptosDate;
  conditions: {
    primary: string;
    secondary?: string;
    description: string;
    emoji: string;
  };
  temperature: {
    current: number;
    feels_like: number;
    range: { min: number; max: number };
    unit: "celsius" | "fahrenheit";
  };
  precipitation: {
    chance: number;
    intensity: "none" | "light" | "moderate" | "heavy";
    type: "none" | "rain" | "snow" | "sleet" | "hail" | "mixed";
    duration_hours?: number;
  };
  wind: {
    speed: number;
    direction: string;
    gusts: boolean;
    description: string;
  };
  atmosphere: {
    humidity: number;
    pressure: "low" | "normal" | "high";
    visibility_miles: number;
  };
  magical_influences?: {
    wild_magic_surge_chance: number;
    elemental_affinities: string[];
    planar_weather: boolean;
    divine_influences: string[];
  };
  alerts: WeatherAlert[];
  gameplay_effects: GameplayEffects;
  trend: WeatherTrend;
}

export interface WeatherAlert {
  type: "weather" | "astronomical" | "magical" | "seasonal";
  severity: "low" | "moderate" | "high" | "extreme";
  message: string;
  emoji: string;
  onset_time?: string;
  duration?: string;
  mechanical_effects?: string[];
}

export interface GameplayEffects {
  travel: {
    speed_modifier: number;
    difficulty: "easy" | "moderate" | "hard" | "extreme";
    safety_notes: string[];
  };
  camping: {
    comfort_level: "excellent" | "good" | "fair" | "poor" | "dangerous";
    required_gear: string[];
    survival_dc_modifier: number;
  };
  spellcasting: {
    effects: string[];
    elemental_bonuses: Record<string, number>;
    wild_magic_modifier: number;
  };
  visibility: {
    range_feet: number;
    perception_modifier: number;
    combat_effects: string[];
  };
  social: {
    mood_modifier: string;
    indoor_preference: boolean;
    activity_suggestions: string[];
  };
}

export interface WeatherTrend {
  direction: "improving" | "worsening" | "stable" | "variable";
  confidence: number;
  persistence_factor: number;
  seasonal_progression: boolean;
}

export interface RegionalWeatherModifiers {
  region: string;
  temperature_modifier: number;
  precipitation_modifier: number;
  storm_modifier: number;
  wind_modifier: number;
  humidity_modifier: number;
  special_conditions: string[];
  coastal_effects: boolean;
  elevation_effects?: {
    high_altitude: boolean;
    mountain_effects: boolean;
  };
  magical_zones?: Array<{
    name: string;
    effect: string;
  }>;
}

export interface WeatherHistory {
  date: HarptosDate;
  conditions: EnhancedWeatherData;
  notable_events?: string[];
}
