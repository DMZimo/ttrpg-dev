import React from "react";
import { HARPTOS_MONTHS } from "../../utils/fantasyCalendar";
import type { CalendarDayData, CalendarGridProps } from "./types";

export default function CalendarGrid({
  calendarDays,
  displayYear,
  displayMonth,
  selectedDate,
  compact,
  onDayClick,
}: CalendarGridProps) {
  const monthData = HARPTOS_MONTHS[displayMonth - 1];

  return (
    <div className="calendar-bg rounded-b-lg shadow-lg border calendar-border overflow-visible">
      <table className="w-full table-fixed">
        <thead>
          <tr className="calendar-surface-secondary">
            {Array.from({ length: 10 }, (_, i) => (
              <th
                key={i}
                className="py-3 px-2 text-sm font-medium calendar-text-secondary border-r calendar-border last:border-r-0 w-[10%]"
              >
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 3 }).map((_, tendayIdx) => (
            <tr
              key={tendayIdx}
              className="border-b calendar-border last:border-b-0"
            >
              {Array.from({ length: 10 }).map((_, dayIdx) => {
                const day = tendayIdx * 10 + dayIdx + 1;
                if (day > monthData.days) {
                  return <td key={dayIdx} className="p-2" />;
                }

                const dayData = calendarDays[day - 1];
                const isToday = dayData.isToday;
                const hasEvents = dayData.events.length > 0;
                const isSelected =
                  selectedDate === `${displayYear}-${displayMonth}-${day}`;

                return (
                  <td
                    key={dayIdx}
                    className={`calendar-day group relative border-r calendar-border last:border-r-0 transition-all duration-200 hover:calendar-hover-bg cursor-pointer w-[10%] ${
                      compact ? "h-16" : "h-20"
                    } ${
                      isToday
                        ? "calendar-accent-bg ring-2 calendar-accent-border"
                        : ""
                    } ${isSelected ? "ring-2 ring-success" : ""} ${
                      hasEvents ? "calendar-warning-bg" : ""
                    }`.trim()}
                    title={`${dayData.day} ${monthData.name} ${displayYear} - ${dayData.weather.condition}, ${dayData.weather.temperature}`}
                    onClick={() => onDayClick(day)}
                  >
                    <div
                      className={`flex flex-col items-center justify-start p-1 h-full overflow-hidden ${
                        compact ? "space-y-0" : "space-y-1"
                      }`}
                    >
                      {/* Day Number */}
                      <span
                        className={`font-semibold ${
                          isToday ? "calendar-accent" : "calendar-text-primary"
                        } ${compact ? "text-sm" : "text-base"}`}
                      >
                        {dayData.day}
                      </span>

                      {/* Events Row */}
                      {dayData.events.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center items-center min-h-0 flex-shrink">
                          {dayData.events
                            .slice(0, compact ? 1 : 2)
                            .map((event, idx) => (
                              <a
                                key={idx}
                                href={`/timekeeping/holidays/${event.name
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                                  .replace(/[^a-z0-9-]/g, "")}`}
                                className={`event-indicator hover:scale-110 transition-transform duration-200 flex-shrink-0 ${
                                  compact ? "text-xs" : "text-sm"
                                }`}
                                title={`${event.name}: ${event.description} (Click to learn more)`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {event.emoji}
                              </a>
                            ))}
                          {dayData.events.length > (compact ? 1 : 2) && (
                            <span className="text-xs calendar-text-tertiary flex-shrink-0">
                              +{dayData.events.length - (compact ? 1 : 2)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Moon Phase & Weather */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <a
                          href="/timekeeping/celestial/selune"
                          className={`hover:scale-110 transition-transform duration-200 ${
                            compact ? "text-xs" : "text-sm"
                          }`}
                          title={`${dayData.moon.description} (Click to learn about Selûne)`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {dayData.moon.emoji}
                        </a>

                        {/* Weather icon on hover */}
                        <span
                          className={`weather-icon opacity-0 group-hover:opacity-100 transition-opacity ${
                            compact ? "text-xs" : "text-sm"
                          }`}
                          title={`${dayData.weather.condition} - ${dayData.weather.description}`}
                        >
                          {dayData.weather.emoji}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Hover Details */}
                    <div
                      className="day-details fixed bg-surface-elevated calendar-text-primary text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 min-w-max pointer-events-none shadow-card border border-primary transform -translate-x-1/2 translate-y-2"
                      style={{
                        left: "50%",
                        top: "100%",
                      }}
                    >
                      <div className="font-bold mb-1">
                        {dayData.day} {monthData.name} {displayYear} DR
                      </div>
                      <div className="space-y-1">
                        <div>
                          🌤️ Weather: {dayData.weather.condition} (
                          {dayData.weather.temperature})
                        </div>
                        <div>🌙 Moon: {dayData.moon.description}</div>
                        <div>
                          📅 Tenday {dayData.tenday}, Day {dayData.dayOfTenday}
                        </div>
                        {dayData.events.length > 0 && (
                          <div className="border-t border-secondary pt-1 mt-2">
                            <div className="font-medium">Events:</div>
                            {dayData.events.map((event, idx) => (
                              <div key={idx} className="text-xs">
                                • {event.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
