import React from "react";
import { transformMonthData } from "../../utils/calendarUtils";
import type {
  CalendarDayData,
  CalendarGridProps,
} from "../../types/calendarTypes";

export default function CalendarGrid({
  calendarDays,
  specialDays,
  displayYear,
  displayMonth,
  selectedDate,
  compact,
  onDayClick,
  onSpecialDayClick,
  months,
}: CalendarGridProps) {
  const monthData = months.find((m) => m.data.month_number === displayMonth);

  if (!monthData) {
    return <div>Error: Month data not found</div>;
  }

  return (
    <div className="bg-surface-secondary rounded-b-lg shadow-lg border border-primary overflow-visible">
      {/* Regular month view - 3 tendays of 10 days each */}
      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-surface-tertiary/50">
            {Array.from({ length: 10 }, (_, i) => (
              <th
                key={i}
                className="py-3 px-2 text-sm font-medium text-secondary border-r border-primary last:border-r-0 w-[10%]"
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
              className="border-b border-primary last:border-b-0"
            >
              {Array.from({ length: 10 }).map((_, dayIdx) => {
                const day = tendayIdx * 10 + dayIdx + 1;
                if (day > 30) {
                  // Standard Harptos month length
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
                    className={`calendar-day group relative border-r border-primary last:border-r-0 transition-all duration-200 hover:bg-surface-tertiary cursor-pointer w-[10%] ${
                      compact ? "h-16" : "h-20"
                    } ${
                      isToday ? "bg-hero-red/20 ring-2 border-hero-red" : ""
                    } ${
                      isSelected ? "ring-2 ring-blue-500 bg-blue-900/30" : ""
                    } ${hasEvents ? "bg-gold-900/20" : ""}`.trim()}
                    title={`${dayData.day} ${monthData.data.name} ${displayYear} - ${dayData.weather.condition}, ${dayData.weather.temperature}`}
                    onClick={() => onDayClick(day)}
                  >
                    <div
                      className={`flex flex-col items-center justify-between p-1 h-full overflow-hidden ${
                        compact ? "space-y-0" : "space-y-1"
                      }`}
                    >
                      {/* Day Number */}
                      <span
                        className={`font-semibold ${
                          isToday
                            ? "text-hero-red"
                            : isSelected
                            ? "text-blue-400"
                            : "text-primary"
                        } ${compact ? "text-sm" : "text-base"}`}
                      >
                        {dayData.day}
                      </span>

                      {/* Events Row */}
                      <div className="flex flex-wrap gap-1 justify-center items-center min-h-0 flex-shrink-0">
                        {dayData.events.length > 0 ? (
                          <>
                            {dayData.events
                              .slice(0, compact ? 1 : 2)
                              .map((event, idx) => (
                                <span
                                  key={idx}
                                  className={`event-indicator transition-transform duration-200 flex-shrink-0 ${
                                    compact ? "text-xs" : "text-sm"
                                  }`}
                                  title={`${event.name}: ${event.description}`}
                                >
                                  {event.emoji}
                                </span>
                              ))}
                            {dayData.events.length > (compact ? 1 : 2) && (
                              <span className="text-xs text-tertiary flex-shrink-0">
                                +{dayData.events.length - (compact ? 1 : 2)}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs opacity-0">•</span>
                        )}
                      </div>

                      {/* Moon Phase & Weather - Always Visible */}
                      <div className="flex items-center justify-center space-x-1 flex-shrink-0">
                        <span
                          className={`transition-transform duration-200 ${
                            compact ? "text-xs" : "text-sm"
                          }`}
                          title={`${dayData.moon.description}`}
                        >
                          {dayData.moon.emoji}
                        </span>

                        <span
                          className={`weather-icon transition-opacity ${
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
                      className="day-details fixed bg-surface-elevated text-primary text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 min-w-max pointer-events-none shadow-card border border-primary transform -translate-x-1/2 translate-y-2"
                      style={{
                        left: "50%",
                        top: "100%",
                      }}
                    >
                      <div className="font-bold mb-1">
                        {dayData.day} {monthData.data.name} {displayYear} DR
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

      {/* Special Days Section - shown after the regular month */}
      {specialDays.length > 0 && (
        <div className="border-t border-primary p-6 text-center bg-gradient-to-r from-amber-900/20 to-yellow-900/20">
          {specialDays.map((specialDay, index) => (
            <div key={index} className="space-y-3">
              <div className="text-2xl font-bold text-primary">
                🎉 {specialDay.holidayName} 🎉
              </div>
              <div className="text-sm text-secondary max-w-2xl mx-auto">
                {specialDay.specialDayType === "shieldmeet"
                  ? "The rare leap day celebration occurring every four years"
                  : `Special festival day between ${
                      monthData.data.name
                    } 30 and ${
                      months.find(
                        (m) =>
                          m.data.month_number ===
                          (displayMonth === 12 ? 1 : displayMonth + 1)
                      )?.data.name || "Next Month"
                    } 1`}
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-secondary">
                <span>
                  🌤️ {specialDay.weather.condition} (
                  {specialDay.weather.temperature})
                </span>
                <span>🌙 {specialDay.moon.description}</span>
                {specialDay.events.length > 0 && (
                  <span>
                    🎊 {specialDay.events.length} Festival Event
                    {specialDay.events.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={() => onSpecialDayClick(specialDay)}
                className="bg-accent-900/20 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Learn More About {specialDay.holidayName}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
