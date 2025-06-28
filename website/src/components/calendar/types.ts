import type { HarptosDate } from "../../utils/fantasyCalendar";

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
  }>;
  details: any;
  moon: {
    description: string;
    emoji: string;
  };
  isToday: boolean;
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
}
