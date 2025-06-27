// --- Types and Interfaces ---

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

// --- Constants ---

export const HARPTOS_MONTHS: HarptosMonth[] = [
  {
    id: 1,
    name: "Hammer",
    commonName: "Deepwinter",
    days: 30,
    season: "winter",
  },
  {
    id: 2,
    name: "Alturiak",
    commonName: "The Claw of Winter",
    days: 30,
    season: "winter",
  },
  {
    id: 3,
    name: "Ches",
    commonName: "Claw of Sunsets",
    days: 30,
    season: "spring",
  },
  {
    id: 4,
    name: "Tarsakh",
    commonName: "Claw of Storms",
    days: 30,
    season: "spring",
  },
  {
    id: 5,
    name: "Mirtul",
    commonName: "The Melting",
    days: 30,
    season: "spring",
  },
  {
    id: 6,
    name: "Kythorn",
    commonName: "Time of Flowers",
    days: 30,
    season: "summer",
  },
  {
    id: 7,
    name: "Flamerule",
    commonName: "Summertide",
    days: 30,
    season: "summer",
  },
  { id: 8, name: "Eleasis", commonName: "Highsun", days: 30, season: "summer" },
  {
    id: 9,
    name: "Eleint",
    commonName: "The Fading",
    days: 30,
    season: "autumn",
  },
  {
    id: 10,
    name: "Marpenoth",
    commonName: "Leaffall",
    days: 30,
    season: "autumn",
  },
  {
    id: 11,
    name: "Uktar",
    commonName: "The Rotting",
    days: 30,
    season: "autumn",
  },
  {
    id: 12,
    name: "Nightal",
    commonName: "The Drawing Down",
    days: 30,
    season: "winter",
  },
];

export const HARPTOS_HOLIDAYS: HarptosHoliday[] = [
  {
    id: "midwinter",
    name: "Midwinter",
    description: "Festival between Hammer 30 and Alturiak 1",
    specialDay: "midwinter",
    isRecurring: true,
  },
  {
    id: "spring-equinox",
    name: "Spring Equinox",
    description: "The spring equinox celebration",
    month: 3,
    day: 19,
    isRecurring: true,
  },
  {
    id: "greengrass",
    name: "Greengrass",
    description: "Spring festival between Tarsakh 30 and Mirtul 1",
    specialDay: "greengrass",
    isRecurring: true,
  },
  {
    id: "summer-solstice",
    name: "Summer Solstice",
    description: "The longest day of the year",
    month: 6,
    day: 20,
    isRecurring: true,
  },
  {
    id: "midsummer",
    name: "Midsummer",
    description: "Summer festival between Flamerule 30 and Eleasis 1",
    specialDay: "midsummer",
    isRecurring: true,
  },
  {
    id: "shieldmeet",
    name: "Shieldmeet",
    description:
      "Leap day celebration, occurs day after Midsummer every 4 years",
    specialDay: "shieldmeet",
    isRecurring: true,
    leapYearOnly: true,
  },
  {
    id: "autumn-equinox",
    name: "Autumn Equinox",
    description: "The autumn equinox celebration",
    month: 9,
    day: 21,
    isRecurring: true,
  },
  {
    id: "highharvestide",
    name: "Highharvestide",
    description: "Harvest festival between Eleint 30 and Marpenoth 1",
    specialDay: "highharvestide",
    isRecurring: true,
  },
  {
    id: "feast-of-the-moon",
    name: "Feast of the Moon",
    description: "Festival of the dead between Uktar 30 and Nightal 1",
    specialDay: "feast-of-the-moon",
    isRecurring: true,
  },
  {
    id: "winter-solstice",
    name: "Winter Solstice",
    description: "The shortest day of the year",
    month: 12,
    day: 20,
    isRecurring: true,
  },
];

// --- Utility Functions ---

export function isLeapYear(year: number): boolean {
  return year % 4 === 0;
}

