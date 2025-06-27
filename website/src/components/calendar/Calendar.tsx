import React, { useState, useEffect } from "react";
import {
  createHarptosDate,
  getMoonPhase,
  getWeatherForDate,
  getSpecialEvents,
  getDayDetails,
  HARPTOS_MONTHS,
  type HarptosDate,
} from "../../utils/fantasyCalendar";

interface CalendarProps {
  year: number;
  month: number;
  currentDate: HarptosDate;
  compact?: boolean;
  onDateSelect?: (date: string) => void;
}

export default function Calendar({
  year,
  month,
  currentDate,
  compact = false,
  onDateSelect,
}: CalendarProps) {
  const [displayYear, setDisplayYear] = useState(year);
  const [displayMonth, setDisplayMonth] = useState(month);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [showMonthInfo, setShowMonthInfo] = useState(false);

  const monthData = HARPTOS_MONTHS[displayMonth - 1];

  // Generate calendar data with enhanced information
  const calendarDays = Array.from({ length: monthData.days }, (_, i) => {
    const day = i + 1;
    const dateObj = createHarptosDate(displayYear, displayMonth, day);
    const weather = getWeatherForDate(dateObj);
    const events = getSpecialEvents(dateObj);
    const details = getDayDetails(dateObj);
    const moon = getMoonPhase(dateObj);

    return {
      ...dateObj,
      weather,
      events,
      details,
      moon,
      isToday:
        dateObj.year === currentDate.year &&
        dateObj.month === currentDate.month &&
        dateObj.day === currentDate.day,
    };
  });

  // Navigation handlers
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (displayMonth === 1) {
        setDisplayMonth(12);
        setDisplayYear(displayYear - 1);
      } else {
        setDisplayMonth(displayMonth - 1);
      }
    } else {
      if (displayMonth === 12) {
        setDisplayMonth(1);
        setDisplayYear(displayYear + 1);
      } else {
        setDisplayMonth(displayMonth + 1);
      }
    }
  };

  const navigateYear = (direction: "prev" | "next") => {
    setDisplayYear(displayYear + (direction === "next" ? 1 : -1));
  };

  const goToCurrentDate = () => {
    setDisplayYear(currentDate.year);
    setDisplayMonth(currentDate.month);
  };

  const jumpToMonth = (monthNum: number) => {
    setDisplayMonth(monthNum);
    setShowQuickJump(false);
  };

  const toggleMonthInfo = () => {
    setShowMonthInfo(!showMonthInfo);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${displayYear}-${displayMonth}-${day}`;
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigateMonth("prev");
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateMonth("next");
          break;
        case "Home":
          e.preventDefault();
          goToCurrentDate();
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateYear("prev");
          break;
        case "ArrowDown":
          e.preventDefault();
          navigateYear("next");
          break;
        case "Escape":
          e.preventDefault();
          setShowQuickJump(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [displayMonth, displayYear]);

  // Close quick jump when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".quick-jump") && !target.closest(".month-info")) {
        setShowQuickJump(false);
        setShowMonthInfo(false);
      }
    };

    if (showQuickJump || showMonthInfo) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showQuickJump, showMonthInfo]);

  return (
    <div className="calendar-container">
      {/* Header with Month/Year Display and Info Toggle */}
      <div className="calendar-bg flex gap-3 mb-6 p-4 rounded-t-lg shadow-lg border calendar-border border-b sm:flex-row sm:mb-0">
        {/* Back to date */}
        <button
          onClick={goToCurrentDate}
          className="px-3 py-2 calendar-success-bg hover:opacity-90 text-white text-sm rounded-lg transition-colors"
          aria-label="Go to current date"
        >
          Today
        </button>

        {/* Year Navigation */}
        <div className="flex items-center gap-1 px-2 w-full sm:w-auto rounded-lg shadow-lg border calendar-border">
          <button
            onClick={() => navigateYear("prev")}
            className="calendar-text-secondary hover:calendar-accent transition-colors"
            aria-label="Previous year"
          >
            ⬅️
          </button>
          <h2 className="text-xl sm:text-2xl font-bold calendar-text-primary group-hover:calendar-accent transition-colors">
            {displayYear}
          </h2>
          <span className="calendar-text-tertiary ml-2 text-lg">DR</span>
          <button
            onClick={() => navigateYear("next")}
            className="p-1 calendar-text-secondary hover:calendar-accent transition-colors"
            aria-label="Next year"
          >
            ➡️
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-around gap-1 w-64">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 calendar-hover-bg hover:calendar-accent-bg calendar-text-primary hover:calendar-accent rounded-lg transition-all"
            aria-label="Previous month"
          >
            ⬅️
          </button>
          <div className="text-sm calendar-text-secondary w-48">
            <h2 className="flex gap-1 text-xl sm:text-2xl font-bold calendar-text-primary group-hover:calendar-accent transition-colors">
              {monthData.name}
            </h2>
            {monthData.commonName} • {monthData.season}
          </div>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 calendar-hover-bg hover:calendar-accent-bg calendar-text-primary hover:calendar-accent rounded-lg transition-all"
            aria-label="Next month"
          >
            ➡️
          </button>
        </div>
      </div>
      {/* Current Month Information */}
      <div className=""></div>

      {/* Calendar Grid */}
      <div className="calendar-bg rounded-b-lg shadow-lg border calendar-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="calendar-surface-secondary">
              {Array.from({ length: 10 }, (_, i) => (
                <th
                  key={i}
                  className="py-3 px-2 text-sm font-medium calendar-text-secondary border-r calendar-border last:border-r-0"
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
                      className={`calendar-day group relative border-r calendar-border last:border-r-0 transition-all duration-200 hover:calendar-hover-bg cursor-pointer ${
                        compact ? "h-16 p-1" : "h-20 p-2"
                      } ${
                        isToday
                          ? "calendar-accent-bg ring-2 calendar-accent-border"
                          : ""
                      } ${isSelected ? "ring-2 ring-emerald-500" : ""} ${
                        hasEvents ? "calendar-warning-bg" : ""
                      }`.trim()}
                      title={`${dayData.day} ${monthData.name} ${displayYear} - ${dayData.weather.condition}, ${dayData.weather.temperature}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div
                        className={`flex flex-col items-center justify-start space-y-1 h-full ${
                          compact ? "space-y-0" : ""
                        }`}
                      >
                        {/* Day Number */}
                        <span
                          className={`font-semibold ${
                            isToday
                              ? "calendar-accent"
                              : "calendar-text-primary"
                          } ${compact ? "text-sm" : "text-base"}`}
                        >
                          {dayData.day}
                        </span>

                        {/* Events Row */}
                        {dayData.events.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center items-center">
                            {dayData.events
                              .slice(0, compact ? 1 : 2)
                              .map((event, idx) => (
                                <a
                                  key={idx}
                                  href={`/timekeeping/holidays/${event.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")
                                    .replace(/[^a-z0-9-]/g, "")}`}
                                  className={`event-indicator hover:scale-110 transition-transform duration-200 ${
                                    compact ? "text-xs" : "text-sm"
                                  }`}
                                  title={`${event.name}: ${event.description} (Click to learn more)`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {event.emoji}
                                </a>
                              ))}
                            {dayData.events.length > (compact ? 1 : 2) && (
                              <span className="text-xs calendar-text-tertiary">
                                +{dayData.events.length - (compact ? 1 : 2)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Moon Phase & Weather */}
                        <div className="flex items-center space-x-1">
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
                      <div className="day-details absolute top-full left-0 mt-1 bg-slate-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-max pointer-events-none shadow-lg border border-slate-700">
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
                            📅 Tenday {dayData.tenday}, Day{" "}
                            {dayData.dayOfTenday}
                          </div>
                          {dayData.events.length > 0 && (
                            <div className="border-t border-gray-600 pt-1 mt-2">
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
    </div>
  );
}
