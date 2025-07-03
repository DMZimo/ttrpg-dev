import React, { useState, useEffect } from "react";
import {
  formatHarptosDate,
  formatHarptosTime,
  getMoonPhase,
  isLeapYear,
  getOrdinalSuffix,
} from "../../utils/calendarUtils";
import type { CurrentDateWidgetProps } from "../../types/calendarTypes";

export default function CurrentDateWidget({
  currentDate,
  currentTime,
  months,
  holidays,
  celestial,
  events = [],
}: CurrentDateWidgetProps) {
  const [upcomingHolidays, setUpcomingHolidays] = useState<any[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  const currentMoonPhase = getMoonPhase(currentDate, celestial);

  // Get current month data
  const monthData = months.find(
    (m) => m.data.month_number === currentDate.month
  );

  useEffect(() => {
    // Check if current date is a holiday
    const todayHoliday = holidays.find((h) => {
      const date = h.data.date;
      return (
        "month" in date &&
        "day" in date &&
        date.month === currentDate.month &&
        date.day === currentDate.day
      );
    });

    // Find upcoming holidays (next 5 holidays)
    const currentDayOfYear = (currentDate.month - 1) * 30 + currentDate.day;
    const upcoming = holidays
      .map((holidayEntry) => {
        const holiday = holidayEntry.data;
        // Check if it's a regular date holiday
        if ("month" in holiday.date && "day" in holiday.date) {
          const holidayDayOfYear =
            (holiday.date.month - 1) * 30 + holiday.date.day;
          let daysUntil = holidayDayOfYear - currentDayOfYear;
          if (daysUntil <= 0) daysUntil += 365; // Next year
          return {
            holiday: {
              id: holidayEntry.id,
              name: holiday.name,
              description: holiday.description,
              type: holiday.type,
              observance: holiday.observance,
            },
            daysUntil,
            month: holiday.date.month,
            day: holiday.date.day,
          };
        }
        return null;
      })
      .filter((item) => item !== null)
      .sort((a: any, b: any) => a.daysUntil - b.daysUntil)
      .slice(0, 5); // Show next 5 holidays

    setUpcomingHolidays(upcoming);

    // Set today's events
    const todayEvents: any[] = [];
    if (todayHoliday) {
      todayEvents.push({
        name: todayHoliday.data.name,
        emoji: "🎉",
        description: todayHoliday.data.description,
        type: todayHoliday.data.type || "holiday",
      });
    }
    setTodaysEvents(todayEvents);

    // Get recent campaign events
    const recent = events
      .filter((event) => {
        // Basic filter
        return event.data.type === "timeline-event";
      })
      .sort((a, b) => {
        // Sort by session number or date
        if (a.data.sessionNumber && b.data.sessionNumber) {
          return b.data.sessionNumber - a.data.sessionNumber;
        }
        return 0;
      })
      .slice(0, 3); // Show last 3 events

    setRecentEvents(recent);
  }, [currentDate, holidays, events]);

  // Helper for season styling
  const getSeasonTextColor = (season: string) => {
    switch (season.toLowerCase()) {
      case "winter":
        return "text-blue-400";
      case "spring":
        return "text-green-400";
      case "summer":
        return "text-yellow-400";
      case "autumn":
      case "fall":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  const getSeasonEmoji = (season: string) => {
    switch (season.toLowerCase()) {
      case "winter":
        return "❄️";
      case "spring":
        return "🌱";
      case "summer":
        return "☀️";
      case "autumn":
      case "fall":
        return "🍂";
      default:
        return "🌍";
    }
  };

  const currentSeasonEmoji = getSeasonEmoji(currentDate.season);
  const currentSeasonText = getSeasonTextColor(currentDate.season);

  return (
    <div className="calendar-widget">
      <div className="bg-gradient-to-br from-slate-800/90 to-blue-950/90 rounded-lg border border-slate-700 shadow-lg overflow-hidden flex flex-col">
        {/* Widget Header */}
        <div className="border-b border-red-500 bg-gradient-to-r from-hero-red-dark to-hero-red p-3">
          {/* Current Date & Time */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-base font-medium text-white">
                {currentTime.formalName}
              </div>
              <div className="text-xl font-bold text-white">
                {formatHarptosDate(currentDate, months, "formal")}
                <span
                  className="text-sm cursor-help ml-1"
                  title={isLeapYear(currentDate.year) ? "leap year" : ""}
                >
                  {isLeapYear(currentDate.year) ? "💫" : ""}
                </span>
              </div>
              <div className="text-sm opacity-90 text-white">
                {monthData?.data.alias || monthData?.data.name} •{" "}
                {currentDate.season.charAt(0).toUpperCase() +
                  currentDate.season.slice(1)}
              </div>
            </div>{" "}
            <a
              href="/calendar"
              className="inline-flex items-center justify-center gap-2 px-3 py-2 font-semibold transition-all duration-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:bg-white/20 text-white rounded-lg"
              title="Return to today's date"
            >
              <span className="sr-only">Back to today</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></rect>
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="4"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></rect>
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></line>
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></line>
                <circle
                  cx="12"
                  cy="14"
                  r="3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></circle>
                <line
                  x1="12"
                  y1="12"
                  x2="12"
                  y2="14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></line>
                <line
                  x1="12"
                  y1="14"
                  x2="13.5"
                  y2="15.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></line>
              </svg>
            </a>
          </div>

          {/* Scrollable Content */}
          <div className="widget-content overflow-y-auto flex-1 space-y-4 p-4">
            {/* Extra info */}
            <div className="text-xs flex flex-col gap-3 p-2 bg-surface-secondary rounded-lg">
              {/* Moon Phase Info */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentMoonPhase.emoji}</span>
                <div className="font-medium text-primary text-sm capitalize">
                  {currentMoonPhase.phase.replace("_", " ")}
                </div>
              </div>
              {/* Tenday info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-1 text-xs text-secondary">
                  <span>
                    Day {currentDate.dayOfTenday} of{" "}
                    {getOrdinalSuffix(currentDate.tenday)} tenday
                  </span>
                </div>
                <div className="progress-bar w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
                  <div
                    className="progress-fill h-full bg-hero-red rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(currentDate.dayOfTenday / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                {/* Season Info */}
                <span
                  className={`font-medium capitalize flex items-center gap-1 ${currentSeasonText}`}
                >
                  {currentSeasonEmoji}
                  {currentDate.season}
                </span>
                <span className="font-medium text-primary">
                  {getOrdinalSuffix(
                    currentDate.month % 3 === 0 ? 3 : currentDate.month % 3
                  )}{" "}
                  of 3 months
                </span>
              </div>
              <div className="w-full bg-surface-secondary rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentDate.season === "winter"
                      ? "bg-blue-400"
                      : currentDate.season === "spring"
                      ? "bg-green-400"
                      : currentDate.season === "summer"
                      ? "bg-yellow-400"
                      : "bg-orange-400"
                  }`}
                  style={{
                    width: `${
                      ((currentDate.month % 3 === 0
                        ? 3
                        : currentDate.month % 3) /
                        3) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Today's Events */}
            {todaysEvents.length > 0 && (
              <div className="todays-events mt-4">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  🎉 Today's Events
                </h4>
                <div className="space-y-2">
                  {todaysEvents.map((event, index) => (
                    <div
                      key={index}
                      className="event-item p-2 bg-gold-900/20 rounded-lg border border-hero-red"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0">
                          {event.emoji}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-primary text-sm">
                            {event.name}
                          </div>
                          <div className="text-xs text-secondary opacity-80 capitalize">
                            {event.type}
                          </div>
                          {event.description && (
                            <div className="text-xs text-secondary mt-1 line-clamp-2">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Campaign Events */}
            {recentEvents.length > 0 && (
              <div className="recent-events mt-4">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  ⚔️ Recent Events
                </h4>
                <div className="space-y-2">
                  {recentEvents.map((event, index) => (
                    <div
                      key={index}
                      className="event-item p-2 bg-surface-tertiary rounded-lg border border-primary"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0">📜</span>
                        <div className="min-w-0">
                          <div className="font-medium text-primary text-sm">
                            {event.data.title}
                          </div>
                          {event.data.sessionNumber && (
                            <div className="text-xs text-secondary opacity-80">
                              Session {event.data.sessionNumber}
                            </div>
                          )}
                          {event.data.description && (
                            <div className="text-xs text-secondary mt-1 line-clamp-2">
                              {event.data.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Holidays */}
            {upcomingHolidays.length > 0 && (
              <div className="upcoming-holidays mt-4">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  🗓️ Upcoming Holidays
                </h4>
                <div className="space-y-2">
                  {upcomingHolidays.map((item, index) => (
                    <div
                      key={index}
                      className="holiday-item p-2 bg-surface-tertiary rounded-lg border border-primary"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <a
                            href={`/timekeeping/holidays/${
                              item.holiday.id ||
                              item.holiday.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            }`}
                            className="font-medium text-primary text-sm text-hero-red hover:underline block"
                          >
                            {item.holiday.name}
                          </a>
                          <div className="text-xs text-secondary opacity-80 capitalize">
                            {item.holiday.type} • {item.holiday.observance}
                          </div>
                        </div>
                        <div className="text-xs text-hero-red font-medium flex-shrink-0">
                          {item.daysUntil === 0
                            ? "Today"
                            : item.daysUntil === 1
                            ? "Tomorrow"
                            : `${item.daysUntil} days`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