export function createHarptosDate(
  year: number,
  month: number,
  day: number
): HarptosDate {
  const monthData = HARPTOS_MONTHS[month - 1];
  const season = monthData.season;
  // Simple holiday check
  const holiday = HARPTOS_HOLIDAYS.find(
    (h) => h.month === month && h.day === day
  );
  const isHoliday = !!holiday;
  const holidayName = holiday ? holiday.name : undefined;
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

export function getCurrentCampaignDate(): HarptosDate {
  // This will be overridden in the calendar page component with actual campaign date
  return createHarptosDate(1491, 4, 15);
}

export function getCurrentCampaignTime(): HarptosTime {
  // This will be overridden in the calendar page component with actual campaign time
  return createHarptosTime(14, 30);
}

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

export function formatHarptosDate(
  date: HarptosDate,
  style: "short" | "long" | "formal" | "conversational" = "long"
): string {
  if (style === "short") return `${date.day}/${date.month}/${date.year}`;
  if (style === "formal")
    return `${date.day} ${HARPTOS_MONTHS[date.month - 1].name}, ${
      date.year
    } DR`;
  return `${date.day} ${HARPTOS_MONTHS[date.month - 1].commonName}, ${
    date.year
  }`;
}

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

export function getMoonPhase(date: HarptosDate): MoonPhase {
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
  const dayOfCycle = (date.day + (date.month ?? 0) * 3) % 29;
  const phaseIdx = Math.floor((dayOfCycle / 29) * 8) % 8;
  return phases[phaseIdx];
}

export function getNextHoliday(
  date: HarptosDate
): { holiday: HarptosHoliday; daysUntil: number } | null {
  // Find next holiday in the year
  const holidays = HARPTOS_HOLIDAYS.filter(
    (h) => h.month !== undefined && h.day !== undefined
  ).map((h) => ({
    ...h,
    date: createHarptosDate(date.year, h.month!, h.day!),
  }));
  const currentDayOfYear = (date.month - 1) * 30 + date.day;
  let minDiff = Infinity;
  let next: any = null;
  for (const h of holidays) {
    const hDayOfYear = ((h.month ?? 1) - 1) * 30 + (h.day ?? 1);
    let diff = hDayOfYear - currentDayOfYear;
    if (diff < 0) diff += 360; // wrap to next year
    if (diff < minDiff) {
      minDiff = diff;
      next = h;
    }
  }
  return next ? { holiday: next, daysUntil: minDiff } : null;
}

export function getSeasonEmoji(season: HarptosDate["season"]): string {
  return {
    winter: "❄️",
    spring: "🌸",
    summer: "☀️",
    autumn: "🍂",
  }[season];
}

export function getSeasonTextColor(season: HarptosDate["season"]): string {
  return {
    winter: "text-blue-600 dark:text-blue-400",
    spring: "text-green-600 dark:text-green-400",
    summer: "text-yellow-600 dark:text-yellow-400",
    autumn: "text-orange-600 dark:text-orange-400",
  }[season];
}

// Enhanced utility functions for better interactivity

export function getWeatherForDate(date: HarptosDate): {
  condition: string;
  temperature: string;
  description: string;
  emoji: string;
} {
  // Simple weather generation based on season and day
  const seasonWeather = {
    winter: [
      {
        condition: "Snow",
        temperature: "Cold",
        description: "Heavy snowfall",
        emoji: "❄️",
      },
      {
        condition: "Frost",
        temperature: "Freezing",
        description: "Clear but frosty",
        emoji: "🧊",
      },
      {
        condition: "Overcast",
        temperature: "Cold",
        description: "Grey cloudy skies",
        emoji: "☁️",
      },
      {
        condition: "Clear",
        temperature: "Cool",
        description: "Crisp winter day",
        emoji: "🌤️",
      },
    ],
    spring: [
      {
        condition: "Rain",
        temperature: "Mild",
        description: "Spring showers",
        emoji: "🌧️",
      },
      {
        condition: "Sunny",
        temperature: "Warm",
        description: "Pleasant spring day",
        emoji: "☀️",
      },
      {
        condition: "Cloudy",
        temperature: "Cool",
        description: "Partly cloudy",
        emoji: "⛅",
      },
      {
        condition: "Breezy",
        temperature: "Mild",
        description: "Fresh spring breeze",
        emoji: "🌬️",
      },
    ],
    summer: [
      {
        condition: "Hot",
        temperature: "Hot",
        description: "Blazing summer heat",
        emoji: "🔥",
      },
      {
        condition: "Sunny",
        temperature: "Warm",
        description: "Perfect summer day",
        emoji: "☀️",
      },
      {
        condition: "Thunderstorm",
        temperature: "Warm",
        description: "Summer storm",
        emoji: "⛈️",
      },
      {
        condition: "Humid",
        temperature: "Muggy",
        description: "Sticky summer day",
        emoji: "💨",
      },
    ],
    autumn: [
      {
        condition: "Crisp",
        temperature: "Cool",
        description: "Clear autumn day",
        emoji: "🍂",
      },
      {
        condition: "Foggy",
        temperature: "Cool",
        description: "Morning mist",
        emoji: "🌫️",
      },
      {
        condition: "Windy",
        temperature: "Cool",
        description: "Autumn winds",
        emoji: "🌬️",
      },
      {
        condition: "Drizzle",
        temperature: "Mild",
        description: "Light autumn rain",
        emoji: "🌦️",
      },
    ],
  };

  const dayIndex = (date.day + date.month * 3) % 4;
  return seasonWeather[date.season][dayIndex];
}

export function getSpecialEvents(date: HarptosDate): Array<{
  name: string;
  type: "holiday" | "astronomical" | "seasonal" | "custom";
  description: string;
  emoji: string;
}> {
  const events = [];

  // Check for holidays
  const holiday = HARPTOS_HOLIDAYS.find(
    (h) => h.month === date.month && h.day === date.day
  );
  if (holiday) {
    events.push({
      name: holiday.name,
      type: "holiday" as const,
      description: holiday.description,
      emoji: "🎉",
    });
  }

  // Check for special days based on day of month
  if (date.day === 1) {
    events.push({
      name: "Month's Beginning",
      type: "seasonal" as const,
      description: `Start of ${HARPTOS_MONTHS[date.month - 1].commonName}`,
      emoji: "🌅",
    });
  }

  if (date.day === 30) {
    events.push({
      name: "Month's End",
      type: "seasonal" as const,
      description: `End of ${HARPTOS_MONTHS[date.month - 1].commonName}`,
      emoji: "🌇",
    });
  }

  // Check for tenday transitions
  if (date.dayOfTenday === 1) {
    events.push({
      name: `${getTendayOrdinal(date.tenday)} Tenday Begins`,
      type: "seasonal" as const,
      description: "Start of a new tenday",
      emoji: "📅",
    });
  }

  // Full moon special events
  const moon = getMoonPhase(date);
  if (moon.phase === "Full Moon") {
    events.push({
      name: "Full Moon",
      type: "astronomical" as const,
      description: "The moon shines brightest tonight",
      emoji: "🌕",
    });
  }

  return events;
}

export function getTendayOrdinal(tenday: number): string {
  return tenday === 1 ? "First" : tenday === 2 ? "Second" : "Third";
}

export function getYearView(year: number): Array<{
  month: HarptosMonth;
  holidays: HarptosHoliday[];
  seasonProgress: number;
}> {
  return HARPTOS_MONTHS.map((month) => {
    const holidays = HARPTOS_HOLIDAYS.filter((h) => h.month === month.id);
    const seasonMonths = HARPTOS_MONTHS.filter(
      (m) => m.season === month.season
    );
    const seasonIndex = seasonMonths.findIndex((m) => m.id === month.id);
    const seasonProgress = ((seasonIndex + 1) / seasonMonths.length) * 100;

    return {
      month,
      holidays,
      seasonProgress,
    };
  });
}

export function getSeasonView(
  season: HarptosDate["season"],
  year: number
): {
  months: HarptosMonth[];
  holidays: HarptosHoliday[];
  totalDays: number;
  currentProgress?: number;
} {
  const months = HARPTOS_MONTHS.filter((m) => m.season === season);
  const holidays = HARPTOS_HOLIDAYS.filter((h) => {
    if (!h.month) return false;
    return months.some((m) => m.id === h.month);
  });
  const totalDays = months.reduce((sum, m) => sum + m.days, 0);

  return {
    months,
    holidays,
    totalDays,
  };
}

export function getDayDetails(date: HarptosDate): {
  monthProgress: number;
  yearProgress: number;
  seasonProgress: number;
  tendayProgress: number;
  timeOfDay: string;
  dayType: "weekday" | "holiday" | "special";
} {
  const monthProgress = (date.day / 30) * 100;
  const yearProgress = (((date.month - 1) * 30 + date.day) / 360) * 100;

  const seasonMonths = HARPTOS_MONTHS.filter((m) => m.season === date.season);
  const seasonDayCount = seasonMonths.reduce((sum, m) => sum + m.days, 0);
  const currentSeasonDay = seasonMonths.reduce((sum, m) => {
    if (m.id < date.month) return sum + m.days;
    if (m.id === date.month) return sum + date.day;
    return sum;
  }, 0);
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

export function getCalendarViewModes() {
  return [
    {
      id: "month",
      name: "Month View",
      description: "Traditional monthly calendar",
      emoji: "📅",
    },
    {
      id: "season",
      name: "Season View",
      description: "View by seasonal quarters",
      emoji: "🌸",
    },
    {
      id: "year",
      name: "Year Overview",
      description: "Full year at a glance",
      emoji: "📊",
    },
    {
      id: "timeline",
      name: "Timeline View",
      description: "Linear progression view",
      emoji: "📈",
    },
  ];
}

export function generateCalendarData(year: number, month?: number) {
  const isFullYear = !month;

  if (isFullYear) {
    return HARPTOS_MONTHS.map((monthData) => ({
      month: monthData,
      days: Array.from({ length: monthData.days }, (_, i) => {
        const day = i + 1;
        const date = createHarptosDate(year, monthData.id, day);
        return {
          ...date,
          weather: getWeatherForDate(date),
          events: getSpecialEvents(date),
          details: getDayDetails(date),
        };
      }),
    }));
  } else {
    const monthData = HARPTOS_MONTHS[month - 1];
    return {
      month: monthData,
      days: Array.from({ length: monthData.days }, (_, i) => {
        const day = i + 1;
        const date = createHarptosDate(year, month, day);
        return {
          ...date,
          weather: getWeatherForDate(date),
          events: getSpecialEvents(date),
          details: getDayDetails(date),
        };
      }),
    };
  }
}
