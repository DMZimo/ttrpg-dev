import React, { useState, useEffect } from "react";
import {
  createHarptosDate,
  getMoonPhase,
  getWeatherForDate,
  getSpecialEvents,
  getDayDetails,
  getSpecialDaysForMonth,
  HARPTOS_MONTHS,
  type HarptosDate,
} from "../../utils/fantasyCalendar";
import CalendarGrid from "./CalendarGrid";
import type { CalendarDayData } from "./types";

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
  const calendarDays: CalendarDayData[] = Array.from(
    { length: monthData.days },
    (_, i) => {
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
    }
  );

  // Generate special days for this month
  const specialDays: CalendarDayData[] = getSpecialDaysForMonth(
    displayYear,
    displayMonth
  ).map((specialDay) => {
    const weather = getWeatherForDate(specialDay);
    const events = getSpecialEvents(specialDay);
    const details = getDayDetails(specialDay);
    const moon = getMoonPhase(specialDay);

    return {
      ...specialDay,
      weather,
      events,
      details,
      moon,
      isToday: false, // Special days are never "today" in the normal sense
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
      <CalendarGrid
        calendarDays={calendarDays}
        specialDays={specialDays}
        displayYear={displayYear}
        displayMonth={displayMonth}
        selectedDate={selectedDate}
        compact={compact}
        onDayClick={handleDayClick}
        onSpecialDayClick={handleSpecialDayClick}
      />
    </div>
  );
}
