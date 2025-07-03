import React, { useState, useEffect } from "react";
import {
  createHarptosDate,
  getMoonPhase,
  getSpecialEvents,
  getSpecialDaysForMonth,
  type HarptosDate,
  type HarptosTime,
} from "../../utils/calendarUtils";
import {
  generateEnhancedWeather,
  type EnhancedWeatherData,
} from "../../utils/weatherUtils";
import CalendarGrid from "./CalendarGrid";
import WeatherWidget from "./WeatherWidget";
import CurrentDateWidget from "./CurrentDateWidget";
import { Button } from "../ui/Button";
import type {
  CalendarDayData,
  CalendarDataProps,
} from "../../types/calendarTypes";

interface CalendarProps extends CalendarDataProps {
  year: number;
  month: number;
  currentDate: HarptosDate;
  currentTime?: HarptosTime; // Optional current time for widget
  compact?: boolean;
  onDateSelect?: (date: string) => void;
  regionName?: string; // For weather data
}

export default function Calendar({
  year,
  month,
  currentDate,
  currentTime,
  months,
  holidays,
  seasons,
  celestial,
  events = [],
  compact = false,
  onDateSelect,
  regionName = "Sword Coast",
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

      // Generate enhanced weather for this day
      let enhancedWeather: EnhancedWeatherData | null = null;
      try {
        enhancedWeather = generateEnhancedWeather(dateObj, monthData);
      } catch (error) {
        console.error("Error generating enhanced weather for day", day, error);
      }

      // Convert enhanced weather to legacy format for compatibility
      const weather = enhancedWeather
        ? {
            condition: enhancedWeather.conditions.primary,
            temperature: `${enhancedWeather.temperature.current}°${
              enhancedWeather.temperature.unit === "fahrenheit" ? "F" : "C"
            }`,
            description: enhancedWeather.conditions.description,
            emoji: enhancedWeather.conditions.emoji,
          }
        : {
            condition: "Clear",
            temperature: "65°F",
            description: "Clear skies with mild temperatures",
            emoji: "☀️",
          };

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
    // Generate enhanced weather for special days
    let enhancedWeather: EnhancedWeatherData | null = null;
    try {
      enhancedWeather = generateEnhancedWeather(specialDay, monthData);
    } catch (error) {
      console.error("Error generating enhanced weather for special day", error);
    }

    // Convert enhanced weather to legacy format for compatibility
    const weather = enhancedWeather
      ? {
          condition: enhancedWeather.conditions.primary,
          temperature: `${enhancedWeather.temperature.current}°${
            enhancedWeather.temperature.unit === "fahrenheit" ? "F" : "C"
          }`,
          description: enhancedWeather.conditions.description,
          emoji: enhancedWeather.conditions.emoji,
        }
      : {
          condition: "Clear",
          temperature: "65°F",
          description: "Clear skies with mild temperatures",
          emoji: "☀️",
        };

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
    <div className="calendar-container flex gap-4">
      {/* Left Sidebar - Current Date Widget */}
      <div className="calendar-sidebar-left w-80">
        <div className="calendar-sidebar-widget sticky top-4">
          <CurrentDateWidget
            currentDate={currentDate}
            currentTime={
              currentTime || {
                hour: 12,
                minute: 0,
                period: "noon",
                formalName: "Noon",
              }
            }
            months={months}
            holidays={holidays}
            celestial={celestial}
            events={events}
          />
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="calendar-main flex-1">
        {/* Calendar Header */}
        <div className="calendar-header bg-gradient-to-r from-hero-red-dark to-hero-red text-white p-6 rounded-t-lg shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigateYear("prev")}
                ariaLabel="Previous Year"
                title="Previous Year"
                size="sm"
              >
                ⟪
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigateMonth("prev")}
                ariaLabel="Previous Month"
                title="Previous Month"
                size="sm"
              >
                ⟨
              </Button>
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
              <Button
                variant="ghost"
                onClick={() => navigateMonth("next")}
                ariaLabel="Next Month"
                title="Next Month"
                size="sm"
              >
                ⟩
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigateYear("next")}
                ariaLabel="Next Year"
                title="Next Year"
                size="sm"
              >
                ⟫
              </Button>
            </div>
          </div>
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
      </div>

      {/* Right Sidebar - Weather Widget */}
      <div className="calendar-sidebar-right w-80">
        <div className="calendar-sidebar-widget sticky top-4">
          <h3 className="font-semibold text-lg mb-2">Weather Conditions</h3>
          <WeatherWidget
            selectedDay={
              selectedDate
                ? calendarDays.find(
                    (day) =>
                      `${displayYear}-${displayMonth}-${day.day}` ===
                      selectedDate
                  ) || null
                : calendarDays.find(
                    (day) =>
                      day.year === currentDate.year &&
                      day.month === currentDate.month &&
                      day.day === currentDate.day
                  ) || calendarDays[0] // Default to current day or first day
            }
            currentDate={currentDate}
            months={months}
            compact={compact}
            showGameplayEffects={true}
            regionName={regionName}
          />
        </div>
      </div>
    </div>
  );
}
