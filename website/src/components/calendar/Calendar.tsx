import React, { useState, useEffect } from "react";
import {
  createHarptosDate,
  getMoonPhase,
  getWeatherForDate,
  getSpecialEvents,
  getSpecialDaysForMonth,
  type HarptosDate,
} from "../../utils/gameCalendarUtils";
import CalendarGrid from "./CalendarGrid";
import WeatherWidget from "./WeatherWidget";
import type { CalendarDayData, CalendarDataProps } from "./types";

interface CalendarProps extends CalendarDataProps {
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
  months,
  holidays,
  seasons,
  celestial,
  events = [],
  compact = false,
  onDateSelect,
}: CalendarProps) {
  const [displayYear, setDisplayYear] = useState(year);
  const [displayMonth, setDisplayMonth] = useState(month);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [showMonthInfo, setShowMonthInfo] = useState(false);

  // Get month data from collections
  const monthData = months.find((m) => m.data.month_number === displayMonth);

  if (!monthData) {
    return <div>Error: Month data not found for month {displayMonth}</div>;
  }

  // Generate calendar data with enhanced information from collections
  const calendarDays: CalendarDayData[] = Array.from(
    { length: 30 }, // Standard Harptos month length
    (_, i) => {
      const day = i + 1;
      const dateObj = createHarptosDate(
        displayYear,
        displayMonth,
        day,
        months,
        holidays
      );
      const weather = getWeatherForDate(dateObj, months);
      const specialEvents = getSpecialEvents(dateObj, holidays, events || []);
      const moon = getMoonPhase(dateObj, celestial);

      // Enhanced details using collection data
      const details = {
        monthInfo: monthData,
        holidayInfo: holidays.find((h) => {
          if ("month" in h.data.date && "day" in h.data.date) {
            return (
              h.data.date.month === displayMonth && h.data.date.day === day
            );
          }
          return false;
        }),
        seasonInfo: seasons.find((s) =>
          s.data.months.includes(monthData.data.name)
        ),
        celestialInfo: celestial.find((c) => c.data.type === "moon"), // Primary moon
      };

      // Get holiday details if this day has a holiday
      const holidayDetails = details.holidayInfo
        ? {
            name: details.holidayInfo.data.name,
            traditions: details.holidayInfo.data.traditions || [],
            culturalSignificance: details.holidayInfo.data.culturalSignificance,
            mechanicalEffects: details.holidayInfo.data.mechanicalEffects || [],
            associatedDeities: details.holidayInfo.data.associatedDeities || [],
          }
        : undefined;

      return {
        ...dateObj,
        weather,
        events: specialEvents,
        details,
        moon: {
          ...moon,
          phase: moon.phase,
        },
        isToday:
          dateObj.year === currentDate.year &&
          dateObj.month === currentDate.month &&
          dateObj.day === currentDate.day,
        holidayDetails,
      };
    }
  );

  // Generate special days for this month using collection data
  const specialDays: CalendarDayData[] = getSpecialDaysForMonth(
    displayYear,
    displayMonth,
    holidays
  ).map((specialDay) => {
    const weather = getWeatherForDate(specialDay, months);
    const specialEvents = getSpecialEvents(specialDay, holidays, events || []);
    const moon = getMoonPhase(specialDay, celestial);

    // Find holiday info for special days
    const holidayInfo = holidays.find((h) => {
      if ("specialDay" in h.data.date) {
        return h.data.date.specialDay === specialDay.specialDayType;
      }
      return false;
    });

    const details = {
      monthInfo: monthData,
      holidayInfo,
      seasonInfo: seasons.find((s) =>
        s.data.months.includes(monthData.data.name)
      ),
      celestialInfo: celestial.find((c) => c.data.type === "moon"),
    };

    const holidayDetails = holidayInfo
      ? {
          name: holidayInfo.data.name,
          traditions: holidayInfo.data.traditions || [],
          culturalSignificance: holidayInfo.data.culturalSignificance,
          mechanicalEffects: holidayInfo.data.mechanicalEffects || [],
          associatedDeities: holidayInfo.data.associatedDeities || [],
        }
      : undefined;

    return {
      ...specialDay,
      weather,
      events: specialEvents,
      details,
      moon: {
        ...moon,
        phase: moon.phase,
      },
      isToday: false,
      holidayDetails,
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

  const handleSpecialDayClick = (specialDay: CalendarDayData) => {
    // Navigate to the special day's holiday page
    const holidaySlug = specialDay.holidayName
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (holidaySlug) {
      window.location.href = `/timekeeping/holidays/${holidaySlug}`;
    }
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
      if (!target?.closest(".quick-jump-container")) {
        setShowQuickJump(false);
      }
      if (!target?.closest(".month-info-container")) {
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
      {/* Calendar Header */}
      <div className="calendar-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg shadow-md">
        {/* Legend */}
        <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">
          <span>Visual Indicators</span>
          <div className="flex space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-hero-red border border-hero-red rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Current Day
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Holiday/Festival
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-600 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Selected Date
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateYear("prev")}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              title="Previous Year"
            >
              ⟪
            </button>
            <button
              onClick={() => navigateMonth("prev")}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              title="Previous Month"
            >
              ⟨
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {monthData.data.name} {displayYear}
            </h2>
            <p className="text-sm opacity-90">
              {monthData.data.alias} • {monthData.data.season}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth("next")}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              title="Next Month"
            >
              ⟩
            </button>
            <button
              onClick={() => navigateYear("next")}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              title="Next Year"
            >
              ⟫
            </button>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={goToCurrentDate}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Today ({currentDate.month}/{currentDate.day}/{currentDate.year})
          </button>
          <button
            onClick={() => setShowQuickJump(!showQuickJump)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Quick Jump
          </button>
          <button
            onClick={toggleMonthInfo}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Month Info
          </button>
        </div>

        {/* Quick Jump Menu */}
        {showQuickJump && (
          <div className="quick-jump-container absolute z-10 bg-white rounded-lg shadow-lg p-4 mt-2 grid grid-cols-3 gap-2">
            {months.map((m) => (
              <button
                key={m.data.month_number}
                onClick={() => jumpToMonth(m.data.month_number)}
                className={`p-2 rounded text-sm transition-colors ${
                  m.data.month_number === displayMonth
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {m.data.name}
              </button>
            ))}
          </div>
        )}

        {/* Month Info Panel */}
        {showMonthInfo && (
          <div className="month-info-container absolute z-10 bg-white rounded-lg shadow-lg p-4 mt-2 text-gray-800 max-w-md">
            <h4 className="font-bold text-lg mb-2">{monthData.data.name}</h4>
            <p className="text-sm mb-2">{monthData.data.Description}</p>
            <div className="text-xs space-y-1">
              <p>
                <strong>Season:</strong> {monthData.data.season}
              </p>
              <p>
                <strong>Alias:</strong> {monthData.data.alias}
              </p>
              {monthData.data.activities.length > 0 && (
                <div>
                  <strong>Activities:</strong>
                  <ul className="ml-4 list-disc">
                    {monthData.data.activities
                      .slice(0, 3)
                      .map((activity, idx) => (
                        <li key={idx}>
                          {typeof activity === "string"
                            ? activity
                            : "Complex Activity"}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        calendarDays={calendarDays}
        specialDays={specialDays}
        displayYear={displayYear}
        displayMonth={displayMonth}
        selectedDate={selectedDate}
        compact={compact}
        onDayClick={handleDayClick}
        onSpecialDayClick={handleSpecialDayClick}
        months={months}
      />

      {/* Weather Widget - shows when a day is selected */}
      {selectedDate && (
        <div className="mt-4">
          <WeatherWidget
            selectedDay={
              calendarDays.find(
                (day) =>
                  `${displayYear}-${displayMonth}-${day.day}` === selectedDate
              ) || null
            }
            currentDate={currentDate}
            months={months}
            compact={compact}
            showExtendedForecast={true}
            showHistoricalWeather={false}
          />
        </div>
      )}
    </div>
  );
}
