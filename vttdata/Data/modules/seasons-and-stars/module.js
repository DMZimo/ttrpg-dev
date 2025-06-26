;{try{let e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a4e58c75-7318-47f8-9816-5e21e3fe01e3",e._sentryDebugIdIdentifier="sentry-dbid-a4e58c75-7318-47f8-9816-5e21e3fe01e3")}catch(e){}};{
    let _global =
      typeof window !== 'undefined' ?
        window :
        typeof global !== 'undefined' ?
          global :
          typeof globalThis !== 'undefined' ?
            globalThis :
            typeof self !== 'undefined' ?
              self :
              {};

    _global.SENTRY_RELEASE={id:"seasons-and-stars@0.4.1"};}

/**
 * Centralized logging system for Seasons & Stars module
 * Provides debug mode toggle and user-friendly error notifications
 */
/* eslint-disable no-console */
class Logger {
    /**
     * Log debug messages (only shown when debug mode is enabled)
     */
    static debug(message, data) {
        if (this.isDebugEnabled()) {
            console.log(`[S&S] ${message}`, data || '');
        }
    }
    /**
     * Log informational messages
     */
    static info(message, data) {
        console.log(`[S&S] ${message}`, data || '');
    }
    /**
     * Log warning messages
     */
    static warn(message, data) {
        console.warn(`[S&S WARNING] ${message}`, data || '');
        if (this.shouldShowUserNotifications()) {
            ui?.notifications?.warn(`Seasons & Stars: ${message}`);
        }
    }
    /**
     * Log error messages with user notification
     */
    static error(message, error) {
        console.error(`[S&S ERROR] ${message}`, error || '');
        if (this.shouldShowUserNotifications()) {
            ui?.notifications?.error(`Seasons & Stars: ${message}`);
        }
    }
    /**
     * Log critical errors that require immediate user attention
     */
    static critical(message, error) {
        console.error(`[S&S CRITICAL] ${message}`, error || '');
        // Always show critical errors regardless of settings
        ui?.notifications?.error(`Seasons & Stars: ${message}`);
    }
    /**
     * Check if debug mode is enabled
     */
    static isDebugEnabled() {
        try {
            return game.settings?.get(this.MODULE_ID, 'debugMode') === true;
        }
        catch {
            return false; // Fallback if settings not available
        }
    }
    /**
     * Check if user notifications should be shown
     */
    static shouldShowUserNotifications() {
        try {
            return game.settings?.get(this.MODULE_ID, 'showNotifications') !== false;
        }
        catch {
            return true; // Default to showing notifications
        }
    }
    /**
     * Performance timing utility
     */
    static time(label) {
        if (this.isDebugEnabled()) {
            console.time(`[S&S] ${label}`);
        }
    }
    /**
     * End performance timing
     */
    static timeEnd(label) {
        if (this.isDebugEnabled()) {
            console.timeEnd(`[S&S] ${label}`);
        }
    }
    /**
     * Log API calls for debugging integration issues
     */
    static api(method, params, result) {
        if (this.isDebugEnabled()) {
            console.group(`[S&S API] ${method}`);
            if (params)
                console.log('Parameters:', params);
            if (result !== undefined)
                console.log('Result:', result);
            console.groupEnd();
        }
    }
    /**
     * Log module integration events
     */
    static integration(event, data) {
        if (this.isDebugEnabled()) {
            console.log(`[S&S Integration] ${event}`, data || '');
        }
    }
}
Logger.MODULE_ID = 'seasons-and-stars';

/**
 * Calendar Time Utilities
 *
 * Utility functions for calendar-specific time calculations that replace
 * hardcoded assumptions throughout the codebase.
 *
 * Eliminates hardcoded values like:
 * - 86400 (seconds per day)
 * - 24 * 60 * 60 (seconds per day)
 * - 365 (days per year)
 * - 12 (months per year)
 * - 7 (days per week)
 *
 * These functions work with any calendar system by using the calendar's
 * actual time configuration instead of Earth-based assumptions.
 */
class CalendarTimeUtils {
    /**
     * Get seconds per day for a calendar
     * Replaces hardcoded 86400 or 24 * 60 * 60
     */
    static getSecondsPerDay(calendar) {
        return calendar.time.hoursInDay * calendar.time.minutesInHour * calendar.time.secondsInMinute;
    }
    /**
     * Get seconds per hour for a calendar
     * Replaces hardcoded 3600 or 60 * 60
     */
    static getSecondsPerHour(calendar) {
        return calendar.time.minutesInHour * calendar.time.secondsInMinute;
    }
    /**
     * Get days per week for a calendar
     * Replaces hardcoded 7
     */
    static getDaysPerWeek(calendar) {
        return calendar.weekdays.length;
    }
    /**
     * Get months per year for a calendar
     * Replaces hardcoded 12
     */
    static getMonthsPerYear(calendar) {
        return calendar.months.length;
    }
    /**
     * Convert days to seconds using calendar-specific day length
     * Replaces hardcoded days * 86400
     */
    static daysToSeconds(days, calendar) {
        return days * this.getSecondsPerDay(calendar);
    }
    /**
     * Convert weeks to days using calendar-specific week length
     * Replaces hardcoded weeks * 7
     */
    static weeksToDays(weeks, calendar) {
        return weeks * this.getDaysPerWeek(calendar);
    }
    /**
     * Convert hours to seconds using calendar-specific hour length
     * Replaces hardcoded hours * 3600
     */
    static hoursToSeconds(hours, calendar) {
        return hours * this.getSecondsPerHour(calendar);
    }
    /**
     * Convert weeks to seconds using calendar-specific time units
     * Combines week length and day length calculations
     */
    static weeksToSeconds(weeks, calendar) {
        const days = this.weeksToDays(weeks, calendar);
        return this.daysToSeconds(days, calendar);
    }
    /**
     * Convert seconds to world time components (days, hours, minutes, seconds)
     * Uses calendar-specific time units for accurate breakdown
     */
    static secondsToWorldTimeUnits(totalSeconds, calendar) {
        const secondsPerDay = this.getSecondsPerDay(calendar);
        const secondsPerHour = this.getSecondsPerHour(calendar);
        const secondsPerMinute = calendar.time.secondsInMinute;
        const days = Math.floor(totalSeconds / secondsPerDay);
        let remainingSeconds = totalSeconds % secondsPerDay;
        const hours = Math.floor(remainingSeconds / secondsPerHour);
        remainingSeconds = remainingSeconds % secondsPerHour;
        const minutes = Math.floor(remainingSeconds / secondsPerMinute);
        const seconds = remainingSeconds % secondsPerMinute;
        return { days, hours, minutes, seconds };
    }
    // === DATE COMPARISON UTILITIES ===
    /**
     * Compare two dates chronologically
     * Returns: -1 if dateA < dateB, 0 if equal, 1 if dateA > dateB
     * Replaces repeated date comparison patterns throughout codebase
     */
    static compareDates(dateA, dateB) {
        if (dateA.year !== dateB.year)
            return dateA.year - dateB.year;
        if (dateA.month !== dateB.month)
            return dateA.month - dateB.month;
        return dateA.day - dateB.day;
    }
    /**
     * Check if two dates are equal (ignores weekday and time)
     * Replaces repeated date equality checks
     */
    static isDateEqual(dateA, dateB) {
        return this.compareDates(dateA, dateB) === 0;
    }
    /**
     * Check if dateA is before dateB chronologically
     * Replaces repeated date ordering checks
     */
    static isDateBefore(dateA, dateB) {
        return this.compareDates(dateA, dateB) < 0;
    }
    /**
     * Check if dateA is after dateB chronologically
     * Replaces repeated date ordering checks
     */
    static isDateAfter(dateA, dateB) {
        return this.compareDates(dateA, dateB) > 0;
    }
    // === DATE ARITHMETIC UTILITIES ===
    /**
     * Normalize month values with year overflow/underflow handling
     * Replaces repeated month normalization patterns
     */
    static normalizeMonth(month, year, calendar) {
        const monthsPerYear = this.getMonthsPerYear(calendar);
        let normalizedMonth = month;
        let normalizedYear = year;
        // Handle month overflow
        while (normalizedMonth > monthsPerYear) {
            normalizedMonth -= monthsPerYear;
            normalizedYear++;
        }
        // Handle month underflow
        while (normalizedMonth < 1) {
            normalizedMonth += monthsPerYear;
            normalizedYear--;
        }
        return { month: normalizedMonth, year: normalizedYear };
    }
    /**
     * Add months to a date with proper year overflow and day clamping
     * Replaces repeated month arithmetic patterns
     */
    static addMonthsToDate(date, months, calendar) {
        // Calculate new month and year
        const { month: newMonth, year: newYear } = this.normalizeMonth(date.month + months, date.year, calendar);
        // Handle day overflow (e.g., Jan 31 + 1 month = Feb 28/29)
        const maxDayInNewMonth = calendar.months[newMonth - 1]?.days || 30; // Fallback to 30
        const clampedDay = Math.min(date.day, maxDayInNewMonth);
        return {
            year: newYear,
            month: newMonth,
            day: clampedDay,
            weekday: date.weekday, // Preserve weekday (would need calendar engine for accurate calculation)
            time: date.time,
        };
    }
    /**
     * Normalize weekday values using calendar-specific week length
     * Replaces repeated weekday normalization patterns
     */
    static normalizeWeekday(weekday, calendar) {
        const weekLength = this.getDaysPerWeek(calendar);
        let normalized = weekday % weekLength;
        // Handle negative weekdays
        if (normalized < 0) {
            normalized += weekLength;
        }
        return normalized;
    }
    // === FORMATTING UTILITIES ===
    /**
     * Add ordinal suffix to numbers (1st, 2nd, 3rd, 4th, etc.)
     * Replaces repeated ordinal formatting patterns
     */
    static addOrdinalSuffix(num) {
        const lastDigit = num % 10;
        const lastTwoDigits = num % 100;
        // Special cases for 11th, 12th, 13th (always 'th')
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${num}th`;
        }
        // Regular ordinal rules
        switch (lastDigit) {
            case 1:
                return `${num}st`;
            case 2:
                return `${num}nd`;
            case 3:
                return `${num}rd`;
            default:
                return `${num}th`;
        }
    }
    /**
     * Format time component with zero-padding
     * Replaces repeated time formatting patterns
     */
    static formatTimeComponent(value, padLength = 2) {
        return value.toString().padStart(padLength, '0');
    }
    // === CALENDAR-SPECIFIC YEAR OPERATIONS ===
    /**
     * Calculate approximate year length by summing month days
     * Replaces hardcoded 365 day assumptions
     */
    static getApproximateYearLength(calendar) {
        return calendar.months.reduce((sum, month) => sum + month.days, 0);
    }
}

/**
 * Calendar date representation and formatting for Seasons & Stars
 */
class CalendarDate {
    constructor(data, calendar) {
        this.year = data.year;
        this.month = data.month;
        this.day = data.day;
        this.weekday = data.weekday;
        this.intercalary = data.intercalary;
        this.time = data.time;
        this.calendar = calendar;
    }
    /**
     * Format the date for display
     */
    format(options = {}) {
        const { includeTime = false, includeWeekday = true, includeYear = true, format = 'long', } = options;
        const parts = [];
        // Add weekday if requested and not an intercalary day
        if (includeWeekday && !this.intercalary) {
            const weekdayName = this.getWeekdayName(format);
            parts.push(weekdayName);
        }
        // Handle intercalary days
        if (this.intercalary) {
            parts.push(this.intercalary);
        }
        else {
            // Regular date formatting
            const dayStr = this.getDayString(format);
            const monthStr = this.getMonthName(format);
            if (format === 'numeric') {
                parts.push(`${this.month}/${this.day}`);
            }
            else {
                parts.push(`${dayStr} ${monthStr}`);
            }
        }
        // Add year if requested
        if (includeYear) {
            const yearStr = this.getYearString();
            parts.push(yearStr);
        }
        // Add time if requested
        if (includeTime && this.time) {
            const timeStr = this.getTimeString();
            parts.push(timeStr);
        }
        return parts.join(', ');
    }
    /**
     * Get a short format string (for UI display)
     */
    toShortString() {
        return this.format({
            includeTime: false,
            includeWeekday: false,
            format: 'short',
        });
    }
    /**
     * Get a full format string (for detailed display)
     */
    toLongString() {
        return this.format({
            includeTime: true,
            includeWeekday: true,
            includeYear: true,
            format: 'long',
        });
    }
    /**
     * Get just the date portion (no time)
     */
    toDateString() {
        return this.format({
            includeTime: false,
            includeWeekday: true,
            includeYear: true,
            format: 'long',
        });
    }
    /**
     * Get just the time portion
     */
    toTimeString() {
        if (!this.time)
            return '';
        return this.getTimeString();
    }
    /**
     * Get the weekday name
     */
    getWeekdayName(format) {
        const weekday = this.calendar.weekdays[this.weekday];
        if (!weekday)
            return 'Unknown';
        if (format === 'short' && weekday.abbreviation) {
            return weekday.abbreviation;
        }
        return weekday.name;
    }
    /**
     * Get the month name
     */
    getMonthName(format) {
        const month = this.calendar.months[this.month - 1];
        if (!month)
            return 'Unknown';
        if (format === 'short' && month.abbreviation) {
            return month.abbreviation;
        }
        return month.name;
    }
    /**
     * Get the day string with appropriate suffix
     */
    getDayString(format) {
        if (format === 'numeric') {
            return this.day.toString();
        }
        // Add ordinal suffix for long format
        if (format === 'long') {
            return this.addOrdinalSuffix(this.day);
        }
        return this.day.toString();
    }
    /**
     * Get the year string with prefix/suffix
     */
    getYearString() {
        const { prefix, suffix } = this.calendar.year;
        return `${prefix}${this.year}${suffix}`.trim();
    }
    /**
     * Get the time string
     */
    getTimeString() {
        if (!this.time)
            return '';
        const { hour, minute, second } = this.time;
        // Use 24-hour format by default
        const hourStr = CalendarTimeUtils.formatTimeComponent(hour);
        const minuteStr = CalendarTimeUtils.formatTimeComponent(minute);
        const secondStr = CalendarTimeUtils.formatTimeComponent(second);
        return `${hourStr}:${minuteStr}:${secondStr}`;
    }
    /**
     * Add ordinal suffix to a number (1st, 2nd, 3rd, etc.)
     */
    addOrdinalSuffix(num) {
        return CalendarTimeUtils.addOrdinalSuffix(num);
    }
    /**
     * Clone this date with optional modifications
     */
    clone(modifications = {}) {
        return new CalendarDate({
            year: modifications.year ?? this.year,
            month: modifications.month ?? this.month,
            day: modifications.day ?? this.day,
            weekday: modifications.weekday ?? this.weekday,
            intercalary: modifications.intercalary ?? this.intercalary,
            time: modifications.time ?? (this.time ? { ...this.time } : undefined),
        }, this.calendar);
    }
    /**
     * Compare this date with another date
     */
    compareTo(other) {
        if (this.year !== other.year)
            return this.year - other.year;
        if (this.month !== other.month)
            return this.month - other.month;
        if (this.day !== other.day)
            return this.day - other.day;
        // Compare time if both have it
        if (this.time && other.time) {
            if (this.time.hour !== other.time.hour)
                return this.time.hour - other.time.hour;
            if (this.time.minute !== other.time.minute)
                return this.time.minute - other.time.minute;
            if (this.time.second !== other.time.second)
                return this.time.second - other.time.second;
        }
        return 0;
    }
    /**
     * Check if this date is equal to another date
     */
    equals(other) {
        return this.compareTo(other) === 0;
    }
    /**
     * Check if this date is before another date
     */
    isBefore(other) {
        return this.compareTo(other) < 0;
    }
    /**
     * Check if this date is after another date
     */
    isAfter(other) {
        return this.compareTo(other) > 0;
    }
    /**
     * Get a plain object representation
     */
    toObject() {
        return {
            year: this.year,
            month: this.month,
            day: this.day,
            weekday: this.weekday,
            intercalary: this.intercalary,
            time: this.time ? { ...this.time } : undefined,
        };
    }
    /**
     * Create a CalendarDate from a plain object
     */
    static fromObject(data, calendar) {
        return new CalendarDate(data, calendar);
    }
}

/**
 * System Compatibility Manager for Seasons & Stars
 *
 * Provides extensible compatibility layer for different game systems that may
 * calculate dates/weekdays differently than the standard fantasy calendar math.
 *
 * Supports both calendar-defined compatibility (in JSON) and hook-based runtime
 * registration for external modules.
 */
/**
 * Manages system compatibility adjustments for calendar calculations
 */
class CompatibilityManager {
    constructor() {
        this.hookRegistry = new Map();
        this.timeSourceRegistry = new Map();
        this.initializeHookSystem();
        this.initializeGenericHooks();
        this.initializeSystemSpecificHooks();
        this.initializeSystemDetection();
    }
    /**
     * Initialize hook system for external module registration
     */
    initializeHookSystem() {
        // Create registry interface for hook callbacks
        const registry = {
            register: (systemId, calendarId, adjustment) => {
                const key = `${systemId}:${calendarId}`;
                this.hookRegistry.set(key, adjustment);
                Logger.debug(`Registered compatibility: ${systemId} + ${calendarId}`, adjustment);
            },
            get: (systemId, calendarId) => {
                const key = `${systemId}:${calendarId}`;
                return this.hookRegistry.get(key) || null;
            },
            has: (systemId, calendarId) => {
                const key = `${systemId}:${calendarId}`;
                return this.hookRegistry.has(key);
            },
            list: () => {
                const result = [];
                for (const [key, adjustment] of this.hookRegistry.entries()) {
                    const [systemId, calendarId] = key.split(':');
                    result.push({ systemId, calendarId, adjustment });
                }
                return result;
            },
        };
        // Emit hook to allow external modules to register compatibility
        Hooks.callAll('seasons-stars:registerCompatibility', registry);
    }
    /**
     * Initialize generic hooks for backward compatibility
     */
    initializeGenericHooks() {
        // Reserved for future generic hooks if needed
    }
    /**
     * Initialize system-specific hooks for compatibility registration
     */
    initializeSystemSpecificHooks() {
        // System-specific hooks are now minimal since we use direct registration
        // Only keeping compatibility hooks for potential future use
    }
    /**
     * Initialize system detection to emit appropriate system-specific hooks
     */
    initializeSystemDetection() {
        // Wait for Foundry to be ready so game.system is available
        Hooks.once('ready', () => {
            const currentSystem = game.system?.id;
            if (currentSystem) {
                Logger.debug(`Detected system: ${currentSystem}, triggering system-specific hooks`);
                // Trigger system-specific hook initialization for detected system
                // Pass the compatibility manager instance for direct registration
                Hooks.callAll(`seasons-stars:${currentSystem}:systemDetected`, this);
            }
        });
    }
    /**
     * Get compatibility adjustment for current system and calendar
     */
    getCompatibilityAdjustment(calendar, systemId) {
        const currentSystemId = systemId || game.system?.id;
        if (!currentSystemId || !calendar)
            return null;
        // 1. Check calendar-defined compatibility first
        const calendarCompat = calendar.compatibility?.[currentSystemId];
        if (calendarCompat) {
            return {
                ...calendarCompat,
                provider: 'calendar-defined',
            };
        }
        // 2. Check hook-registered compatibility
        const key = `${currentSystemId}:${calendar.id}`;
        const hookCompat = this.hookRegistry.get(key);
        if (hookCompat) {
            return {
                ...hookCompat,
                provider: hookCompat.provider || 'hook-registered',
            };
        }
        return null;
    }
    /**
     * Apply weekday compatibility adjustment
     */
    applyWeekdayAdjustment(weekday, calendar, systemId) {
        const adjustment = this.getCompatibilityAdjustment(calendar, systemId);
        if (adjustment?.weekdayOffset) {
            const weekdayCount = calendar.weekdays?.length || 7;
            let adjustedWeekday = (weekday + adjustment.weekdayOffset) % weekdayCount;
            // Handle negative results
            if (adjustedWeekday < 0) {
                adjustedWeekday += weekdayCount;
            }
            return adjustedWeekday;
        }
        return weekday;
    }
    /**
     * Apply date formatting adjustments
     */
    applyDateFormatAdjustment(date, calendar, systemId) {
        const adjustment = this.getCompatibilityAdjustment(calendar, systemId);
        if (adjustment?.dateFormatting) {
            const formatting = adjustment.dateFormatting;
            return {
                ...date,
                month: formatting.monthOffset ? date.month + formatting.monthOffset : date.month,
                day: formatting.dayOffset ? date.day + formatting.dayOffset : date.day,
            };
        }
        return date;
    }
    /**
     * Get debug information about active compatibility adjustments
     */
    getDebugInfo(calendar, systemId) {
        const currentSystemId = systemId || game.system?.id;
        const adjustment = this.getCompatibilityAdjustment(calendar, currentSystemId);
        if (!adjustment) {
            return `No compatibility adjustments for ${currentSystemId} + ${calendar?.id || 'unknown'}`;
        }
        const parts = [];
        if (adjustment.weekdayOffset) {
            parts.push(`weekday offset: +${adjustment.weekdayOffset}`);
        }
        if (adjustment.dateFormatting) {
            parts.push('date formatting adjustments');
        }
        return `${currentSystemId} + ${calendar.id}: ${parts.join(', ')} (${adjustment.provider})`;
    }
    /**
     * Register a time source for a specific system (direct registration)
     */
    registerTimeSource(systemId, sourceFunction) {
        this.timeSourceRegistry.set(systemId, sourceFunction);
        Logger.debug(`Registered time source for system: ${systemId}`);
    }
    /**
     * Get external time source value by system ID
     */
    getExternalTimeSource(systemId) {
        const timeSourceFunction = this.timeSourceRegistry.get(systemId);
        if (timeSourceFunction) {
            try {
                return timeSourceFunction();
            }
            catch (error) {
                Logger.warn(`Error getting time from source ${systemId}:`, error);
                return null;
            }
        }
        return null;
    }
    /**
     * Get all available external time sources
     */
    getAvailableTimeSources() {
        return Array.from(this.timeSourceRegistry.keys());
    }
    /**
     * List all available compatibility adjustments for debugging
     */
    debugListAll() {
        Logger.debug('All registered compatibility adjustments:');
        // Hook-registered compatibility
        for (const [key, adjustment] of this.hookRegistry.entries()) {
            Logger.debug(`  Hook: ${key}`, adjustment);
        }
        // Registered time sources
        Logger.debug('Registered time sources:');
        for (const sourceId of this.timeSourceRegistry.keys()) {
            Logger.debug(`  Time source: ${sourceId}`);
        }
        // Note: Calendar-defined compatibility is checked dynamically per calendar
        Logger.debug('  Calendar-defined compatibility is checked per calendar load');
    }
}
// Global instance
const compatibilityManager = new CompatibilityManager();

/**
 * Core calendar calculation engine for Seasons & Stars
 */
class CalendarEngine {
    constructor(calendar) {
        this.calculationCache = new Map();
        this.calendar = calendar;
        this.precomputeYearData();
    }
    /**
     * Convert Foundry world time (seconds) to calendar date
     * Now supports both epoch-based and real-time-based interpretation
     */
    worldTimeToDate(worldTime) {
        const adjustedWorldTime = this.adjustWorldTimeForInterpretation(worldTime);
        const totalSeconds = Math.floor(adjustedWorldTime);
        const secondsPerDay = CalendarTimeUtils.getSecondsPerDay(this.calendar);
        const totalDays = Math.floor(totalSeconds / secondsPerDay);
        let secondsInDay = totalSeconds % secondsPerDay;
        // Handle negative seconds in day (can happen with real-time interpretation)
        if (secondsInDay < 0) {
            secondsInDay += secondsPerDay;
        }
        // Calculate time of day
        const secondsPerHour = CalendarTimeUtils.getSecondsPerHour(this.calendar);
        const hour = Math.floor(secondsInDay / secondsPerHour);
        const minute = Math.floor((secondsInDay % secondsPerHour) / this.calendar.time.secondsInMinute);
        const second = secondsInDay % this.calendar.time.secondsInMinute;
        // Convert days to calendar date
        const dateInfo = this.daysToDate(totalDays);
        const dateData = {
            year: dateInfo.year,
            month: dateInfo.month,
            day: dateInfo.day,
            weekday: dateInfo.weekday,
            intercalary: dateInfo.intercalary,
            time: { hour, minute, second },
        };
        return new CalendarDate(dateData, this.calendar);
    }
    /**
     * Convert calendar date to Foundry world time (seconds)
     * Handles both interpretation modes
     */
    dateToWorldTime(date) {
        const totalDays = this.dateToDays(date);
        const secondsPerDay = CalendarTimeUtils.getSecondsPerDay(this.calendar);
        let totalSeconds = totalDays * secondsPerDay;
        // Add time of day if provided
        if (date.time) {
            const secondsPerHour = CalendarTimeUtils.getSecondsPerHour(this.calendar);
            totalSeconds += date.time.hour * secondsPerHour;
            totalSeconds += date.time.minute * this.calendar.time.secondsInMinute;
            totalSeconds += date.time.second;
        }
        return this.adjustWorldTimeFromInterpretation(totalSeconds);
    }
    /**
     * Add days to a calendar date
     */
    addDays(date, days) {
        const totalDays = this.dateToDays(date) + days;
        const newDate = this.daysToDate(totalDays);
        // Preserve time if it exists
        if (date.time) {
            newDate.time = { ...date.time };
        }
        return newDate;
    }
    /**
     * Add months to a calendar date
     */
    addMonths(date, months) {
        const { month: targetMonth, year: targetYear } = CalendarTimeUtils.normalizeMonth(date.month + months, date.year, this.calendar);
        // Adjust day if target month is shorter
        const targetMonthDays = this.getMonthLength(targetMonth, targetYear);
        const targetDay = Math.min(date.day, targetMonthDays);
        const dateData = {
            year: targetYear,
            month: targetMonth,
            day: targetDay,
            weekday: this.calculateWeekday(targetYear, targetMonth, targetDay),
            time: date.time ? { ...date.time } : undefined,
        };
        return new CalendarDate(dateData, this.calendar);
    }
    /**
     * Add years to a calendar date
     */
    addYears(date, years) {
        const targetYear = date.year + years;
        // Handle leap year day adjustments
        const targetMonthDays = this.getMonthLength(date.month, targetYear);
        const targetDay = Math.min(date.day, targetMonthDays);
        const dateData = {
            year: targetYear,
            month: date.month,
            day: targetDay,
            weekday: this.calculateWeekday(targetYear, date.month, targetDay),
            time: date.time ? { ...date.time } : undefined,
        };
        return new CalendarDate(dateData, this.calendar);
    }
    /**
     * Add hours to a calendar date
     */
    addHours(date, hours) {
        const currentTime = date.time || { hour: 0, minute: 0, second: 0 };
        const totalHours = currentTime.hour + hours;
        const hoursPerDay = this.calendar.time.hoursInDay;
        let extraDays = Math.floor(totalHours / hoursPerDay);
        let newHour = totalHours % hoursPerDay;
        // Handle negative hours
        if (newHour < 0) {
            newHour += hoursPerDay;
            extraDays -= 1;
        }
        const baseData = {
            year: date.year,
            month: date.month,
            day: date.day,
            weekday: date.weekday,
            intercalary: date.intercalary,
            time: {
                hour: newHour,
                minute: currentTime.minute,
                second: currentTime.second,
            },
        };
        let result = new CalendarDate(baseData, this.calendar);
        // Add extra days if needed
        if (extraDays !== 0) {
            result = this.addDays(result, extraDays);
        }
        return result;
    }
    /**
     * Add minutes to a calendar date
     */
    addMinutes(date, minutes) {
        const currentTime = date.time || { hour: 0, minute: 0, second: 0 };
        const totalMinutes = currentTime.minute + minutes;
        const minutesPerHour = this.calendar.time.minutesInHour;
        let extraHours = Math.floor(totalMinutes / minutesPerHour);
        let newMinute = totalMinutes % minutesPerHour;
        // Handle negative minutes
        if (newMinute < 0) {
            newMinute += minutesPerHour;
            extraHours -= 1;
        }
        const baseData = {
            year: date.year,
            month: date.month,
            day: date.day,
            weekday: date.weekday,
            intercalary: date.intercalary,
            time: {
                hour: currentTime.hour,
                minute: newMinute,
                second: currentTime.second,
            },
        };
        let result = new CalendarDate(baseData, this.calendar);
        // Add extra hours if needed
        if (extraHours !== 0) {
            result = this.addHours(result, extraHours);
        }
        return result;
    }
    /**
     * Adjust worldTime based on calendar's interpretation mode
     */
    adjustWorldTimeForInterpretation(worldTime) {
        const worldTimeConfig = this.calendar.worldTime;
        if (!worldTimeConfig || worldTimeConfig.interpretation === 'epoch-based') {
            // Default behavior: worldTime represents seconds since calendar epoch
            return worldTime;
        }
        if (worldTimeConfig.interpretation === 'real-time-based') {
            // Real-time mode: worldTime=0 should map to currentYear, not epochYear
            const yearDifference = worldTimeConfig.currentYear - worldTimeConfig.epochYear;
            // Use accurate year lengths instead of 365.25 average
            let epochOffset = 0;
            const secondsPerDay = this.calendar.time.hoursInDay *
                this.calendar.time.minutesInHour *
                this.calendar.time.secondsInMinute;
            if (yearDifference > 0) {
                // Add up actual year lengths from epoch to current year
                for (let year = worldTimeConfig.epochYear; year < worldTimeConfig.currentYear; year++) {
                    const yearLengthDays = this.getYearLength(year);
                    epochOffset += yearLengthDays * secondsPerDay;
                }
            }
            else if (yearDifference < 0) {
                // Subtract actual year lengths from current year to epoch
                for (let year = worldTimeConfig.currentYear; year < worldTimeConfig.epochYear; year++) {
                    const yearLengthDays = this.getYearLength(year);
                    epochOffset -= yearLengthDays * secondsPerDay;
                }
            }
            return worldTime + epochOffset;
        }
        return worldTime;
    }
    /**
     * Convert internal seconds back to worldTime based on interpretation mode
     */
    adjustWorldTimeFromInterpretation(internalSeconds) {
        const worldTimeConfig = this.calendar.worldTime;
        if (!worldTimeConfig || worldTimeConfig.interpretation === 'epoch-based') {
            return internalSeconds;
        }
        if (worldTimeConfig.interpretation === 'real-time-based') {
            const yearDifference = worldTimeConfig.currentYear - worldTimeConfig.epochYear;
            // Use accurate year lengths instead of 365.25 average
            let epochOffset = 0;
            const secondsPerDay = this.calendar.time.hoursInDay *
                this.calendar.time.minutesInHour *
                this.calendar.time.secondsInMinute;
            if (yearDifference > 0) {
                // Add up actual year lengths from epoch to current year
                for (let year = worldTimeConfig.epochYear; year < worldTimeConfig.currentYear; year++) {
                    const yearLengthDays = this.getYearLength(year);
                    epochOffset += yearLengthDays * secondsPerDay;
                }
            }
            else if (yearDifference < 0) {
                // Subtract actual year lengths from current year to epoch
                for (let year = worldTimeConfig.currentYear; year < worldTimeConfig.epochYear; year++) {
                    const yearLengthDays = this.getYearLength(year);
                    epochOffset -= yearLengthDays * secondsPerDay;
                }
            }
            return internalSeconds - epochOffset;
        }
        return internalSeconds;
    }
    /**
     * Convert days since epoch to calendar date
     */
    daysToDate(totalDays) {
        let year = this.calendar.year.epoch;
        let remainingDays = totalDays;
        // Find the correct year
        while (remainingDays >= this.getYearLength(year)) {
            remainingDays -= this.getYearLength(year);
            year++;
        }
        // Handle negative days (before epoch)
        while (remainingDays < 0) {
            year--;
            remainingDays += this.getYearLength(year);
        }
        // Find month and day within the year
        let month = 1;
        const monthLengths = this.getMonthLengths(year);
        const intercalaryDays = this.getIntercalaryDays(year);
        for (month = 1; month <= this.calendar.months.length; month++) {
            const monthLength = monthLengths[month - 1];
            if (remainingDays < monthLength) {
                break;
            }
            remainingDays -= monthLength;
            // Check for intercalary days after this month
            const intercalaryAfterMonth = intercalaryDays.filter(i => i.after === this.calendar.months[month - 1].name);
            for (const intercalary of intercalaryAfterMonth) {
                const intercalaryDayCount = intercalary.days || 1;
                if (remainingDays < intercalaryDayCount) {
                    // We're within this intercalary period - return intercalary date with no weekday calculation
                    const dateData = {
                        year,
                        month,
                        day: remainingDays + 1, // Intercalary day index (1-based)
                        weekday: 0, // Placeholder - intercalary days don't have weekdays
                        intercalary: intercalary.name,
                    };
                    return new CalendarDate(dateData, this.calendar);
                }
                remainingDays -= intercalaryDayCount;
            }
        }
        const day = remainingDays + 1;
        const dateData = {
            year,
            month,
            day,
            weekday: this.calculateWeekday(year, month, day),
        };
        return new CalendarDate(dateData, this.calendar);
    }
    /**
     * Convert calendar date to days since epoch
     */
    dateToDays(date) {
        let totalDays = 0;
        // Handle years before or after epoch
        if (date.year >= this.calendar.year.epoch) {
            // Add days for complete years after epoch
            for (let year = this.calendar.year.epoch; year < date.year; year++) {
                totalDays += this.getYearLength(year);
            }
        }
        else {
            // Subtract days for complete years before epoch
            for (let year = date.year; year < this.calendar.year.epoch; year++) {
                totalDays -= this.getYearLength(year);
            }
        }
        // Add days for complete months in the target year
        const monthLengths = this.getMonthLengths(date.year);
        const intercalaryDays = this.getIntercalaryDays(date.year);
        for (let month = 1; month < date.month; month++) {
            totalDays += monthLengths[month - 1];
            // Add intercalary days after this month
            const intercalaryAfterMonth = intercalaryDays.filter(i => i.after === this.calendar.months[month - 1].name);
            // Sum up all days from intercalary periods (using days field, defaulting to 1)
            totalDays += intercalaryAfterMonth.reduce((sum, intercalary) => {
                return sum + (intercalary.days || 1);
            }, 0);
        }
        // Handle intercalary vs regular days
        if (date.intercalary) {
            // For intercalary dates, add all days of the target month, then the intercalary day position
            totalDays += monthLengths[date.month - 1]; // All days of the month
            totalDays += date.day - 1; // Position within the intercalary period (0-based)
        }
        else {
            // For regular dates, add days within the target month
            totalDays += date.day - 1;
        }
        return totalDays;
    }
    /**
     * Calculate weekday for a given date
     */
    calculateWeekday(year, month, day) {
        const tempDateData = { year, month, day, weekday: 0 };
        const tempDate = new CalendarDate(tempDateData, this.calendar);
        const weekdayContributingDays = this.dateToWeekdayDays(tempDate);
        const weekdayCount = this.calendar.weekdays.length;
        const epochWeekday = this.calendar.year.startDay;
        // Calculate weekday: (days since epoch + weekday of epoch date) % weekday count
        // Handle negative results for dates before epoch
        let weekday = (weekdayContributingDays + epochWeekday) % weekdayCount;
        if (weekday < 0) {
            weekday += weekdayCount;
        }
        // Apply system compatibility adjustments
        weekday = compatibilityManager.applyWeekdayAdjustment(weekday, this.calendar);
        return weekday;
    }
    /**
     * Convert calendar date to days since epoch, counting only weekday-contributing days
     */
    dateToWeekdayDays(date) {
        let totalDays = 0;
        // Handle years before or after epoch
        if (date.year >= this.calendar.year.epoch) {
            // Add days for complete years after epoch
            for (let year = this.calendar.year.epoch; year < date.year; year++) {
                totalDays += this.getYearWeekdayDays(year);
            }
        }
        else {
            // Subtract days for complete years before epoch
            for (let year = date.year; year < this.calendar.year.epoch; year++) {
                totalDays -= this.getYearWeekdayDays(year);
            }
        }
        // Add days for complete months in the target year
        const monthLengths = this.getMonthLengths(date.year);
        const intercalaryDays = this.getIntercalaryDays(date.year);
        for (let month = 1; month < date.month; month++) {
            totalDays += monthLengths[month - 1];
            // Add only weekday-contributing intercalary days after this month
            const intercalaryAfterMonth = intercalaryDays.filter(i => i.after === this.calendar.months[month - 1].name);
            intercalaryAfterMonth.forEach(intercalary => {
                const countsForWeekdays = intercalary.countsForWeekdays ?? true;
                if (countsForWeekdays) {
                    totalDays += intercalary.days || 1;
                }
            });
        }
        // Add days in the target month
        totalDays += date.day - 1;
        // Handle intercalary days - they don't contribute to weekday counts
        if (date.intercalary) ;
        return totalDays;
    }
    /**
     * Get the number of weekday-contributing days in a year
     */
    getYearWeekdayDays(year) {
        const monthLengths = this.getMonthLengths(year);
        const intercalaryDays = this.getIntercalaryDays(year);
        let totalDays = monthLengths.reduce((sum, days) => sum + days, 0);
        // Add only weekday-contributing intercalary days
        intercalaryDays.forEach(intercalary => {
            const countsForWeekdays = intercalary.countsForWeekdays ?? true;
            if (countsForWeekdays) {
                totalDays += intercalary.days || 1;
            }
        });
        return totalDays;
    }
    /**
     * Get the length of a specific year in days
     */
    getYearLength(year) {
        const monthLengths = this.getMonthLengths(year);
        const baseLength = monthLengths.reduce((sum, length) => sum + length, 0);
        const intercalaryDays = this.getIntercalaryDays(year);
        // Sum up all intercalary days, using the days field (defaulting to 1 for backward compatibility)
        const totalIntercalaryDays = intercalaryDays.reduce((sum, intercalary) => {
            return sum + (intercalary.days || 1);
        }, 0);
        return baseLength + totalIntercalaryDays;
    }
    /**
     * Get month lengths for a specific year (accounting for leap years)
     */
    getMonthLengths(year) {
        const monthLengths = this.calendar.months.map(month => month.days);
        // Add leap year days if applicable
        if (this.isLeapYear(year) && this.calendar.leapYear.month) {
            const leapMonthIndex = this.calendar.months.findIndex(month => month.name === this.calendar.leapYear.month);
            if (leapMonthIndex >= 0) {
                monthLengths[leapMonthIndex] += this.calendar.leapYear.extraDays || 1;
            }
        }
        return monthLengths;
    }
    /**
     * Get length of a specific month in a specific year
     */
    getMonthLength(month, year) {
        const monthLengths = this.getMonthLengths(year);
        return monthLengths[month - 1] || 0;
    }
    /**
     * Get intercalary days that come after a specific month
     */
    getIntercalaryDaysAfterMonth(year, month) {
        const intercalaryDays = this.getIntercalaryDays(year);
        const monthName = this.calendar.months[month - 1]?.name;
        if (!monthName)
            return [];
        return intercalaryDays.filter(intercalary => intercalary.after === monthName);
    }
    /**
     * Get intercalary days for a specific year
     */
    getIntercalaryDays(year) {
        return this.calendar.intercalary.filter(intercalary => {
            if (intercalary.leapYearOnly) {
                return this.isLeapYear(year);
            }
            return true;
        });
    }
    /**
     * Check if a year is a leap year
     */
    isLeapYear(year) {
        const { rule, interval } = this.calendar.leapYear;
        switch (rule) {
            case 'none':
                return false;
            case 'gregorian':
                return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            case 'custom':
                return interval ? year % interval === 0 : false;
            default:
                return false;
        }
    }
    /**
     * Precompute year data for performance
     */
    precomputeYearData() {
        const currentYear = this.calendar.year.currentYear;
        // Cache calculations for nearby years
        for (let year = currentYear - 10; year <= currentYear + 10; year++) {
            const cacheKey = `year-${year}`;
            if (!this.calculationCache.has(cacheKey)) {
                const calculation = {
                    totalDays: this.getYearLength(year),
                    weekdayIndex: 0, // Will be calculated when needed
                    yearLength: this.getYearLength(year),
                    monthLengths: this.getMonthLengths(year),
                    intercalaryDays: this.getIntercalaryDays(year),
                };
                this.calculationCache.set(cacheKey, calculation);
            }
        }
    }
    /**
     * Update the calendar configuration
     */
    updateCalendar(calendar) {
        this.calendar = calendar;
        this.calculationCache.clear();
        this.precomputeYearData();
    }
    /**
     * Get the current calendar configuration
     */
    getCalendar() {
        return { ...this.calendar };
    }
}

/**
 * Application-wide constants for Seasons & Stars
 */
// Time-related constants
const TIME_CONSTANTS = {
    DEFAULT_DAWN_HOUR: 6,
    DEFAULT_DUSK_HOUR: 18,
};
// Widget positioning constants (consolidated from individual widgets)
const WIDGET_POSITIONING = {
    Z_INDEX: 101,
    ESTIMATED_MINI_HEIGHT: 32,
    POSITIONING_RETRY_DELAY: 100,
    MAX_POSITIONING_ATTEMPTS: 10,
    FADE_ANIMATION_DURATION: 200,
    STANDALONE_BOTTOM_OFFSET: 150,
};

/**
 * Time conversion and Foundry VTT integration for Seasons & Stars
 */
class TimeConverter {
    constructor(engine) {
        this.lastKnownTime = 0;
        this.lastKnownDate = null;
        this.engine = engine;
        this.registerFoundryHooks();
    }
    /**
     * Register hooks to sync with Foundry's time system
     */
    registerFoundryHooks() {
        // Hook into Foundry's world time updates
        Hooks.on('updateWorldTime', this.onWorldTimeUpdate.bind(this));
        // Hook into initial setup
        Hooks.on('ready', this.onFoundryReady.bind(this));
    }
    /**
     * Handle Foundry ready event
     */
    onFoundryReady() {
        // Initialize with current world time
        if (game.time?.worldTime !== undefined) {
            this.lastKnownTime = game.time.worldTime;
            // Check if this is a new world (worldTime = 0) and we're using Gregorian calendar
            if (this.lastKnownTime === 0 && this.engine.getCalendar().id === 'gregorian') {
                // Set to current real-world date for Gregorian calendar
                this.initializeWithRealWorldDate();
            }
            else {
                const dateResult = this.engine.worldTimeToDate(this.lastKnownTime);
                this.lastKnownDate =
                    dateResult instanceof CalendarDate
                        ? dateResult
                        : new CalendarDate(dateResult, this.engine.getCalendar());
            }
        }
    }
    /**
     * Initialize Gregorian calendar with current real-world date
     */
    async initializeWithRealWorldDate() {
        const now = new Date();
        const realWorldDateData = {
            year: now.getFullYear(),
            month: now.getMonth() + 1, // JavaScript months are 0-indexed
            day: now.getDate(),
            weekday: 0, // Will be calculated by the engine
            time: {
                hour: now.getHours(),
                minute: now.getMinutes(),
                second: now.getSeconds(),
            },
        };
        const realWorldDate = new CalendarDate(realWorldDateData, this.engine.getCalendar());
        Logger.debug('Initializing Gregorian calendar with current date:', realWorldDate);
        // Only set if user is GM (GMs control world time)
        if (game.user?.isGM) {
            try {
                await this.setCurrentDate(realWorldDate);
            }
            catch (error) {
                Logger.warn('Could not initialize with real-world date:', error);
                // Fallback to default behavior
                const dateResult = this.engine.worldTimeToDate(this.lastKnownTime);
                this.lastKnownDate =
                    dateResult instanceof CalendarDate
                        ? dateResult
                        : new CalendarDate(dateResult, this.engine.getCalendar());
            }
        }
        else {
            // For players, just use the default conversion
            const dateResult = this.engine.worldTimeToDate(this.lastKnownTime);
            this.lastKnownDate =
                dateResult instanceof CalendarDate
                    ? dateResult
                    : new CalendarDate(dateResult, this.engine.getCalendar());
        }
    }
    /**
     * Handle world time updates from Foundry
     */
    onWorldTimeUpdate(newTime, delta) {
        this.lastKnownTime = newTime;
        const dateResult = this.engine.worldTimeToDate(newTime);
        this.lastKnownDate =
            dateResult instanceof CalendarDate
                ? dateResult
                : new CalendarDate(dateResult, this.engine.getCalendar());
        // Emit custom hook for other modules
        Hooks.callAll('seasons-stars:dateChanged', {
            newDate: this.lastKnownDate,
            oldTime: newTime - delta,
            newTime: newTime,
            delta: delta,
        });
    }
    /**
     * Get the current calendar date based on Foundry world time
     */
    getCurrentDate() {
        let worldTime = game.time?.worldTime || 0;
        // Check for external time sources via compatibility manager
        const currentSystem = game.system?.id;
        if (currentSystem) {
            const externalTime = compatibilityManager.getExternalTimeSource(currentSystem);
            if (externalTime !== null) {
                Logger.debug(`Using external time source for ${currentSystem}: ${externalTime} (Foundry: ${worldTime})`);
                worldTime = externalTime;
            }
        }
        const result = this.engine.worldTimeToDate(worldTime);
        // If the engine returns a CalendarDate instance, use it directly
        if (result instanceof CalendarDate) {
            return result;
        }
        // Otherwise, create a new instance from the data
        return new CalendarDate(result, this.engine.getCalendar());
    }
    /**
     * Set the current date by updating Foundry world time
     */
    async setCurrentDate(date) {
        const worldTime = this.engine.dateToWorldTime(date);
        if (game.user?.isGM) {
            await game.time?.advance(worldTime - (game.time?.worldTime || 0));
        }
        else {
            ui.notifications?.warn('Only GMs can change the world time.');
        }
    }
    /**
     * Advance time by a number of days
     */
    async advanceDays(days) {
        const currentDate = this.getCurrentDate();
        const newDate = this.engine.addDays(currentDate, days);
        await this.setCurrentDate(newDate);
    }
    /**
     * Advance time by a number of hours
     */
    async advanceHours(hours) {
        const secondsPerHour = this.engine.getCalendar().time.minutesInHour * this.engine.getCalendar().time.secondsInMinute;
        const deltaSeconds = hours * secondsPerHour;
        if (game.user?.isGM) {
            await game.time?.advance(deltaSeconds);
        }
        else {
            ui.notifications?.warn('Only GMs can change the world time.');
        }
    }
    /**
     * Advance time by a number of minutes
     */
    async advanceMinutes(minutes) {
        const deltaSeconds = minutes * this.engine.getCalendar().time.secondsInMinute;
        if (game.user?.isGM) {
            await game.time?.advance(deltaSeconds);
        }
        else {
            ui.notifications?.warn('Only GMs can change the world time.');
        }
    }
    /**
     * Advance time by a number of weeks
     */
    async advanceWeeks(weeks) {
        const currentDate = this.getCurrentDate();
        const weekLength = this.engine.getCalendar().weekdays.length;
        const days = weeks * weekLength; // Convert weeks to days using dynamic week length
        const newDate = this.engine.addDays(currentDate, days);
        await this.setCurrentDate(newDate);
    }
    /**
     * Advance time by a number of months
     */
    async advanceMonths(months) {
        const currentDate = this.getCurrentDate();
        const newDate = this.engine.addMonths(currentDate, months);
        await this.setCurrentDate(newDate);
    }
    /**
     * Advance time by a number of years
     */
    async advanceYears(years) {
        const currentDate = this.getCurrentDate();
        const newDate = this.engine.addYears(currentDate, years);
        await this.setCurrentDate(newDate);
    }
    /**
     * Set a specific time of day while keeping the date
     */
    async setTimeOfDay(hour, minute = 0, second = 0) {
        const currentDate = this.getCurrentDate();
        const currentDateData = currentDate.toObject();
        // Update the time component
        currentDateData.time = { hour, minute, second };
        // Create new CalendarDate instance
        const calendar = this.engine.getCalendar();
        const newDate = new CalendarDate(currentDateData, calendar);
        await this.setCurrentDate(newDate);
    }
    /**
     * Get the time as a percentage of the day (0.0 to 1.0)
     */
    getDayProgress() {
        const currentDate = this.getCurrentDate();
        if (!currentDate.time) {
            return 0;
        }
        const calendar = this.engine.getCalendar();
        const totalSecondsInDay = calendar.time.hoursInDay * calendar.time.minutesInHour * calendar.time.secondsInMinute;
        const currentSecondsInDay = currentDate.time.hour * calendar.time.minutesInHour * calendar.time.secondsInMinute +
            currentDate.time.minute * calendar.time.secondsInMinute +
            currentDate.time.second;
        return currentSecondsInDay / totalSecondsInDay;
    }
    /**
     * Check if it's currently daytime (between dawn and dusk by default)
     */
    isDaytime(dawnHour = TIME_CONSTANTS.DEFAULT_DAWN_HOUR, duskHour = TIME_CONSTANTS.DEFAULT_DUSK_HOUR) {
        const currentDate = this.getCurrentDate();
        if (!currentDate.time) {
            return true; // Default to daytime if no time component
        }
        return currentDate.time.hour >= dawnHour && currentDate.time.hour < duskHour;
    }
    /**
     * Get the current season (0-3 for spring, summer, autumn, winter)
     * This is a simple implementation - can be enhanced later
     */
    getCurrentSeason() {
        const currentDate = this.getCurrentDate();
        const calendar = this.engine.getCalendar();
        // Simple approximation: divide year into 4 equal seasons
        const monthsPerSeason = calendar.months.length / 4;
        return Math.floor((currentDate.month - 1) / monthsPerSeason);
    }
    /**
     * Calculate the difference between two dates in days
     */
    daysBetween(date1, date2) {
        const time1 = this.engine.dateToWorldTime(date1);
        const time2 = this.engine.dateToWorldTime(date2);
        const secondsPerDay = this.engine.getCalendar().time.hoursInDay *
            this.engine.getCalendar().time.minutesInHour *
            this.engine.getCalendar().time.secondsInMinute;
        return Math.floor((time2 - time1) / secondsPerDay);
    }
    /**
     * Convert real-world time to game time based on time ratio
     */
    realTimeToGameTime(realSeconds, timeRatio = 1) {
        return realSeconds * timeRatio;
    }
    /**
     * Convert game time to real-world time based on time ratio
     */
    gameTimeToRealTime(gameSeconds, timeRatio = 1) {
        return gameSeconds / timeRatio;
    }
    /**
     * Schedule a callback for a specific calendar date
     */
    scheduleCallback(targetDate, callback) {
        const targetTime = this.engine.dateToWorldTime(targetDate);
        const currentTime = game.time?.worldTime || 0;
        if (targetTime <= currentTime) {
            // Target is in the past or now, execute immediately
            callback();
            return;
        }
        // Set up a one-time hook to watch for the target time
        const hookId = Hooks.on('updateWorldTime', (newTime) => {
            if (newTime >= targetTime) {
                callback();
                Hooks.off('updateWorldTime', hookId);
            }
        });
    }
    /**
     * Update the calendar engine (when calendar configuration changes)
     */
    updateEngine(engine) {
        this.engine = engine;
        // Recalculate current date with new calendar
        if (game.time?.worldTime !== undefined) {
            this.lastKnownTime = game.time.worldTime;
            const dateResult = this.engine.worldTimeToDate(this.lastKnownTime);
            this.lastKnownDate =
                dateResult instanceof CalendarDate
                    ? dateResult
                    : new CalendarDate(dateResult, this.engine.getCalendar());
        }
    }
    /**
     * Get debug information about time conversion
     */
    getDebugInfo() {
        const currentDate = this.getCurrentDate();
        const worldTime = game.time?.worldTime || 0;
        return {
            worldTime,
            calendarDate: currentDate,
            formattedDate: currentDate.toLongString(),
            dayProgress: this.getDayProgress(),
            isDaytime: this.isDaytime(),
            season: this.getCurrentSeason(),
            lastKnownTime: this.lastKnownTime,
            lastKnownDate: this.lastKnownDate,
        };
    }
}

/**
 * Calendar JSON format validation for Seasons & Stars
 */
class CalendarValidator {
    /**
     * Validate a complete calendar configuration
     */
    static validate(calendar) {
        const result = {
            isValid: true,
            errors: [],
            warnings: [],
        };
        // Check if input is an object
        if (!calendar || typeof calendar !== 'object') {
            result.errors.push('Calendar must be a valid object');
            result.isValid = false;
            return result;
        }
        // Validate required root fields
        this.validateRequiredFields(calendar, result);
        // Validate data types and constraints
        if (result.errors.length === 0) {
            this.validateDataTypes(calendar, result);
            this.validateConstraints(calendar, result);
            this.validateCrossReferences(calendar, result);
        }
        result.isValid = result.errors.length === 0;
        return result;
    }
    /**
     * Validate required fields are present
     */
    static validateRequiredFields(calendar, result) {
        const requiredFields = ['id', 'translations', 'months', 'weekdays'];
        for (const field of requiredFields) {
            if (!(field in calendar)) {
                result.errors.push(`Missing required field: ${field}`);
            }
        }
        // Check required fields in nested objects
        if (calendar.months) {
            calendar.months.forEach((month, index) => {
                if (!month.name) {
                    result.errors.push(`Month ${index + 1} missing required field: name`);
                }
                if (typeof month.days !== 'number') {
                    result.errors.push(`Month ${index + 1} missing required field: days`);
                }
            });
        }
        if (calendar.weekdays) {
            calendar.weekdays.forEach((weekday, index) => {
                if (!weekday.name) {
                    result.errors.push(`Weekday ${index + 1} missing required field: name`);
                }
            });
        }
        if (calendar.intercalary) {
            calendar.intercalary.forEach((intercalary, index) => {
                if (!intercalary.name) {
                    result.errors.push(`Intercalary day ${index + 1} missing required field: name`);
                }
                if (!intercalary.after) {
                    result.errors.push(`Intercalary day ${index + 1} missing required field: after`);
                }
            });
        }
    }
    /**
     * Validate data types
     */
    static validateDataTypes(calendar, result) {
        // Validate ID
        if (typeof calendar.id !== 'string') {
            result.errors.push('Calendar ID must be a string');
        }
        // Validate translations structure
        if (calendar.translations) {
            if (typeof calendar.translations !== 'object') {
                result.errors.push('Calendar translations must be an object');
            }
            else {
                // Check that there's at least one translation
                const languages = Object.keys(calendar.translations);
                if (languages.length === 0) {
                    result.errors.push('Calendar must have at least one translation');
                }
                // Validate each translation
                for (const [lang, translation] of Object.entries(calendar.translations)) {
                    if (typeof translation !== 'object') {
                        result.errors.push(`Translation for language '${lang}' must be an object`);
                        continue;
                    }
                    const trans = translation;
                    if (!trans.label || typeof trans.label !== 'string') {
                        result.errors.push(`Translation for language '${lang}' missing required label`);
                    }
                }
            }
        }
        // Validate year configuration
        if (calendar.year) {
            this.validateYearConfig(calendar.year, result);
        }
        // Validate leap year configuration
        if (calendar.leapYear) {
            this.validateLeapYearConfig(calendar.leapYear, result);
        }
        // Validate arrays
        if (!Array.isArray(calendar.months)) {
            result.errors.push('Months must be an array');
        }
        if (!Array.isArray(calendar.weekdays)) {
            result.errors.push('Weekdays must be an array');
        }
        if (calendar.intercalary && !Array.isArray(calendar.intercalary)) {
            result.errors.push('Intercalary days must be an array');
        }
        // Validate time configuration
        if (calendar.time) {
            this.validateTimeConfig(calendar.time, result);
        }
    }
    /**
     * Validate year configuration
     */
    static validateYearConfig(year, result) {
        if (typeof year !== 'object') {
            result.errors.push('Year configuration must be an object');
            return;
        }
        if (year.epoch !== undefined && typeof year.epoch !== 'number') {
            result.errors.push('Year epoch must be a number');
        }
        if (year.currentYear !== undefined && typeof year.currentYear !== 'number') {
            result.errors.push('Year currentYear must be a number');
        }
        if (year.prefix !== undefined && typeof year.prefix !== 'string') {
            result.errors.push('Year prefix must be a string');
        }
        if (year.suffix !== undefined && typeof year.suffix !== 'string') {
            result.errors.push('Year suffix must be a string');
        }
        if (year.startDay !== undefined && typeof year.startDay !== 'number') {
            result.errors.push('Year startDay must be a number');
        }
    }
    /**
     * Validate leap year configuration
     */
    static validateLeapYearConfig(leapYear, result) {
        if (typeof leapYear !== 'object') {
            result.errors.push('Leap year configuration must be an object');
            return;
        }
        const validRules = ['none', 'gregorian', 'custom'];
        if (leapYear.rule && !validRules.includes(leapYear.rule)) {
            result.errors.push(`Leap year rule must be one of: ${validRules.join(', ')}`);
        }
        if (leapYear.interval !== undefined && typeof leapYear.interval !== 'number') {
            result.errors.push('Leap year interval must be a number');
        }
        if (leapYear.month !== undefined && typeof leapYear.month !== 'string') {
            result.errors.push('Leap year month must be a string');
        }
        if (leapYear.extraDays !== undefined && typeof leapYear.extraDays !== 'number') {
            result.errors.push('Leap year extraDays must be a number');
        }
    }
    /**
     * Validate time configuration
     */
    static validateTimeConfig(time, result) {
        if (typeof time !== 'object') {
            result.errors.push('Time configuration must be an object');
            return;
        }
        if (time.hoursInDay !== undefined && typeof time.hoursInDay !== 'number') {
            result.errors.push('Time hoursInDay must be a number');
        }
        if (time.minutesInHour !== undefined && typeof time.minutesInHour !== 'number') {
            result.errors.push('Time minutesInHour must be a number');
        }
        if (time.secondsInMinute !== undefined && typeof time.secondsInMinute !== 'number') {
            result.errors.push('Time secondsInMinute must be a number');
        }
    }
    /**
     * Validate data constraints and ranges
     */
    static validateConstraints(calendar, result) {
        // Validate ID format
        if (calendar.id && !/^[a-zA-Z0-9_-]+$/.test(calendar.id)) {
            result.errors.push('Calendar ID must contain only alphanumeric characters, hyphens, and underscores');
        }
        // Validate months
        if (Array.isArray(calendar.months)) {
            if (calendar.months.length === 0) {
                result.errors.push('Calendar must have at least one month');
            }
            calendar.months.forEach((month, index) => {
                if (typeof month.days === 'number') {
                    if (month.days < 1 || month.days > 366) {
                        result.errors.push(`Month ${index + 1} days must be between 1 and 366`);
                    }
                }
            });
        }
        // Validate weekdays
        if (Array.isArray(calendar.weekdays)) {
            if (calendar.weekdays.length === 0) {
                result.errors.push('Calendar must have at least one weekday');
            }
        }
        // Validate year constraints
        if (calendar.year?.startDay !== undefined && Array.isArray(calendar.weekdays)) {
            if (calendar.year.startDay < 0 || calendar.year.startDay >= calendar.weekdays.length) {
                result.errors.push(`Year startDay must be between 0 and ${calendar.weekdays.length - 1}`);
            }
        }
        // Validate time constraints
        if (calendar.time) {
            if (calendar.time.hoursInDay !== undefined && calendar.time.hoursInDay < 1) {
                result.errors.push('Time hoursInDay must be at least 1');
            }
            if (calendar.time.minutesInHour !== undefined && calendar.time.minutesInHour < 1) {
                result.errors.push('Time minutesInHour must be at least 1');
            }
            if (calendar.time.secondsInMinute !== undefined && calendar.time.secondsInMinute < 1) {
                result.errors.push('Time secondsInMinute must be at least 1');
            }
        }
        // Validate leap year constraints
        if (calendar.leapYear?.rule === 'custom' && calendar.leapYear?.interval !== undefined) {
            if (calendar.leapYear.interval < 1) {
                result.errors.push('Leap year interval must be at least 1');
            }
        }
    }
    /**
     * Validate cross-references between fields
     */
    static validateCrossReferences(calendar, result) {
        // Check for unique month names
        if (Array.isArray(calendar.months)) {
            const monthNames = calendar.months.map((m) => m.name).filter(Boolean);
            const uniqueNames = new Set(monthNames);
            if (monthNames.length !== uniqueNames.size) {
                result.errors.push('Month names must be unique');
            }
        }
        // Check for unique weekday names
        if (Array.isArray(calendar.weekdays)) {
            const weekdayNames = calendar.weekdays.map((w) => w.name).filter(Boolean);
            const uniqueNames = new Set(weekdayNames);
            if (weekdayNames.length !== uniqueNames.size) {
                result.errors.push('Weekday names must be unique');
            }
        }
        // Validate leap year month reference
        if (calendar.leapYear?.month && Array.isArray(calendar.months)) {
            const monthExists = calendar.months.some((m) => m.name === calendar.leapYear.month);
            if (!monthExists) {
                result.errors.push(`Leap year month '${calendar.leapYear.month}' does not exist in months list`);
            }
        }
        // Validate intercalary day references
        if (Array.isArray(calendar.intercalary) && Array.isArray(calendar.months)) {
            calendar.intercalary.forEach((intercalary, index) => {
                if (intercalary.after) {
                    const monthExists = calendar.months.some((m) => m.name === intercalary.after);
                    if (!monthExists) {
                        result.errors.push(`Intercalary day ${index + 1} references non-existent month '${intercalary.after}'`);
                    }
                }
            });
        }
    }
    /**
     * Validate calendar and provide helpful error messages
     */
    static validateWithHelp(calendar) {
        const result = this.validate(calendar);
        // Add helpful warnings for common issues
        if (calendar.year?.epoch === undefined) {
            result.warnings.push('Year epoch not specified, defaulting to 0');
        }
        if (calendar.year?.currentYear === undefined) {
            result.warnings.push('Current year not specified, defaulting to 1');
        }
        if (!calendar.time) {
            result.warnings.push('Time configuration not specified, using 24-hour day');
        }
        if (!calendar.leapYear) {
            result.warnings.push('Leap year configuration not specified, no leap years will occur');
        }
        // Check for commonly forgotten fields
        if (Array.isArray(calendar.months)) {
            calendar.months.forEach((month, index) => {
                if (!month.abbreviation) {
                    result.warnings.push(`Month ${index + 1} (${month.name}) has no abbreviation`);
                }
            });
        }
        return result;
    }
    /**
     * Quick validation for just checking if calendar is loadable
     */
    static isValid(calendar) {
        return this.validate(calendar).isValid;
    }
    /**
     * Get a list of validation errors as strings
     */
    static getErrors(calendar) {
        return this.validate(calendar).errors;
    }
}

/**
 * Calendar localization utilities for Seasons & Stars
 */
class CalendarLocalization {
    /**
     * Get the current language code from Foundry
     */
    static getCurrentLanguage() {
        // Default to English if no game object available (testing)
        if (typeof game === 'undefined')
            return 'en';
        // Use Foundry's language setting
        return game.i18n?.lang || 'en';
    }
    /**
     * Get translated calendar label
     */
    static getCalendarLabel(calendar) {
        const lang = this.getCurrentLanguage();
        // Try current language first
        if (calendar.translations[lang]?.label) {
            return calendar.translations[lang].label;
        }
        // Fall back to English
        if (calendar.translations.en?.label) {
            return calendar.translations.en.label;
        }
        // Last resort: use calendar ID
        return calendar.id;
    }
    /**
     * Get translated calendar description
     */
    static getCalendarDescription(calendar) {
        const lang = this.getCurrentLanguage();
        // Try current language first
        if (calendar.translations[lang]?.description) {
            return calendar.translations[lang].description;
        }
        // Fall back to English
        return calendar.translations.en?.description;
    }
    /**
     * Get translated calendar setting
     */
    static getCalendarSetting(calendar) {
        const lang = this.getCurrentLanguage();
        // Try current language first
        if (calendar.translations[lang]?.setting) {
            return calendar.translations[lang].setting;
        }
        // Fall back to English
        return calendar.translations.en?.setting;
    }
    /**
     * Get translated month description
     */
    static getMonthDescription(month) {
        const lang = this.getCurrentLanguage();
        // Try translated description first
        if (month.translations?.[lang]?.description) {
            return month.translations[lang].description;
        }
        // Fall back to English translation
        if (month.translations?.en?.description) {
            return month.translations.en.description;
        }
        // Fall back to base description
        return month.description;
    }
    /**
     * Get translated weekday description
     */
    static getWeekdayDescription(weekday) {
        const lang = this.getCurrentLanguage();
        // Try translated description first
        if (weekday.translations?.[lang]?.description) {
            return weekday.translations[lang].description;
        }
        // Fall back to English translation
        if (weekday.translations?.en?.description) {
            return weekday.translations.en.description;
        }
        // Fall back to base description
        return weekday.description;
    }
    /**
     * Get translated intercalary description
     */
    static getIntercalaryDescription(intercalary) {
        const lang = this.getCurrentLanguage();
        // Try translated description first
        if (intercalary.translations?.[lang]?.description) {
            return intercalary.translations[lang].description;
        }
        // Fall back to English translation
        if (intercalary.translations?.en?.description) {
            return intercalary.translations.en.description;
        }
        // Fall back to base description
        return intercalary.description;
    }
    /**
     * Get all available languages for a calendar
     */
    static getAvailableLanguages(calendar) {
        return Object.keys(calendar.translations);
    }
    /**
     * Check if a calendar has translations for a specific language
     */
    static hasLanguage(calendar, language) {
        return language in calendar.translations;
    }
    /**
     * Create a localized calendar object for UI display
     */
    static getLocalizedCalendarInfo(calendar) {
        return {
            id: calendar.id,
            label: this.getCalendarLabel(calendar),
            description: this.getCalendarDescription(calendar) || '',
            setting: this.getCalendarSetting(calendar) || '',
            availableLanguages: this.getAvailableLanguages(calendar),
            currentLanguage: this.getCurrentLanguage(),
        };
    }
    /**
     * Get translated name for a calendar element (month, weekday, etc.)
     */
    static getCalendarTranslation(calendar, path, fallback) {
        const lang = this.getCurrentLanguage();
        const pathParts = path.split('.');
        if (pathParts.length !== 2) {
            return fallback;
        }
        const [type, id] = pathParts;
        // Try current language first
        if (calendar.translations[lang]) {
            const translation = calendar.translations[lang][type];
            if (translation && typeof translation === 'object' && id in translation) {
                return translation[id];
            }
        }
        // Fall back to English
        if (calendar.translations.en) {
            const translation = calendar.translations.en[type];
            if (translation && typeof translation === 'object' && id in translation) {
                return translation[id];
            }
        }
        // Last resort: use fallback
        return fallback;
    }
    /**
     * Create settings choices for calendar selection
     */
    static createCalendarChoices(calendars) {
        const choices = {};
        for (const calendar of calendars) {
            choices[calendar.id] = this.getCalendarLabel(calendar);
        }
        return choices;
    }
}

/**
 * Auto-generated calendar list
 *
 * This file is automatically generated by scripts/generate-calendar-list.js
 * Do not edit manually - it will be overwritten on next build
 *
 * Generated on: 2025-06-24T23:32:51.384Z
 * Found 15 calendar(s): dark-sun, dnd5e-sword-coast, eberron, exandrian, forbidden-lands, forgotten-realms, golarion-pf2e, gregorian, greyhawk, starfinder-absalom-station, symbaroum, traditional-fantasy-epoch, traveller-imperial, vale-reckoning, warhammer
 */
const BUILT_IN_CALENDARS = [
    "dark-sun",
    "dnd5e-sword-coast",
    "eberron",
    "exandrian",
    "forbidden-lands",
    "forgotten-realms",
    "golarion-pf2e",
    "gregorian",
    "greyhawk",
    "starfinder-absalom-station",
    "symbaroum",
    "traditional-fantasy-epoch",
    "traveller-imperial",
    "vale-reckoning",
    "warhammer"
];

/**
 * Calendar management system for Seasons & Stars
 */
class CalendarManager {
    constructor() {
        this.calendars = new Map();
        this.engines = new Map();
        this.timeConverter = null;
        this.activeCalendarId = null;
    }
    /**
     * Initialize the calendar manager
     */
    async initialize() {
        Logger.debug('Initializing Calendar Manager');
        // Load built-in calendars
        await this.loadBuiltInCalendars();
        // Complete initialization after settings are registered
        await this.completeInitialization();
    }
    /**
     * Complete initialization after settings are registered
     */
    async completeInitialization() {
        Logger.debug('Completing Calendar Manager initialization');
        // Load active calendar from settings
        const savedCalendarId = game.settings?.get('seasons-and-stars', 'activeCalendar');
        if (savedCalendarId && this.calendars.has(savedCalendarId)) {
            await this.setActiveCalendar(savedCalendarId);
        }
        else {
            // Default to first available calendar
            const firstCalendarId = this.calendars.keys().next().value;
            if (firstCalendarId) {
                await this.setActiveCalendar(firstCalendarId);
            }
        }
        Logger.debug(`Loaded ${this.calendars.size} calendars`);
    }
    /**
     * Load built-in calendar definitions
     */
    async loadBuiltInCalendars() {
        const builtInCalendars = BUILT_IN_CALENDARS;
        for (const calendarId of builtInCalendars) {
            try {
                // Try to load from module's calendars directory
                const response = await fetch(`modules/seasons-and-stars/calendars/${calendarId}.json`);
                if (response.ok) {
                    const calendarData = await response.json();
                    this.loadCalendar(calendarData);
                }
                else {
                    Logger.warn(`Could not load built-in calendar: ${calendarId}`);
                }
            }
            catch (error) {
                Logger.error(`Error loading calendar ${calendarId}`, error);
            }
        }
    }
    /**
     * Load a calendar from data
     */
    loadCalendar(calendarData) {
        // Validate the calendar data
        const validation = CalendarValidator.validate(calendarData);
        if (!validation.isValid) {
            Logger.error(`Invalid calendar data for ${calendarData.id}: ${validation.errors.join(', ')}`);
            return false;
        }
        // Warn about potential issues
        if (validation.warnings.length > 0) {
            Logger.warn(`Calendar warnings for ${calendarData.id}: ${validation.warnings.join(', ')}`);
        }
        // Store the calendar
        this.calendars.set(calendarData.id, calendarData);
        // Create engine for this calendar
        const engine = new CalendarEngine(calendarData);
        this.engines.set(calendarData.id, engine);
        const label = CalendarLocalization.getCalendarLabel(calendarData);
        Logger.debug(`Loaded calendar: ${label} (${calendarData.id})`);
        return true;
    }
    /**
     * Set the active calendar
     */
    async setActiveCalendar(calendarId) {
        if (!this.calendars.has(calendarId)) {
            Logger.error(`Calendar not found: ${calendarId}`);
            return false;
        }
        this.activeCalendarId = calendarId;
        // Update time converter with new engine
        const engine = this.engines.get(calendarId);
        if (!engine) {
            Logger.error(`Engine not found for calendar: ${calendarId}`);
            return false;
        }
        if (this.timeConverter) {
            this.timeConverter.updateEngine(engine);
        }
        else {
            this.timeConverter = new TimeConverter(engine);
        }
        // Save to settings
        if (game.settings) {
            await game.settings.set('seasons-and-stars', 'activeCalendar', calendarId);
        }
        // Emit hook for calendar change
        Hooks.callAll('seasons-stars:calendarChanged', {
            newCalendarId: calendarId,
            calendar: this.calendars.get(calendarId),
        });
        Logger.debug(`Active calendar set to: ${calendarId}`);
        return true;
    }
    /**
     * Get the active calendar
     */
    getActiveCalendar() {
        if (!this.activeCalendarId)
            return null;
        return this.calendars.get(this.activeCalendarId) || null;
    }
    /**
     * Get the active calendar engine
     */
    getActiveEngine() {
        if (!this.activeCalendarId)
            return null;
        return this.engines.get(this.activeCalendarId) || null;
    }
    /**
     * Get the time converter
     */
    getTimeConverter() {
        return this.timeConverter;
    }
    /**
     * Get all available calendar IDs
     */
    getAvailableCalendars() {
        return Array.from(this.calendars.keys());
    }
    /**
     * Get all calendar objects
     */
    getAllCalendars() {
        return Array.from(this.calendars.values());
    }
    /**
     * Get calendar data by ID
     */
    getCalendar(calendarId) {
        return this.calendars.get(calendarId) || null;
    }
    /**
     * Import a calendar from JSON file
     */
    async importCalendarFromFile(file) {
        try {
            const text = await file.text();
            const calendarData = JSON.parse(text);
            return this.loadCalendar(calendarData);
        }
        catch (error) {
            Logger.error('Error importing calendar', error);
            ui.notifications?.error(`Failed to import calendar: ${error.message}`);
            return false;
        }
    }
    /**
     * Export a calendar to JSON
     */
    exportCalendar(calendarId) {
        const calendar = this.calendars.get(calendarId);
        if (!calendar) {
            Logger.error(`Calendar not found for export: ${calendarId}`);
            return null;
        }
        try {
            return JSON.stringify(calendar, null, 2);
        }
        catch (error) {
            Logger.error('Error exporting calendar', error);
            return null;
        }
    }
    /**
     * Remove a calendar (built-in calendars cannot be removed)
     */
    removeCalendar(calendarId) {
        const builtInCalendars = ['gregorian', 'vale-reckoning'];
        if (builtInCalendars.includes(calendarId)) {
            Logger.warn(`Cannot remove built-in calendar: ${calendarId}`);
            return false;
        }
        if (!this.calendars.has(calendarId)) {
            Logger.warn(`Calendar not found: ${calendarId}`);
            return false;
        }
        // Don't remove if it's the active calendar
        if (this.activeCalendarId === calendarId) {
            Logger.warn(`Cannot remove active calendar: ${calendarId}`);
            return false;
        }
        this.calendars.delete(calendarId);
        this.engines.delete(calendarId);
        Logger.debug(`Removed calendar: ${calendarId}`);
        return true;
    }
    /**
     * Get current date from active calendar
     */
    getCurrentDate() {
        if (!this.timeConverter)
            return null;
        return this.timeConverter.getCurrentDate();
    }
    /**
     * Advance time by days using active calendar
     */
    async advanceDays(days) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.advanceDays(days);
    }
    /**
     * Advance time by hours using active calendar
     */
    async advanceHours(hours) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.advanceHours(hours);
    }
    /**
     * Advance time by weeks using active calendar
     */
    async advanceWeeks(weeks) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.advanceWeeks(weeks);
    }
    /**
     * Advance time by months using active calendar
     */
    async advanceMonths(months) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.advanceMonths(months);
    }
    /**
     * Advance time by years using active calendar
     */
    async advanceYears(years) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.advanceYears(years);
    }
    /**
     * Advance time by minutes using active calendar
     */
    async advanceMinutes(minutes) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.advanceMinutes(minutes);
    }
    /**
     * Set current date using active calendar
     */
    async setCurrentDate(date) {
        if (!this.timeConverter) {
            throw new Error('No active calendar set');
        }
        await this.timeConverter.setCurrentDate(date);
    }
    /**
     * Get debug information
     */
    getDebugInfo() {
        return {
            activeCalendarId: this.activeCalendarId,
            availableCalendars: this.getAvailableCalendars(),
            currentDate: this.getCurrentDate()?.toLongString(),
            timeConverter: this.timeConverter?.getDebugInfo(),
        };
    }
    /**
     * Validate all loaded calendars
     */
    validateAllCalendars() {
        const results = {};
        for (const [calendarId, calendar] of this.calendars.entries()) {
            results[calendarId] = CalendarValidator.validateWithHelp(calendar);
        }
        return results;
    }
}

/**
 * Performance optimization utilities for the notes system
 *
 * Note: Memory monitoring has been moved to the Memory Mage module.
 * This optimizer now focuses on search performance and caching only.
 */
/**
 * Performance optimizer for large note collections
 */
class NotePerformanceOptimizer {
    constructor(config = {}) {
        // LRU cache implementation
        this.lruCache = new Map();
        this.cacheAccessOrder = [];
        this.config = {
            cacheSize: 200,
            cacheEvictionStrategy: 'lru',
            maxSearchResults: 1000,
            searchTimeout: 5000,
            enablePagination: true,
            lazyIndexing: true,
            indexRebuildThreshold: 500,
            ...config,
        };
        this.metrics = {
            indexBuildTime: 0,
            searchTime: 0,
            cacheHitRate: 0,
            totalNotes: 0,
            indexedDates: 0,
        };
    }
    static getInstance(config) {
        if (!this.instance) {
            this.instance = new NotePerformanceOptimizer(config);
        }
        return this.instance;
    }
    /**
     * Optimized note retrieval with smart caching
     */
    async getOptimizedNotes(dateKeys, useCache = true) {
        const startTime = performance.now();
        const result = new Map();
        const uncachedKeys = [];
        // Check cache first
        if (useCache) {
            for (const dateKey of dateKeys) {
                const cachedNotes = this.getCachedNotesForDate(dateKey);
                if (cachedNotes) {
                    result.set(dateKey, cachedNotes);
                }
                else {
                    uncachedKeys.push(dateKey);
                }
            }
        }
        else {
            uncachedKeys.push(...dateKeys);
        }
        // Fetch uncached notes in batches
        if (uncachedKeys.length > 0) {
            const batchSize = 10; // Process 10 dates at a time
            for (let i = 0; i < uncachedKeys.length; i += batchSize) {
                const batch = uncachedKeys.slice(i, i + batchSize);
                const batchResults = await this.fetchNotesBatch(batch);
                for (const [dateKey, notes] of batchResults) {
                    result.set(dateKey, notes);
                    // Cache the results
                    if (useCache) {
                        this.cacheNotesForDate(dateKey, notes);
                    }
                }
                // Yield to prevent blocking
                if (i + batchSize < uncachedKeys.length) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                }
            }
        }
        const endTime = performance.now();
        this.metrics.searchTime = endTime - startTime;
        return result;
    }
    /**
     * Optimized search with early termination and pagination
     */
    async optimizedSearch(criteria) {
        const startTime = performance.now();
        // Apply smart filtering strategy
        const searchStrategy = this.determineSearchStrategy(criteria);
        let notes = [];
        try {
            // Use timeout to prevent long-running searches
            notes = await Promise.race([
                this.executeSearchStrategy(searchStrategy, criteria),
                this.createSearchTimeout(),
            ]);
        }
        catch (error) {
            Logger.warn('Search timeout or error:', error);
            // Return partial results
            notes = [];
        }
        // Apply pagination if enabled
        const limit = criteria.limit || this.config.maxSearchResults;
        const offset = criteria.offset || 0;
        const totalCount = notes.length;
        if (this.config.enablePagination && totalCount > limit) {
            notes = notes.slice(offset, offset + limit);
        }
        const endTime = performance.now();
        const searchTime = endTime - startTime;
        this.metrics.searchTime = searchTime;
        return {
            notes,
            totalCount,
            hasMore: totalCount > offset + notes.length,
            searchTime,
        };
    }
    /**
     * Memory pressure relief - clean up caches and rebuild indexes
     * Called by Memory Mage during memory pressure events
     */
    relieveMemoryPressure() {
        Logger.info('Relieving memory pressure...');
        // Clear cache partially (keep most recent 50%)
        this.clearOldCacheEntries(0.5);
        Logger.info('Memory pressure relief completed');
    }
    /**
     * Get current performance metrics
     */
    getMetrics() {
        this.updateMetrics();
        return { ...this.metrics };
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        // Adjust cache size if needed
        if (newConfig.cacheSize && newConfig.cacheSize < this.lruCache.size) {
            this.clearOldCacheEntries(1 - newConfig.cacheSize / this.lruCache.size);
        }
    }
    /**
     * Get estimated memory usage for Memory Mage
     */
    getMemoryUsage() {
        // Estimate cache memory usage
        const avgNoteSize = 0.01; // Estimate 10KB per cached note
        const cacheMemory = this.lruCache.size * avgNoteSize;
        // Add small baseline for the optimizer itself
        const baseMemory = 0.1;
        return cacheMemory + baseMemory;
    }
    /**
     * Determine optimal search strategy based on criteria
     */
    determineSearchStrategy(criteria) {
        // Use index strategy for date-based searches
        if (criteria.dateFrom || criteria.dateTo) {
            return 'index';
        }
        // Use full search for complex text queries
        if (criteria.query && criteria.query.length > 3) {
            return 'full';
        }
        // Use hybrid for mixed criteria
        return 'hybrid';
    }
    /**
     * Execute search based on strategy
     */
    async executeSearchStrategy(strategy, criteria) {
        switch (strategy) {
            case 'index':
                return this.indexBasedSearch(criteria);
            case 'full':
                return this.fullTextSearch(criteria);
            case 'hybrid':
                return this.hybridSearch(criteria);
            default:
                return this.fullTextSearch(criteria);
        }
    }
    /**
     * Index-based search for date ranges
     */
    async indexBasedSearch(criteria) {
        const dateKeys = this.generateDateKeys(criteria.dateFrom, criteria.dateTo);
        const notesMap = await this.getOptimizedNotes(dateKeys);
        const allNotes = [];
        for (const notes of notesMap.values()) {
            allNotes.push(...notes);
        }
        // Apply additional filters
        return this.applyAdditionalFilters(allNotes, criteria);
    }
    /**
     * Full text search with optimizations
     */
    async fullTextSearch(criteria) {
        const allNotes = this.getAllCalendarNotes();
        // Early termination if too many notes
        if (allNotes.length > this.config.indexRebuildThreshold) {
            Logger.warn(`Large collection (${allNotes.length} notes) - consider date filtering`);
        }
        return this.applyAdditionalFilters(allNotes, criteria);
    }
    /**
     * Hybrid search combining index and full search
     */
    async hybridSearch(criteria) {
        // Start with index-based filtering if date criteria exists
        let notes;
        if (criteria.dateFrom || criteria.dateTo) {
            notes = await this.indexBasedSearch(criteria);
        }
        else {
            notes = this.getAllCalendarNotes();
        }
        // Apply text filtering on the reduced set
        return this.applyAdditionalFilters(notes, criteria);
    }
    /**
     * Create search timeout promise
     */
    createSearchTimeout() {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Search timeout'));
            }, this.config.searchTimeout);
        });
    }
    /**
     * Generate date keys for a range
     */
    generateDateKeys(from, to) {
        if (!from && !to)
            return [];
        const keys = [];
        const start = from || to;
        const end = to || from;
        // Limit range to prevent excessive key generation
        const maxDays = 366; // One year maximum
        let dayCount = 0;
        const current = { ...start };
        while (dayCount < maxDays && this.compareDates(current, end) <= 0) {
            keys.push(this.getDateKey(current));
            this.incrementDate(current);
            dayCount++;
        }
        return keys;
    }
    /**
     * Apply additional filters to notes
     */
    applyAdditionalFilters(notes, criteria) {
        let filtered = notes;
        // Apply text filter
        if (criteria.query) {
            const queryLower = criteria.query.toLowerCase();
            filtered = filtered.filter(note => {
                const title = note.name?.toLowerCase() || '';
                const content = this.getNoteContent(note).toLowerCase();
                return title.includes(queryLower) || content.includes(queryLower);
            });
        }
        // Apply category filter
        if (criteria.categories && criteria.categories.length > 0) {
            filtered = filtered.filter(note => {
                const category = note.flags?.['seasons-and-stars']?.category;
                return criteria.categories.includes(category);
            });
        }
        // Apply other filters...
        // (Implementation similar to existing NoteSearch)
        return filtered;
    }
    /**
     * Cache management methods
     */
    getCachedNotesForDate(dateKey) {
        const cached = this.lruCache.get(dateKey);
        if (cached) {
            // Update access time
            cached.lastAccess = Date.now();
            this.updateCacheAccessOrder(dateKey);
            return [cached.note]; // For single note, adjust for multiple notes
        }
        return null;
    }
    cacheNotesForDate(dateKey, notes) {
        // For simplicity, cache first note only
        // In production, implement proper multi-note caching
        if (notes.length > 0) {
            this.addToLRUCache(dateKey, notes[0]);
        }
    }
    addToLRUCache(key, note) {
        // Remove if already exists
        if (this.lruCache.has(key)) {
            this.lruCache.delete(key);
            const index = this.cacheAccessOrder.indexOf(key);
            if (index > -1) {
                this.cacheAccessOrder.splice(index, 1);
            }
        }
        // Check cache size
        while (this.lruCache.size >= this.config.cacheSize) {
            const oldestKey = this.cacheAccessOrder.shift();
            if (oldestKey) {
                this.lruCache.delete(oldestKey);
            }
        }
        // Add new entry
        this.lruCache.set(key, { note, lastAccess: Date.now() });
        this.cacheAccessOrder.push(key);
    }
    updateCacheAccessOrder(key) {
        const index = this.cacheAccessOrder.indexOf(key);
        if (index > -1) {
            this.cacheAccessOrder.splice(index, 1);
            this.cacheAccessOrder.push(key);
        }
    }
    clearOldCacheEntries(fraction) {
        const entriesToRemove = Math.floor(this.lruCache.size * fraction);
        for (let i = 0; i < entriesToRemove && this.cacheAccessOrder.length > 0; i++) {
            const oldestKey = this.cacheAccessOrder.shift();
            if (oldestKey) {
                this.lruCache.delete(oldestKey);
            }
        }
    }
    /**
     * Utility methods
     */
    async fetchNotesBatch(dateKeys) {
        const result = new Map();
        // Implementation would use note storage system
        // For now, return empty map
        dateKeys.forEach(key => {
            result.set(key, []);
        });
        return result;
    }
    getAllCalendarNotes() {
        if (!game.journal)
            return [];
        return game.journal.filter(journal => {
            const flags = journal.flags?.['seasons-and-stars'];
            return flags?.calendarNote === true;
        });
    }
    getNoteContent(note) {
        // Extract content from first text page
        const textPage = note.pages?.find(page => page.type === 'text');
        return textPage?.text?.content || '';
    }
    getDateKey(date) {
        const year = date.year.toString().padStart(4, '0');
        const month = date.month.toString().padStart(2, '0');
        const day = date.day.toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    compareDates(date1, date2) {
        return CalendarTimeUtils.compareDates(date1, date2);
    }
    incrementDate(date) {
        // Simple increment - would need calendar-aware logic in production
        date.day++;
        if (date.day > 30) {
            // Simplified
            date.day = 1;
            date.month++;
            if (date.month > 12) {
                date.month = 1;
                date.year++;
            }
        }
    }
    updateMetrics() {
        this.metrics.totalNotes = this.getAllCalendarNotes().length;
        this.metrics.cacheHitRate = this.calculateCacheHitRate();
    }
    calculateCacheHitRate() {
        // Would need to track hits/misses in production
        return 0.85; // Placeholder
    }
}

/**
 * Efficient date-based storage and retrieval system for calendar notes
 */
/**
 * High-performance storage system with date-based indexing
 */
class NoteStorage {
    constructor() {
        this.dateIndex = new Map();
        this.noteCache = new Map();
        this.cacheSize = 100; // Limit cache size to prevent memory issues
        this.indexBuilt = false;
    }
    /**
     * Initialize the storage system
     */
    initialize() {
        this.performanceOptimizer = NotePerformanceOptimizer.getInstance({
            cacheSize: this.cacheSize,
        });
        this.buildDateIndex();
        this.indexBuilt = true;
        Logger.debug('Note storage initialized with performance optimization');
    }
    /**
     * Store a note with date indexing
     */
    async storeNote(note, date) {
        if (!this.indexBuilt) {
            this.initialize();
        }
        const dateKey = this.getDateKey(date);
        this.addToDateIndex(dateKey, note.id);
        // Add to cache
        this.addToCache(note.id, note);
    }
    /**
     * Remove a note from storage and indexing
     */
    async removeNote(noteId) {
        // Remove from all date indices
        for (const [dateKey, noteIds] of this.dateIndex.entries()) {
            if (noteIds.has(noteId)) {
                this.removeFromDateIndex(dateKey, noteId);
            }
        }
        // Remove from cache
        this.noteCache.delete(noteId);
    }
    /**
     * Find notes by specific date (fast retrieval using index)
     */
    async findNotesByDate(date) {
        if (!this.indexBuilt) {
            this.initialize();
        }
        const dateKey = this.getDateKey(date);
        const noteIds = this.dateIndex.get(dateKey) || new Set();
        const notes = [];
        for (const noteId of noteIds) {
            const note = this.getFromCache(noteId) || game.journal?.get(noteId);
            if (note && this.isCalendarNote(note)) {
                notes.push(note);
                // Add to cache if retrieved from game
                if (!this.noteCache.has(noteId)) {
                    this.addToCache(noteId, note);
                }
            }
        }
        return this.sortNotesByCreation(notes);
    }
    /**
     * Find notes by specific date (synchronous version for API compatibility)
     */
    findNotesByDateSync(date) {
        if (!this.indexBuilt) {
            this.initialize();
        }
        const dateKey = this.getDateKey(date);
        const noteIds = this.dateIndex.get(dateKey) || new Set();
        const notes = [];
        for (const noteId of noteIds) {
            const note = this.getFromCache(noteId) || game.journal?.get(noteId);
            if (note && this.isCalendarNote(note)) {
                notes.push(note);
                // Add to cache if retrieved from game
                if (!this.noteCache.has(noteId)) {
                    this.addToCache(noteId, note);
                }
            }
        }
        return this.sortNotesByCreation(notes);
    }
    /**
     * Find notes by date range (optimized for ranges)
     */
    async findNotesByDateRange(start, end) {
        if (!this.indexBuilt) {
            this.initialize();
        }
        const notes = [];
        const noteIds = new Set();
        // Iterate through date range and collect note IDs
        const startKey = this.getDateKey(start);
        const endKey = this.getDateKey(end);
        for (const [dateKey, dayNoteIds] of this.dateIndex.entries()) {
            if (dateKey >= startKey && dateKey <= endKey) {
                for (const noteId of dayNoteIds) {
                    noteIds.add(noteId);
                }
            }
        }
        // Retrieve notes
        for (const noteId of noteIds) {
            const note = this.getFromCache(noteId) || game.journal?.get(noteId);
            if (note && this.isCalendarNote(note)) {
                // Double-check date range for notes that span multiple days
                // Try S&S flags first, then bridge flags
                const ssFlags = note.flags?.['seasons-and-stars'];
                const bridgeFlags = note.flags?.['foundryvtt-simple-calendar-compat'];
                const startDate = ssFlags?.startDate || bridgeFlags?.startDate;
                if (startDate && this.isDateInRange(startDate, start, end)) {
                    notes.push(note);
                    // Add to cache if retrieved from game
                    if (!this.noteCache.has(noteId)) {
                        this.addToCache(noteId, note);
                    }
                }
            }
        }
        return this.sortNotesByDate(notes);
    }
    /**
     * Rebuild the date index (call when notes are created/updated outside storage)
     *
     * NOTE: This is a workaround for bridge integration synchronization issues.
     * When external modules (like Simple Weather) create notes through the Simple Calendar
     * Compatibility Bridge, those notes don't automatically appear in calendar highlighting
     * until this method is called. See KNOWN-ISSUES.md for details.
     */
    rebuildIndex() {
        Logger.debug('Rebuilding note storage index');
        this.dateIndex.clear();
        this.buildDateIndex();
        Logger.debug(`Index rebuilt with ${this.dateIndex.size} date entries`);
    }
    /**
     * Clear the cache to free memory
     */
    clearCache() {
        this.noteCache.clear();
        Logger.debug('Note cache cleared');
    }
    /**
     * Get cache statistics for debugging
     */
    getCacheStats() {
        return {
            size: this.noteCache.size,
            maxSize: this.cacheSize,
        };
    }
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        if (!this.performanceOptimizer) {
            return null;
        }
        return this.performanceOptimizer.getMetrics();
    }
    /**
     * Optimize storage for large collections
     */
    async optimizeForLargeCollections() {
        if (!this.performanceOptimizer) {
            Logger.warn('Performance optimizer not initialized');
            return;
        }
        Logger.debug('Optimizing storage for large collections...');
        // Clear cache and rebuild index
        this.clearCache();
        this.rebuildIndex();
        // Update configuration for large collections
        this.performanceOptimizer.updateConfig({
            cacheSize: Math.min(500, Math.max(200, this.dateIndex.size * 2)),
            maxSearchResults: 500,
            enablePagination: true,
        });
        Logger.debug('Storage optimization completed');
    }
    /**
     * Build the date index from existing journal entries
     */
    buildDateIndex() {
        this.dateIndex.clear();
        if (!game.journal) {
            Logger.warn('Game journal not available for indexing');
            return;
        }
        let indexedCount = 0;
        game.journal.forEach(journal => {
            if (this.isCalendarNote(journal)) {
                // Try to get dateKey from S&S flags first, then bridge flags
                const ssFlags = journal.flags?.['seasons-and-stars'];
                const bridgeFlags = journal.flags?.['foundryvtt-simple-calendar-compat'];
                const dateKey = ssFlags?.dateKey || bridgeFlags?.dateKey;
                if (dateKey) {
                    this.addToDateIndex(dateKey, journal.id);
                    indexedCount++;
                }
            }
        });
        Logger.debug(`Built date index for ${indexedCount} calendar notes`);
    }
    /**
     * Generate a date key for indexing (YYYY-MM-DD format)
     */
    getDateKey(date) {
        const year = date.year.toString().padStart(4, '0');
        const month = date.month.toString().padStart(2, '0');
        const day = date.day.toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * Add a note to the date index
     */
    addToDateIndex(dateKey, noteId) {
        if (!this.dateIndex.has(dateKey)) {
            this.dateIndex.set(dateKey, new Set());
        }
        this.dateIndex.get(dateKey).add(noteId);
    }
    /**
     * Remove a note from the date index
     */
    removeFromDateIndex(dateKey, noteId) {
        const noteIds = this.dateIndex.get(dateKey);
        if (noteIds) {
            noteIds.delete(noteId);
            // Clean up empty date entries
            if (noteIds.size === 0) {
                this.dateIndex.delete(dateKey);
            }
        }
    }
    /**
     * Add note to cache with size management
     */
    addToCache(noteId, note) {
        // Manage cache size
        if (this.noteCache.size >= this.cacheSize) {
            // Remove oldest entry (FIFO)
            const firstKey = this.noteCache.keys().next().value;
            if (firstKey) {
                this.noteCache.delete(firstKey);
            }
        }
        this.noteCache.set(noteId, note);
    }
    /**
     * Get note from cache
     */
    getFromCache(noteId) {
        return this.noteCache.get(noteId) || null;
    }
    /**
     * Check if a journal entry is a calendar note
     */
    isCalendarNote(journal) {
        // Check for native S&S flags
        const ssFlags = journal.flags?.['seasons-and-stars'];
        if (ssFlags?.calendarNote === true) {
            return true;
        }
        // Check for bridge flags (Simple Calendar compatibility)
        const bridgeFlags = journal.flags?.['foundryvtt-simple-calendar-compat'];
        return bridgeFlags?.isCalendarNote === true;
    }
    /**
     * Check if a date is within a range (inclusive)
     */
    isDateInRange(date, start, end) {
        return this.compareDates(date, start) >= 0 && this.compareDates(date, end) <= 0;
    }
    /**
     * Compare two dates
     */
    compareDates(a, b) {
        if (a.year !== b.year)
            return a.year - b.year;
        if (a.month !== b.month)
            return a.month - b.month;
        return a.day - b.day;
    }
    /**
     * Sort notes by creation time
     */
    sortNotesByCreation(notes) {
        return notes.sort((a, b) => {
            // Try S&S flags first, then bridge flags
            const aSSFlags = a.flags?.['seasons-and-stars'];
            const aBridgeFlags = a.flags?.['foundryvtt-simple-calendar-compat'];
            const bSSFlags = b.flags?.['seasons-and-stars'];
            const bBridgeFlags = b.flags?.['foundryvtt-simple-calendar-compat'];
            const aCreated = aSSFlags?.created || aBridgeFlags?.created || 0;
            const bCreated = bSSFlags?.created || bBridgeFlags?.created || 0;
            return aCreated - bCreated;
        });
    }
    /**
     * Sort notes by date, then creation time
     */
    sortNotesByDate(notes) {
        return notes.sort((a, b) => {
            // Try S&S flags first, then bridge flags
            const aSSFlags = a.flags?.['seasons-and-stars'];
            const aBridgeFlags = a.flags?.['foundryvtt-simple-calendar-compat'];
            const bSSFlags = b.flags?.['seasons-and-stars'];
            const bBridgeFlags = b.flags?.['foundryvtt-simple-calendar-compat'];
            const aDate = aSSFlags?.startDate || aBridgeFlags?.startDate;
            const bDate = bSSFlags?.startDate || bBridgeFlags?.startDate;
            if (aDate && bDate) {
                const comparison = this.compareDates(aDate, bDate);
                if (comparison !== 0)
                    return comparison;
            }
            const aCreated = aSSFlags?.created || aBridgeFlags?.created || 0;
            const bCreated = bSSFlags?.created || bBridgeFlags?.created || 0;
            return aCreated - bCreated;
        });
    }
}

/**
 * Permission management system for calendar notes
 */
/**
 * Manages permissions and access control for calendar notes
 */
class NotePermissions {
    /**
     * Check if a user can create calendar notes
     */
    canCreateNote(user) {
        // GMs can always create notes
        if (user.isGM)
            return true;
        // Check if players are allowed to create notes via setting
        const allowPlayerCreation = game.settings?.get('seasons-and-stars', 'allowPlayerNotes');
        return allowPlayerCreation || false;
    }
    /**
     * Check if a user can edit a specific note
     */
    canEditNote(user, note) {
        // GMs can always edit notes
        if (user.isGM)
            return true;
        // Check ownership level
        const ownership = note.ownership;
        const userLevel = ownership[user.id] || ownership.default || CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
        return userLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    }
    /**
     * Check if a user can delete a specific note
     */
    canDeleteNote(user, note) {
        // GMs can always delete notes
        if (user.isGM)
            return true;
        // Check ownership level (same as edit for now)
        const ownership = note.ownership;
        const userLevel = ownership[user.id] || ownership.default || CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
        return userLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    }
    /**
     * Check if a user can view a specific note
     */
    canViewNote(user, note) {
        // GMs can always view notes
        if (user.isGM)
            return true;
        // Check ownership level
        const ownership = note.ownership;
        const userLevel = ownership[user.id] || ownership.default || CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
        return userLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
    }
    /**
     * Check if a user can manage a specific note's permissions
     */
    canManagePermissions(user, note) {
        // Only GMs can manage permissions
        if (user.isGM)
            return true;
        // Note creators with owner level can manage their own notes
        const ownership = note.ownership;
        const userLevel = ownership[user.id] || CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
        return userLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    }
    /**
     * Set note ownership permissions
     */
    async setNoteOwnership(note, ownership) {
        await note.update({ ownership });
    }
    /**
     * Set a note to be GM-only
     */
    async setGMOnly(note) {
        await this.setNoteOwnership(note, {
            default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
        });
    }
    /**
     * Set a note to be player-visible
     */
    async setPlayerVisible(note) {
        await this.setNoteOwnership(note, {
            default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
        });
    }
    /**
     * Set a note to be player-editable
     */
    async setPlayerEditable(note) {
        await this.setNoteOwnership(note, {
            default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
        });
    }
    /**
     * Give a specific user ownership of a note
     */
    async setUserOwnership(note, userId, level) {
        const currentOwnership = note.ownership || {};
        const newOwnership = {
            ...currentOwnership,
            [userId]: level,
        };
        await this.setNoteOwnership(note, newOwnership);
    }
    /**
     * Remove a user's specific permissions (fall back to default)
     */
    async removeUserOwnership(note, userId) {
        const currentOwnership = note.ownership || {};
        const newOwnership = { ...currentOwnership };
        delete newOwnership[userId];
        await this.setNoteOwnership(note, newOwnership);
    }
    /**
     * Get the effective permission level for a user on a note
     */
    getUserPermissionLevel(user, note) {
        if (user.isGM)
            return CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
        const ownership = note.ownership;
        return ownership[user.id] || ownership.default || CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
    }
    /**
     * Get a human-readable permission level name
     */
    getPermissionLevelName(level) {
        switch (level) {
            case CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE:
                return 'None';
            case CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED:
                return 'Limited';
            case CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER:
                return 'Observer';
            case CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER:
                return 'Owner';
            default:
                return 'Unknown';
        }
    }
    /**
     * Check if an action is a GM-only feature
     */
    isGMOnlyFeature(action) {
        const gmOnlyActions = [
            'manage-permissions',
            'delete-any-note',
            'edit-any-note',
            'view-private-notes',
            'bulk-operations',
            'import-export',
        ];
        return gmOnlyActions.includes(action);
    }
    /**
     * Check if a user can perform a GM-only action
     */
    canPerformGMAction(user, action) {
        if (!this.isGMOnlyFeature(action))
            return true;
        return user.isGM;
    }
    /**
     * Filter notes based on user permissions
     */
    filterNotesByPermission(notes, user, requiredLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) {
        return notes.filter(note => {
            const userLevel = this.getUserPermissionLevel(user, note);
            return userLevel >= requiredLevel;
        });
    }
    /**
     * Get all notes the user can view
     */
    getViewableNotes(user) {
        const allNotes = game.journal?.filter(journal => {
            const flags = journal.flags?.['seasons-and-stars'];
            return flags?.calendarNote === true;
        }) || [];
        return this.filterNotesByPermission(allNotes, user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER);
    }
    /**
     * Get all notes the user can edit
     */
    getEditableNotes(user) {
        const allNotes = game.journal?.filter(journal => {
            const flags = journal.flags?.['seasons-and-stars'];
            return flags?.calendarNote === true;
        }) || [];
        return this.filterNotesByPermission(allNotes, user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
    }
    /**
     * Check if the current user has sufficient permissions for an operation
     */
    checkPermission(operation, note, user) {
        const currentUser = user || game.user;
        if (!currentUser)
            return false;
        switch (operation) {
            case 'create':
                return this.canCreateNote(currentUser);
            case 'view':
                return note ? this.canViewNote(currentUser, note) : false;
            case 'edit':
                return note ? this.canEditNote(currentUser, note) : false;
            case 'delete':
                return note ? this.canDeleteNote(currentUser, note) : false;
            case 'manage':
                return note ? this.canManagePermissions(currentUser, note) : false;
            default:
                return false;
        }
    }
    /**
     * Create ownership object for new notes based on settings
     */
    getDefaultOwnership(creatorId) {
        const playerVisible = game.settings?.get('seasons-and-stars', 'defaultPlayerVisible');
        const playerEditable = game.settings?.get('seasons-and-stars', 'defaultPlayerEditable');
        let defaultLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
        if (playerEditable) {
            defaultLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
        }
        else if (playerVisible) {
            defaultLevel = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
        }
        return {
            [creatorId]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
            default: defaultLevel,
        };
    }
    /**
     * Validate ownership data
     */
    validateOwnership(ownership) {
        const errors = [];
        if (!ownership || typeof ownership !== 'object') {
            errors.push('Ownership must be an object');
            return { isValid: false, errors };
        }
        // Check default level
        if (ownership.default !== undefined) {
            const validLevels = Object.values(CONST.DOCUMENT_OWNERSHIP_LEVELS);
            if (!validLevels.includes(ownership.default)) {
                errors.push(`Invalid default ownership level: ${ownership.default}`);
            }
        }
        // Check user-specific levels
        for (const [userId, level] of Object.entries(ownership)) {
            if (userId === 'default')
                continue;
            const validLevels = Object.values(CONST.DOCUMENT_OWNERSHIP_LEVELS);
            if (!validLevels.includes(level)) {
                errors.push(`Invalid ownership level for user ${userId}: ${level}`);
            }
        }
        return { isValid: errors.length === 0, errors };
    }
    /**
     * Get permission summary for debugging
     */
    getPermissionSummary(note, user) {
        const currentUser = user || game.user;
        if (!currentUser)
            return null;
        return {
            noteId: note.id,
            noteName: note.name,
            userId: currentUser.id,
            userName: currentUser.name,
            isGM: currentUser.isGM,
            permissionLevel: this.getUserPermissionLevel(currentUser, note),
            permissionName: this.getPermissionLevelName(this.getUserPermissionLevel(currentUser, note)),
            canView: this.canViewNote(currentUser, note),
            canEdit: this.canEditNote(currentUser, note),
            canDelete: this.canDeleteNote(currentUser, note),
            canManage: this.canManagePermissions(currentUser, note),
            ownership: note.ownership,
        };
    }
}
/**
 * Singleton instance for global access
 */
const notePermissions = new NotePermissions();

/**
 * Recurring events system for calendar notes
 */
/**
 * Manages recurring events and generates occurrence dates
 */
class NoteRecurrence {
    /**
     * Generate all occurrences for a recurring pattern within a date range
     */
    static generateOccurrences(startDate, pattern, rangeStart, rangeEnd, engine // Calendar engine for date calculations
    ) {
        const occurrences = [];
        let currentDate = { ...startDate };
        let occurrenceIndex = 0;
        // Safety limit to prevent infinite loops
        const maxIterations = 10000;
        let iterations = 0;
        while (iterations < maxIterations) {
            iterations++;
            // Check if we've exceeded our limits
            if (pattern.endDate && this.isDateAfter(currentDate, pattern.endDate)) {
                break;
            }
            if (pattern.maxOccurrences && occurrenceIndex >= pattern.maxOccurrences) {
                break;
            }
            // Check if current date is within our requested range
            if (this.isDateInRange(currentDate, rangeStart, rangeEnd)) {
                const isException = this.isExceptionDate(currentDate, pattern.exceptions || []);
                occurrences.push({
                    date: { ...currentDate },
                    isException,
                    index: occurrenceIndex,
                });
            }
            // If we're past the range end, stop
            if (this.isDateAfter(currentDate, rangeEnd)) {
                break;
            }
            // Calculate next occurrence date
            currentDate = this.getNextOccurrenceDate(currentDate, pattern, engine);
            occurrenceIndex++;
        }
        return occurrences;
    }
    /**
     * Calculate the next occurrence date based on the recurrence pattern
     */
    static getNextOccurrenceDate(currentDate, pattern, engine) {
        switch (pattern.frequency) {
            case 'daily':
                return this.addDays(currentDate, pattern.interval, engine);
            case 'weekly':
                if (pattern.weekdays && pattern.weekdays.length > 0) {
                    return this.getNextWeekdayOccurrence(currentDate, pattern, engine);
                }
                else {
                    // Use calendar-specific week length instead of hardcoded 7
                    const calendar = engine.getCalendar();
                    const weekLength = CalendarTimeUtils.getDaysPerWeek(calendar);
                    return this.addDays(currentDate, weekLength * pattern.interval, engine);
                }
            case 'monthly':
                return this.getNextMonthlyOccurrence(currentDate, pattern, engine);
            case 'yearly':
                return this.getNextYearlyOccurrence(currentDate, pattern, engine);
            default:
                throw new Error(`Unsupported recurrence frequency: ${pattern.frequency}`);
        }
    }
    /**
     * Get next occurrence for weekly pattern with specific weekdays
     */
    static getNextWeekdayOccurrence(currentDate, pattern, engine) {
        if (!pattern.weekdays || pattern.weekdays.length === 0) {
            // Use calendar-specific week length instead of hardcoded 7
            const calendar = engine.getCalendar();
            const weekLength = CalendarTimeUtils.getDaysPerWeek(calendar);
            return this.addDays(currentDate, weekLength * pattern.interval, engine);
        }
        const weekdayNumbers = pattern.weekdays.map(day => this.weekdayNameToNumber(day));
        weekdayNumbers.sort((a, b) => a - b);
        const currentWeekday = currentDate.weekday || 0;
        // Find next weekday in current week
        const nextWeekday = weekdayNumbers.find(day => day > currentWeekday);
        if (nextWeekday !== undefined) {
            // Next occurrence is in the same week
            const daysToAdd = nextWeekday - currentWeekday;
            return this.addDays(currentDate, daysToAdd, engine);
        }
        else {
            // Move to next interval week and use first weekday
            const calendar = engine.getCalendar();
            const weekLength = CalendarTimeUtils.getDaysPerWeek(calendar);
            const daysToNextWeek = weekLength - currentWeekday + weekdayNumbers[0];
            const daysToAdd = daysToNextWeek + (pattern.interval - 1) * weekLength;
            return this.addDays(currentDate, daysToAdd, engine);
        }
    }
    /**
     * Get next occurrence for monthly pattern
     */
    static getNextMonthlyOccurrence(currentDate, pattern, engine) {
        if (pattern.monthDay) {
            // Specific day of month (e.g., 15th of every month)
            let nextDate = { ...currentDate };
            // Try same month first
            if (currentDate.day < pattern.monthDay) {
                nextDate.day = pattern.monthDay;
                if (this.isValidDate(nextDate, engine)) {
                    return nextDate;
                }
            }
            // Move to next interval month
            nextDate = this.addMonths(currentDate, pattern.interval, engine);
            nextDate.day = Math.min(pattern.monthDay, engine.getMonthLength(nextDate.month, nextDate.year));
            return nextDate;
        }
        else if (pattern.monthWeek && pattern.monthWeekday) {
            // Specific weekday of specific week (e.g., 2nd Tuesday of every month)
            return this.getNextMonthlyWeekdayOccurrence(currentDate, pattern, engine);
        }
        else {
            // Default: same day of next interval month
            return this.addMonths(currentDate, pattern.interval, engine);
        }
    }
    /**
     * Get next occurrence for monthly weekday pattern (e.g., 2nd Tuesday)
     */
    static getNextMonthlyWeekdayOccurrence(currentDate, pattern, engine) {
        if (!pattern.monthWeek || !pattern.monthWeekday) {
            return this.addMonths(currentDate, pattern.interval, engine);
        }
        const targetWeekday = this.weekdayNameToNumber(pattern.monthWeekday);
        // Try current month first
        const currentMonthDate = this.getNthWeekdayOfMonth(currentDate.year, currentDate.month, pattern.monthWeek, targetWeekday, engine);
        if (currentMonthDate && this.isDateAfter(currentMonthDate, currentDate)) {
            return currentMonthDate;
        }
        // Move to next interval month
        const nextMonth = this.addMonths(currentDate, pattern.interval, engine);
        const nextMonthDate = this.getNthWeekdayOfMonth(nextMonth.year, nextMonth.month, pattern.monthWeek, targetWeekday, engine);
        return nextMonthDate || this.addMonths(currentDate, pattern.interval, engine);
    }
    /**
     * Get next occurrence for yearly pattern
     */
    static getNextYearlyOccurrence(currentDate, pattern, engine) {
        const targetMonth = pattern.yearMonth || currentDate.month;
        const targetDay = pattern.yearDay || currentDate.day;
        // Try current year first
        if (currentDate.month < targetMonth ||
            (currentDate.month === targetMonth && currentDate.day < targetDay)) {
            const thisYearDateData = {
                year: currentDate.year,
                month: targetMonth,
                day: targetDay,
                weekday: engine.calculateWeekday(currentDate.year, targetMonth, targetDay),
                time: currentDate.time,
            };
            const calendar = engine.getCalendar();
            const thisYearDate = new CalendarDate(thisYearDateData, calendar);
            if (this.isValidDate(thisYearDate, engine)) {
                return thisYearDate;
            }
        }
        // Move to next interval year
        const nextYear = currentDate.year + pattern.interval;
        const maxDay = engine.getMonthLength(targetMonth, nextYear);
        const nextYearDay = Math.min(targetDay, maxDay);
        const nextYearDateData = {
            year: nextYear,
            month: targetMonth,
            day: nextYearDay,
            weekday: engine.calculateWeekday(nextYear, targetMonth, nextYearDay),
            time: currentDate.time,
        };
        const calendar = engine.getCalendar();
        return new CalendarDate(nextYearDateData, calendar);
    }
    /**
     * Add days to a date using the calendar engine
     */
    static addDays(date, days, engine) {
        // Convert to world time, add days, convert back
        const worldTime = engine.dateToWorldTime(date);
        // Use calendar-specific day length instead of hardcoded 24 * 60 * 60
        const calendar = engine.getCalendar();
        const dayInSeconds = CalendarTimeUtils.getSecondsPerDay(calendar);
        const newWorldTime = worldTime + days * dayInSeconds;
        const result = engine.worldTimeToDate(newWorldTime);
        // Ensure we return a proper CalendarDate instance
        if (result instanceof CalendarDate) {
            return result;
        }
        else {
            // Convert plain object to CalendarDate instance
            return new CalendarDate(result, calendar);
        }
    }
    /**
     * Add months to a date using the calendar engine
     */
    static addMonths(date, months, engine) {
        let newYear = date.year;
        let newMonth = date.month + months;
        // Handle year overflow/underflow using calendar-specific month count
        const calendar = engine.getCalendar();
        const monthsPerYear = CalendarTimeUtils.getMonthsPerYear(calendar);
        while (newMonth > monthsPerYear) {
            newMonth -= monthsPerYear;
            newYear++;
        }
        while (newMonth < 1) {
            newMonth += monthsPerYear;
            newYear--;
        }
        // Handle day overflow (e.g., Jan 31 + 1 month should be Feb 28/29)
        const maxDay = engine.getMonthLength(newMonth, newYear);
        const newDay = Math.min(date.day, maxDay);
        const newDateData = {
            year: newYear,
            month: newMonth,
            day: newDay,
            weekday: engine.calculateWeekday(newYear, newMonth, newDay),
            time: date.time,
        };
        return new CalendarDate(newDateData, calendar);
    }
    /**
     * Get the Nth occurrence of a weekday in a month
     */
    static getNthWeekdayOfMonth(year, month, week, weekday, engine) {
        // Find first occurrence of weekday in month
        let day = 1;
        let foundWeekday = engine.calculateWeekday(year, month, day);
        const calendar = engine.getCalendar();
        const weekLength = CalendarTimeUtils.getDaysPerWeek(calendar);
        while (foundWeekday !== weekday && day <= weekLength) {
            day++;
            if (day <= engine.getMonthLength(month, year)) {
                foundWeekday = engine.calculateWeekday(year, month, day);
            }
            else {
                return null; // Weekday doesn't exist in this month
            }
        }
        // Add weeks to get to the Nth occurrence
        const targetDay = day + (week - 1) * weekLength;
        if (targetDay > engine.getMonthLength(month, year)) {
            return null; // Nth occurrence doesn't exist
        }
        const dateData = {
            year,
            month,
            day: targetDay,
            weekday: engine.calculateWeekday(year, month, targetDay),
            time: { hour: 0, minute: 0, second: 0 },
        };
        return new CalendarDate(dateData, calendar);
    }
    /**
     * Convert weekday name to number (0 = Sunday, 6 = Saturday)
     */
    static weekdayNameToNumber(weekday) {
        const mapping = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };
        return mapping[weekday] || 0;
    }
    /**
     * Check if a date is within a range (inclusive)
     */
    static isDateInRange(date, start, end) {
        return (!CalendarTimeUtils.isDateBefore(date, start) && !CalendarTimeUtils.isDateAfter(date, end));
    }
    /**
     * Check if date A is before date B
     */
    static isDateBefore(dateA, dateB) {
        return CalendarTimeUtils.isDateBefore(dateA, dateB);
    }
    /**
     * Check if date A is after date B
     */
    static isDateAfter(dateA, dateB) {
        return CalendarTimeUtils.isDateAfter(dateA, dateB);
    }
    /**
     * Check if a date is an exception (should be skipped)
     */
    static isExceptionDate(date, exceptions) {
        return exceptions.some(exception => CalendarTimeUtils.isDateEqual(date, exception));
    }
    /**
     * Validate that a date is valid for the calendar
     */
    static isValidDate(date, engine) {
        try {
            const monthLength = engine.getMonthLength(date.month, date.year);
            return date.day >= 1 && date.day <= monthLength;
        }
        catch {
            return false;
        }
    }
    /**
     * Create a simple recurring pattern
     */
    static createSimplePattern(frequency, interval = 1, options = {}) {
        return {
            frequency,
            interval,
            ...options,
        };
    }
    /**
     * Create a weekly pattern for specific days
     */
    static createWeeklyPattern(weekdays, interval = 1, options = {}) {
        return {
            frequency: 'weekly',
            interval,
            weekdays,
            ...options,
        };
    }
    /**
     * Create a monthly pattern for a specific day
     */
    static createMonthlyDayPattern(dayOfMonth, interval = 1, options = {}) {
        return {
            frequency: 'monthly',
            interval,
            monthDay: dayOfMonth,
            ...options,
        };
    }
    /**
     * Create a monthly pattern for a specific weekday of a specific week
     */
    static createMonthlyWeekdayPattern(week, weekday, interval = 1, options = {}) {
        return {
            frequency: 'monthly',
            interval,
            monthWeek: week,
            monthWeekday: weekday,
            ...options,
        };
    }
    /**
     * Create a yearly pattern
     */
    static createYearlyPattern(month, day, interval = 1, options = {}) {
        return {
            frequency: 'yearly',
            interval,
            yearMonth: month,
            yearDay: day,
            ...options,
        };
    }
}

/**
 * Search and filtering system for calendar notes
 */
/**
 * Search and filter calendar notes
 */
class NoteSearch {
    /**
     * Search notes based on criteria
     */
    static async searchNotes(criteria) {
        const startTime = performance.now();
        // Get all calendar notes
        const allNotes = this.getAllCalendarNotes();
        // Apply filters
        let filteredNotes = allNotes;
        if (criteria.query) {
            filteredNotes = this.filterByText(filteredNotes, criteria.query);
        }
        if (criteria.dateFrom || criteria.dateTo) {
            filteredNotes = this.filterByDateRange(filteredNotes, criteria.dateFrom, criteria.dateTo);
        }
        if (criteria.categories && criteria.categories.length > 0) {
            filteredNotes = this.filterByCategories(filteredNotes, criteria.categories, false);
        }
        if (criteria.excludeCategories && criteria.excludeCategories.length > 0) {
            filteredNotes = this.filterByCategories(filteredNotes, criteria.excludeCategories, true);
        }
        if (criteria.tags && criteria.tags.length > 0) {
            filteredNotes = this.filterByTags(filteredNotes, criteria.tags, 'all');
        }
        if (criteria.anyTags && criteria.anyTags.length > 0) {
            filteredNotes = this.filterByTags(filteredNotes, criteria.anyTags, 'any');
        }
        if (criteria.excludeTags && criteria.excludeTags.length > 0) {
            filteredNotes = this.filterByTags(filteredNotes, criteria.excludeTags, 'exclude');
        }
        if (criteria.playerVisible !== undefined) {
            filteredNotes = this.filterByPlayerVisibility(filteredNotes, criteria.playerVisible);
        }
        if (criteria.isRecurring !== undefined) {
            filteredNotes = this.filterByRecurring(filteredNotes, criteria.isRecurring);
        }
        if (criteria.author) {
            filteredNotes = this.filterByAuthor(filteredNotes, criteria.author);
        }
        // Sort results
        const sortBy = criteria.sortBy || 'created';
        const sortOrder = criteria.sortOrder || 'desc';
        filteredNotes = this.sortNotes(filteredNotes, sortBy, sortOrder);
        // Apply pagination
        const totalCount = filteredNotes.length;
        const offset = criteria.offset || 0;
        const limit = criteria.limit || 50;
        const paginatedNotes = filteredNotes.slice(offset, offset + limit);
        const hasMore = offset + limit < totalCount;
        const searchTime = performance.now() - startTime;
        return {
            notes: paginatedNotes,
            totalCount,
            hasMore,
            searchTime,
        };
    }
    /**
     * Get all calendar notes
     */
    static getAllCalendarNotes() {
        return game.journal.filter(journal => {
            const flags = journal.flags?.['seasons-and-stars'];
            return flags?.calendarNote === true;
        });
    }
    /**
     * Filter notes by text search in title and content
     */
    static filterByText(notes, query) {
        if (!query.trim())
            return notes;
        const searchTerms = query
            .toLowerCase()
            .split(/\s+/)
            .filter(term => term.length > 0);
        return notes.filter(note => {
            const title = note.name?.toLowerCase() || '';
            const content = note.pages.values().next().value?.text?.content?.toLowerCase() || '';
            const searchText = `${title} ${content}`;
            // All search terms must be found
            return searchTerms.every(term => searchText.includes(term));
        });
    }
    /**
     * Filter notes by date range
     */
    static filterByDateRange(notes, dateFrom, dateTo) {
        return notes.filter(note => {
            const flags = note.flags?.['seasons-and-stars'];
            if (!flags?.startDate)
                return false;
            const noteDate = flags.startDate;
            if (dateFrom && this.isDateBefore(noteDate, dateFrom)) {
                return false;
            }
            if (dateTo && this.isDateAfter(noteDate, dateTo)) {
                return false;
            }
            return true;
        });
    }
    /**
     * Filter notes by categories
     */
    static filterByCategories(notes, categories, exclude = false) {
        return notes.filter(note => {
            const flags = note.flags?.['seasons-and-stars'];
            const noteCategory = flags?.category || 'general';
            const isInCategory = categories.includes(noteCategory);
            return exclude ? !isInCategory : isInCategory;
        });
    }
    /**
     * Filter notes by tags
     */
    static filterByTags(notes, tags, mode) {
        return notes.filter(note => {
            const flags = note.flags?.['seasons-and-stars'];
            const noteTags = (flags?.tags || []).map(tag => tag.toLowerCase());
            const searchTags = tags.map(tag => tag.toLowerCase());
            switch (mode) {
                case 'all':
                    return searchTags.every(tag => noteTags.includes(tag));
                case 'any':
                    return searchTags.some(tag => noteTags.includes(tag));
                case 'exclude':
                    return !searchTags.some(tag => noteTags.includes(tag));
                default:
                    return true;
            }
        });
    }
    /**
     * Filter notes by player visibility
     */
    static filterByPlayerVisibility(notes, playerVisible) {
        return notes.filter(note => {
            const isVisible = note.ownership?.default >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
            return isVisible === playerVisible;
        });
    }
    /**
     * Filter notes by recurring status
     */
    static filterByRecurring(notes, isRecurring) {
        return notes.filter(note => {
            const flags = note.flags?.['seasons-and-stars'];
            const noteIsRecurring = flags?.isRecurringParent === true || !!flags?.recurringParentId;
            return noteIsRecurring === isRecurring;
        });
    }
    /**
     * Filter notes by author
     */
    static filterByAuthor(notes, authorId) {
        return notes.filter(note => note.author?.id === authorId);
    }
    /**
     * Sort notes by criteria
     */
    static sortNotes(notes, sortBy, sortOrder) {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        return notes.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'title':
                    comparison = (a.name || '').localeCompare(b.name || '');
                    break;
                case 'category': {
                    const catA = a.flags?.['seasons-and-stars']?.category || 'general';
                    const catB = b.flags?.['seasons-and-stars']?.category || 'general';
                    comparison = catA.localeCompare(catB);
                    break;
                }
                case 'date': {
                    const dateA = a.flags?.['seasons-and-stars']?.startDate;
                    const dateB = b.flags?.['seasons-and-stars']?.startDate;
                    if (dateA && dateB) {
                        comparison = this.compareDates(dateA, dateB);
                    }
                    break;
                }
                case 'created': {
                    const createdA = a.flags?.['seasons-and-stars']?.created || 0;
                    const createdB = b.flags?.['seasons-and-stars']?.created || 0;
                    comparison = createdA - createdB;
                    break;
                }
                case 'modified': {
                    const modifiedA = a.flags?.['seasons-and-stars']?.modified || 0;
                    const modifiedB = b.flags?.['seasons-and-stars']?.modified || 0;
                    comparison = modifiedA - modifiedB;
                    break;
                }
            }
            return comparison * multiplier;
        });
    }
    /**
     * Compare two dates
     */
    static compareDates(dateA, dateB) {
        if (dateA.year !== dateB.year)
            return dateA.year - dateB.year;
        if (dateA.month !== dateB.month)
            return dateA.month - dateB.month;
        return dateA.day - dateB.day;
    }
    /**
     * Check if date A is before date B
     */
    static isDateBefore(dateA, dateB) {
        return this.compareDates(dateA, dateB) < 0;
    }
    /**
     * Check if date A is after date B
     */
    static isDateAfter(dateA, dateB) {
        return this.compareDates(dateA, dateB) > 0;
    }
    /**
     * Get search suggestions based on existing notes
     */
    static getSearchSuggestions() {
        const notes = this.getAllCalendarNotes();
        const categories = new Set();
        const tags = new Set();
        const authors = new Set();
        notes.forEach(note => {
            const flags = note.flags?.['seasons-and-stars'];
            // Collect categories
            if (flags?.category) {
                categories.add(flags.category);
            }
            // Collect tags
            if (flags?.tags) {
                flags.tags.forEach((tag) => tags.add(tag));
            }
            // Collect authors
            if (note.author?.name) {
                authors.add(note.author.name);
            }
        });
        return {
            categories: Array.from(categories).sort(),
            tags: Array.from(tags).sort(),
            authors: Array.from(authors).sort(),
        };
    }
    /**
     * Create quick search presets
     */
    static getSearchPresets() {
        return {
            recent: {
                sortBy: 'created',
                sortOrder: 'desc',
                limit: 10,
            },
            upcoming: {
                dateFrom: this.getCurrentDate(),
                sortBy: 'date',
                sortOrder: 'asc',
                limit: 10,
            },
            recurring: {
                isRecurring: true,
                sortBy: 'title',
                sortOrder: 'asc',
            },
            important: {
                anyTags: ['important', 'urgent'],
                sortBy: 'created',
                sortOrder: 'desc',
            },
            'player-visible': {
                playerVisible: true,
                sortBy: 'date',
                sortOrder: 'asc',
            },
        };
    }
    /**
     * Get current date from calendar manager
     */
    static getCurrentDate() {
        const currentDate = game.seasonsStars?.manager?.getCurrentDate();
        if (currentDate) {
            return currentDate;
        }
        // Fallback to a reasonable default
        const fallbackData = {
            year: 2024,
            month: 1,
            day: 1,
            weekday: 0,
            time: { hour: 0, minute: 0, second: 0 },
        };
        // Create a CalendarDate instance - need calendar for this
        const manager = game.seasonsStars?.manager;
        const calendar = manager?.getActiveCalendar();
        if (calendar) {
            return new CalendarDate(fallbackData, calendar);
        }
        // If no calendar available, this shouldn't happen but return the data
        return fallbackData;
    }
}

/**
 * Notes management system for Seasons & Stars calendar integration
 */
/**
 * Central coordinator for all calendar note operations
 */
class NotesManager {
    constructor() {
        this.initialized = false;
        this.notesFolderId = null;
        this.storage = new NoteStorage();
    }
    /**
     * Check if the notes manager is initialized
     */
    isInitialized() {
        return this.initialized;
    }
    /**
     * Initialize the notes manager
     */
    async initialize() {
        if (this.initialized)
            return;
        Logger.info('Initializing Notes Manager');
        // Initialize storage system
        this.storage.initialize();
        // Initialize notes folder
        await this.initializeNotesFolder();
        // Check if we have a large collection and optimize accordingly
        const noteCount = this.getAllCalendarNotes().length;
        if (noteCount > 500) {
            Logger.info(`Large note collection detected (${noteCount} notes) - applying optimizations`);
            await this.storage.optimizeForLargeCollections();
        }
        this.initialized = true;
        Logger.info('Notes Manager initialized');
    }
    /**
     * Create a new calendar note
     */
    async createNote(data) {
        if (!this.initialized) {
            throw new Error('NotesManager not initialized');
        }
        const noteFolder = await this.getOrCreateNotesFolder();
        const activeCalendar = game.seasonsStars?.manager?.getActiveCalendar();
        if (!activeCalendar) {
            throw new Error('No active calendar available');
        }
        // Create the journal entry
        const journal = await JournalEntry.create({
            name: data.title,
            folder: noteFolder.id,
            ownership: data.playerVisible ? { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER } : {},
            flags: {
                'seasons-and-stars': {
                    calendarNote: true,
                    version: '1.0',
                    dateKey: this.formatDateKey(data.startDate),
                    startDate: data.startDate,
                    endDate: data.endDate,
                    allDay: data.allDay,
                    calendarId: data.calendarId || activeCalendar.id,
                    category: data.category || 'general',
                    tags: data.tags || [],
                    recurring: data.recurring,
                    isRecurringParent: !!data.recurring,
                    created: Date.now(),
                    modified: Date.now(),
                },
            },
        });
        if (!journal) {
            throw new Error('Failed to create journal entry');
        }
        // Create content page using v13 pages system
        await journal.createEmbeddedDocuments('JournalEntryPage', [
            {
                type: 'text',
                name: 'Content',
                text: { content: data.content },
            },
        ]);
        // Add to storage system
        await this.storage.storeNote(journal, data.startDate);
        // Handle recurring notes - generate initial occurrences
        if (data.recurring) {
            await this.generateRecurringOccurrences(journal, data.recurring, data.startDate);
        }
        // Emit hook for note creation
        Hooks.callAll('seasons-stars:noteCreated', journal);
        Logger.info(`Created note: ${data.title}${data.recurring ? ' (recurring)' : ''}`);
        return journal;
    }
    /**
     * Update an existing calendar note
     */
    async updateNote(noteId, data) {
        const journal = game.journal?.get(noteId);
        if (!journal) {
            throw new Error(`Note ${noteId} not found`);
        }
        // Verify this is a calendar note
        const flags = journal.flags?.['seasons-and-stars'];
        if (!flags?.calendarNote) {
            throw new Error(`Journal entry ${noteId} is not a calendar note`);
        }
        // Build update object
        const updateData = {};
        // Update basic properties
        if (data.title !== undefined) {
            updateData.name = data.title;
        }
        // Update flags
        const flagUpdates = {
            modified: Date.now(),
        };
        if (data.startDate !== undefined) {
            flagUpdates.startDate = data.startDate;
            flagUpdates.dateKey = this.formatDateKey(data.startDate);
        }
        if (data.endDate !== undefined)
            flagUpdates.endDate = data.endDate;
        if (data.allDay !== undefined)
            flagUpdates.allDay = data.allDay;
        if (data.category !== undefined)
            flagUpdates.category = data.category;
        if (data.tags !== undefined)
            flagUpdates.tags = data.tags;
        updateData['flags.seasons-and-stars'] = flagUpdates;
        // Update ownership if visibility changed
        if (data.playerVisible !== undefined) {
            updateData.ownership = data.playerVisible
                ? { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER }
                : {};
        }
        await journal.update(updateData);
        // Update content if provided
        if (data.content !== undefined) {
            const pages = journal.pages;
            if (pages.size > 0) {
                const contentPage = pages.values().next().value;
                if (contentPage?.update) {
                    await contentPage.update({
                        'text.content': data.content,
                    });
                }
            }
        }
        // Emit hook for note update
        Hooks.callAll('seasons-stars:noteUpdated', journal);
        Logger.info(`Updated note: ${journal.name}`);
        return journal;
    }
    /**
     * Delete a calendar note
     */
    async deleteNote(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal) {
            throw new Error(`Note ${noteId} not found`);
        }
        // Verify this is a calendar note
        const flags = journal.flags?.['seasons-and-stars'];
        if (!flags?.calendarNote) {
            throw new Error(`Journal entry ${noteId} is not a calendar note`);
        }
        // Remove from storage system
        await this.storage.removeNote(noteId);
        await journal.delete();
        // Emit hook for note deletion
        Hooks.callAll('seasons-stars:noteDeleted', noteId);
        Logger.info(`Deleted note: ${journal.name}`);
    }
    /**
     * Get a specific calendar note
     */
    async getNote(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return null;
        // Verify this is a calendar note
        const flags = journal.flags?.['seasons-and-stars'];
        if (!flags?.calendarNote)
            return null;
        return journal;
    }
    /**
     * Get all notes for a specific date
     */
    async getNotesForDate(date) {
        if (!this.initialized) {
            throw new Error('NotesManager not initialized');
        }
        return await this.storage.findNotesByDate(date);
    }
    /**
     * Get all notes for a date range
     */
    async getNotesForDateRange(start, end) {
        if (!this.initialized) {
            throw new Error('NotesManager not initialized');
        }
        return await this.storage.findNotesByDateRange(start, end);
    }
    /**
     * Set module-specific data on a note
     */
    async setNoteModuleData(noteId, moduleId, data) {
        const journal = game.journal?.get(noteId);
        if (!journal) {
            throw new Error(`Note ${noteId} not found`);
        }
        await journal.setFlag(moduleId, 'data', data);
        // Update modification timestamp
        await journal.setFlag('seasons-and-stars', 'modified', Date.now());
    }
    /**
     * Get module-specific data from a note
     */
    getNoteModuleData(noteId, moduleId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return null;
        return journal.getFlag(moduleId, 'data');
    }
    /**
     * Initialize the notes folder if it doesn't exist
     */
    async initializeNotesFolder() {
        await this.getOrCreateNotesFolder();
    }
    /**
     * Get or create the notes folder
     */
    async getOrCreateNotesFolder() {
        // Try to find existing folder
        const existingFolder = game.folders?.find(f => f.type === 'JournalEntry' &&
            f.getFlag?.('seasons-and-stars', 'notesFolder') === true);
        if (existingFolder) {
            this.notesFolderId = existingFolder.id;
            return existingFolder;
        }
        // Create new folder
        const folder = await Folder.create({
            name: 'Calendar Notes',
            type: 'JournalEntry',
            flags: {
                'seasons-and-stars': {
                    notesFolder: true,
                    version: '1.0',
                },
            },
        });
        if (!folder) {
            throw new Error('Failed to create notes folder');
        }
        this.notesFolderId = folder.id;
        Logger.info('Created Calendar Notes folder');
        return folder;
    }
    /**
     * Format a date as a key for storage (YYYY-MM-DD format, 1-based)
     */
    formatDateKey(date) {
        const year = date.year.toString().padStart(4, '0');
        const month = date.month.toString().padStart(2, '0');
        const day = date.day.toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * Check if a date is within a range (inclusive)
     */
    isDateInRange(date, start, end) {
        return this.compareDates(date, start) >= 0 && this.compareDates(date, end) <= 0;
    }
    /**
     * Compare two dates
     */
    compareDates(a, b) {
        if (a.year !== b.year)
            return a.year - b.year;
        if (a.month !== b.month)
            return a.month - b.month;
        return a.day - b.day;
    }
    /**
     * Rebuild storage index (useful after bulk operations)
     */
    rebuildStorageIndex() {
        if (!this.initialized)
            return;
        this.storage.rebuildIndex();
    }
    /**
     * Get storage statistics for debugging
     */
    getStorageStats() {
        if (!this.initialized)
            return null;
        return this.storage.getCacheStats();
    }
    /**
     * Check if current user can create notes
     */
    canCreateNote() {
        return notePermissions.canCreateNote(game.user);
    }
    /**
     * Check if current user can edit a note
     */
    canEditNote(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return false;
        return notePermissions.canEditNote(game.user, journal);
    }
    /**
     * Check if current user can delete a note
     */
    canDeleteNote(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return false;
        return notePermissions.canDeleteNote(game.user, journal);
    }
    /**
     * Check if current user can view a note
     */
    canViewNote(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return false;
        return notePermissions.canViewNote(game.user, journal);
    }
    /**
     * Get all notes the current user can view
     */
    getUserViewableNotes() {
        return notePermissions.getViewableNotes(game.user);
    }
    /**
     * Get all notes the current user can edit
     */
    getUserEditableNotes() {
        return notePermissions.getEditableNotes(game.user);
    }
    /**
     * Search notes based on criteria
     */
    async searchNotes(criteria) {
        if (!this.initialized) {
            throw new Error('NotesManager not initialized');
        }
        return await NoteSearch.searchNotes(criteria);
    }
    /**
     * Get search suggestions based on existing notes
     */
    getSearchSuggestions() {
        return NoteSearch.getSearchSuggestions();
    }
    /**
     * Get predefined search presets
     */
    getSearchPresets() {
        return NoteSearch.getSearchPresets();
    }
    /**
     * Quick search for notes by text
     */
    async quickSearch(query, limit = 10) {
        const result = await this.searchNotes({
            query,
            limit,
            sortBy: 'created',
            sortOrder: 'desc',
        });
        return result.notes;
    }
    /**
     * Get notes for a specific category
     */
    async getNotesByCategory(category, limit) {
        const result = await this.searchNotes({
            categories: [category],
            limit,
            sortBy: 'date',
            sortOrder: 'asc',
        });
        return result.notes;
    }
    /**
     * Get notes with specific tags
     */
    async getNotesByTags(tags, matchAll = true, limit) {
        const searchCriteria = {
            limit,
            sortBy: 'date',
            sortOrder: 'asc',
        };
        if (matchAll) {
            searchCriteria.tags = tags;
        }
        else {
            searchCriteria.anyTags = tags;
        }
        const result = await this.searchNotes(searchCriteria);
        return result.notes;
    }
    /**
     * Get upcoming notes (from current date forward)
     */
    async getUpcomingNotes(limit = 20) {
        const currentDate = game.seasonsStars?.manager?.getCurrentDate();
        if (!currentDate)
            return [];
        const result = await this.searchNotes({
            dateFrom: currentDate,
            limit,
            sortBy: 'date',
            sortOrder: 'asc',
        });
        return result.notes;
    }
    /**
     * Get recent notes (by creation date)
     */
    async getRecentNotes(limit = 10) {
        const result = await this.searchNotes({
            limit,
            sortBy: 'created',
            sortOrder: 'desc',
        });
        return result.notes;
    }
    /**
     * Generate recurring occurrences for a note
     */
    async generateRecurringOccurrences(parentNote, pattern, startDate) {
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine) {
            Logger.warn('No calendar engine available for recurring note generation');
            return;
        }
        // Generate occurrences for next 2 years to start
        const currentDate = game.seasonsStars?.manager?.getCurrentDate();
        if (!currentDate)
            return;
        const rangeStart = currentDate;
        const rangeEndData = {
            year: rangeStart.year + 2,
            month: rangeStart.month,
            day: rangeStart.day,
            weekday: rangeStart.weekday,
            time: rangeStart.time,
        };
        const calendar = game.seasonsStars?.manager?.getActiveCalendar();
        const rangeEnd = calendar ? new CalendarDate(rangeEndData, calendar) : rangeStart;
        const occurrences = NoteRecurrence.generateOccurrences(startDate, pattern, rangeStart, rangeEnd, engine);
        Logger.info(`Generating ${occurrences.length} recurring occurrences`);
        // Create notes for each occurrence (except exceptions)
        for (const occurrence of occurrences) {
            if (occurrence.isException || occurrence.index === 0) {
                continue; // Skip exceptions and the original note
            }
            await this.createRecurringOccurrence(parentNote, occurrence.date);
        }
    }
    /**
     * Create a single recurring occurrence note
     */
    async createRecurringOccurrence(parentNote, occurrenceDate) {
        const noteFolder = await this.getOrCreateNotesFolder();
        const parentFlags = parentNote.flags['seasons-and-stars'];
        const parentContent = parentNote.pages.values().next().value?.text?.content || '';
        // Create the occurrence note
        const journal = await JournalEntry.create({
            name: `${parentNote.name} (${this.formatDateKey(occurrenceDate)})`,
            folder: noteFolder.id,
            ownership: parentNote.ownership,
            flags: {
                'seasons-and-stars': {
                    calendarNote: true,
                    version: '1.0',
                    dateKey: this.formatDateKey(occurrenceDate),
                    startDate: occurrenceDate,
                    endDate: parentFlags.endDate,
                    allDay: parentFlags.allDay,
                    calendarId: parentFlags.calendarId,
                    category: parentFlags.category,
                    tags: parentFlags.tags,
                    recurringParentId: parentNote.id,
                    isRecurringParent: false,
                    created: Date.now(),
                    modified: Date.now(),
                },
            },
        });
        if (!journal) {
            throw new Error('Failed to create recurring occurrence');
        }
        // Create content page
        await journal.createEmbeddedDocuments('JournalEntryPage', [
            {
                type: 'text',
                name: 'Content',
                text: { content: parentContent },
            },
        ]);
        // Add to storage system
        await this.storage.storeNote(journal, occurrenceDate);
        return journal;
    }
    /**
     * Get all recurring occurrences for a parent note
     */
    getRecurringOccurrences(parentNoteId) {
        return game.journal.filter(journal => {
            const flags = journal.flags?.['seasons-and-stars'];
            return flags?.calendarNote && flags?.recurringParentId === parentNoteId;
        });
    }
    /**
     * Delete recurring note and all its occurrences
     */
    async deleteRecurringNote(parentNoteId) {
        const parentNote = game.journal?.get(parentNoteId);
        if (!parentNote) {
            throw new Error(`Parent note ${parentNoteId} not found`);
        }
        // Check permissions
        if (!notePermissions.canDeleteNote(game.user, parentNote)) {
            throw new Error('Insufficient permissions to delete recurring note');
        }
        // Get all occurrences
        const occurrences = this.getRecurringOccurrences(parentNoteId);
        // Delete all occurrences first
        for (const occurrence of occurrences) {
            await this.deleteNote(occurrence.id);
        }
        // Delete the parent note
        await this.deleteNote(parentNoteId);
        Logger.info(`Deleted recurring note and ${occurrences.length} occurrences`);
    }
    /**
     * Update recurring pattern for a note
     */
    async updateRecurringPattern(parentNoteId, newPattern) {
        const parentNote = game.journal?.get(parentNoteId);
        if (!parentNote) {
            throw new Error(`Parent note ${parentNoteId} not found`);
        }
        // Check permissions
        if (!notePermissions.canEditNote(game.user, parentNote)) {
            throw new Error('Insufficient permissions to update recurring note');
        }
        // Update the parent note's pattern
        await parentNote.setFlag('seasons-and-stars', 'recurring', newPattern);
        await parentNote.setFlag('seasons-and-stars', 'modified', Date.now());
        // Delete existing occurrences
        const existingOccurrences = this.getRecurringOccurrences(parentNoteId);
        for (const occurrence of existingOccurrences) {
            await this.deleteNote(occurrence.id);
        }
        // Generate new occurrences
        const startDate = parentNote.flags['seasons-and-stars'].startDate;
        await this.generateRecurringOccurrences(parentNote, newPattern, startDate);
        Logger.info('Updated recurring pattern and regenerated occurrences');
    }
    /**
     * Check if a note is a recurring parent
     */
    isRecurringParent(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return false;
        const flags = journal.flags?.['seasons-and-stars'];
        return flags?.calendarNote && flags?.isRecurringParent === true;
    }
    /**
     * Check if a note is a recurring occurrence
     */
    isRecurringOccurrence(noteId) {
        const journal = game.journal?.get(noteId);
        if (!journal)
            return false;
        const flags = journal.flags?.['seasons-and-stars'];
        return flags?.calendarNote && !!flags?.recurringParentId;
    }
    /**
     * Get the parent note for a recurring occurrence
     */
    getRecurringParent(occurrenceId) {
        const occurrence = game.journal?.get(occurrenceId);
        if (!occurrence)
            return null;
        const parentId = occurrence.flags?.['seasons-and-stars']?.recurringParentId;
        if (!parentId)
            return null;
        return game.journal?.get(parentId) || null;
    }
    /**
     * Get all calendar notes in the system
     */
    getAllCalendarNotes() {
        if (!game.journal)
            return [];
        return game.journal.filter(journal => {
            const flags = journal.flags?.['seasons-and-stars'];
            return flags?.calendarNote === true;
        });
    }
    /**
     * Get performance metrics for monitoring
     */
    getPerformanceMetrics() {
        return this.storage.getPerformanceMetrics();
    }
    /**
     * Optimize the notes system for better performance
     */
    async optimizePerformance() {
        Logger.info('Starting notes system optimization...');
        await this.storage.optimizeForLargeCollections();
        // Clean up any orphaned data
        await this.cleanupOrphanedData();
        Logger.info('Notes system optimization completed');
    }
    /**
     * Clean up orphaned data
     */
    async cleanupOrphanedData() {
        const allNotes = this.getAllCalendarNotes();
        let orphanedCount = 0;
        for (const note of allNotes) {
            const flags = note.flags?.['seasons-and-stars'];
            // Check for recurring orphans
            if (flags?.recurringParentId) {
                const parent = game.journal?.get(flags.recurringParentId);
                if (!parent) {
                    Logger.warn(`Found orphaned recurring note: ${note.id}`);
                    // Could optionally clean up or convert to standalone note
                    orphanedCount++;
                }
            }
        }
        if (orphanedCount > 0) {
            Logger.info(`Found ${orphanedCount} orphaned notes during cleanup`);
        }
    }
}

/**
 * Note categories and tagging system for calendar notes
 */
/**
 * Default note categories with icons and colors
 */
const DEFAULT_CATEGORIES = [
    {
        id: 'general',
        name: 'General',
        icon: 'fas fa-sticky-note',
        color: '#4a90e2',
        description: 'General notes and reminders',
        isDefault: true,
    },
    {
        id: 'event',
        name: 'Event',
        icon: 'fas fa-calendar-star',
        color: '#7b68ee',
        description: 'Special events and occasions',
    },
    {
        id: 'reminder',
        name: 'Reminder',
        icon: 'fas fa-bell',
        color: '#ffa500',
        description: 'Important reminders and deadlines',
    },
    {
        id: 'weather',
        name: 'Weather',
        icon: 'fas fa-cloud-sun',
        color: '#87ceeb',
        description: 'Weather conditions and patterns',
    },
    {
        id: 'story',
        name: 'Story',
        icon: 'fas fa-book-open',
        color: '#98fb98',
        description: 'Story events and narrative notes',
    },
    {
        id: 'combat',
        name: 'Combat',
        icon: 'fas fa-crossed-swords',
        color: '#dc143c',
        description: 'Combat encounters and battles',
    },
    {
        id: 'travel',
        name: 'Travel',
        icon: 'fas fa-route',
        color: '#daa520',
        description: 'Travel plans and journey notes',
    },
    {
        id: 'npc',
        name: 'NPC',
        icon: 'fas fa-users',
        color: '#9370db',
        description: 'Non-player character events',
    },
];
/**
 * Default predefined tags for common use cases
 */
const DEFAULT_TAGS = [
    'important',
    'urgent',
    'recurring',
    'party',
    'player',
    'gm-only',
    'public',
    'private',
    'completed',
    'in-progress',
    'planned',
    'cancelled',
];
/**
 * Manages note categories and tags
 */
class NoteCategories {
    constructor() {
        this.config = this.loadConfiguration();
    }
    /**
     * Load category configuration from game settings
     */
    loadConfiguration() {
        const savedConfig = game.settings.get('seasons-and-stars', 'noteCategories');
        if (savedConfig && savedConfig.categories) {
            // Merge saved categories with defaults, ensuring defaults exist
            const savedIds = new Set(savedConfig.categories.map(c => c.id));
            const missingDefaults = DEFAULT_CATEGORIES.filter(c => !savedIds.has(c.id));
            return {
                categories: [...savedConfig.categories, ...missingDefaults],
                allowCustomTags: savedConfig.allowCustomTags ?? true,
                predefinedTags: savedConfig.predefinedTags || DEFAULT_TAGS,
            };
        }
        return {
            categories: [...DEFAULT_CATEGORIES],
            allowCustomTags: true,
            predefinedTags: [...DEFAULT_TAGS],
        };
    }
    /**
     * Save category configuration to game settings
     */
    async saveConfiguration() {
        await game.settings.set('seasons-and-stars', 'noteCategories', this.config);
    }
    /**
     * Get all available categories
     */
    getCategories() {
        return [...this.config.categories];
    }
    /**
     * Get category by ID
     */
    getCategory(id) {
        return this.config.categories.find(c => c.id === id) || null;
    }
    /**
     * Get default category
     */
    getDefaultCategory() {
        return this.config.categories.find(c => c.isDefault) || this.config.categories[0];
    }
    /**
     * Add a new category
     */
    async addCategory(category) {
        // Validate category
        if (!category.id || !category.name) {
            throw new Error('Category must have id and name');
        }
        // Check for duplicate ID
        if (this.config.categories.find(c => c.id === category.id)) {
            throw new Error(`Category with id '${category.id}' already exists`);
        }
        this.config.categories.push(category);
        await this.saveConfiguration();
    }
    /**
     * Update an existing category
     */
    async updateCategory(id, updates) {
        const index = this.config.categories.findIndex(c => c.id === id);
        if (index === -1) {
            throw new Error(`Category with id '${id}' not found`);
        }
        // Don't allow changing ID
        if (updates.id && updates.id !== id) {
            throw new Error('Cannot change category ID');
        }
        this.config.categories[index] = { ...this.config.categories[index], ...updates };
        await this.saveConfiguration();
    }
    /**
     * Remove a category
     */
    async removeCategory(id) {
        const category = this.getCategory(id);
        if (!category) {
            throw new Error(`Category with id '${id}' not found`);
        }
        // Prevent removal of default categories
        if (category.isDefault) {
            throw new Error('Cannot remove default category');
        }
        this.config.categories = this.config.categories.filter(c => c.id !== id);
        await this.saveConfiguration();
    }
    /**
     * Get all predefined tags
     */
    getPredefinedTags() {
        return [...this.config.predefinedTags];
    }
    /**
     * Add a predefined tag
     */
    async addPredefinedTag(tag) {
        if (!tag || typeof tag !== 'string') {
            throw new Error('Tag must be a non-empty string');
        }
        const normalizedTag = tag.toLowerCase().trim();
        if (this.config.predefinedTags.includes(normalizedTag)) {
            return; // Already exists
        }
        this.config.predefinedTags.push(normalizedTag);
        await this.saveConfiguration();
    }
    /**
     * Remove a predefined tag
     */
    async removePredefinedTag(tag) {
        const normalizedTag = tag.toLowerCase().trim();
        this.config.predefinedTags = this.config.predefinedTags.filter(t => t !== normalizedTag);
        await this.saveConfiguration();
    }
    /**
     * Check if custom tags are allowed
     */
    areCustomTagsAllowed() {
        return this.config.allowCustomTags;
    }
    /**
     * Set whether custom tags are allowed
     */
    async setCustomTagsAllowed(allowed) {
        this.config.allowCustomTags = allowed;
        await this.saveConfiguration();
    }
    /**
     * Validate tags against configuration
     */
    validateTags(tags) {
        const valid = [];
        const invalid = [];
        for (const tag of tags) {
            const normalizedTag = tag.toLowerCase().trim();
            if (this.config.predefinedTags.includes(normalizedTag)) {
                valid.push(normalizedTag);
            }
            else if (this.config.allowCustomTags) {
                valid.push(normalizedTag);
            }
            else {
                invalid.push(tag);
            }
        }
        return { valid, invalid };
    }
    /**
     * Parse tag string into array of tags
     */
    parseTagString(tagString) {
        if (!tagString)
            return [];
        return tagString
            .split(/[,;]/) // Split on comma or semicolon
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .map(tag => tag.toLowerCase());
    }
    /**
     * Format tags array into string
     */
    formatTagsToString(tags) {
        return tags.join(', ');
    }
    /**
     * Get category color for styling
     */
    getCategoryColor(categoryId) {
        const category = this.getCategory(categoryId);
        return category?.color || '#4a90e2';
    }
    /**
     * Get category icon for display
     */
    getCategoryIcon(categoryId) {
        const category = this.getCategory(categoryId);
        return category?.icon || 'fas fa-sticky-note';
    }
    /**
     * Search categories by name
     */
    searchCategories(query) {
        if (!query)
            return this.getCategories();
        const lowercaseQuery = query.toLowerCase();
        return this.config.categories.filter(category => category.name.toLowerCase().includes(lowercaseQuery) ||
            category.description?.toLowerCase().includes(lowercaseQuery));
    }
}
// Global instance - initialized manually in module.ts after settings are registered
let noteCategories;
/**
 * Initialize the global noteCategories instance
 * Called from module.ts after settings are registered
 */
function initializeNoteCategories() {
    noteCategories = new NoteCategories();
}

/**
 * Calendar Selection Dialog for Seasons & Stars
 * Allows users to browse and switch between available calendars
 */
class CalendarSelectionDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    constructor(calendars, currentCalendarId) {
        super();
        this.selectedCalendarId = null;
        Logger.debug('CalendarSelectionDialog constructor', {
            type: typeof calendars,
            isMap: calendars instanceof Map,
            calendars,
        });
        // Convert array to Map if needed
        if (Array.isArray(calendars)) {
            Logger.debug('Converting array to Map');
            this.calendars = new Map();
            calendars.forEach((calendar, index) => {
                const id = calendar.id || String(index);
                this.calendars.set(id, calendar);
            });
            Logger.debug('Converted calendars Map', this.calendars);
        }
        else if (calendars instanceof Map) {
            this.calendars = calendars;
        }
        else {
            Logger.error('Unsupported calendars type', new Error(`Type: ${typeof calendars}`));
            this.calendars = new Map();
        }
        this.currentCalendarId = currentCalendarId;
        this.selectedCalendarId = currentCalendarId;
    }
    /** @override */
    async _prepareContext(options = {}) {
        const context = await super._prepareContext(options);
        const calendarsData = Array.from(this.calendars.entries()).map(([id, calendar]) => {
            const label = CalendarLocalization.getCalendarLabel(calendar);
            const description = CalendarLocalization.getCalendarDescription(calendar);
            const setting = CalendarLocalization.getCalendarSetting(calendar);
            // Generate sample date for preview
            const sampleDate = this.generateSampleDate(calendar);
            return {
                id,
                label,
                description,
                setting,
                sampleDate,
                isCurrent: id === this.currentCalendarId,
                isSelected: id === this.selectedCalendarId,
            };
        });
        return Object.assign(context, {
            calendars: calendarsData,
            selectedCalendar: this.selectedCalendarId,
            currentCalendar: this.currentCalendarId,
        });
    }
    /** @override */
    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        Logger.debug('Attaching part listeners', { partId, element: htmlElement });
        Logger.debug('Scrollable elements', htmlElement.querySelectorAll('.calendar-selection-grid'));
        // Add action buttons to window and update button state after rendering
        this.addActionButtons($(htmlElement));
        this.updateSelectButton($(htmlElement));
        // Debug: Check if scrolling is working
        const scrollableGrid = htmlElement.querySelector('.calendar-selection-grid');
        if (scrollableGrid) {
            const style = getComputedStyle(scrollableGrid);
            Logger.debug('Found scrollable grid', {
                overflow: style.overflow,
                clientHeight: scrollableGrid.clientHeight,
                scrollHeight: scrollableGrid.scrollHeight,
            });
        }
    }
    /**
     * Add action buttons to the dialog
     */
    addActionButtons(html) {
        const footer = $(`
      <div class="dialog-buttons flexrow">
        <button data-action="cancel" type="button">
          <i class="fas fa-times"></i>
          ${game.i18n.localize('SEASONS_STARS.dialog.calendar_selection.cancel')}
        </button>
        <button data-action="chooseCalendar" type="button" class="ss-button primary" id="select-calendar">
          <i class="fas fa-check"></i>
          ${game.i18n.localize('SEASONS_STARS.dialog.calendar_selection.select')}
        </button>
      </div>
    `);
        html.append(footer);
    }
    /**
     * Select a calendar card
     */
    selectCalendarCard(calendarId) {
        this.selectedCalendarId = calendarId;
        // Re-render to update UI state
        this.render(true);
    }
    /**
     * Update the select button state
     */
    updateSelectButton(html) {
        const $html = html || (this.element ? $(this.element) : $());
        const selectButton = $html.find('#select-calendar');
        const isDifferent = this.selectedCalendarId !== this.currentCalendarId;
        selectButton.prop('disabled', !isDifferent);
        selectButton.toggleClass('disabled', !isDifferent);
        if (isDifferent) {
            const calendar = this.calendars.get(this.selectedCalendarId);
            const label = calendar
                ? CalendarLocalization.getCalendarLabel(calendar)
                : this.selectedCalendarId;
            selectButton.html(`<i class="fas fa-check"></i> Switch to ${label}`);
        }
        else {
            selectButton.html(`<i class="fas fa-check"></i> Select Calendar`);
        }
    }
    /**
     * Show preview for a calendar
     */
    showPreview(calendarId) {
        const calendar = this.calendars.get(calendarId);
        if (!calendar)
            return;
        const label = CalendarLocalization.getCalendarLabel(calendar);
        const description = CalendarLocalization.getCalendarDescription(calendar);
        const setting = CalendarLocalization.getCalendarSetting(calendar);
        // Generate multiple sample dates
        const samples = [
            this.generateSampleDate(calendar, 1),
            this.generateSampleDate(calendar, 100),
            this.generateSampleDate(calendar, 365),
        ];
        const content = `
      <div class="calendar-preview">
        <div class="preview-header">
          <h3>${label}</h3>
          <div class="preview-setting">${setting}</div>
        </div>
        <div class="preview-description">${description}</div>
        <div class="preview-samples">
          <h4>${game.i18n.localize('SEASONS_STARS.dialog.calendar_selection.sample_dates')}</h4>
          ${samples.map(sample => `<div class="sample-date">${sample}</div>`).join('')}
        </div>
        <div class="preview-structure">
          <h4>${game.i18n.localize('SEASONS_STARS.dialog.calendar_selection.structure')}</h4>
          <div class="structure-info">
            <div><strong>${game.i18n.localize('SEASONS_STARS.calendar.months')}:</strong> ${calendar.months.length}</div>
            <div><strong>${game.i18n.localize('SEASONS_STARS.calendar.days_per_week')}:</strong> ${calendar.weekdays.length}</div>
            ${calendar.leapYear ? `<div><strong>${game.i18n.localize('SEASONS_STARS.calendar.leap_year')}:</strong> ${game.i18n.localize('SEASONS_STARS.calendar.enabled')}</div>` : ''}
          </div>
        </div>
      </div>
    `;
        new foundry.applications.api.DialogV2({
            window: {
                title: game.i18n.format('SEASONS_STARS.dialog.calendar_preview.title', { calendar: label }),
            },
            content,
            buttons: [
                {
                    action: 'close',
                    icon: 'fas fa-times',
                    label: game.i18n.localize('SEASONS_STARS.dialog.close'),
                    callback: () => { },
                },
            ],
            default: 'close',
            classes: ['seasons-stars', 'calendar-preview-dialog'],
            position: {
                width: 400,
                height: 'auto',
            },
        }).render(true);
    }
    /**
     * Generate a sample date for preview
     */
    generateSampleDate(calendar, dayOffset = 1) {
        // Use current world time if no offset, otherwise use offset from a reasonable base
        let totalDays;
        if (dayOffset === 1) {
            // Use current world time for default sample
            const currentTime = game.time?.worldTime || 0;
            Logger.debug(`Using current world time for sample: ${currentTime} seconds`);
            // Use calendar-specific day length instead of hardcoded 86400
            const secondsPerDay = CalendarTimeUtils.getSecondsPerDay(calendar);
            totalDays = Math.floor(currentTime / secondsPerDay);
            Logger.debug(`Converted to total days: ${totalDays}`);
        }
        else {
            // Use offset for other samples
            totalDays = dayOffset;
            Logger.debug(`Using offset days for sample: ${totalDays}`);
        }
        // Use approximate year calculation for sample generation
        // For accurate date calculation, use the calendar engine, but this is just for preview samples
        const approximateYearLength = CalendarTimeUtils.getApproximateYearLength(calendar);
        const year = 1000 + Math.floor(totalDays / approximateYearLength);
        const dayInYear = totalDays % approximateYearLength;
        Logger.debug('Calculated year and day in year', { year, dayInYear });
        let remainingDays = dayInYear;
        let monthIndex = 0;
        // Find the month
        for (let i = 0; i < calendar.months.length; i++) {
            const monthDays = calendar.months[i].days;
            if (remainingDays <= monthDays) {
                monthIndex = i;
                break;
            }
            remainingDays -= monthDays;
        }
        const month = calendar.months[monthIndex];
        const day = Math.max(1, remainingDays);
        const weekdayIndex = (dayOffset - 1) % calendar.weekdays.length;
        const weekday = calendar.weekdays[weekdayIndex];
        // Format using calendar's translation
        const monthLabel = CalendarLocalization.getCalendarTranslation(calendar, `months.${month.id || month.name}`, month.name);
        const weekdayLabel = CalendarLocalization.getCalendarTranslation(calendar, `weekdays.${weekday.id || weekday.name}`, weekday.name);
        return `${weekdayLabel}, ${monthLabel} ${day}, ${year}`;
    }
    /**
     * Handle calendar selection
     */
    async selectCalendar() {
        if (this.selectedCalendarId && this.selectedCalendarId !== this.currentCalendarId) {
            // Switch to the selected calendar
            await game.settings?.set('seasons-and-stars', 'activeCalendar', this.selectedCalendarId);
            // Notify user
            const calendar = this.calendars.get(this.selectedCalendarId);
            const label = calendar
                ? CalendarLocalization.getCalendarLabel(calendar)
                : this.selectedCalendarId;
            ui.notifications?.info(game.i18n.format('SEASONS_STARS.notifications.calendar_changed', { calendar: label }));
        }
    }
    /**
     * Instance action handler for calendar card selection
     */
    async _onSelectCalendar(event, target) {
        Logger.debug('Calendar card clicked', { event, target });
        const calendarId = target.getAttribute('data-calendar-id');
        Logger.debug(`Found calendar ID for selection: ${calendarId}`);
        if (calendarId) {
            Logger.debug(`Calling selectCalendarCard with ID: ${calendarId}`);
            this.selectCalendarCard(calendarId);
        }
        else {
            Logger.warn('Selection action failed - no calendar ID found');
        }
    }
    /**
     * Instance action handler for calendar preview
     */
    async _onPreviewCalendar(event, target) {
        Logger.debug('Preview button clicked', { event, target });
        Logger.debug('Calendars data', {
            type: typeof this.calendars,
            isMap: this.calendars instanceof Map,
            calendars: this.calendars,
        });
        event.stopPropagation();
        const calendarId = target.closest('[data-calendar-id]')?.getAttribute('data-calendar-id');
        Logger.debug(`Found calendar ID: ${calendarId}`);
        if (calendarId) {
            Logger.debug(`Calling showPreview with ID: ${calendarId}`);
            this.showPreview(calendarId);
        }
        else {
            Logger.warn('Preview action failed - no calendar ID found');
        }
    }
    /**
     * Instance action handler for choosing calendar
     */
    async _onChooseCalendar(event, target) {
        Logger.debug('Choose calendar clicked', { event, target });
        await this.selectCalendar();
        this.close();
    }
    /**
     * Instance action handler for cancel
     */
    async _onCancel(event, target) {
        Logger.debug('Cancel clicked', { event, target });
        this.close();
    }
    /**
     * Static method to show the calendar selection dialog
     */
    static async show() {
        if (!game.seasonsStars?.manager) {
            ui.notifications?.error(game.i18n.localize('SEASONS_STARS.errors.manager_not_ready'));
            return;
        }
        const calendars = game.seasonsStars.manager.getAllCalendars();
        Logger.debug('CalendarSelectionDialog.show() - calendars from manager', {
            type: typeof calendars,
            isMap: calendars instanceof Map,
            calendars,
        });
        const currentCalendarId = game.settings?.get('seasons-and-stars', 'activeCalendar');
        if (calendars.size === 0) {
            ui.notifications?.warn(game.i18n.localize('SEASONS_STARS.warnings.no_calendars_available'));
            return;
        }
        const dialog = new CalendarSelectionDialog(calendars, currentCalendarId);
        dialog.render(true);
    }
}
CalendarSelectionDialog.DEFAULT_OPTIONS = {
    id: 'seasons-stars-calendar-selection',
    classes: ['seasons-stars', 'calendar-selection-dialog'],
    tag: 'div',
    window: {
        frame: true,
        positioned: true,
        title: 'SEASONS_STARS.dialog.calendar_selection.title',
        icon: 'fa-solid fa-calendar-alt',
        minimizable: false,
        resizable: true,
    },
    position: {
        width: 600,
        height: 600,
    },
    actions: {
        selectCalendar: CalendarSelectionDialog.prototype._onSelectCalendar,
        previewCalendar: CalendarSelectionDialog.prototype._onPreviewCalendar,
        chooseCalendar: CalendarSelectionDialog.prototype._onChooseCalendar,
        cancel: CalendarSelectionDialog.prototype._onCancel,
    },
};
CalendarSelectionDialog.PARTS = {
    main: {
        id: 'main',
        template: 'modules/seasons-and-stars/templates/calendar-selection-dialog.hbs',
        scrollable: ['.calendar-selection-grid'],
    },
};

var calendarSelectionDialog = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CalendarSelectionDialog: CalendarSelectionDialog
});

/**
 * Calendar Widget Manager
 *
 * Centralized widget management to break circular dependencies between widget classes.
 * Each widget type can be managed independently without direct references to other widgets.
 */
/**
 * Central manager for all calendar widgets
 * Eliminates the need for widgets to directly import each other
 */
class CalendarWidgetManager {
    /**
     * Register a widget factory function
     */
    static registerWidget(type, factory) {
        this.factories.set(type, factory);
        Logger.debug(`Registered widget factory for ${type}`);
    }
    /**
     * Get or create a widget instance
     */
    static getWidget(type) {
        let instance = this.instances.get(type);
        if (!instance) {
            const factory = this.factories.get(type);
            if (factory) {
                try {
                    instance = factory();
                    this.instances.set(type, instance);
                    Logger.debug(`Created widget instance for ${type}`);
                }
                catch (error) {
                    Logger.error(`Failed to create widget ${type}:`, error instanceof Error ? error : new Error(String(error)));
                    return null;
                }
            }
            else {
                Logger.warn(`No factory registered for widget type: ${type}`);
                return null;
            }
        }
        return instance;
    }
    /**
     * Show a specific widget type
     */
    static async showWidget(type) {
        const widget = this.getWidget(type);
        if (widget) {
            try {
                await widget.show();
                Logger.debug(`Showed widget: ${type}`);
            }
            catch (error) {
                Logger.error(`Failed to show widget ${type}:`, error instanceof Error ? error : new Error(String(error)));
            }
        }
    }
    /**
     * Hide a specific widget type
     */
    static async hideWidget(type) {
        const widget = this.getWidget(type);
        if (widget) {
            try {
                await widget.hide();
                Logger.debug(`Hid widget: ${type}`);
            }
            catch (error) {
                Logger.error(`Failed to hide widget ${type}:`, error instanceof Error ? error : new Error(String(error)));
            }
        }
    }
    /**
     * Toggle a specific widget type
     */
    static async toggleWidget(type) {
        const widget = this.getWidget(type);
        if (widget) {
            try {
                await widget.toggle();
                Logger.debug(`Toggled widget: ${type}`);
            }
            catch (error) {
                Logger.error(`Failed to toggle widget ${type}:`, error instanceof Error ? error : new Error(String(error)));
            }
        }
    }
    /**
     * Switch to a specific widget type, hiding others
     */
    static async switchToWidget(type, hideOthers = false) {
        if (hideOthers) {
            // Hide all other widgets first
            for (const [otherType] of this.instances) {
                if (otherType !== type) {
                    await this.hideWidget(otherType);
                }
            }
        }
        await this.showWidget(type);
    }
    /**
     * Check if a widget is visible
     */
    static isWidgetVisible(type) {
        const widget = this.getWidget(type);
        return widget ? widget.isVisible() : false;
    }
    /**
     * Get the actual widget instance for direct access
     */
    static getWidgetInstance(type) {
        const widget = this.getWidget(type);
        return widget ? widget.getInstance() : null;
    }
    /**
     * Hide all widgets
     */
    static async hideAllWidgets() {
        const hidePromises = Array.from(this.instances.keys()).map(type => this.hideWidget(type));
        await Promise.all(hidePromises);
        Logger.debug('Hid all widgets');
    }
    /**
     * Get list of currently visible widgets
     */
    static getVisibleWidgets() {
        const visible = [];
        for (const [type] of this.instances) {
            if (this.isWidgetVisible(type)) {
                visible.push(type);
            }
        }
        return visible;
    }
    /**
     * Clear all widget instances (useful for cleanup)
     */
    static clearInstances() {
        this.instances.clear();
        Logger.debug('Cleared all widget instances');
    }
    /**
     * Get registered widget types
     */
    static getRegisteredTypes() {
        return Array.from(this.factories.keys());
    }
}
CalendarWidgetManager.instances = new Map();
CalendarWidgetManager.factories = new Map();
/**
 * Widget wrapper class to make any widget compatible with the manager
 */
class WidgetWrapper {
    constructor(widget, showMethod = 'render', hideMethod = 'close', toggleMethod = 'toggle', getInstanceMethod = 'getInstance', isVisibleProperty = 'rendered') {
        this.widget = widget;
        this.showMethod = showMethod;
        this.hideMethod = hideMethod;
        this.toggleMethod = toggleMethod;
        this.getInstanceMethod = getInstanceMethod;
        this.isVisibleProperty = isVisibleProperty;
    }
    async show() {
        if (this.widget && typeof this.widget[this.showMethod] === 'function') {
            await this.widget[this.showMethod]();
        }
    }
    async hide() {
        if (this.widget && typeof this.widget[this.hideMethod] === 'function') {
            await this.widget[this.hideMethod]();
        }
    }
    async toggle() {
        if (this.widget && typeof this.widget[this.toggleMethod] === 'function') {
            await this.widget[this.toggleMethod]();
        }
        else {
            // Fallback toggle implementation
            if (this.isVisible()) {
                await this.hide();
            }
            else {
                await this.show();
            }
        }
    }
    getInstance() {
        if (this.widget && typeof this.widget[this.getInstanceMethod] === 'function') {
            return this.widget[this.getInstanceMethod]();
        }
        return this.widget;
    }
    isVisible() {
        if (this.widget && this.isVisibleProperty in this.widget) {
            return Boolean(this.widget[this.isVisibleProperty]);
        }
        return false;
    }
}

/**
 * Calendar Widget - Compact date/time display for Seasons & Stars
 */
class CalendarWidget extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    constructor() {
        super(...arguments);
        this.updateInterval = null;
        this.sidebarButtons = [];
    }
    /**
     * Prepare rendering context for template
     */
    async _prepareContext(options = {}) {
        const context = await super._prepareContext(options);
        const manager = game.seasonsStars?.manager;
        if (!manager) {
            return Object.assign(context, {
                error: 'Calendar manager not initialized',
                calendar: null,
                currentDate: null,
                formattedDate: 'Not Available',
            });
        }
        const activeCalendar = manager.getActiveCalendar();
        const currentDate = manager.getCurrentDate();
        if (!activeCalendar || !currentDate) {
            return Object.assign(context, {
                error: 'No active calendar',
                calendar: null,
                currentDate: null,
                formattedDate: 'No Calendar Active',
            });
        }
        const calendarInfo = CalendarLocalization.getLocalizedCalendarInfo(activeCalendar);
        // Check if SmallTime is available and active
        const hasSmallTime = this.detectSmallTime();
        return Object.assign(context, {
            calendar: calendarInfo,
            currentDate: currentDate.toObject(),
            formattedDate: currentDate.toLongString(),
            shortDate: currentDate.toDateString(),
            timeString: currentDate.toTimeString(),
            isGM: game.user?.isGM || false,
            canAdvanceTime: game.user?.isGM || false,
            hasSmallTime: hasSmallTime,
            showTimeControls: !hasSmallTime, // Only show time controls if SmallTime is not available
            sidebarButtons: this.sidebarButtons, // Include sidebar buttons for template
        });
    }
    /**
     * Attach event listeners to rendered parts
     */
    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        // Register this as the active instance
        CalendarWidget.activeInstance = this;
        // Start auto-update after rendering
        this.startAutoUpdate();
    }
    /**
     * Instance action handler for opening calendar selection dialog
     */
    async _onOpenCalendarSelection(event, _target) {
        event.preventDefault();
        CalendarSelectionDialog.show();
    }
    /**
     * Instance action handler for opening detailed view dialog
     */
    async _onOpenDetailedView(event, _target) {
        event.preventDefault();
        const manager = game.seasonsStars?.manager;
        if (!manager) {
            ui.notifications?.error('Calendar manager not available');
            return;
        }
        // Open the calendar grid widget with the current date
        manager.getCurrentDate();
        CalendarWidgetManager.showWidget('grid');
    }
    /**
     * Instance action handler for date advancement
     */
    async _onAdvanceDate(event, target) {
        event.preventDefault();
        const amount = parseInt(target.dataset.amount || '0');
        const unit = target.dataset.unit || 'days';
        const manager = game.seasonsStars?.manager;
        if (!manager)
            return;
        Logger.info(`Advancing date: ${amount} ${unit}`);
        try {
            switch (unit) {
                case 'minutes':
                    await manager.advanceMinutes(amount);
                    break;
                case 'hours':
                    await manager.advanceHours(amount);
                    break;
                case 'days':
                    await manager.advanceDays(amount);
                    break;
                case 'weeks':
                    await manager.advanceWeeks(amount);
                    break;
                case 'months':
                    await manager.advanceMonths(amount);
                    break;
                case 'years':
                    await manager.advanceYears(amount);
                    break;
                default:
                    Logger.warn(`Unknown date unit: ${unit}`);
                    return;
            }
            // Show success notification for larger advances
            if ((unit === 'weeks' && amount >= 2) ||
                (unit === 'months' && amount >= 1) ||
                (unit === 'years' && amount >= 1)) {
                ui.notifications?.info(`Time advanced by ${amount} ${unit}`);
            }
        }
        catch (error) {
            Logger.error('Error advancing date', error);
            ui.notifications?.error('Failed to advance date');
        }
    }
    /**
     * Instance action handler for opening bulk advance dialog
     */
    async _onOpenBulkAdvance(event, _target) {
        event.preventDefault();
        // Show placeholder for now - will implement proper dialog later
        ui.notifications?.info('Bulk time advancement coming soon!');
    }
    /**
     * Handle sidebar button clicks
     */
    async _onClickSidebarButton(event, target) {
        event.preventDefault();
        const buttonName = target.dataset.buttonName;
        if (!buttonName) {
            Logger.warn('Sidebar button clicked without button name');
            return;
        }
        // Find the button in our array and execute its callback
        const button = this.sidebarButtons.find(btn => btn.name === buttonName);
        if (button && typeof button.callback === 'function') {
            try {
                button.callback();
            }
            catch (error) {
                Logger.error(`Error executing sidebar button "${buttonName}" callback`, error);
            }
        }
        else {
            Logger.warn(`Sidebar button "${buttonName}" not found or has invalid callback`);
        }
    }
    /**
     * Switch to mini widget
     */
    async _onSwitchToMini(event, _target) {
        event.preventDefault();
        Logger.debug('Switching from main widget to mini widget');
        try {
            // Close current widget
            this.close();
            // Open mini widget
            CalendarWidgetManager.showWidget('mini');
        }
        catch (error) {
            Logger.error('Failed to switch to mini widget', error instanceof Error ? error : new Error(String(error)));
        }
    }
    /**
     * Switch to grid widget
     */
    async _onSwitchToGrid(event, _target) {
        event.preventDefault();
        Logger.debug('Switching from main widget to grid widget');
        try {
            // Close current widget
            this.close();
            // Open grid widget
            CalendarWidgetManager.showWidget('grid');
        }
        catch (error) {
            Logger.error('Failed to switch to grid widget', error instanceof Error ? error : new Error(String(error)));
        }
    }
    /**
     * Detect if SmallTime module is available and active
     */
    detectSmallTime() {
        // Check if SmallTime module is installed and enabled
        const smallTimeModule = game.modules?.get('smalltime');
        if (!smallTimeModule?.active) {
            return false;
        }
        // Check if SmallTime UI elements are present in the DOM
        const selectors = [
            '#smalltime-app',
            '.smalltime-app',
            '#timeDisplay',
            '#slideContainer',
            '[id*="smalltime"]',
            '.form:has(#timeDisplay)',
        ];
        for (const selector of selectors) {
            try {
                if (document.querySelector(selector)) {
                    return true;
                }
            }
            catch (_error) {
                // Skip invalid selectors
                continue;
            }
        }
        return false;
    }
    /**
     * Start automatic updates
     */
    startAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        // Update every 30 seconds
        this.updateInterval = window.setInterval(() => {
            if (this.rendered) {
                this.render();
            }
        }, 30000);
    }
    /**
     * Stop automatic updates
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    /**
     * Handle closing the widget
     */
    async close(options = {}) {
        this.stopAutoUpdate();
        // Clear active instance if this is it
        if (CalendarWidget.activeInstance === this) {
            CalendarWidget.activeInstance = null;
        }
        return super.close(options);
    }
    /**
     * Handle Foundry hooks for real-time updates
     */
    static registerHooks() {
        // Update widget when time changes
        Hooks.on('seasons-stars:dateChanged', () => {
            if (CalendarWidget.activeInstance?.rendered) {
                CalendarWidget.activeInstance.render();
            }
        });
        // Update widget when calendar changes
        Hooks.on('seasons-stars:calendarChanged', () => {
            if (CalendarWidget.activeInstance?.rendered) {
                CalendarWidget.activeInstance.render();
            }
        });
        // Update widget when settings change (especially quick time buttons)
        Hooks.on('seasons-stars:settingsChanged', (settingName) => {
            if (settingName === 'quickTimeButtons' && CalendarWidget.activeInstance?.rendered) {
                CalendarWidget.activeInstance.render();
            }
        });
    }
    /**
     * Toggle widget visibility
     */
    static toggle() {
        if (CalendarWidget.activeInstance) {
            if (CalendarWidget.activeInstance.rendered) {
                CalendarWidget.activeInstance.close();
            }
            else {
                CalendarWidget.activeInstance.render(true);
            }
        }
        else {
            new CalendarWidget().render(true);
        }
    }
    /**
     * Show the widget
     */
    static show() {
        if (CalendarWidget.activeInstance) {
            if (!CalendarWidget.activeInstance.rendered) {
                CalendarWidget.activeInstance.render(true);
            }
        }
        else {
            new CalendarWidget().render(true);
        }
    }
    /**
     * Hide the widget
     */
    static hide() {
        if (CalendarWidget.activeInstance?.rendered) {
            CalendarWidget.activeInstance.close();
        }
    }
    /**
     * Get the current widget instance
     */
    static getInstance() {
        return CalendarWidget.activeInstance;
    }
    /**
     * Add a sidebar button for integration with other modules (like Simple Weather)
     */
    addSidebarButton(name, icon, tooltip, callback) {
        // Check if button already exists
        const existingButton = this.sidebarButtons.find(btn => btn.name === name);
        if (existingButton) {
            Logger.debug(`Button "${name}" already exists in widget`);
            return;
        }
        // Store the button
        this.sidebarButtons.push({ name, icon, tooltip, callback });
        // If rendered, re-render to include the new button
        if (this.rendered) {
            this.render();
        }
    }
    /**
     * Remove a sidebar button by name
     */
    removeSidebarButton(name) {
        const index = this.sidebarButtons.findIndex(btn => btn.name === name);
        if (index !== -1) {
            this.sidebarButtons.splice(index, 1);
            // Re-render to remove the button
            if (this.rendered) {
                this.render();
            }
        }
    }
    /**
     * Check if a sidebar button exists
     */
    hasSidebarButton(name) {
        return this.sidebarButtons.some(btn => btn.name === name);
    }
}
CalendarWidget.activeInstance = null;
CalendarWidget.DEFAULT_OPTIONS = {
    id: 'seasons-stars-widget',
    classes: ['seasons-stars', 'calendar-widget'],
    tag: 'div',
    window: {
        frame: true,
        positioned: true,
        title: 'SEASONS_STARS.calendar.current_date',
        icon: 'fa-solid fa-calendar-alt',
        minimizable: false,
        resizable: false,
    },
    position: {
        width: 280,
        height: 'auto',
    },
    actions: {
        openCalendarSelection: CalendarWidget.prototype._onOpenCalendarSelection,
        openDetailedView: CalendarWidget.prototype._onOpenDetailedView,
        advanceDate: CalendarWidget.prototype._onAdvanceDate,
        openBulkAdvance: CalendarWidget.prototype._onOpenBulkAdvance,
        clickSidebarButton: CalendarWidget.prototype._onClickSidebarButton,
        switchToMini: CalendarWidget.prototype._onSwitchToMini,
        switchToGrid: CalendarWidget.prototype._onSwitchToGrid,
    },
};
CalendarWidget.PARTS = {
    main: {
        id: 'main',
        template: 'modules/seasons-and-stars/templates/calendar-widget.hbs',
    },
};

/**
 * Base widget manager to handle common widget patterns
 * Eliminates repeated code across calendar widgets
 */
/**
 * SmallTime integration utility
 */
class SmallTimeUtils {
    /**
     * Check if SmallTime module is installed and active
     */
    static isSmallTimeAvailable() {
        const smallTimeModule = game.modules?.get('smalltime');
        return smallTimeModule?.active === true;
    }
    /**
     * Get SmallTime element for positioning (only if module is active)
     */
    static getSmallTimeElement() {
        if (!this.isSmallTimeAvailable()) {
            return null;
        }
        // Only search for the element if the module is actually active
        const selectors = ['#smalltime-app', '.smalltime-app', '#timeDisplay', '#slideContainer'];
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                Logger.debug(`SmallTime element found: ${selector}`);
                return element;
            }
        }
        Logger.debug('SmallTime module active but element not found');
        return null;
    }
}

/**
 * Calendar Mini Widget - Compact date display that pairs with SmallTime
 */
class CalendarMiniWidget extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    constructor() {
        super(...arguments);
        this.isClosing = false;
        this.sidebarButtons = [];
    }
    /**
     * Prepare rendering context for template
     */
    async _prepareContext(options = {}) {
        const context = (await super._prepareContext(options));
        const manager = game.seasonsStars?.manager;
        if (!manager) {
            return Object.assign(context, {
                error: 'Calendar not available',
                shortDate: 'N/A',
                hasSmallTime: false,
                showTimeControls: false,
                calendar: null,
                currentDate: null,
                formattedDate: 'N/A',
                isGM: game.user?.isGM || false,
            });
        }
        const activeCalendar = manager.getActiveCalendar();
        const currentDate = manager.getCurrentDate();
        if (!activeCalendar || !currentDate) {
            return Object.assign(context, {
                error: 'No calendar active',
                shortDate: 'N/A',
                hasSmallTime: false,
                showTimeControls: false,
                calendar: null,
                currentDate: null,
                formattedDate: 'N/A',
                isGM: game.user?.isGM || false,
            });
        }
        // Check if SmallTime is available and active
        const hasSmallTime = SmallTimeUtils.isSmallTimeAvailable();
        return Object.assign(context, {
            shortDate: currentDate.toDateString(),
            hasSmallTime: hasSmallTime,
            showTimeControls: !hasSmallTime && (game.user?.isGM || false),
            isGM: game.user?.isGM || false,
            calendar: {
                id: activeCalendar.id || 'unknown',
                label: activeCalendar.label || activeCalendar.name || 'Unknown Calendar',
                description: activeCalendar.description,
            },
            currentDate: currentDate.toObject(),
            formattedDate: currentDate.toLongString(),
        });
    }
    /**
     * Simple post-render positioning like SmallTime
     */
    async _onRender(context, options) {
        await super._onRender(context, options);
        // Register this as the active instance
        CalendarMiniWidget.activeInstance = this;
        // Add click handlers for mini-date element
        const miniDateElement = this.element?.querySelector('.mini-date');
        if (miniDateElement) {
            let clickTimeout = null;
            let clickCount = 0;
            miniDateElement.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                clickCount++;
                if (clickCount === 1) {
                    // Single click - wait to see if there's a double click
                    clickTimeout = setTimeout(() => {
                        Logger.debug('Mini widget: Single click - opening calendar selection');
                        this._onOpenCalendarSelection(event, miniDateElement);
                        clickCount = 0;
                    }, 300);
                }
                else if (clickCount === 2) {
                    // Double click - cancel single click and handle double click
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                        clickTimeout = null;
                    }
                    clickCount = 0;
                    Logger.debug('Mini widget: Double-click detected, opening larger view');
                    this._onOpenLargerView(event, miniDateElement);
                }
            });
        }
        // Render any existing sidebar buttons
        this.renderExistingSidebarButtons();
        // Position widget after render (SmallTime approach)
        this.positionWidget();
    }
    /**
     * Position widget - simplified approach like SmallTime
     */
    positionWidget() {
        if (!this.element || this.isClosing) {
            if (this.isClosing) {
                Logger.debug('Mini widget: Skipping positioning during close');
            }
            return;
        }
        Logger.debug('Mini widget: Positioning widget');
        const smallTimeElement = SmallTimeUtils.getSmallTimeElement();
        if (smallTimeElement) {
            // Check if SmallTime is pinned/docked in DOM or floating
            if (this.isSmallTimeDocked(smallTimeElement)) {
                Logger.debug('Mini widget: SmallTime is docked - using DOM positioning');
                // SmallTime is docked - use DOM positioning
                this.dockAboveSmallTime(smallTimeElement);
            }
            else {
                Logger.debug('Mini widget: SmallTime is floating - using fixed positioning');
                // SmallTime is floating - use fixed positioning
                this.positionAboveSmallTime(smallTimeElement);
            }
        }
        else {
            Logger.debug('Mini widget: No SmallTime - docking to player list');
            // No SmallTime - dock to player list
            this.dockToPlayerList();
        }
    }
    /**
     * Attach event listeners to rendered parts
     */
    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        // Add proper action handling for data-action elements
        htmlElement.addEventListener('click', this._onClickAction.bind(this));
    }
    /**
     * Handle click actions on elements with data-action attributes
     */
    _onClickAction(event) {
        const target = event.target;
        const actionElement = target.closest('[data-action]');
        if (!actionElement)
            return;
        const action = actionElement.dataset.action;
        if (!action)
            return;
        // Skip openCalendarSelection on mini-date to let double-click handler manage it
        if (action === 'openCalendarSelection' && actionElement.classList.contains('mini-date')) {
            return; // Let the custom double-click handler manage mini-date clicks
        }
        // Prevent default for all other actions
        event.preventDefault();
        event.stopPropagation();
        Logger.debug(`Mini widget action triggered: ${action}`);
        // Call the appropriate action handler
        switch (action) {
            case 'advanceTime':
                this._onAdvanceTime(event, actionElement);
                break;
            case 'openCalendarSelection':
                this._onOpenCalendarSelection(event, actionElement);
                break;
            case 'openLargerView':
                this._onOpenLargerView(event, actionElement);
                break;
            default:
                Logger.warn(`Unknown action: ${action}`);
                break;
        }
    }
    /**
     * Hide widget with smooth animation (SmallTime approach)
     */
    hideWithAnimation() {
        if (!this.element || !this.rendered || this.isClosing)
            return;
        Logger.debug('Mini widget: Starting hide animation');
        // Mark as closing to prevent positioning changes
        this.isClosing = true;
        // Capture current position before animation to prevent movement
        const rect = this.element.getBoundingClientRect();
        Logger.debug('Mini widget: Captured position before hide', {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
        // Lock the position using fixed positioning
        this.element.style.position = 'fixed';
        this.element.style.top = `${rect.top}px`;
        this.element.style.left = `${rect.left}px`;
        this.element.style.width = `${rect.width}px`;
        this.element.style.height = `${rect.height}px`;
        // Stop any existing animations and apply custom fade-out
        $(this.element).stop();
        $(this.element).css({
            animation: 'seasons-stars-fade-out 0.2s ease-out',
            opacity: '0',
        });
        // Delay the actual close until after fade completes
        setTimeout(() => {
            Logger.debug('Mini widget: Animation complete, closing');
            this.close();
        }, WIDGET_POSITIONING.FADE_ANIMATION_DURATION);
    }
    /**
     * Handle closing the widget
     */
    async close(options = {}) {
        // Clear active instance if this is it
        if (CalendarMiniWidget.activeInstance === this) {
            CalendarMiniWidget.activeInstance = null;
        }
        // Clean up mutation observer
        const observer = this._playerListObserver;
        if (observer) {
            observer.disconnect();
            delete this._playerListObserver;
        }
        // Reset closing flag
        this.isClosing = false;
        return super.close(options);
    }
    /**
     * Handle Foundry hooks for real-time updates
     */
    static registerHooks() {
        // Update widget when date changes
        Hooks.on('seasons-stars:dateChanged', () => {
            if (CalendarMiniWidget.activeInstance?.rendered) {
                CalendarMiniWidget.activeInstance.render();
            }
        });
        // Update widget when calendar changes
        Hooks.on('seasons-stars:calendarChanged', () => {
            if (CalendarMiniWidget.activeInstance?.rendered) {
                CalendarMiniWidget.activeInstance.render();
            }
        });
        // Update widget when settings change (especially quick time buttons)
        Hooks.on('seasons-stars:settingsChanged', (settingName) => {
            if (settingName === 'quickTimeButtons' && CalendarMiniWidget.activeInstance?.rendered) {
                CalendarMiniWidget.activeInstance.render();
            }
        });
    }
    /**
     * Show the mini widget
     * Creates a new instance if none exists, or renders existing instance if not already visible.
     * The widget will automatically position itself relative to SmallTime or the player list.
     *
     * @example
     * ```typescript
     * CalendarMiniWidget.show();
     * ```
     */
    static show() {
        if (CalendarMiniWidget.activeInstance) {
            if (!CalendarMiniWidget.activeInstance.rendered) {
                CalendarMiniWidget.activeInstance.render(true);
            }
        }
        else {
            new CalendarMiniWidget().render(true);
        }
    }
    /**
     * Hide the mini widget with smooth animation
     * Uses a fade-out animation before closing to provide visual feedback.
     * Safe to call even if no widget is currently displayed.
     *
     * @example
     * ```typescript
     * CalendarMiniWidget.hide();
     * ```
     */
    static hide() {
        if (CalendarMiniWidget.activeInstance?.rendered) {
            CalendarMiniWidget.activeInstance.hideWithAnimation();
        }
    }
    /**
     * Get the current active instance of the mini widget
     * Returns null if no widget is currently instantiated.
     * Useful for external modules that need to interact with the widget.
     *
     * @returns The active CalendarMiniWidget instance, or null if none exists
     * @example
     * ```typescript
     * const widget = CalendarMiniWidget.getInstance();
     * if (widget) {
     *   widget.addSidebarButton('my-button', 'fas fa-cog', 'Settings', () => {});
     * }
     * ```
     */
    static getInstance() {
        return CalendarMiniWidget.activeInstance;
    }
    /**
     * Add a sidebar button to the mini widget
     * Provides generic API for integration with other modules via compatibility bridges
     */
    addSidebarButton(name, icon, tooltip, callback) {
        // Check if button already exists
        const existingButton = this.sidebarButtons.find(btn => btn.name === name);
        if (existingButton) {
            Logger.debug(`Button "${name}" already exists in mini widget`);
            return;
        }
        // Add to buttons array
        this.sidebarButtons.push({ name, icon, tooltip, callback });
        Logger.debug(`Added sidebar button "${name}" to mini widget`);
        // If widget is rendered, add button to DOM immediately
        if (this.rendered && this.element) {
            this.renderSidebarButton(name, icon, tooltip, callback);
        }
    }
    /**
     * Remove a sidebar button by name
     */
    removeSidebarButton(name) {
        const index = this.sidebarButtons.findIndex(btn => btn.name === name);
        if (index !== -1) {
            this.sidebarButtons.splice(index, 1);
            Logger.debug(`Removed sidebar button "${name}" from mini widget`);
            // Remove from DOM if rendered
            if (this.rendered && this.element) {
                const buttonId = `mini-sidebar-btn-${name.toLowerCase().replace(/\s+/g, '-')}`;
                const buttonElement = this.element.querySelector(`#${buttonId}`);
                if (buttonElement) {
                    buttonElement.remove();
                }
            }
        }
    }
    /**
     * Check if a sidebar button exists
     */
    hasSidebarButton(name) {
        return this.sidebarButtons.some(btn => btn.name === name);
    }
    /**
     * Render a sidebar button in the mini widget DOM
     */
    renderSidebarButton(name, icon, tooltip, callback) {
        if (!this.element)
            return;
        const buttonId = `mini-sidebar-btn-${name.toLowerCase().replace(/\s+/g, '-')}`;
        // Don't add if already exists in DOM
        if (this.element.querySelector(`#${buttonId}`)) {
            return;
        }
        // Find or create header area for buttons
        let headerArea = this.element.querySelector('.mini-widget-header');
        if (!headerArea) {
            // Create header if it doesn't exist
            headerArea = document.createElement('div');
            headerArea.className = 'mini-widget-header';
            headerArea.style.cssText =
                'display: flex; justify-content: flex-end; align-items: center; padding: 2px 4px; background: rgba(0,0,0,0.1); border-bottom: 1px solid var(--color-border-light-tertiary);';
            // Insert at the beginning of the widget
            this.element.insertBefore(headerArea, this.element.firstChild);
        }
        // Create button element
        const button = document.createElement('button');
        button.id = buttonId;
        button.className = 'mini-sidebar-button';
        button.title = tooltip;
        button.innerHTML = `<i class="fas ${icon}"></i>`;
        button.style.cssText = `
      background: var(--color-bg-btn, #f0f0f0);
      border: 1px solid var(--color-border-dark, #999);
      border-radius: 2px;
      padding: 2px 4px;
      margin-left: 2px;
      cursor: pointer;
      font-size: 10px;
      color: var(--color-text-primary, #000);
      transition: background-color 0.15s ease;
    `;
        // Add click handler
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            try {
                callback();
            }
            catch (error) {
                Logger.error(`Error in mini widget sidebar button "${name}"`, error);
            }
        });
        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.background = 'var(--color-bg-btn-hover, #e0e0e0)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'var(--color-bg-btn, #f0f0f0)';
        });
        headerArea.appendChild(button);
        Logger.debug(`Rendered sidebar button "${name}" in mini widget DOM`);
    }
    /**
     * Render all existing sidebar buttons (called after widget render)
     */
    renderExistingSidebarButtons() {
        this.sidebarButtons.forEach(button => {
            this.renderSidebarButton(button.name, button.icon, button.tooltip, button.callback);
        });
    }
    /**
     * Toggle mini widget visibility
     * Shows the widget if hidden, hides it if currently displayed.
     * This is the primary method used by keyboard shortcuts and scene controls.
     *
     * @example
     * ```typescript
     * // Toggle widget from a macro or keybinding
     * CalendarMiniWidget.toggle();
     *
     * // Can also be called from the global API
     * game.seasonsStars.widgets.toggleMini();
     * ```
     */
    static toggle() {
        if (CalendarMiniWidget.activeInstance?.rendered) {
            CalendarMiniWidget.activeInstance.hideWithAnimation();
        }
        else {
            CalendarMiniWidget.show();
        }
    }
    /**
     * Instance action handler for time advancement
     */
    async _onAdvanceTime(event, target) {
        event.preventDefault();
        const amount = parseInt(target.dataset.amount || '0');
        const unit = target.dataset.unit || 'hours';
        const manager = game.seasonsStars?.manager;
        if (!manager)
            return;
        Logger.info(`Mini widget advancing time: ${amount} ${unit}`);
        try {
            switch (unit) {
                case 'minutes':
                    await manager.advanceMinutes(amount);
                    break;
                case 'hours':
                    await manager.advanceHours(amount);
                    break;
                default:
                    Logger.warn(`Unknown time unit: ${unit}`);
                    return;
            }
        }
        catch (error) {
            Logger.error('Error advancing time', error);
            ui.notifications?.error('Failed to advance time');
        }
    }
    /**
     * Handle opening calendar selection dialog
     */
    async _onOpenCalendarSelection(event, _target) {
        event.preventDefault();
        const manager = game.seasonsStars?.manager;
        if (!manager)
            return;
        try {
            const calendars = manager.getAllCalendars();
            const activeCalendar = manager.getActiveCalendar();
            const currentCalendarId = activeCalendar?.id || 'gregorian';
            const { CalendarSelectionDialog } = await Promise.resolve().then(function () { return calendarSelectionDialog; });
            new CalendarSelectionDialog(calendars, currentCalendarId).render(true);
        }
        catch (error) {
            Logger.error('Error opening calendar selection', error);
            ui.notifications?.error('Failed to open calendar selection');
        }
    }
    /**
     * Detect if SmallTime module is available and active
     */
    /**
     * Auto-position the mini widget relative to SmallTime or find optimal standalone position
     */
    autoPositionRelativeToSmallTime() {
        if (this.isClosing)
            return;
        // Wait for both our element and SmallTime to be ready
        const attemptPositioning = (attempts = 0) => {
            if (this.isClosing)
                return; // Check again in case close started during attempts
            const maxAttempts = WIDGET_POSITIONING.MAX_POSITIONING_ATTEMPTS;
            const smallTimeElement = SmallTimeUtils.getSmallTimeElement();
            if (smallTimeElement && this.element && this.rendered) {
                // Both elements exist and we're rendered, proceed with positioning
                Logger.debug(`Auto-positioning mini widget relative to SmallTime (attempt ${attempts + 1})`);
                this.positionRelativeToSmallTime('above'); // Default to above instead of below
            }
            else if (attempts < maxAttempts) {
                // Retry after a short delay
                Logger.debug(`Retrying positioning (attempt ${attempts + 1} of ${maxAttempts})`);
                setTimeout(() => attemptPositioning(attempts + 1), WIDGET_POSITIONING.POSITIONING_RETRY_DELAY);
            }
            else {
                // SmallTime not found - use standalone positioning
                Logger.debug('SmallTime not found, using standalone positioning');
                this.positionStandalone();
            }
        };
        // Start the positioning attempt
        requestAnimationFrame(() => attemptPositioning());
    }
    /**
     * Position mini widget in standalone mode (when SmallTime is not available)
     * First try to dock to player list, then fallback to fixed positioning
     */
    positionStandalone() {
        if (!this.element)
            return;
        // First attempt: Try SmallTime-style docking to player list
        const playerList = document.getElementById('players');
        if (playerList) {
            this.positionRelativeToPlayerList();
            return;
        }
        // Fallback: Fixed positioning if player list not found
        let position = { top: 80, left: 20 }; // Default fallback
        try {
            // Fallback: Try to find where player list would typically be
            // Usually bottom-right area of UI
            position = {
                top: window.innerHeight - WIDGET_POSITIONING.STANDALONE_BOTTOM_OFFSET, // Typical player list area
                left: window.innerWidth - 240, // Typical player list left edge
            };
            Logger.debug('Player list not found, using typical location', position);
        }
        catch (error) {
            Logger.warn('Error in standalone positioning, using fallback', error);
        }
        // Apply the fixed position as last resort
        this.element.style.position = 'fixed';
        this.element.style.top = `${position.top}px`;
        this.element.style.left = `${position.left}px`;
        this.element.style.zIndex = WIDGET_POSITIONING.Z_INDEX.toString();
        this.element.style.margin = '0';
        // Add a class to indicate standalone mode
        this.element.classList.add('standalone-mode');
        this.element.classList.remove('above-smalltime', 'below-smalltime', 'beside-smalltime', 'docked-mode');
    }
    /**
     * Find SmallTime element using multiple strategies
     */
    /**
     * Position the mini widget relative to SmallTime
     */
    positionRelativeToSmallTime(position = 'below') {
        const smallTimeElement = SmallTimeUtils.getSmallTimeElement();
        if (!smallTimeElement || !this.element) {
            Logger.debug('SmallTime not found, using standalone positioning');
            // Use standalone positioning instead of basic fallback
            this.positionStandalone();
            return;
        }
        Logger.debug(`Found SmallTime, positioning mini widget ${position}`);
        // Wait for the mini widget to be properly rendered before getting dimensions
        requestAnimationFrame(() => {
            const smallTimeRect = smallTimeElement.getBoundingClientRect();
            // Use a fixed height estimate instead of getBoundingClientRect() which can be wrong
            const estimatedMiniHeight = WIDGET_POSITIONING.ESTIMATED_MINI_HEIGHT;
            Logger.debug('SmallTime rect', smallTimeRect);
            Logger.debug(`Using estimated mini height: ${estimatedMiniHeight}`);
            let newPosition;
            switch (position) {
                case 'above':
                    newPosition = {
                        top: smallTimeRect.top - estimatedMiniHeight - 8,
                        left: smallTimeRect.left,
                    };
                    this.element?.classList.add('above-smalltime');
                    this.element?.classList.remove('below-smalltime', 'beside-smalltime');
                    break;
                case 'beside':
                    newPosition = {
                        top: smallTimeRect.top,
                        left: smallTimeRect.right + 8,
                    };
                    this.element?.classList.add('beside-smalltime');
                    this.element?.classList.remove('above-smalltime', 'below-smalltime');
                    break;
                case 'below':
                default:
                    newPosition = {
                        top: smallTimeRect.bottom + 8,
                        left: smallTimeRect.left,
                    };
                    this.element?.classList.add('below-smalltime');
                    this.element?.classList.remove('above-smalltime', 'beside-smalltime');
                    break;
            }
            Logger.debug('Positioning mini widget at', newPosition);
            // Apply positioning directly via CSS (more reliable than setPosition for frameless windows)
            if (this.element) {
                this.element.style.position = 'fixed';
                this.element.style.top = `${newPosition.top}px`;
                this.element.style.left = `${newPosition.left}px`;
                this.element.style.zIndex = WIDGET_POSITIONING.Z_INDEX.toString();
                // Try to match SmallTime's actual background color
                this.matchSmallTimeBackground(smallTimeElement);
                Logger.debug('Applied CSS positioning directly');
                // Verify final position
                setTimeout(() => {
                    const finalRect = this.element?.getBoundingClientRect();
                    Logger.debug('Final position', finalRect);
                }, WIDGET_POSITIONING.POSITIONING_RETRY_DELAY);
            }
        });
    }
    /**
     * Match SmallTime's actual background styling
     */
    matchSmallTimeBackground(smallTimeElement) {
        try {
            // Find SmallTime's content area
            const smallTimeContent = smallTimeElement.querySelector('.window-content') ||
                smallTimeElement.querySelector('form') ||
                smallTimeElement;
            if (smallTimeContent && this.element) {
                const computedStyle = getComputedStyle(smallTimeContent);
                const miniContent = this.element.querySelector('.calendar-mini-content');
                if (miniContent) {
                    // Try to match the background
                    const background = computedStyle.backgroundColor;
                    const backgroundImage = computedStyle.backgroundImage;
                    Logger.debug('SmallTime background', { background, backgroundImage });
                    if (background && background !== 'rgba(0, 0, 0, 0)') {
                        miniContent.style.background = background;
                    }
                    if (backgroundImage && backgroundImage !== 'none') {
                        miniContent.style.backgroundImage = backgroundImage;
                    }
                }
            }
        }
        catch (error) {
            Logger.debug('Could not match SmallTime background', error);
        }
    }
    /**
     * Public positioning methods
     */
    static positionAboveSmallTime() {
        if (CalendarMiniWidget.activeInstance?.rendered) {
            CalendarMiniWidget.activeInstance.positionRelativeToSmallTime('above');
        }
    }
    static positionBelowSmallTime() {
        if (CalendarMiniWidget.activeInstance?.rendered) {
            CalendarMiniWidget.activeInstance.positionRelativeToSmallTime('below');
        }
    }
    static positionBesideSmallTime() {
        if (CalendarMiniWidget.activeInstance?.rendered) {
            CalendarMiniWidget.activeInstance.positionRelativeToSmallTime('beside');
        }
    }
    /**
     * Listen for SmallTime position changes and update accordingly
     */
    static registerSmallTimeIntegration() {
        // Listen for SmallTime app rendering/movement
        Hooks.on('renderApplication', (app) => {
            if (app.id === 'smalltime-app' &&
                CalendarMiniWidget.activeInstance?.rendered &&
                !CalendarMiniWidget.activeInstance.isClosing) {
                // Delay to ensure SmallTime positioning is complete
                setTimeout(() => {
                    CalendarMiniWidget.activeInstance?.autoPositionRelativeToSmallTime();
                }, WIDGET_POSITIONING.POSITIONING_RETRY_DELAY);
            }
        });
        // Listen for player list changes that might affect positioning
        Hooks.on('renderPlayerList', () => {
            if (CalendarMiniWidget.activeInstance?.rendered &&
                !CalendarMiniWidget.activeInstance.isClosing) {
                setTimeout(() => {
                    CalendarMiniWidget.activeInstance?.handlePlayerListChange();
                }, 50);
            }
        });
        // Also listen for general UI updates that might affect player list
        Hooks.on('renderSidebar', () => {
            if (CalendarMiniWidget.activeInstance?.rendered &&
                !CalendarMiniWidget.activeInstance.isClosing) {
                setTimeout(() => {
                    CalendarMiniWidget.activeInstance?.handlePlayerListChange();
                }, WIDGET_POSITIONING.POSITIONING_RETRY_DELAY);
            }
        });
        // Use MutationObserver to watch for player list changes in real-time
        const playerList = document.getElementById('players');
        if (playerList && CalendarMiniWidget.activeInstance) {
            const observer = new MutationObserver(() => {
                if (CalendarMiniWidget.activeInstance?.rendered &&
                    !CalendarMiniWidget.activeInstance.isClosing) {
                    CalendarMiniWidget.activeInstance.handlePlayerListChange();
                }
            });
            observer.observe(playerList, {
                attributes: true,
                attributeFilter: ['class', 'style'],
                childList: true,
                subtree: true,
            });
            // Store observer for cleanup
            CalendarMiniWidget.activeInstance._playerListObserver = observer;
        }
        // Listen for window resize to maintain positioning
        window.addEventListener('resize', () => {
            if (CalendarMiniWidget.activeInstance?.rendered &&
                !CalendarMiniWidget.activeInstance.isClosing) {
                // Re-evaluate positioning on resize
                CalendarMiniWidget.activeInstance.autoPositionRelativeToSmallTime();
            }
        });
    }
    /**
     * Handle player list expansion/contraction
     */
    handlePlayerListChange() {
        if (this.isClosing)
            return;
        const playerList = document.getElementById('players');
        // Check if player list is expanded using the same approach as SmallTime
        const isExpanded = playerList?.classList.contains('expanded') || false;
        if (this.element) {
            this.element.classList.toggle('player-list-expanded', isExpanded);
            // Use SmallTime-style positioning - insert before player list when not with SmallTime
            if (!SmallTimeUtils.getSmallTimeElement()) {
                this.positionRelativeToPlayerList();
            }
        }
    }
    /**
     * Position widget relative to player list using SmallTime approach
     */
    positionRelativeToPlayerList() {
        if (!this.element)
            return;
        const playerList = document.getElementById('players');
        if (!playerList)
            return;
        try {
            // Use SmallTime's approach: insert before the player list in the DOM
            // This automatically moves with player list expansion/contraction
            const uiLeft = document.getElementById('ui-left');
            if (uiLeft && !uiLeft.contains(this.element)) {
                // Move to ui-left container and position before players list
                playerList.parentElement?.insertBefore(this.element, playerList);
                // Style as pinned/docked (similar to SmallTime)
                this.element.style.position = 'relative';
                this.element.style.top = 'auto';
                this.element.style.left = 'auto';
                this.element.style.zIndex = WIDGET_POSITIONING.Z_INDEX.toString();
                this.element.style.margin = '0 0 8px 0'; // Small gap above player list
                this.element.classList.add('docked-mode');
                this.element.classList.remove('standalone-mode', 'above-smalltime', 'below-smalltime', 'beside-smalltime');
                Logger.debug('Mini widget docked above player list (SmallTime style)');
            }
        }
        catch (error) {
            Logger.warn('Error docking to player list, using fallback positioning', error);
            this.positionStandalone();
        }
    }
    /**
     * Simple positioning above SmallTime (like SmallTime's pinApp)
     */
    positionAboveSmallTime(smallTimeElement) {
        if (!this.element)
            return;
        const smallTimeRect = smallTimeElement.getBoundingClientRect();
        const estimatedMiniHeight = 32;
        // Position above SmallTime
        this.element.style.position = 'fixed';
        this.element.style.top = `${smallTimeRect.top - estimatedMiniHeight - 8}px`;
        this.element.style.left = `${smallTimeRect.left}px`;
        this.element.style.zIndex = WIDGET_POSITIONING.Z_INDEX.toString();
        this.element.classList.add('above-smalltime');
        this.element.classList.remove('below-smalltime', 'beside-smalltime', 'standalone-mode', 'docked-mode');
    }
    /**
     * Check if SmallTime is docked/pinned in the DOM hierarchy
     */
    isSmallTimeDocked(smallTimeElement) {
        // SmallTime adds 'pinned' class when docked
        if (smallTimeElement.classList.contains('pinned')) {
            return true;
        }
        // Also check if it's positioned in ui-left (where pinned widgets go)
        const uiLeft = document.getElementById('ui-left');
        if (uiLeft && uiLeft.contains(smallTimeElement)) {
            return true;
        }
        // Check if position is relative (docked) vs fixed (floating)
        const computedStyle = getComputedStyle(smallTimeElement);
        return computedStyle.position === 'relative';
    }
    /**
     * Dock above SmallTime in the DOM (when SmallTime is also docked)
     */
    dockAboveSmallTime(smallTimeElement) {
        if (!this.element)
            return;
        // Insert before SmallTime in the DOM (like SmallTime does with players)
        $(smallTimeElement).before(this.element);
        // Style for docked mode above SmallTime
        this.element.style.position = 'relative';
        this.element.style.top = 'auto';
        this.element.style.left = 'auto';
        this.element.style.zIndex = WIDGET_POSITIONING.Z_INDEX.toString();
        this.element.style.margin = '0 0 8px 0'; // Small gap below us, above SmallTime
        this.element.classList.add('above-smalltime', 'docked-mode');
        this.element.classList.remove('below-smalltime', 'beside-smalltime', 'standalone-mode');
    }
    /**
     * Simple docking to player list (exactly like SmallTime's pinApp)
     */
    dockToPlayerList() {
        if (!this.element)
            return;
        const playerList = document.getElementById('players');
        if (!playerList)
            return;
        // Exactly like SmallTime: $('#players').before(app.element)
        $(playerList).before(this.element);
        // Style for docked mode
        this.element.style.position = 'relative';
        this.element.style.top = 'auto';
        this.element.style.left = 'auto';
        this.element.style.zIndex = WIDGET_POSITIONING.Z_INDEX.toString();
        this.element.style.margin = '0 0 8px 0';
        this.element.classList.add('docked-mode');
        this.element.classList.remove('standalone-mode', 'above-smalltime', 'below-smalltime', 'beside-smalltime');
    }
    /**
     * Open larger calendar view (default widget or grid based on setting)
     */
    async _onOpenLargerView(event, _target) {
        event.preventDefault();
        Logger.info('Opening larger view from mini widget');
        try {
            const defaultWidget = game.settings?.get('seasons-and-stars', 'defaultWidget') || 'main';
            Logger.info(`Default widget setting: ${defaultWidget}`);
            // Open either the default widget or grid widget (both are larger than mini)
            if (defaultWidget === 'grid') {
                Logger.info('Opening grid widget');
                CalendarWidgetManager.showWidget('grid');
            }
            else {
                // For 'main' or anything else, show the main widget
                Logger.info('Opening main calendar widget');
                CalendarWidgetManager.showWidget('main');
            }
        }
        catch (error) {
            Logger.error('Failed to open larger view', error instanceof Error ? error : new Error(String(error)));
            // Fallback to main widget
            Logger.info('Fallback: Opening main calendar widget');
            CalendarWidgetManager.showWidget('main');
        }
    }
}
CalendarMiniWidget.activeInstance = null;
CalendarMiniWidget.DEFAULT_OPTIONS = {
    id: 'seasons-stars-mini-widget',
    classes: ['seasons-stars', 'calendar-mini-widget'],
    tag: 'div',
    window: {
        frame: false,
        positioned: true,
        minimizable: false,
        resizable: false,
    },
    position: {
        width: 200,
        height: 'auto',
        top: -1e3, // Start off-screen to minimize flash
        left: -1e3,
    },
    actions: {
        advanceTime: CalendarMiniWidget.prototype._onAdvanceTime,
        openCalendarSelection: CalendarMiniWidget.prototype._onOpenCalendarSelection,
        openLargerView: CalendarMiniWidget.prototype._onOpenLargerView,
    },
};
CalendarMiniWidget.PARTS = {
    main: {
        id: 'main',
        template: 'modules/seasons-and-stars/templates/calendar-mini-widget.hbs',
    },
};

/**
 * Calendar Grid Widget - Monthly calendar view for Seasons & Stars
 */
class CalendarGridWidget extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
    constructor(initialDate) {
        super();
        this.sidebarButtons = [];
        // Use provided date or current date
        const manager = game.seasonsStars?.manager;
        if (initialDate) {
            this.viewDate = initialDate;
        }
        else {
            const currentDate = manager?.getCurrentDate();
            if (currentDate) {
                this.viewDate = currentDate;
            }
            else {
                // Fallback to default date
                this.viewDate = {
                    year: 2024,
                    month: 1,
                    day: 1,
                    weekday: 0,
                    time: { hour: 0, minute: 0, second: 0 },
                };
            }
        }
    }
    /**
     * Handle post-render setup
     */
    async _onRender(context, options) {
        await super._onRender(context, options);
        // Register as active instance
        CalendarGridWidget.activeInstance = this;
        // Render any existing sidebar buttons
        this.renderExistingSidebarButtons();
    }
    /**
     * Prepare rendering context for template
     */
    async _prepareContext(options = {}) {
        const context = await super._prepareContext(options);
        const manager = game.seasonsStars?.manager;
        if (!manager) {
            return Object.assign(context, {
                error: 'Calendar manager not initialized',
            });
        }
        const activeCalendar = manager.getActiveCalendar();
        const currentDate = manager.getCurrentDate();
        if (!activeCalendar || !currentDate) {
            return Object.assign(context, {
                error: 'No active calendar',
            });
        }
        const calendarInfo = CalendarLocalization.getLocalizedCalendarInfo(activeCalendar);
        const monthData = this.generateMonthData(activeCalendar, this.viewDate, currentDate);
        const clickBehavior = game.settings.get('seasons-and-stars', 'calendarClickBehavior');
        const isGM = game.user?.isGM || false;
        // Generate UI hint based on current settings
        let uiHint = '';
        if (isGM) {
            if (clickBehavior === 'viewDetails') {
                uiHint = 'Click dates to view details. Ctrl+Click to set current date.';
            }
            else {
                uiHint = 'Click dates to set current date.';
            }
        }
        else {
            uiHint = 'Click dates to view details.';
        }
        return Object.assign(context, {
            calendar: calendarInfo,
            viewDate: this.viewDate,
            currentDate: currentDate.toObject(),
            monthData: monthData,
            monthName: activeCalendar.months[this.viewDate.month - 1]?.name || 'Unknown',
            monthDescription: activeCalendar.months[this.viewDate.month - 1]?.description,
            yearDisplay: `${activeCalendar.year?.prefix || ''}${this.viewDate.year}${activeCalendar.year?.suffix || ''}`,
            isGM: isGM,
            clickBehavior: clickBehavior,
            uiHint: uiHint,
            weekdays: activeCalendar.weekdays.map(wd => ({
                name: wd.name,
                abbreviation: wd.abbreviation,
                description: wd.description,
            })),
        });
    }
    /**
     * Generate calendar month data with day grid and note indicators
     */
    generateMonthData(calendar, viewDate, currentDate) {
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine)
            return { weeks: [], totalDays: 0 };
        // Get month information
        const monthInfo = calendar.months[viewDate.month - 1];
        if (!monthInfo)
            return { weeks: [], totalDays: 0 };
        // Calculate month length (considering leap years)
        const monthLength = engine.getMonthLength(viewDate.month, viewDate.year);
        // Find the first day of the month and its weekday
        const firstDayData = {
            year: viewDate.year,
            month: viewDate.month,
            day: 1,
            weekday: engine.calculateWeekday(viewDate.year, viewDate.month, 1),
            time: { hour: 0, minute: 0, second: 0 },
        };
        const firstDay = new CalendarDate(firstDayData, calendar);
        // Get notes for this month for note indicators with category and tooltip information
        const notesManager = game.seasonsStars?.notes;
        const monthNotes = new Map(); // dateKey -> note data
        if (notesManager) {
            // Get all notes for the month
            // Get notes synchronously for UI performance
            try {
                for (let day = 1; day <= monthLength; day++) {
                    const dayDateData = {
                        year: viewDate.year,
                        month: viewDate.month,
                        day: day,
                        weekday: 0,
                        time: { hour: 0, minute: 0, second: 0 },
                    };
                    const dayDate = new CalendarDate(dayDateData, calendar);
                    const allNotes = notesManager.storage?.findNotesByDateSync(dayDate) || [];
                    const notes = allNotes.filter(note => {
                        // Use Foundry's native permission checking
                        if (!game.user)
                            return false; // No user logged in
                        if (game.user.isGM)
                            return true;
                        const ownership = note.ownership;
                        const userLevel = ownership[game.user.id] || ownership.default || CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;
                        return userLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
                    });
                    if (notes.length > 0) {
                        const dateKey = this.formatDateKey(dayDate);
                        const dayCategories = new Set();
                        const noteDetails = [];
                        // Gather categories and details from all notes for this day
                        notes.forEach(note => {
                            const category = note.flags?.['seasons-and-stars']?.category || 'general';
                            const tags = note.flags?.['seasons-and-stars']?.tags || [];
                            dayCategories.add(category);
                            noteDetails.push({
                                title: note.name || 'Untitled Note',
                                tags: Array.isArray(tags) ? tags : [],
                            });
                        });
                        // Determine primary category (most common, or first if tied)
                        const categoryCount = new Map();
                        notes.forEach(note => {
                            const category = note.flags?.['seasons-and-stars']?.category || 'general';
                            categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
                        });
                        const primaryCategory = Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';
                        monthNotes.set(dateKey, {
                            count: notes.length,
                            primaryCategory,
                            categories: dayCategories,
                            notes: noteDetails,
                        });
                    }
                }
            }
            catch (error) {
                Logger.warn('Error loading notes for calendar', error);
            }
        }
        // Build calendar grid
        const weeks = [];
        let currentWeek = [];
        // Fill in empty cells before month starts
        const startWeekday = firstDay.weekday || 0;
        for (let i = 0; i < startWeekday; i++) {
            currentWeek.push({
                day: 0,
                date: { year: 0, month: 0, day: 0, weekday: 0 },
                isCurrentMonth: false,
                isToday: false,
                hasNotes: false,
                isEmpty: true,
            });
        }
        // Fill in the days of the month
        for (let day = 1; day <= monthLength; day++) {
            const dayDateData = {
                year: viewDate.year,
                month: viewDate.month,
                day: day,
                weekday: engine.calculateWeekday(viewDate.year, viewDate.month, day),
                time: { hour: 0, minute: 0, second: 0 },
            };
            const dayDate = new CalendarDate(dayDateData, calendar);
            const isToday = this.isSameDate(dayDate, currentDate);
            const isViewDate = this.isSameDate(dayDate, viewDate);
            const dateKey = this.formatDateKey(dayDate);
            const noteData = monthNotes.get(dateKey);
            const noteCount = noteData?.count || 0;
            const hasNotes = noteCount > 0;
            // Determine category class for styling
            let categoryClass = '';
            if (hasNotes && noteData) {
                if (noteData.categories.size > 1) {
                    categoryClass = 'category-mixed';
                }
                else {
                    categoryClass = `category-${noteData.primaryCategory}`;
                }
            }
            // Create enhanced tooltip with note details
            let noteTooltip = '';
            if (hasNotes && noteData) {
                const notesList = noteData.notes
                    .map(note => {
                    const tagText = note.tags.length > 0 ? ` [${note.tags.join(', ')}]` : '';
                    return `${note.title}${tagText}`;
                })
                    .join('\n');
                noteTooltip = `${noteCount} note(s) (${noteData.primaryCategory}):\n${notesList}`;
            }
            currentWeek.push({
                day: day,
                date: {
                    year: dayDate.year,
                    month: dayDate.month,
                    day: dayDate.day,
                    weekday: dayDate.weekday,
                },
                isCurrentMonth: true,
                isToday: isToday,
                hasNotes: hasNotes,
                // Additional properties for template
                isSelected: isViewDate,
                isClickable: game.user?.isGM || false,
                weekday: dayDate.weekday,
                fullDate: `${viewDate.year}-${viewDate.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                noteCount: noteCount,
                noteMultiple: noteCount > 1,
                categoryClass: categoryClass,
                primaryCategory: noteData?.primaryCategory || 'general',
                noteTooltip: noteTooltip,
                canCreateNote: this.canCreateNote(),
            });
            // Start new week on last day of week
            if (currentWeek.length === calendar.weekdays.length) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        // Fill in empty cells after month ends
        if (currentWeek.length > 0) {
            while (currentWeek.length < calendar.weekdays.length) {
                currentWeek.push({
                    day: 0,
                    date: { year: 0, month: 0, day: 0, weekday: 0 },
                    isCurrentMonth: false,
                    isToday: false,
                    hasNotes: false,
                    isEmpty: true,
                });
            }
            weeks.push(currentWeek);
        }
        // Add intercalary days as separate full-width rows
        const intercalaryDays = engine.getIntercalaryDaysAfterMonth(viewDate.year, viewDate.month);
        for (const intercalary of intercalaryDays) {
            // Find the month that this intercalary day comes after
            const afterMonthIndex = calendar.months.findIndex(m => m.name === intercalary.after);
            const intercalaryMonth = afterMonthIndex >= 0 ? afterMonthIndex + 1 : viewDate.month;
            const intercalaryDateData = {
                year: viewDate.year,
                month: intercalaryMonth, // Use the month it comes after (1-based)
                day: 1, // Intercalary days don't have regular day numbers
                weekday: 0, // Intercalary days don't have weekdays
                time: { hour: 0, minute: 0, second: 0 },
                intercalary: intercalary.name,
            };
            const intercalaryDate = new CalendarDate(intercalaryDateData, calendar);
            const isToday = this.isSameIntercalaryDate(intercalaryDate, currentDate);
            const isViewDate = this.isSameIntercalaryDate(intercalaryDate, viewDate);
            // Create intercalary day row as full-width cell
            const intercalaryRow = [
                {
                    day: intercalary.name,
                    date: intercalaryDate,
                    isToday: isToday,
                    isSelected: isViewDate,
                    isClickable: game.user?.isGM || false,
                    isCurrentMonth: true, // Intercalary days are always part of the current month
                    isIntercalary: true,
                    intercalaryName: intercalary.name,
                    intercalaryDescription: intercalary.description,
                    fullDate: `${viewDate.year}-${viewDate.month.toString().padStart(2, '0')}-${intercalary.name}`,
                    hasNotes: false, // TODO: Add intercalary note support in future
                    noteCount: 0,
                    categoryClass: '',
                    primaryCategory: 'general',
                    noteTooltip: '',
                    canCreateNote: this.canCreateNote(),
                },
            ];
            weeks.push(intercalaryRow);
        }
        return {
            weeks: weeks,
            totalDays: monthLength,
            monthName: monthInfo.name,
            monthDescription: monthInfo.description,
            intercalaryDays: intercalaryDays,
        };
    }
    /**
     * Format date as storage key
     */
    formatDateKey(date) {
        return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    }
    /**
     * Check if current user can create notes
     */
    canCreateNote() {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager)
            return false;
        // Use notes manager's canCreateNote method
        return notesManager.canCreateNote();
    }
    /**
     * Check if two dates are the same (ignoring time)
     */
    isSameDate(date1, date2) {
        // Basic date comparison
        const sameBasicDate = date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
        // Both must have the same intercalary status
        const bothIntercalary = !!date1.intercalary && !!date2.intercalary;
        const neitherIntercalary = !date1.intercalary && !date2.intercalary;
        const sameIntercalaryStatus = bothIntercalary || neitherIntercalary;
        // If both are intercalary, they must have the same intercalary name
        const sameIntercalaryName = bothIntercalary ? date1.intercalary === date2.intercalary : true;
        return sameBasicDate && sameIntercalaryStatus && sameIntercalaryName;
    }
    /**
     * Add ordinal suffix to a number (1st, 2nd, 3rd, etc.)
     */
    addOrdinalSuffix(num) {
        const lastDigit = num % 10;
        const lastTwoDigits = num % 100;
        // Handle special cases (11th, 12th, 13th)
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${num}th`;
        }
        // Handle regular cases
        switch (lastDigit) {
            case 1:
                return `${num}st`;
            case 2:
                return `${num}nd`;
            case 3:
                return `${num}rd`;
            default:
                return `${num}th`;
        }
    }
    /**
     * Format a year with prefix and suffix from calendar configuration
     */
    formatYear(year) {
        const manager = game.seasonsStars?.manager;
        const calendar = manager?.getActiveCalendar();
        if (!calendar)
            return year.toString();
        const prefix = calendar.year?.prefix || '';
        const suffix = calendar.year?.suffix || '';
        return `${prefix}${year}${suffix}`;
    }
    /**
     * Check if two intercalary dates are the same
     */
    isSameIntercalaryDate(date1, date2) {
        return (date1.year === date2.year &&
            date1.month === date2.month &&
            date1.intercalary === date2.intercalary &&
            !!date1.intercalary &&
            !!date2.intercalary);
    }
    /**
     * Navigate to previous month
     */
    async _onPreviousMonth(event, _target) {
        event.preventDefault();
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine)
            return;
        this.viewDate = engine.addMonths(this.viewDate, -1);
        this.render();
    }
    /**
     * Navigate to next month
     */
    async _onNextMonth(event, _target) {
        event.preventDefault();
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine)
            return;
        this.viewDate = engine.addMonths(this.viewDate, 1);
        this.render();
    }
    /**
     * Navigate to previous year
     */
    async _onPreviousYear(event, _target) {
        event.preventDefault();
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine)
            return;
        this.viewDate = engine.addYears(this.viewDate, -1);
        this.render();
    }
    /**
     * Navigate to next year
     */
    async _onNextYear(event, _target) {
        event.preventDefault();
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine)
            return;
        this.viewDate = engine.addYears(this.viewDate, 1);
        this.render();
    }
    /**
     * Select a specific date (GM only - sets world time) or view date details based on setting
     */
    async _onSelectDate(event, target) {
        event.preventDefault();
        const clickBehavior = game.settings.get('seasons-and-stars', 'calendarClickBehavior');
        const isGM = game.user?.isGM;
        const isCtrlClick = event.ctrlKey || event.metaKey;
        // Ctrl+Click always sets date (if GM)
        if (isCtrlClick && isGM) {
            return this.setCurrentDate(target);
        }
        // Regular click behavior based on setting
        if (clickBehavior === 'viewDetails') {
            return this.showDateInfo(target);
        }
        // Default behavior: set date (GM only)
        if (!isGM) {
            ui.notifications?.warn('Only GMs can change the current date');
            return;
        }
        return this.setCurrentDate(target);
    }
    /**
     * Set the current date (extracted from _onSelectDate for reuse)
     */
    async setCurrentDate(target) {
        const manager = game.seasonsStars?.manager;
        const engine = manager?.getActiveEngine();
        if (!manager || !engine)
            return;
        try {
            // Check if this is an intercalary day
            const calendarDay = target.closest('.calendar-day');
            const isIntercalary = calendarDay?.classList.contains('intercalary');
            let targetDate;
            const currentDate = manager.getCurrentDate();
            if (isIntercalary) {
                // Handle intercalary day selection
                const intercalaryName = target.dataset.day; // For intercalary days, day contains the name
                if (!intercalaryName)
                    return;
                // Find the intercalary day definition to determine which month it comes after
                const calendar = engine.getCalendar();
                const intercalaryDef = calendar.intercalary?.find(i => i.name === intercalaryName);
                if (!intercalaryDef)
                    return;
                // Find the month that this intercalary day comes after
                const afterMonthIndex = calendar.months.findIndex(m => m.name === intercalaryDef.after);
                if (afterMonthIndex === -1)
                    return;
                const targetDateData = {
                    year: this.viewDate.year,
                    month: afterMonthIndex + 1, // Use the month it comes after (1-based)
                    day: 1, // Intercalary days typically use day 1 as a placeholder
                    weekday: 0, // Intercalary days don't have weekdays
                    time: currentDate?.time || { hour: 0, minute: 0, second: 0 },
                    intercalary: intercalaryName,
                };
                targetDate = new CalendarDate(targetDateData, calendar);
                const afterMonthName = calendar.months[afterMonthIndex]?.name || 'Unknown';
                const yearDisplay = this.formatYear(this.viewDate.year);
                ui.notifications?.info(`Date set to ${intercalaryName} (intercalary day after ${afterMonthName} ${yearDisplay})`);
            }
            else {
                // Handle regular day selection
                const day = parseInt(target.dataset.day || '0');
                if (day < 1)
                    return;
                const targetDateData = {
                    year: this.viewDate.year,
                    month: this.viewDate.month,
                    day: day,
                    weekday: engine.calculateWeekday(this.viewDate.year, this.viewDate.month, day),
                    time: currentDate?.time || { hour: 0, minute: 0, second: 0 },
                };
                const calendar = engine.getCalendar();
                targetDate = new CalendarDate(targetDateData, calendar);
                const monthName = calendar.months[targetDate.month - 1]?.name || 'Unknown';
                const dayWithSuffix = this.addOrdinalSuffix(targetDate.day);
                const yearDisplay = this.formatYear(targetDate.year);
                ui.notifications?.info(`Date set to ${dayWithSuffix} of ${monthName}, ${yearDisplay}`);
            }
            // Set the target date
            await manager.setCurrentDate(targetDate);
            // Update view date to selected date
            this.viewDate = targetDate;
            this.render();
        }
        catch (error) {
            Logger.error('Failed to set date', error);
            ui.notifications?.error('Failed to set date');
        }
    }
    /**
     * Show information about a specific date without setting it
     */
    showDateInfo(target) {
        const manager = game.seasonsStars?.manager;
        const engine = manager?.getActiveEngine();
        if (!manager || !engine)
            return;
        try {
            // Check if this is an intercalary day
            const calendarDay = target.closest('.calendar-day');
            const isIntercalary = calendarDay?.classList.contains('intercalary');
            const calendar = engine.getCalendar();
            let dateInfo = '';
            if (isIntercalary) {
                // Handle intercalary day information
                const intercalaryName = target.dataset.day;
                if (!intercalaryName)
                    return;
                const intercalaryDef = calendar.intercalary?.find(i => i.name === intercalaryName);
                const afterMonthName = intercalaryDef?.after || 'Unknown';
                const yearDisplay = this.formatYear(this.viewDate.year);
                dateInfo = `${intercalaryName} (intercalary day after ${afterMonthName}, ${yearDisplay})`;
                if (intercalaryDef?.description) {
                    dateInfo += `\n${intercalaryDef.description}`;
                }
            }
            else {
                // Handle regular day information
                const day = parseInt(target.dataset.day || '0');
                if (day < 1)
                    return;
                const monthName = calendar.months[this.viewDate.month - 1]?.name || 'Unknown';
                const monthDesc = calendar.months[this.viewDate.month - 1]?.description;
                const dayWithSuffix = this.addOrdinalSuffix(day);
                const yearDisplay = this.formatYear(this.viewDate.year);
                dateInfo = `${dayWithSuffix} of ${monthName}, ${yearDisplay}`;
                if (monthDesc) {
                    dateInfo += `\n${monthDesc}`;
                }
            }
            // Show as notification
            ui.notifications?.info(dateInfo);
        }
        catch (error) {
            Logger.error('Failed to show date info', error);
            ui.notifications?.warn('Failed to load date information');
        }
    }
    /**
     * Go to current date
     */
    async _onGoToToday(event, _target) {
        event.preventDefault();
        const manager = game.seasonsStars?.manager;
        if (!manager)
            return;
        const currentDate = manager.getCurrentDate();
        if (currentDate) {
            this.viewDate = currentDate;
            this.render();
        }
    }
    /**
     * Set year via input dialog
     */
    async _onSetYear(event, _target) {
        event.preventDefault();
        const engine = game.seasonsStars?.manager?.getActiveEngine();
        if (!engine)
            return;
        // Create a simple input dialog
        const currentYear = this.viewDate.year;
        const newYear = await new Promise(resolve => {
            new Dialog({
                title: 'Set Year',
                content: `
          <form>
            <div class="form-group">
              <label>Enter Year:</label>
              <input type="number" name="year" value="${currentYear}" min="1" max="99999" step="1" autofocus />
            </div>
          </form>
        `,
                buttons: {
                    ok: {
                        icon: '<i class="fas fa-check"></i>',
                        label: 'Set Year',
                        callback: (html) => {
                            const yearInput = html.find('input[name="year"]').val();
                            const year = parseInt(yearInput);
                            if (!isNaN(year) && year > 0) {
                                resolve(year);
                            }
                            else {
                                ui.notifications?.error('Please enter a valid year');
                                resolve(null);
                            }
                        },
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: 'Cancel',
                        callback: () => resolve(null),
                    },
                },
                default: 'ok',
            }).render(true);
        });
        if (newYear !== null) {
            const viewDateData = this.viewDate.toObject
                ? this.viewDate.toObject()
                : this.viewDate;
            this.viewDate = { ...viewDateData, year: newYear };
            this.render();
        }
    }
    /**
     * Create a new note for the selected date
     */
    async _onCreateNote(event, target) {
        event.preventDefault();
        event.stopPropagation();
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            ui.notifications?.error('Notes system not available');
            return;
        }
        // Check permissions
        if (!this.canCreateNote()) {
            ui.notifications?.error("You don't have permission to create notes");
            return;
        }
        // Get the date from the clicked element
        const dayElement = target.closest('.calendar-day');
        if (!dayElement)
            return;
        const day = parseInt(dayElement.getAttribute('data-day') || '0');
        if (!day)
            return;
        const targetDateData = {
            year: this.viewDate.year,
            month: this.viewDate.month,
            day: day,
            weekday: 0, // Will be calculated by the engine
            time: { hour: 0, minute: 0, second: 0 },
        };
        const manager = game.seasonsStars?.manager;
        const calendar = manager?.getActiveCalendar();
        if (!calendar)
            return;
        const targetDate = new CalendarDate(targetDateData, calendar);
        // Show note creation dialog
        const noteData = await this.showCreateNoteDialog(targetDate);
        if (!noteData)
            return;
        try {
            const note = await notesManager.createNote(noteData);
            ui.notifications?.info(`Created note: ${noteData.title}`);
            // Refresh the calendar to show the new note indicator
            this.render();
            // Emit hook for other modules
            Hooks.callAll('seasons-stars:noteCreated', note);
        }
        catch (error) {
            Logger.error('Failed to create note', error);
            ui.notifications?.error('Failed to create note');
        }
    }
    /**
     * Show note creation dialog with enhanced category and tag support
     */
    async showCreateNoteDialog(date) {
        const categories = game.seasonsStars?.categories;
        if (!categories) {
            ui.notifications?.error('Note categories system not available');
            return null;
        }
        return new Promise(resolve => {
            // Ensure we have valid date values
            const safeDate = {
                year: date.year || this.viewDate.year || 2024,
                month: date.month || this.viewDate.month || 1,
                day: date.day || 1,
            };
            // Format date using calendar system
            const manager = game.seasonsStars?.manager;
            const activeCalendar = manager?.getActiveCalendar();
            let dateDisplayStr = `${safeDate.year}-${safeDate.month.toString().padStart(2, '0')}-${safeDate.day.toString().padStart(2, '0')}`;
            let calendarInfo = '';
            if (activeCalendar) {
                const monthName = activeCalendar.months[safeDate.month - 1]?.name || `Month ${safeDate.month}`;
                const yearPrefix = activeCalendar.year?.prefix || '';
                const yearSuffix = activeCalendar.year?.suffix || '';
                dateDisplayStr = `${safeDate.day} ${monthName}, ${yearPrefix}${safeDate.year}${yearSuffix}`;
                calendarInfo = `<div style="text-align: center; margin-bottom: 16px; padding: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; font-weight: 600; color: var(--color-text-dark-primary);">${dateDisplayStr}</div>`;
            }
            // Build category options from the categories system
            const availableCategories = categories.getCategories();
            const categoryOptions = availableCategories
                .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
                .join('');
            // Get predefined tags for suggestions
            const predefinedTags = categories.getPredefinedTags();
            const tagSuggestions = predefinedTags
                .map(tag => `<span class="tag-suggestion" data-tag="${tag}">${tag}</span>`)
                .join(' ');
            // Get existing tags from notes for autocompletion
            const notesManager = game.seasonsStars?.notes;
            const existingTags = new Set();
            if (notesManager && notesManager.storage) {
                try {
                    // Check if getAllNotes method exists and is callable
                    if (typeof notesManager.storage.getAllNotes === 'function') {
                        const allNotes = notesManager.storage.getAllNotes() || [];
                        allNotes.forEach(note => {
                            const noteTags = note.flags?.['seasons-and-stars']?.tags || [];
                            noteTags.forEach((tag) => existingTags.add(tag));
                        });
                    }
                    else {
                        // Fallback: try to get notes from game.journal if storage method unavailable
                        if (game.journal) {
                            for (const entry of game.journal.values()) {
                                if (entry.flags?.['seasons-and-stars']?.calendarNote === true) {
                                    const noteTags = entry.flags?.['seasons-and-stars']?.tags || [];
                                    noteTags.forEach((tag) => existingTags.add(tag));
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    // Silent fallback - just use predefined tags if existing tags can't be loaded
                    Logger.debug('Could not load existing tags for autocompletion, using predefined tags only', error);
                }
            }
            // Combine predefined and existing tags for autocompletion
            const allAvailableTags = Array.from(new Set([...predefinedTags, ...existingTags]));
            new Dialog({
                title: `Create Note`,
                content: `
          <style>
            .seasons-stars-note-form {
              max-width: 600px;
              font-family: var(--font-primary);
              overflow: visible;
            }
            .seasons-stars-note-form .form-group {
              margin-bottom: 16px;
            }
            .seasons-stars-note-form .form-row {
              display: flex;
              gap: 12px;
            }
            .seasons-stars-note-form .form-group.half-width {
              flex: 1;
            }
            .seasons-stars-note-form label {
              display: block;
              margin-bottom: 4px;
              font-weight: 600;
              color: var(--color-text-dark-primary);
              font-size: 13px;
            }
            .seasons-stars-note-form input[type="text"],
            .seasons-stars-note-form textarea,
            .seasons-stars-note-form select {
              width: 100%;
              padding: 8px 10px;
              border: 1px solid var(--color-border-dark);
              border-radius: 4px;
              background: var(--color-bg-option);
              color: var(--color-text-dark-primary);
              font-size: 13px;
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
              line-height: 1.4;
              min-height: 36px;
            }
            .seasons-stars-note-form select {
              padding: 6px 10px;
              height: auto;
              min-height: 34px;
            }
            .seasons-stars-note-form input[type="text"]:focus,
            .seasons-stars-note-form textarea:focus,
            .seasons-stars-note-form select:focus {
              border-color: var(--color-border-highlight);
              box-shadow: 0 0 0 2px rgba(var(--color-shadow-highlight), 0.2);
              outline: none;
            }
            .seasons-stars-note-form textarea {
              resize: vertical;
              min-height: 80px;
            }
            .seasons-stars-note-form .tag-suggestions {
              margin-top: 6px;
              max-height: 80px;
              overflow-y: auto;
              border: 1px solid var(--color-border-light);
              border-radius: 4px;
              padding: 8px;
              background: rgba(0, 0, 0, 0.1);
            }
            .seasons-stars-note-form .tag-suggestions small {
              display: block;
              margin-bottom: 6px;
              color: var(--color-text-dark-secondary);
              font-weight: 600;
              font-size: 11px;
            }
            .seasons-stars-note-form .tag-suggestion {
              display: inline-block;
              background: var(--color-bg-btn);
              border: 1px solid var(--color-border-dark);
              border-radius: 12px;
              padding: 4px 10px;
              margin: 2px 4px 2px 0;
              cursor: pointer;
              font-size: 11px;
              font-weight: 500;
              transition: all 0.2s ease;
              user-select: none;
            }
            .seasons-stars-note-form .tag-suggestion:hover {
              background: var(--color-bg-btn-hover);
              transform: translateY(-1px);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .seasons-stars-note-form .tag-autocomplete {
              position: relative;
            }
            .seasons-stars-note-form .tag-autocomplete-dropdown {
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: var(--color-bg-option);
              border: 1px solid var(--color-border-dark);
              border-top: none;
              border-radius: 0 0 4px 4px;
              max-height: 120px;
              overflow-y: auto;
              z-index: 1000;
              display: none;
            }
            .seasons-stars-note-form .tag-autocomplete-item {
              padding: 6px 10px;
              cursor: pointer;
              font-size: 12px;
              border-bottom: 1px solid var(--color-border-light);
              transition: background-color 0.15s ease;
            }
            .seasons-stars-note-form .tag-autocomplete-item:hover,
            .seasons-stars-note-form .tag-autocomplete-item.selected {
              background: var(--color-bg-btn-hover);
            }
            .seasons-stars-note-form .tag-autocomplete-item:last-child {
              border-bottom: none;
            }
            .seasons-stars-note-form .tag-autocomplete-item .tag-match {
              font-weight: 600;
              color: var(--color-text-highlight);
            }
          </style>
          <form class="seasons-stars-note-form">
            ${calendarInfo}
            
            <div class="form-group">
              <label>Title:</label>
              <input type="text" name="title" placeholder="Note title" autofocus />
            </div>
            
            <div class="form-group">
              <label>Content:</label>
              <textarea name="content" rows="4" placeholder="Note content"></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group half-width">
                <label>Category:</label>
                <select name="category" class="category-select">
                  ${categoryOptions}
                </select>
              </div>
              <div class="form-group half-width">
                <label>
                  <input type="checkbox" name="allDay" checked />
                  All Day Event
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Tags (optional):</label>
              <div class="tag-autocomplete">
                <input type="text" name="tags" placeholder="Enter tags separated by commas" class="tags-input" autocomplete="off" />
                <div class="tag-autocomplete-dropdown"></div>
              </div>
              <div class="tag-suggestions">
                <small>Click to add:</small>
                ${tagSuggestions}
              </div>
            </div>
          </form>
          
          <style>
            .seasons-stars-note-form .form-row {
              display: flex;
              gap: 12px;
            }
            .seasons-stars-note-form .half-width {
              flex: 1;
            }
            .seasons-stars-note-form .category-select {
              width: 100%;
            }
            .seasons-stars-note-form .tags-input {
              width: 100%;
              margin-bottom: 5px;
            }
            .seasons-stars-note-form .tag-suggestions {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
              align-items: flex-start;
              padding-top: 2px;
            }
            .seasons-stars-note-form input[type="checkbox"] {
              margin-right: 6px;
            }
            .seasons-stars-note-form .category-select {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
              background-repeat: no-repeat;
              background-position: right 8px center;
              background-size: 12px;
              padding-right: 30px !important;
              vertical-align: top;
            }
            .seasons-stars-note-form .category-select option {
              padding: 4px 8px;
              line-height: 1.4;
              min-height: 20px;
            }
          </style>
        `,
                buttons: {
                    create: {
                        icon: '<i class="fas fa-plus"></i>',
                        label: 'Create Note',
                        callback: (html) => {
                            const form = html.find('form')[0];
                            const formData = new FormData(form);
                            const title = formData.get('title');
                            const content = formData.get('content');
                            const tagsString = formData.get('tags');
                            if (!title?.trim()) {
                                ui.notifications?.error('Note title is required');
                                resolve(null);
                                return;
                            }
                            // Parse tags
                            const tags = categories.parseTagString(tagsString);
                            const { valid: validTags, invalid: invalidTags } = categories.validateTags(tags);
                            if (invalidTags.length > 0) {
                                ui.notifications?.warn(`Some tags are not allowed: ${invalidTags.join(', ')}`);
                            }
                            resolve({
                                title: title.trim(),
                                content: content || '',
                                startDate: date,
                                allDay: formData.has('allDay'),
                                category: formData.get('category') || categories.getDefaultCategory().id,
                                tags: validTags,
                                playerVisible: false, // Default to private
                                recurring: undefined, // No recurring support for now
                            });
                        },
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: 'Cancel',
                        callback: () => resolve(null),
                    },
                },
                default: 'create',
                resizable: true,
                render: (html) => {
                    // Add click handlers for tag suggestions
                    html.find('.tag-suggestion').on('click', function () {
                        const tag = $(this).data('tag');
                        const tagsInput = html.find('input[name="tags"]');
                        const currentTags = tagsInput.val();
                        if (currentTags) {
                            tagsInput.val(currentTags + ', ' + tag);
                        }
                        else {
                            tagsInput.val(tag);
                        }
                        tagsInput.trigger('input'); // Trigger autocompletion update
                    });
                    // Update category select styling based on selection
                    html.find('.category-select').on('change', function () {
                        const selectedCat = categories.getCategory($(this).val());
                        if (selectedCat) {
                            $(this).css('border-left', `4px solid ${selectedCat.color}`);
                        }
                    });
                    // Tag autocompletion functionality
                    const tagsInput = html.find('input[name="tags"]');
                    const autocompleteDropdown = html.find('.tag-autocomplete-dropdown');
                    let selectedIndex = -1;
                    // Smart tag matching function
                    function matchTag(searchTerm, tagToMatch) {
                        const search = searchTerm.toLowerCase();
                        const tag = tagToMatch.toLowerCase();
                        // Direct match
                        if (tag.includes(search)) {
                            const index = tag.indexOf(search);
                            const highlighted = tagToMatch.substring(0, index) +
                                '<span class="tag-match">' +
                                tagToMatch.substring(index, index + search.length) +
                                '</span>' +
                                tagToMatch.substring(index + search.length);
                            return { matches: true, highlighted };
                        }
                        // Colon-separated tag matching
                        if (tag.includes(':')) {
                            const parts = tag.split(':');
                            for (const part of parts) {
                                if (part.trim().includes(search)) {
                                    const partIndex = part.trim().indexOf(search);
                                    const highlighted = tagToMatch.replace(part, part.substring(0, partIndex) +
                                        '<span class="tag-match">' +
                                        part.substring(partIndex, partIndex + search.length) +
                                        '</span>' +
                                        part.substring(partIndex + search.length));
                                    return { matches: true, highlighted };
                                }
                            }
                        }
                        return { matches: false, highlighted: tagToMatch };
                    }
                    // Function to get current typing context
                    function getCurrentTypingContext() {
                        const inputElement = tagsInput[0];
                        const cursorPos = inputElement.selectionStart || 0;
                        const fullText = tagsInput.val();
                        const beforeCursor = fullText.substring(0, cursorPos);
                        const afterCursor = fullText.substring(cursorPos);
                        // Find the current tag being typed
                        const lastCommaIndex = beforeCursor.lastIndexOf(',');
                        const currentTag = beforeCursor.substring(lastCommaIndex + 1).trim();
                        return { beforeCursor, afterCursor, currentTag };
                    }
                    // Function to show autocomplete suggestions
                    function showAutocomplete(searchTerm) {
                        if (searchTerm.length < 1) {
                            autocompleteDropdown.hide();
                            return;
                        }
                        const matches = [];
                        allAvailableTags.forEach(tag => {
                            const result = matchTag(searchTerm, tag);
                            if (result.matches) {
                                matches.push({ tag, highlighted: result.highlighted });
                            }
                        });
                        if (matches.length === 0) {
                            autocompleteDropdown.hide();
                            return;
                        }
                        // Limit to top 8 matches
                        const topMatches = matches.slice(0, 8);
                        const dropdownHtml = topMatches
                            .map((match, index) => `<div class="tag-autocomplete-item" data-tag="${match.tag}" data-index="${index}">${match.highlighted}</div>`)
                            .join('');
                        autocompleteDropdown.html(dropdownHtml).show();
                        selectedIndex = -1;
                    }
                    // Function to insert selected tag
                    function insertTag(tagToInsert) {
                        const context = getCurrentTypingContext();
                        const beforeCurrentTag = context.beforeCursor.substring(0, context.beforeCursor.lastIndexOf(',') + 1);
                        const newValue = (beforeCurrentTag ? beforeCurrentTag + ' ' : '') +
                            tagToInsert +
                            (context.afterCursor.startsWith(',') ? '' : ', ') +
                            context.afterCursor;
                        tagsInput.val(newValue.replace(/,\\s*$/, '')); // Remove trailing comma
                        autocompleteDropdown.hide();
                        tagsInput.focus();
                    }
                    // Input event for autocompletion
                    tagsInput.on('input', function () {
                        const context = getCurrentTypingContext();
                        showAutocomplete(context.currentTag);
                    });
                    // Keyboard navigation
                    tagsInput.on('keydown', function (e) {
                        const dropdown = autocompleteDropdown;
                        const items = dropdown.find('.tag-autocomplete-item');
                        if (!dropdown.is(':visible') || items.length === 0)
                            return;
                        switch (e.keyCode) {
                            case 38: // Up arrow
                                e.preventDefault();
                                selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
                                break;
                            case 40: // Down arrow
                                e.preventDefault();
                                selectedIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
                                break;
                            case 13: // Enter
                                e.preventDefault();
                                if (selectedIndex >= 0) {
                                    const selectedTag = items.eq(selectedIndex).data('tag');
                                    insertTag(selectedTag);
                                }
                                return;
                            case 27: // Escape
                                dropdown.hide();
                                return;
                        }
                        // Update visual selection
                        items.removeClass('selected');
                        if (selectedIndex >= 0) {
                            items.eq(selectedIndex).addClass('selected');
                        }
                    });
                    // Click handlers for autocomplete items
                    autocompleteDropdown.on('click', '.tag-autocomplete-item', function () {
                        const tagToInsert = $(this).data('tag');
                        insertTag(tagToInsert);
                    });
                    // Hide dropdown when clicking outside
                    $(document).on('click', function (e) {
                        if (!$(e.target).closest('.tag-autocomplete').length) {
                            autocompleteDropdown.hide();
                        }
                    });
                    // Trigger initial styling
                    html.find('.category-select').trigger('change');
                },
            }).render(true);
        });
    }
    /**
     * View/edit notes for a specific date
     */
    async _onViewNotes(event, target) {
        event.preventDefault();
        event.stopPropagation();
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            ui.notifications?.error('Notes system not available');
            return;
        }
        // Get the date from the clicked element
        const dayElement = target.closest('.calendar-day');
        if (!dayElement)
            return;
        const day = parseInt(dayElement.getAttribute('data-day') || '0');
        if (!day)
            return;
        const targetDateData = {
            year: this.viewDate.year,
            month: this.viewDate.month,
            day: day,
            weekday: 0, // Will be calculated by the engine
            time: { hour: 0, minute: 0, second: 0 },
        };
        const manager = game.seasonsStars?.manager;
        const calendar = manager?.getActiveCalendar();
        if (!calendar)
            return;
        const targetDate = new CalendarDate(targetDateData, calendar);
        try {
            // Get notes for this date
            const notes = notesManager.storage?.findNotesByDateSync?.(targetDate) || [];
            if (notes.length === 0) {
                ui.notifications?.info('No notes found for this date');
                return;
            }
            if (notes.length === 1) {
                // Single note - open directly
                const note = notes[0];
                note.sheet?.render(true);
            }
            else {
                // Multiple notes - show selection dialog
                await this.showNotesSelectionDialog(notes, targetDate);
            }
        }
        catch (error) {
            Logger.error('Failed to view notes', error);
            ui.notifications?.error('Failed to view notes');
        }
    }
    /**
     * Show selection dialog for multiple notes on the same date
     */
    async showNotesSelectionDialog(notes, date) {
        const manager = game.seasonsStars?.manager;
        const activeCalendar = manager?.getActiveCalendar();
        let dateDisplayStr = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
        if (activeCalendar) {
            const monthName = activeCalendar.months[date.month - 1]?.name || `Month ${date.month}`;
            const yearPrefix = activeCalendar.year?.prefix || '';
            const yearSuffix = activeCalendar.year?.suffix || '';
            dateDisplayStr = `${date.day} ${monthName}, ${yearPrefix}${date.year}${yearSuffix}`;
        }
        const notesList = notes
            .map((note, index) => {
            const title = note.name || 'Untitled Note';
            const category = note.flags?.['seasons-and-stars']?.category || 'general';
            const preview = note.pages?.contents?.[0]?.text?.content?.substring(0, 100) || 'No content';
            const cleanPreview = preview.replace(/<[^>]*>/g, '').trim() || 'No content';
            return `
        <div class="note-item" data-note-id="${note.id}" data-index="${index}">
          <div class="note-header">
            <strong>${title}</strong>
            <span class="note-category">${category}</span>
          </div>
          <div class="note-preview">${cleanPreview}${cleanPreview.length >= 100 ? '...' : ''}</div>
        </div>
      `;
        })
            .join('');
        return new Promise(resolve => {
            new Dialog({
                title: `Notes for ${dateDisplayStr}`,
                content: `
          <style>
            .notes-selection {
              max-width: 500px;
            }
            .note-item {
              border: 1px solid var(--color-border-light);
              border-radius: 4px;
              padding: 10px;
              margin-bottom: 8px;
              cursor: pointer;
              transition: background-color 0.2s ease;
              background: rgba(255, 255, 255, 0.02);
            }
            .note-item:hover {
              background: rgba(255, 255, 255, 0.08);
              border-color: var(--color-border-highlight);
            }
            .note-item:last-child {
              margin-bottom: 0;
            }
            .note-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            }
            .note-category {
              font-size: 11px;
              background: var(--color-bg-btn);
              padding: 2px 6px;
              border-radius: 3px;
              color: var(--color-text-light-heading);
            }
            .note-preview {
              font-size: 12px;
              color: var(--color-text-dark-secondary);
              font-style: italic;
            }
          </style>
          <div class="notes-selection">
            <p>Select a note to view/edit:</p>
            ${notesList}
          </div>
        `,
                buttons: {
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: 'Cancel',
                        callback: () => resolve(),
                    },
                },
                default: 'cancel',
                render: (html) => {
                    // Add click handlers for note items
                    html.find('.note-item').on('click', function () {
                        const noteIndex = parseInt($(this).data('index'));
                        const note = notes[noteIndex];
                        if (note && note.sheet) {
                            note.sheet.render(true);
                        }
                        resolve();
                    });
                },
            }).render(true);
        });
    }
    /**
     * Attach event listeners
     */
    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        // Register this as the active instance
        CalendarGridWidget.activeInstance = this;
    }
    /**
     * Handle closing the widget
     */
    async close(options = {}) {
        // Clear active instance if this is it
        if (CalendarGridWidget.activeInstance === this) {
            CalendarGridWidget.activeInstance = null;
        }
        return super.close(options);
    }
    /**
     * Handle Foundry hooks for real-time updates
     */
    static registerHooks() {
        // Update widget when time changes
        Hooks.on('seasons-stars:dateChanged', () => {
            if (CalendarGridWidget.activeInstance?.rendered) {
                CalendarGridWidget.activeInstance.render();
            }
        });
        // Update widget when calendar changes
        Hooks.on('seasons-stars:calendarChanged', () => {
            if (CalendarGridWidget.activeInstance?.rendered) {
                // Reset to current date when calendar changes
                const manager = game.seasonsStars?.manager;
                if (manager) {
                    const currentDate = manager.getCurrentDate();
                    if (currentDate) {
                        CalendarGridWidget.activeInstance.viewDate = currentDate;
                    }
                }
                CalendarGridWidget.activeInstance.render();
            }
        });
    }
    /**
     * Show the widget
     */
    static show(initialDate) {
        if (CalendarGridWidget.activeInstance) {
            if (!CalendarGridWidget.activeInstance.rendered) {
                CalendarGridWidget.activeInstance.render(true);
            }
        }
        else {
            new CalendarGridWidget(initialDate).render(true);
        }
    }
    /**
     * Toggle widget visibility
     */
    static toggle(initialDate) {
        if (CalendarGridWidget.activeInstance) {
            if (CalendarGridWidget.activeInstance.rendered) {
                CalendarGridWidget.activeInstance.close();
            }
            else {
                CalendarGridWidget.activeInstance.render(true);
            }
        }
        else {
            new CalendarGridWidget(initialDate).render(true);
        }
    }
    /**
     * Hide the widget
     */
    static hide() {
        if (CalendarGridWidget.activeInstance?.rendered) {
            CalendarGridWidget.activeInstance.close();
        }
    }
    /**
     * Get the current widget instance
     */
    static getInstance() {
        return CalendarGridWidget.activeInstance;
    }
    /**
     * Add a sidebar button to the grid widget
     * Provides generic API for integration with other modules
     */
    addSidebarButton(name, icon, tooltip, callback) {
        // Check if button already exists
        const existingButton = this.sidebarButtons.find(btn => btn.name === name);
        if (existingButton) {
            Logger.debug(`Button "${name}" already exists in grid widget`);
            return;
        }
        // Add to buttons array
        this.sidebarButtons.push({ name, icon, tooltip, callback });
        Logger.debug(`Added sidebar button "${name}" to grid widget`);
        // If widget is rendered, add button to DOM immediately
        if (this.rendered && this.element) {
            this.renderSidebarButton(name, icon, tooltip, callback);
        }
    }
    /**
     * Render a sidebar button in the grid widget header
     */
    renderSidebarButton(name, icon, tooltip, callback) {
        if (!this.element)
            return;
        const buttonId = `grid-sidebar-btn-${name.toLowerCase().replace(/\s+/g, '-')}`;
        // Don't add if already exists in DOM
        if (this.element.querySelector(`#${buttonId}`)) {
            return;
        }
        // Find window controls area in header
        let windowControls = this.element.querySelector('.window-header .window-controls');
        if (!windowControls) {
            // Try to find window header and add controls area
            const windowHeader = this.element.querySelector('.window-header');
            if (windowHeader) {
                windowControls = document.createElement('div');
                windowControls.className = 'window-controls';
                windowControls.style.cssText = 'display: flex; align-items: center; margin-left: auto;';
                windowHeader.appendChild(windowControls);
            }
            else {
                Logger.warn('No window header found for grid widget sidebar button');
                return;
            }
        }
        // Create button element
        const button = document.createElement('button');
        button.id = buttonId;
        button.className = 'grid-sidebar-button';
        button.title = tooltip;
        button.innerHTML = `<i class="fas ${icon}"></i>`;
        button.style.cssText = `
      background: var(--color-bg-btn, #f0f0f0);
      border: 1px solid var(--color-border-dark, #999);
      border-radius: 3px;
      padding: 4px 6px;
      margin-left: 4px;
      cursor: pointer;
      font-size: 12px;
      color: var(--color-text-primary, #000);
      transition: background-color 0.15s ease;
    `;
        // Add click handler
        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            try {
                callback();
            }
            catch (error) {
                Logger.error(`Error in grid widget sidebar button "${name}"`, error);
            }
        });
        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.background = 'var(--color-bg-btn-hover, #e0e0e0)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'var(--color-bg-btn, #f0f0f0)';
        });
        windowControls.appendChild(button);
        Logger.debug(`Rendered sidebar button "${name}" in grid widget header`);
    }
    /**
     * Render all existing sidebar buttons (called after widget render)
     */
    renderExistingSidebarButtons() {
        this.sidebarButtons.forEach(button => {
            this.renderSidebarButton(button.name, button.icon, button.tooltip, button.callback);
        });
    }
    /**
     * Switch to main widget
     */
    async _onSwitchToMain(event, _target) {
        event.preventDefault();
        Logger.debug('Switching from grid widget to main widget');
        try {
            // Close current widget
            this.close();
            // Open main widget
            CalendarWidgetManager.showWidget('main');
        }
        catch (error) {
            Logger.error('Failed to switch to main widget', error instanceof Error ? error : new Error(String(error)));
        }
    }
    /**
     * Switch to mini widget
     */
    async _onSwitchToMini(event, _target) {
        event.preventDefault();
        Logger.debug('Switching from grid widget to mini widget');
        try {
            // Close current widget
            this.close();
            // Open mini widget
            CalendarWidgetManager.showWidget('mini');
        }
        catch (error) {
            Logger.error('Failed to switch to mini widget', error instanceof Error ? error : new Error(String(error)));
        }
    }
}
CalendarGridWidget.activeInstance = null;
CalendarGridWidget.DEFAULT_OPTIONS = {
    id: 'seasons-stars-grid-widget',
    classes: ['seasons-stars', 'calendar-grid-widget'],
    tag: 'div',
    window: {
        frame: true,
        positioned: true,
        title: 'SEASONS_STARS.calendar.monthly_view',
        icon: 'fa-solid fa-calendar',
        minimizable: false,
        resizable: false,
    },
    position: {
        width: 400,
        height: 'auto',
    },
    actions: {
        previousMonth: CalendarGridWidget.prototype._onPreviousMonth,
        nextMonth: CalendarGridWidget.prototype._onNextMonth,
        previousYear: CalendarGridWidget.prototype._onPreviousYear,
        nextYear: CalendarGridWidget.prototype._onNextYear,
        selectDate: CalendarGridWidget.prototype._onSelectDate,
        goToToday: CalendarGridWidget.prototype._onGoToToday,
        setYear: CalendarGridWidget.prototype._onSetYear,
        createNote: CalendarGridWidget.prototype._onCreateNote,
        viewNotes: CalendarGridWidget.prototype._onViewNotes,
        switchToMain: CalendarGridWidget.prototype._onSwitchToMain,
        switchToMini: CalendarGridWidget.prototype._onSwitchToMini,
    },
};
CalendarGridWidget.PARTS = {
    main: {
        id: 'main',
        template: 'modules/seasons-and-stars/templates/calendar-grid-widget.hbs',
    },
};

/**
 * Scene controls integration for Seasons & Stars
 */
class SeasonsStarsSceneControls {
    /**
     * Register scene controls
     */
    static registerControls() {
        Logger.debug('SeasonsStarsSceneControls.registerControls() called - registering getSceneControlButtons hook');
        Hooks.on('getSceneControlButtons', (controls) => {
            Logger.debug('getSceneControlButtons hook fired', {
                userExists: !!game.user,
                isGM: game.user?.isGM,
                controlsType: typeof controls,
                controlsKeys: Object.keys(controls),
                notesExists: !!controls.notes,
                notesToolsExists: !!controls.notes?.tools,
                notesToolsType: typeof controls.notes?.tools,
                notesToolsKeys: controls.notes?.tools ? Object.keys(controls.notes.tools) : null,
            });
            if (!game.user?.isGM) {
                Logger.debug('User is not GM, skipping scene control registration');
                return;
            }
            // Access notes controls directly (controls is an object, not array)
            if (controls.notes?.tools) {
                Logger.debug('Adding S&S scene control to notes.tools');
                // Use SmallTime's pattern of direct property assignment
                controls.notes.tools['seasons-stars-widget'] = {
                    name: 'seasons-stars-widget',
                    title: 'SEASONS_STARS.calendar.toggle_calendar',
                    icon: 'fas fa-calendar-alt',
                    onChange: () => SeasonsStarsSceneControls.toggleDefaultWidget(),
                    button: true,
                };
                Logger.debug('Added S&S scene control button, updated tools:', Object.keys(controls.notes.tools));
            }
            else {
                Logger.warn('Notes controls not available for scene button', {
                    notesExists: !!controls.notes,
                    notesToolsExists: !!controls.notes?.tools,
                    fullControlsStructure: controls,
                });
            }
        });
        // Update button state based on widget manager state
        Hooks.on('seasons-stars:widgetStateChanged', () => {
            const hasVisibleWidget = CalendarWidgetManager.getVisibleWidgets().length > 0;
            SeasonsStarsSceneControls.updateControlState(hasVisibleWidget);
        });
    }
    /**
     * Show the default widget based on user settings
     */
    static showDefaultWidget() {
        try {
            const defaultWidget = game.settings?.get('seasons-and-stars', 'defaultWidget') || 'main';
            Logger.debug('Showing default widget', { defaultWidget });
            switch (defaultWidget) {
                case 'mini':
                    CalendarWidgetManager.showWidget('mini');
                    break;
                case 'grid':
                    CalendarWidgetManager.showWidget('grid');
                    break;
                case 'main':
                default:
                    CalendarWidgetManager.showWidget('main');
                    break;
            }
        }
        catch (error) {
            Logger.error('Failed to show default widget', error instanceof Error ? error : new Error(String(error)));
            // Fallback to main widget
            CalendarWidgetManager.showWidget('main');
        }
    }
    /**
     * Hide the default widget based on user settings
     */
    static hideDefaultWidget() {
        try {
            const defaultWidget = game.settings?.get('seasons-and-stars', 'defaultWidget') || 'main';
            Logger.debug('Hiding default widget', { defaultWidget });
            switch (defaultWidget) {
                case 'mini':
                    CalendarWidgetManager.hideWidget('mini');
                    break;
                case 'grid':
                    CalendarWidgetManager.hideWidget('grid');
                    break;
                case 'main':
                default:
                    CalendarWidgetManager.hideWidget('main');
                    break;
            }
        }
        catch (error) {
            Logger.error('Failed to hide default widget', error instanceof Error ? error : new Error(String(error)));
            // Fallback to main widget
            CalendarWidgetManager.hideWidget('main');
        }
    }
    /**
     * Toggle the default widget based on user settings
     */
    static toggleDefaultWidget() {
        try {
            const defaultWidget = game.settings?.get('seasons-and-stars', 'defaultWidget') || 'main';
            Logger.debug('Scene control toggling default widget', { defaultWidget });
            switch (defaultWidget) {
                case 'mini':
                    CalendarWidgetManager.toggleWidget('mini');
                    break;
                case 'grid':
                    CalendarWidgetManager.toggleWidget('grid');
                    break;
                case 'main':
                default:
                    CalendarWidgetManager.toggleWidget('main');
                    break;
            }
        }
        catch (error) {
            Logger.error('Failed to toggle default widget from scene control', error instanceof Error ? error : new Error(String(error)));
            // Fallback to main widget
            CalendarWidgetManager.toggleWidget('main');
        }
    }
    /**
     * Update the control button state
     */
    static updateControlState(active) {
        // Look for our tool button in the scene controls
        const control = document.querySelector('[data-tool="seasons-stars-widget"]');
        if (control) {
            control.classList.toggle('active', active);
        }
    }
    /**
     * Add macro support for calendar widget
     */
    static registerMacros() {
        // Extend the existing SeasonsStars object with macro functions
        if (!window.SeasonsStars) {
            window.SeasonsStars = {};
        }
        // Add macro functions to the existing object
        Object.assign(window.SeasonsStars, {
            // Widget controls - respect default widget setting
            showWidget: () => SeasonsStarsSceneControls.showDefaultWidget(),
            hideWidget: () => SeasonsStarsSceneControls.hideDefaultWidget(),
            toggleWidget: () => SeasonsStarsSceneControls.toggleDefaultWidget(),
            // Specific widget controls (for advanced users who want to override default)
            showMainWidget: () => CalendarWidgetManager.showWidget('main'),
            hideMainWidget: () => CalendarWidgetManager.hideWidget('main'),
            toggleMainWidget: () => CalendarWidgetManager.toggleWidget('main'),
            showMiniWidget: () => CalendarWidgetManager.showWidget('mini'),
            hideMiniWidget: () => CalendarWidgetManager.hideWidget('mini'),
            toggleMiniWidget: () => CalendarWidgetManager.toggleWidget('mini'),
            showGridWidget: () => CalendarWidgetManager.showWidget('grid'),
            hideGridWidget: () => CalendarWidgetManager.hideWidget('grid'),
            toggleGridWidget: () => CalendarWidgetManager.toggleWidget('grid'),
            // Mini widget positioning (legacy support)
            positionMiniAboveSmallTime: () => {
                const miniWidget = CalendarWidgetManager.getWidgetInstance('mini');
                if (miniWidget && typeof miniWidget.positionAboveSmallTime === 'function') {
                    miniWidget.positionAboveSmallTime();
                }
            },
            positionMiniBelowSmallTime: () => {
                const miniWidget = CalendarWidgetManager.getWidgetInstance('mini');
                if (miniWidget && typeof miniWidget.positionBelowSmallTime === 'function') {
                    miniWidget.positionBelowSmallTime();
                }
            },
            positionMiniBesideSmallTime: () => {
                const miniWidget = CalendarWidgetManager.getWidgetInstance('mini');
                if (miniWidget && typeof miniWidget.positionBesideSmallTime === 'function') {
                    miniWidget.positionBesideSmallTime();
                }
            },
            // Time advancement functions for macros
            advanceMinutes: async (minutes) => {
                const manager = game.seasonsStars?.manager;
                if (manager && manager.advanceMinutes)
                    await manager.advanceMinutes(minutes);
            },
            advanceHours: async (hours) => {
                const manager = game.seasonsStars?.manager;
                if (manager && manager.advanceHours)
                    await manager.advanceHours(hours);
            },
            advanceDays: async (days) => {
                const manager = game.seasonsStars?.manager;
                if (manager && manager.advanceDays)
                    await manager.advanceDays(days);
            },
            advanceWeeks: async (weeks) => {
                const manager = game.seasonsStars?.manager;
                if (manager && manager.advanceWeeks)
                    await manager.advanceWeeks(weeks);
            },
            advanceMonths: async (months) => {
                const manager = game.seasonsStars?.manager;
                if (manager && manager.advanceMonths)
                    await manager.advanceMonths(months);
            },
            advanceYears: async (years) => {
                const manager = game.seasonsStars?.manager;
                if (manager && manager.advanceYears)
                    await manager.advanceYears(years);
            },
        });
        Logger.debug('Macro functions registered');
    }
}

/**
 * Keyboard shortcuts for Seasons & Stars
 */
class SeasonsStarsKeybindings {
    /**
     * Register all keyboard shortcuts
     */
    static registerKeybindings() {
        if (!game.keybindings) {
            Logger.warn('Keybindings API not available');
            return;
        }
        Logger.info('Registering keyboard shortcuts');
        // Alt+S - Toggle default widget
        game.keybindings.register('seasons-and-stars', 'toggleDefaultWidget', {
            name: 'SEASONS_STARS.keybindings.toggle_default_widget',
            hint: 'SEASONS_STARS.keybindings.toggle_default_widget_hint',
            editable: [
                {
                    key: 'KeyS',
                    modifiers: ['Alt'],
                },
            ],
            onDown: () => {
                Logger.debug('Default widget toggle shortcut pressed');
                SeasonsStarsKeybindings.toggleDefaultWidget();
                return true;
            },
            restricted: false, // Available to all users
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        });
        // Alt+Shift+S - Toggle mini widget specifically
        game.keybindings.register('seasons-and-stars', 'toggleMiniWidget', {
            name: 'SEASONS_STARS.keybindings.toggle_mini_widget',
            hint: 'SEASONS_STARS.keybindings.toggle_mini_widget_hint',
            editable: [
                {
                    key: 'KeyS',
                    modifiers: ['Alt', 'Shift'],
                },
            ],
            onDown: () => {
                Logger.debug('Mini widget toggle shortcut pressed');
                CalendarMiniWidget.toggle();
                return true;
            },
            restricted: false,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        });
        // Alt+Ctrl+S - Toggle grid widget specifically
        game.keybindings.register('seasons-and-stars', 'toggleGridWidget', {
            name: 'SEASONS_STARS.keybindings.toggle_grid_widget',
            hint: 'SEASONS_STARS.keybindings.toggle_grid_widget_hint',
            editable: [
                {
                    key: 'KeyS',
                    modifiers: ['Alt', 'Control'],
                },
            ],
            onDown: () => {
                Logger.debug('Grid widget toggle shortcut pressed');
                CalendarGridWidget.toggle();
                return true;
            },
            restricted: false,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        });
        // Alt+Shift+Ctrl+S - Toggle main widget (future calendar management interface)
        game.keybindings.register('seasons-and-stars', 'toggleMainWidget', {
            name: 'SEASONS_STARS.keybindings.toggle_main_widget',
            hint: 'SEASONS_STARS.keybindings.toggle_main_widget_hint',
            editable: [
                {
                    key: 'KeyS',
                    modifiers: ['Alt', 'Shift', 'Control'],
                },
            ],
            onDown: () => {
                Logger.debug('Main widget toggle shortcut pressed');
                CalendarWidget.toggle();
                return true;
            },
            restricted: false,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
        });
        Logger.info('Keyboard shortcuts registered successfully');
    }
    /**
     * Toggle the default widget based on user settings
     */
    static toggleDefaultWidget() {
        try {
            const defaultWidget = game.settings?.get('seasons-and-stars', 'defaultWidget') || 'main';
            Logger.debug('Toggling default widget', { defaultWidget });
            switch (defaultWidget) {
                case 'mini':
                    CalendarMiniWidget.toggle();
                    break;
                case 'grid':
                    CalendarGridWidget.toggle();
                    break;
                case 'main':
                default:
                    CalendarWidget.toggle();
                    break;
            }
        }
        catch (error) {
            Logger.error('Failed to toggle default widget', error instanceof Error ? error : new Error(String(error)));
            // Fallback to main widget
            CalendarWidget.toggle();
        }
    }
    /**
     * Check if keyboard shortcuts are working (for debugging)
     */
    static testKeybindings() {
        if (!game.keybindings) {
            Logger.warn('Keybindings API not available for testing');
            return false;
        }
        const registeredKeybindings = game.keybindings.actions.get('seasons-and-stars');
        const expectedKeybindings = [
            'toggleDefaultWidget',
            'toggleMiniWidget',
            'toggleGridWidget',
            'toggleMainWidget',
        ];
        const registeredNames = registeredKeybindings ? Array.from(registeredKeybindings.keys()) : [];
        const allRegistered = expectedKeybindings.every(name => registeredNames.includes(name));
        Logger.debug('Keybinding test results', {
            expected: expectedKeybindings,
            registered: registeredNames,
            allRegistered,
        });
        return allRegistered;
    }
}

/**
 * Type guard functions for Seasons & Stars interfaces
 */
function isCalendarManager(obj) {
    return !!(obj &&
        typeof obj === 'object' &&
        'getCurrentDate' in obj &&
        'getActiveCalendar' in obj);
}

/**
 * Bridge Integration Interface for Seasons & Stars
 *
 * Provides a clean, generic API for compatibility bridge modules to integrate
 * with S&S without requiring external calendar system knowledge in the core.
 */
var WidgetPreference;
(function (WidgetPreference) {
    WidgetPreference["MAIN"] = "main";
    WidgetPreference["MINI"] = "mini";
    WidgetPreference["GRID"] = "grid";
    WidgetPreference["ANY"] = "any";
})(WidgetPreference || (WidgetPreference = {}));
/**
 * Main integration class that bridges use to interact with S&S
 */
class SeasonsStarsIntegration {
    constructor(manager) {
        this.manager = manager;
        this.widgetManager = new IntegrationWidgetManager();
        this.hookManager = new IntegrationHookManager(manager);
    }
    /**
     * Detect and create integration instance
     */
    static detect() {
        if (this.instance) {
            return this.instance;
        }
        // Check if S&S is available
        const module = game.modules.get('seasons-and-stars');
        if (!module?.active) {
            return null;
        }
        // Check if manager is available
        const manager = game.seasonsStars?.manager;
        if (!manager || !isCalendarManager(manager)) {
            return null;
        }
        this.instance = new SeasonsStarsIntegration(manager);
        return this.instance;
    }
    /**
     * Get current version
     */
    get version() {
        const module = game.modules.get('seasons-and-stars');
        return module?.version || '0.0.0';
    }
    /**
     * Check if integration is available
     */
    get isAvailable() {
        return !!(this.manager && this.api);
    }
    /**
     * Get API interface
     */
    get api() {
        return new IntegrationAPI(this.manager); // TODO: Fix interface mismatches
    }
    /**
     * Get widgets interface
     */
    get widgets() {
        return this.widgetManager; // TODO: Fix interface mismatches
    }
    /**
     * Get hooks interface
     */
    get hooks() {
        return this.hookManager; // TODO: Fix interface mismatches
    }
    /**
     * Check if specific feature is available
     */
    hasFeature(feature) {
        return this.getFeatureVersion(feature) !== null;
    }
    /**
     * Get feature version for compatibility checking
     */
    getFeatureVersion(feature) {
        const version = this.version;
        // Use capability detection instead of version comparison for better compatibility
        switch (feature) {
            case 'basic-api':
                return this.manager ? version : null;
            case 'widget-system':
                return this.widgetManager.main || this.widgetManager.mini ? version : null;
            case 'sidebar-buttons': {
                // Check if widgets have addSidebarButton method
                const mainWidget = this.widgetManager.main;
                return mainWidget && typeof mainWidget.addSidebarButton === 'function' ? version : null;
            }
            case 'mini-widget':
                return this.widgetManager.mini ? version : null;
            case 'time-advancement':
                return typeof this.manager.advanceDays === 'function' &&
                    typeof this.manager.advanceHours === 'function'
                    ? version
                    : null;
            case 'multiple-calendars':
                return this.manager.getAvailableCalendars().length > 1 ? version : null;
            case 'grid-widget':
                return this.widgetManager.grid ? version : null;
            case 'bridge-interface':
                // This feature is available if we have the integration class
                return version;
            case 'notes-system':
                // Check if notes manager is available
                return game.seasonsStars?.notes ? version : null;
            case 'simple-calendar-notes-api': {
                // Check if notes API methods are available
                const notesManager = game.seasonsStars?.notes;
                return notesManager &&
                    typeof notesManager.createNote === 'function' &&
                    typeof notesManager.setNoteModuleData === 'function'
                    ? version
                    : null;
            }
            default:
                return null;
        }
    }
    compareVersions(version1, version2) {
        const v1Parts = version1.split('.').map(Number);
        const v2Parts = version2.split('.').map(Number);
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            if (v1Part !== v2Part) {
                return v1Part - v2Part;
            }
        }
        return 0;
    }
    /**
     * Clean up integration resources
     */
    cleanup() {
        this.hookManager.cleanup();
        this.widgetManager.cleanup();
        SeasonsStarsIntegration.instance = null;
    }
}
SeasonsStarsIntegration.instance = null;
/**
 * API implementation that wraps the calendar manager
 */
class IntegrationAPI {
    constructor(manager) {
        this.manager = manager;
    }
    getCurrentDate(_calendarId) {
        // The actual manager method doesn't take a calendarId
        const currentDate = this.manager.getCurrentDate();
        if (!currentDate) {
            throw new Error('No active calendar or current date available');
        }
        return currentDate;
    }
    worldTimeToDate(timestamp, _calendarId) {
        // Use engine to convert world time to date
        const engine = this.manager.getActiveEngine();
        if (!engine) {
            throw new Error('No active calendar engine');
        }
        return engine.worldTimeToDate(timestamp);
    }
    dateToWorldTime(date, _calendarId) {
        // Use engine to convert date to world time
        const engine = this.manager.getActiveEngine();
        if (!engine) {
            throw new Error('No active calendar engine');
        }
        return engine.dateToWorldTime(date);
    }
    formatDate(date, options) {
        // Use CalendarDate class to format date
        const calendar = this.manager.getActiveCalendar();
        if (!calendar) {
            throw new Error('No active calendar');
        }
        const calendarDate = new CalendarDate(date, calendar);
        return calendarDate.format(options || {});
    }
    getActiveCalendar() {
        const calendar = this.manager.getActiveCalendar();
        if (!calendar) {
            throw new Error('No active calendar');
        }
        return calendar;
    }
    async setActiveCalendar(calendarId) {
        const success = await this.manager.setActiveCalendar(calendarId);
        if (!success) {
            throw new Error(`Failed to set active calendar: ${calendarId}`);
        }
    }
    getAvailableCalendars() {
        return this.manager.getAvailableCalendars();
    }
    async advanceDays(days, _calendarId) {
        return this.manager.advanceDays(days);
    }
    async advanceHours(hours, _calendarId) {
        return this.manager.advanceHours(hours);
    }
    async advanceMinutes(minutes, _calendarId) {
        return this.manager.advanceMinutes(minutes);
    }
    getMonthNames(calendarId) {
        const calendar = calendarId
            ? this.manager.getCalendar(calendarId)
            : this.manager.getActiveCalendar();
        if (!calendar) {
            throw new Error('No calendar available');
        }
        return calendar.months.map(month => month.name);
    }
    getWeekdayNames(calendarId) {
        const calendar = calendarId
            ? this.manager.getCalendar(calendarId)
            : this.manager.getActiveCalendar();
        if (!calendar) {
            throw new Error('No calendar available');
        }
        return calendar.weekdays.map(weekday => weekday.name);
    }
    getSunriseSunset(_date, _calendarId) {
        // Default implementation - can be enhanced with calendar-specific data
        return {
            sunrise: 6, // 6 AM
            sunset: 18, // 6 PM
        };
    }
    getSeasonInfo(date, _calendarId) {
        // Default seasonal calculation - can be enhanced with calendar-specific data
        const month = date.month;
        if (month >= 3 && month <= 5) {
            return { name: 'Spring', icon: 'spring' };
        }
        else if (month >= 6 && month <= 8) {
            return { name: 'Summer', icon: 'summer' };
        }
        else if (month >= 9 && month <= 11) {
            return { name: 'Fall', icon: 'fall' };
        }
        else {
            return { name: 'Winter', icon: 'winter' };
        }
    }
    get notes() {
        return new IntegrationNotesAPI(this.manager);
    }
}
/**
 * Widget manager for bridge integration
 */
class IntegrationWidgetManager {
    constructor() {
        this.changeCallbacks = [];
    }
    get main() {
        const widget = CalendarWidget.getInstance();
        return widget ? new BridgeWidgetWrapper(widget, 'main') : null;
    }
    get mini() {
        const widget = CalendarMiniWidget.getInstance();
        return widget ? new BridgeWidgetWrapper(widget, 'mini') : null;
    }
    get grid() {
        const widget = CalendarGridWidget.getInstance();
        return widget ? new BridgeWidgetWrapper(widget, 'grid') : null;
    }
    getPreferredWidget(preference = WidgetPreference.ANY) {
        switch (preference) {
            case WidgetPreference.MAIN:
                return this.main;
            case WidgetPreference.MINI:
                return this.mini;
            case WidgetPreference.GRID:
                return this.grid;
            case WidgetPreference.ANY:
            default:
                return this.mini || this.main || this.grid;
        }
    }
    onWidgetChange(callback) {
        this.changeCallbacks.push(callback);
    }
    offWidgetChange(callback) {
        const index = this.changeCallbacks.indexOf(callback);
        if (index > -1) {
            this.changeCallbacks.splice(index, 1);
        }
    }
    notifyWidgetChange() {
        for (const callback of this.changeCallbacks) {
            try {
                callback(this); // TODO: Fix interface mismatch
            }
            catch (error) {
                Logger.error('Widget change callback error', error instanceof Error ? error : new Error(String(error)));
            }
        }
    }
    cleanup() {
        this.changeCallbacks.length = 0;
    }
}
/**
 * Wrapper for widget instances to provide bridge interface
 */
class BridgeWidgetWrapper {
    constructor(widget, widgetType) {
        this.widget = widget;
        this.widgetType = widgetType;
    }
    get id() {
        return `${this.widgetType}-widget`;
    }
    get isVisible() {
        return this.widget.rendered || false;
    }
    addSidebarButton(name, icon, tooltip, callback) {
        if (typeof this.widget.addSidebarButton === 'function') {
            this.widget.addSidebarButton(name, icon, tooltip, callback);
        }
        else {
            throw new Error(`Widget ${this.widgetType} does not support sidebar buttons`);
        }
    }
    removeSidebarButton(name) {
        if (typeof this.widget.removeSidebarButton === 'function') {
            this.widget.removeSidebarButton(name);
        }
    }
    hasSidebarButton(name) {
        if (typeof this.widget.hasSidebarButton === 'function') {
            return this.widget.hasSidebarButton(name);
        }
        return false;
    }
    getInstance() {
        return this.widget;
    }
}
/**
 * Hook manager for bridge integration
 */
class IntegrationHookManager {
    constructor(manager) {
        this.manager = manager;
        this.hookCallbacks = new Map();
        this.setupHookListeners();
    }
    setupHookListeners() {
        // Listen to internal S&S hooks and translate for bridges
        Hooks.on('seasons-stars:dateChanged', (data) => {
            this.emitToCallbacks('dateChanged', data);
        });
        Hooks.on('seasons-stars:calendarChanged', (data) => {
            this.emitToCallbacks('calendarChanged', data);
        });
        Hooks.on('seasons-stars:ready', (data) => {
            this.emitToCallbacks('ready', data);
        });
    }
    onDateChanged(callback) {
        this.addCallback('dateChanged', callback);
    }
    onCalendarChanged(callback) {
        this.addCallback('calendarChanged', callback);
    }
    onReady(callback) {
        this.addCallback('ready', callback);
    }
    off(hookName, callback) {
        const callbacks = this.hookCallbacks.get(hookName);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    addCallback(hookName, callback) {
        if (!this.hookCallbacks.has(hookName)) {
            this.hookCallbacks.set(hookName, []);
        }
        this.hookCallbacks.get(hookName).push(callback);
    }
    emitToCallbacks(hookName, data) {
        const callbacks = this.hookCallbacks.get(hookName);
        if (callbacks) {
            for (const callback of callbacks) {
                try {
                    callback(data);
                }
                catch (error) {
                    Logger.error(`Hook callback error for ${hookName}`, error instanceof Error ? error : new Error(String(error)));
                }
            }
        }
    }
    cleanup() {
        this.hookCallbacks.clear();
        // Note: We don't remove the Foundry hooks as other parts of S&S may still need them
    }
}
/**
 * Notes API implementation for bridge integration
 * Provides complete Simple Calendar API compatibility with full notes functionality
 */
class IntegrationNotesAPI {
    constructor(manager) {
        this.manager = manager;
    }
    // Simple Calendar API compatibility methods
    async addNote(title, content, startDate, endDate, allDay = true, playerVisible = true) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            throw new Error('Notes system not available');
        }
        // Convert Simple Calendar format (0-based) to S&S format (1-based)
        const convertedStartDate = this.convertSCDateToSS(startDate);
        const convertedEndDate = endDate ? this.convertSCDateToSS(endDate) : undefined;
        const noteData = {
            title,
            content,
            startDate: convertedStartDate,
            endDate: convertedEndDate,
            allDay,
            calendarId: this.manager.getActiveCalendar()?.id || 'default',
            playerVisible,
        };
        const note = await notesManager.createNote(noteData);
        // Return Simple Calendar compatible object
        return this.convertNoteToSCFormat(note);
    }
    async removeNote(noteId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            throw new Error('Notes system not available');
        }
        await notesManager.deleteNote(noteId);
    }
    getNotesForDay(year, month, day, _calendarId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            return [];
        }
        // Convert 0-based SC format to 1-based S&S format
        const engine = this.manager.getActiveEngine();
        const ssYear = year;
        const ssMonth = month + 1;
        const ssDay = day + 1;
        const weekday = engine ? engine.calculateWeekday(ssYear, ssMonth, ssDay) : 0;
        const dateData = {
            year: ssYear,
            month: ssMonth,
            day: ssDay,
            weekday,
        };
        const calendar = this.manager.getActiveCalendar();
        if (!calendar) {
            Logger.warn('No active calendar found for note conversion');
            return [];
        }
        const date = new CalendarDate(dateData, calendar);
        try {
            // Get notes synchronously from storage
            const storage = notesManager.storage;
            const notes = storage.findNotesByDateSync(date);
            return notes.map(note => this.convertNoteToSCFormat(note));
        }
        catch (error) {
            Logger.error('Error retrieving notes for day', error instanceof Error ? error : new Error(String(error)));
            return [];
        }
    }
    // Enhanced notes functionality (async versions)
    async createNote(data) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            throw new Error('Notes system not available');
        }
        return notesManager.createNote(data);
    }
    async updateNote(noteId, data) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            throw new Error('Notes system not available');
        }
        return notesManager.updateNote(noteId, data);
    }
    async deleteNote(noteId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            throw new Error('Notes system not available');
        }
        return notesManager.deleteNote(noteId);
    }
    async getNote(noteId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            return null;
        }
        return notesManager.getNote(noteId);
    }
    async getNotesForDate(date, _calendarId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            return [];
        }
        return notesManager.getNotesForDate(date);
    }
    async getNotesForDateRange(start, end, _calendarId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            return [];
        }
        return notesManager.getNotesForDateRange(start, end);
    }
    // Module integration methods
    async setNoteModuleData(noteId, moduleId, data) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            throw new Error('Notes system not available');
        }
        return notesManager.setNoteModuleData(noteId, moduleId, data);
    }
    getNoteModuleData(noteId, moduleId) {
        const notesManager = game.seasonsStars?.notes;
        if (!notesManager) {
            return null;
        }
        return notesManager.getNoteModuleData(noteId, moduleId);
    }
    // Date conversion utilities
    convertSCDateToSS(scDate) {
        // Simple Calendar uses 0-based months and days
        // Seasons & Stars uses 1-based months and days
        const engine = this.manager.getActiveEngine();
        const year = scDate.year;
        const month = (scDate.month || 0) + 1;
        const day = (scDate.day || 0) + 1;
        // Calculate weekday using engine
        const weekday = engine ? engine.calculateWeekday(year, month, day) : 0;
        const dateData = {
            year,
            month,
            day,
            weekday,
        };
        const calendar = this.manager.getActiveCalendar();
        if (!calendar) {
            throw new Error('No active calendar found for date conversion');
        }
        return new CalendarDate(dateData, calendar);
    }
    convertSSDateToSC(ssDate) {
        // Convert 1-based S&S format to 0-based SC format
        return {
            year: ssDate.year,
            month: ssDate.month - 1,
            day: ssDate.day - 1,
        };
    }
    convertNoteToSCFormat(note) {
        const flags = note.flags?.['seasons-and-stars'];
        if (!flags?.calendarNote) {
            throw new Error('Invalid calendar note');
        }
        const startDate = flags.startDate;
        const calendar = this.manager.getActiveCalendar();
        const engine = this.manager.getActiveEngine();
        if (!calendar || !engine) {
            throw new Error('No active calendar or engine available');
        }
        // Get month and weekday names
        const monthName = startDate.month >= 1 && startDate.month <= calendar.months.length
            ? calendar.months[startDate.month - 1]?.name || ''
            : '';
        // Calculate weekday and get name
        const weekdayIndex = engine.calculateWeekday(startDate.year, startDate.month, startDate.day);
        const weekdayName = weekdayIndex >= 0 && weekdayIndex < calendar.weekdays.length
            ? calendar.weekdays[weekdayIndex]?.name || ''
            : '';
        // Get ordinal suffix for day
        const daySuffix = this.getOrdinalSuffix(startDate.day);
        // Convert to 0-based for SC compatibility
        const scDate = this.convertSSDateToSC(startDate);
        return {
            // Core properties (0-based for SC compatibility)
            year: scDate.year,
            month: scDate.month,
            day: scDate.day,
            // Display data
            title: note.name,
            content: this.extractNoteContent(note),
            allDay: flags.allDay,
            // Foundry integration
            journalEntryId: note.id,
            // Enhanced display data (matching SmallTime expectations)
            display: {
                monthName: monthName,
                month: startDate.month.toString(),
                day: startDate.day.toString(),
                year: startDate.year.toString(),
                daySuffix: daySuffix,
                yearPrefix: calendar.year?.prefix || '',
                yearPostfix: calendar.year?.suffix || '',
                date: `${monthName} ${startDate.day}, ${startDate.year}`,
                time: '', // Notes don't have specific times
                weekday: weekdayName,
            },
            // Additional metadata
            startDate: startDate,
            endDate: flags.endDate,
            author: note.author?.name || '',
            playerVisible: note.ownership?.default === CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
        };
    }
    extractNoteContent(note) {
        // Extract content from the first text page
        const textPage = note.pages?.find(page => page.type === 'text');
        return textPage?.text?.content || '';
    }
    formatNoteDisplay(note) {
        // Convert note to display format for compatibility
        return this.convertNoteToSCFormat(note);
    }
    getOrdinalSuffix(day) {
        if (day >= 11 && day <= 13)
            return 'th';
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
}

/**
 * Validation utilities for API parameter checking
 */
class ValidationUtils {
    /**
     * Validate calendar ID parameter
     */
    static validateCalendarId(calendarId) {
        if (calendarId !== undefined && (typeof calendarId !== 'string' || calendarId.trim() === '')) {
            throw new Error('Calendar ID must be a non-empty string');
        }
    }
    /**
     * Validate finite number parameter
     */
    static validateFiniteNumber(value, paramName) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error(`${paramName} must be a finite number`);
        }
    }
    /**
     * Validate calendar date object
     */
    static validateCalendarDate(date, paramName) {
        if (!date || typeof date !== 'object') {
            throw new Error(`${paramName} must be a calendar date object`);
        }
        if (typeof date.year !== 'number' ||
            typeof date.month !== 'number' ||
            typeof date.day !== 'number') {
            throw new Error(`${paramName} must have numeric year, month, and day properties`);
        }
    }
    /**
     * Validate string parameter
     */
    static validateString(value, paramName, allowEmpty = true) {
        if (typeof value !== 'string') {
            throw new Error(`${paramName} must be a string`);
        }
        if (!allowEmpty && value.trim() === '') {
            throw new Error(`${paramName} cannot be empty`);
        }
    }
}

/**
 * API wrapper to consolidate repetitive validation and error handling patterns
 * Reduces boilerplate in module.ts API methods
 */
/**
 * Standardized API method wrapper
 */
class APIWrapper {
    /**
     * Wrap an API method with standardized logging, validation, and error handling
     */
    static async wrapAPIMethod(methodName, params, validator, implementation) {
        try {
            Logger.api(methodName, params);
            // Validate parameters
            validator(params);
            // Execute implementation
            const result = await implementation();
            Logger.api(methodName, params, result === undefined ? 'success' : result);
            return result;
        }
        catch (error) {
            Logger.error(`Failed to ${methodName}`, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
    /**
     * Common validation helpers
     */
    static validateNumber(value, name) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error(`${name} must be a finite number`);
        }
    }
    static validateString(value, name, allowEmpty = false) {
        if (typeof value !== 'string') {
            throw new Error(`${name} must be a string`);
        }
        if (!allowEmpty && value.trim() === '') {
            throw new Error(`${name} must not be empty`);
        }
    }
    static validateOptionalString(value, name) {
        if (value !== undefined && typeof value !== 'string') {
            throw new Error(`${name} must be a string if provided`);
        }
    }
    /**
     * Validate calendar ID with common pattern
     */
    static validateCalendarId(calendarId) {
        if (calendarId !== undefined) {
            this.validateString(calendarId, 'Calendar ID');
            // For now, calendar-specific operations are not implemented
            if (calendarId) {
                throw new Error('Calendar-specific operations not yet implemented');
            }
        }
    }
    /**
     * Validate calendar date object
     */
    static validateCalendarDate(date, name = 'Date') {
        if (!date || typeof date !== 'object') {
            throw new Error(`${name} must be a valid calendar date object`);
        }
        if (typeof date.year !== 'number' ||
            typeof date.month !== 'number' ||
            typeof date.day !== 'number') {
            throw new Error(`${name} must have valid year, month, and day numbers`);
        }
    }
}

/**
 * Quick Time Buttons utility functions for configurable time advancement
 */
/**
 * Parse quick time button setting string into minute values
 */
function parseQuickTimeButtons(settingValue, calendar) {
    if (!settingValue || typeof settingValue !== 'string') {
        Logger.warn('Invalid quick time buttons setting value, using default');
        return [15, 30, 60, 240]; // Default values
    }
    const hoursPerDay = calendar?.time?.hoursInDay || 24;
    const minutesPerHour = calendar?.time?.minutesInHour || 60;
    const daysPerWeek = calendar?.weekdays?.length || 7;
    try {
        return settingValue
            .split(',')
            .map(val => {
            const trimmed = val.trim();
            if (!trimmed)
                return NaN;
            const match = trimmed.match(/^(-?\d+)([mhdw]?)$/);
            if (!match) {
                Logger.debug(`Invalid quick time button value: "${trimmed}"`);
                return NaN;
            }
            const [, amount, unit] = match;
            const num = parseInt(amount);
            if (!Number.isFinite(num)) {
                Logger.debug(`Non-finite number in quick time button value: "${trimmed}"`);
                return NaN;
            }
            switch (unit) {
                case 'w':
                    return num * daysPerWeek * hoursPerDay * minutesPerHour;
                case 'd':
                    return num * hoursPerDay * minutesPerHour;
                case 'h':
                    return num * minutesPerHour;
                case 'm':
                case '':
                    return num; // Default to minutes
                default:
                    Logger.debug(`Unknown unit in quick time button value: "${trimmed}"`);
                    return NaN;
            }
        })
            .filter(val => Number.isFinite(val))
            .sort((a, b) => a - b); // Sort numerically: negatives first, then positives
    }
    catch (error) {
        Logger.error('Error parsing quick time buttons setting', error);
        return [15, 30, 60, 240]; // Fallback to default
    }
}
/**
 * Format minute values for button display using calendar-aware units
 */
function formatTimeButton(minutes, calendar) {
    if (!Number.isFinite(minutes)) {
        return '0m';
    }
    const minutesPerHour = calendar?.time?.minutesInHour || 60;
    const hoursPerDay = calendar?.time?.hoursInDay || 24;
    const daysPerWeek = calendar?.weekdays?.length || 7;
    const absMinutes = Math.abs(minutes);
    const sign = minutes < 0 ? '-' : '';
    // Calculate in calendar-specific units
    const minutesPerDay = hoursPerDay * minutesPerHour;
    const minutesPerWeek = daysPerWeek * minutesPerDay;
    if (absMinutes >= minutesPerWeek && absMinutes % minutesPerWeek === 0) {
        return `${sign}${absMinutes / minutesPerWeek}w`;
    }
    else if (absMinutes >= minutesPerDay && absMinutes % minutesPerDay === 0) {
        return `${sign}${absMinutes / minutesPerDay}d`;
    }
    else if (absMinutes >= minutesPerHour && absMinutes % minutesPerHour === 0) {
        return `${sign}${absMinutes / minutesPerHour}h`;
    }
    else {
        return `${sign}${absMinutes}m`;
    }
}
/**
 * Get quick time buttons appropriate for widget context
 */
function getQuickTimeButtons(allButtons, isMiniWidget = false) {
    if (!isMiniWidget || allButtons.length <= 3) {
        return allButtons;
    }
    // For mini widget, ensure both negative and positive buttons are available
    const sorted = [...allButtons].sort((a, b) => a - b);
    const negatives = sorted.filter(b => b < 0);
    const positives = sorted.filter(b => b > 0);
    // Take 1 largest negative + 2 smallest positives (or all if fewer available)
    const selectedNegative = negatives.length > 0 ? [negatives[negatives.length - 1]] : [];
    const selectedPositives = positives.slice(0, 3 - selectedNegative.length);
    return [...selectedNegative, ...selectedPositives];
}
/**
 * Get quick time buttons from settings for specific widget type
 */
function getQuickTimeButtonsFromSettings(isMiniWidget = false) {
    try {
        // Get setting value
        const settingValue = game.settings?.get('seasons-and-stars', 'quickTimeButtons') || '15,30,60,240';
        // Get current calendar for parsing
        const manager = game.seasonsStars?.manager;
        const calendar = manager?.getActiveCalendar();
        // Parse minute values
        const allButtons = parseQuickTimeButtons(settingValue, calendar);
        // Get appropriate subset for widget type
        const buttons = getQuickTimeButtons(allButtons, isMiniWidget);
        // If no valid buttons, fall back to defaults
        if (buttons.length === 0) {
            return [
                { amount: 15, unit: 'minutes', label: '15m' },
                { amount: 30, unit: 'minutes', label: '30m' },
                { amount: 60, unit: 'minutes', label: '1h' },
                { amount: 240, unit: 'minutes', label: '4h' },
            ];
        }
        // Convert to template format
        return buttons.map(minutes => ({
            amount: minutes,
            unit: 'minutes',
            label: formatTimeButton(minutes, calendar),
        }));
    }
    catch (error) {
        Logger.error('Error getting quick time buttons from settings', error);
        // Fallback to default
        return [
            { amount: 15, unit: 'minutes', label: '15m' },
            { amount: 30, unit: 'minutes', label: '30m' },
            { amount: 60, unit: 'minutes', label: '1h' },
            { amount: 240, unit: 'minutes', label: '4h' },
        ];
    }
}
/**
 * Register Handlebars helper for template use
 */
function registerQuickTimeButtonsHelper() {
    // Access Handlebars from global scope
    const handlebars = globalThis.Handlebars;
    if (handlebars && typeof handlebars.registerHelper === 'function') {
        handlebars.registerHelper('getQuickTimeButtons', function (isMiniWidget = false) {
            return getQuickTimeButtonsFromSettings(isMiniWidget);
        });
        handlebars.registerHelper('formatTimeButton', function (minutes) {
            const manager = game.seasonsStars?.manager;
            const calendar = manager?.getActiveCalendar();
            return formatTimeButton(minutes, calendar);
        });
        Logger.debug('Registered quick time buttons Handlebars helpers');
    }
    else {
        Logger.warn('Handlebars not available for helper registration');
    }
}

/**
 * Settings Preview functionality for Quick Time Buttons
 */
// Module-level state (replaces static class properties)
let previewContainer = null;
let debounceTimer = null;
/**
 * Register hooks for settings preview functionality
 */
function registerSettingsPreviewHooks() {
    // Hook into settings config rendering
    Hooks.on('renderSettingsConfig', (app, html) => {
        enhanceQuickTimeButtonsSetting(html);
    });
    Logger.debug('Settings preview hooks registered');
}
/**
 * Enhance the quick time buttons setting with live preview
 */
function enhanceQuickTimeButtonsSetting(html) {
    try {
        // Find the quick time buttons input
        const quickTimeInput = html.querySelector('input[name="seasons-and-stars.quickTimeButtons"]');
        if (!quickTimeInput) {
            Logger.debug('Quick time buttons setting not found in settings form');
            return;
        }
        // Create preview container
        createPreviewContainer(quickTimeInput);
        // Add input event listener for live updates
        quickTimeInput.addEventListener('input', (event) => {
            const target = event.target;
            debouncePreviewUpdate(target.value);
        });
        // Initial preview
        updatePreview(quickTimeInput.value);
        Logger.debug('Added live preview to quick time buttons setting');
    }
    catch (error) {
        Logger.error('Failed to enhance quick time buttons setting', error);
    }
}
/**
 * Create the preview container HTML
 */
function createPreviewContainer(inputElement) {
    const previewHtml = `
    <div class="quick-time-preview" style="margin-top: 0.5rem; padding: 0.5rem; background: var(--color-bg-option); border-radius: 3px;">
      <div class="preview-content">
        <div class="preview-section">
          <label style="font-weight: bold; margin-bottom: 0.25rem; display: block;">Main Widget Preview:</label>
          <div class="preview-buttons main-widget" style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 0.5rem;"></div>
        </div>
        <div class="preview-section">
          <label style="font-weight: bold; margin-bottom: 0.25rem; display: block;">Mini Widget Preview:</label>
          <div class="preview-buttons mini-widget" style="display: flex; gap: 4px; flex-wrap: wrap;"></div>
        </div>
      </div>
    </div>
  `;
    // Insert preview container after the input's parent form group
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
        formGroup.insertAdjacentHTML('afterend', previewHtml);
        previewContainer = formGroup.nextElementSibling;
    }
}
/**
 * Debounce preview updates to avoid excessive re-rendering
 */
function debouncePreviewUpdate(value) {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
        updatePreview(value);
    }, 300);
}
/**
 * Update the preview display based on current input value
 */
function updatePreview(value) {
    if (!previewContainer) {
        Logger.warn('Preview container not available for update');
        return;
    }
    try {
        // Get current calendar for parsing
        const manager = game.seasonsStars?.manager;
        const calendar = manager?.getActiveCalendar();
        if (!value || typeof value !== 'string') {
            showErrorPreview('Invalid input');
            return;
        }
        // Parse the input value
        const allButtons = parseQuickTimeButtons(value, calendar);
        if (allButtons.length === 0) {
            showErrorPreview('No valid time values found');
            return;
        }
        // Get buttons for each widget type
        const mainWidgetButtons = getQuickTimeButtons(allButtons, false);
        const miniWidgetButtons = getQuickTimeButtons(allButtons, true);
        // Update main widget preview
        const mainContainer = previewContainer.querySelector('.preview-buttons.main-widget');
        if (mainContainer) {
            mainContainer.innerHTML = renderButtonPreview(mainWidgetButtons, calendar);
        }
        // Update mini widget preview
        const miniContainer = previewContainer.querySelector('.preview-buttons.mini-widget');
        if (miniContainer) {
            miniContainer.innerHTML = renderButtonPreview(miniWidgetButtons, calendar);
            // Add note if auto-selection occurred
            if (allButtons.length > 3 && miniWidgetButtons.length === 3) {
                const note = document.createElement('div');
                note.style.fontSize = '0.8em';
                note.style.color = 'var(--color-text-dark-secondary)';
                note.style.marginTop = '0.25rem';
                note.textContent = `Auto-selected ${miniWidgetButtons.length} of ${allButtons.length} buttons for mini widget`;
                miniContainer.appendChild(note);
            }
        }
    }
    catch (error) {
        Logger.error('Error updating preview', error);
        showErrorPreview('Error parsing input');
    }
}
/**
 * Render button preview HTML for a set of buttons
 */
function renderButtonPreview(buttons, calendar) {
    return buttons
        .map(minutes => {
        const label = formatTimeButton(minutes, calendar);
        const cssClass = minutes < 0 ? 'rewind' : 'forward';
        const icon = minutes < 0 ? 'fa-backward' : 'fa-clock';
        return `<span class="preview-button ${cssClass}" style="
      display: inline-block;
      padding: 2px 6px;
      margin: 2px;
      background: ${minutes < 0 ? 'linear-gradient(135deg, #dc2626, #ef4444)' : 'linear-gradient(135deg, #10b981, #14b8a6)'};
      border: 1px solid ${minutes < 0 ? '#dc2626' : '#10b981'};
      border-radius: 3px;
      font-size: 0.8em;
      color: white;
    "><i class="fas ${icon}" style="margin-right: 3px; font-size: 0.7em;"></i>${label}</span>`;
    })
        .join('');
}
/**
 * Show error state in preview
 */
function showErrorPreview(message) {
    if (!previewContainer)
        return;
    const mainContainer = previewContainer.querySelector('.preview-buttons.main-widget');
    const miniContainer = previewContainer.querySelector('.preview-buttons.mini-widget');
    const errorHtml = `<span style="color: var(--color-text-light-warning); font-style: italic;">${message}</span>`;
    if (mainContainer)
        mainContainer.innerHTML = errorHtml;
    if (miniContainer)
        miniContainer.innerHTML = errorHtml;
}

/**
 * PF2e Game System Integration for Seasons & Stars
 *
 * Provides PF2e-specific time sources and compatibility features.
 * Only loaded when PF2e system is detected.
 */
/**
 * Simple PF2e Integration Manager
 *
 * Handles PF2e-specific time sources and monitoring.
 */
class PF2eIntegration {
    constructor() {
        this.syncMonitorInterval = null;
        this.isActive = false;
        // Private constructor for singleton pattern
    }
    /**
     * Initialize PF2e integration (called only when PF2e system is detected)
     */
    static initialize() {
        if (PF2eIntegration.instance) {
            return PF2eIntegration.instance;
        }
        PF2eIntegration.instance = new PF2eIntegration();
        PF2eIntegration.instance.activate();
        return PF2eIntegration.instance;
    }
    /**
     * Activate PF2e integration
     */
    activate() {
        if (this.isActive)
            return;
        Logger.info('PF2e system detected - enabling enhanced compatibility mode');
        this.isActive = true;
    }
    /**
     * Get PF2e-specific world time
     *
     * DIAGNOSTIC: Understanding worldCreatedOn vs S&S epoch difference
     */
    getPF2eWorldTime() {
        try {
            const foundryWorldTime = game.time?.worldTime || 0;
            const worldCreatedOn = game.pf2e?.settings?.worldClock?.worldCreatedOn;
            if (!worldCreatedOn) {
                Logger.debug('No PF2e worldCreatedOn found - using standard worldTime');
                return null;
            }
            // Calculate PF2e's current real-world date (same as PF2e World Clock)
            const pf2eCreationDate = new Date(worldCreatedOn);
            if (isNaN(pf2eCreationDate.getTime())) {
                Logger.error('Invalid PF2e worldCreatedOn format:', worldCreatedOn);
                return null;
            }
            const pf2eCreationSeconds = Math.floor(pf2eCreationDate.getTime() / 1000);
            const pf2eTotalSeconds = pf2eCreationSeconds + foundryWorldTime;
            const realWorldDate = new Date(pf2eTotalSeconds * 1000);
            // Map real-world date to Golarion calendar date using UTC (same as PF2e)
            // PF2e maps: August 12, 2025 → 12th Arodus 4725 AR
            // Month mapping: real-world month → same Golarion month
            // Day mapping: real-world day → same Golarion day
            // Year mapping: real-world year + 2700 → Golarion AR year
            const golarionYear = 4725; // PF2e displays 2025 as 4725 AR
            const golarionMonth = realWorldDate.getUTCMonth() + 1; // Convert to 1-based, use UTC
            const golarionDay = realWorldDate.getUTCDate(); // Use UTC
            const golarionHour = realWorldDate.getUTCHours(); // Use UTC
            const golarionMinute = realWorldDate.getUTCMinutes(); // Use UTC
            const golarionSecond = realWorldDate.getUTCSeconds(); // Use UTC
            Logger.debug('PF2e date mapping:', {
                realWorldDate: realWorldDate.toISOString(),
                golarionDate: {
                    year: golarionYear,
                    month: golarionMonth,
                    day: golarionDay,
                    time: `${golarionHour}:${golarionMinute}:${golarionSecond}`,
                },
            });
            // Get S&S calendar manager and utilities
            const calendarManager = game.seasonsStars?.manager;
            if (!calendarManager) {
                Logger.error('S&S calendar manager not available');
                return null;
            }
            const calendar = calendarManager.getActiveCalendar();
            const engine = calendarManager.getActiveEngine();
            // Create CalendarDate using S&S calendar utilities
            const golarionCalendarDate = new CalendarDate({
                year: golarionYear,
                month: golarionMonth,
                day: golarionDay,
                weekday: 0, // Will be calculated by CalendarDate
                time: {
                    hour: golarionHour,
                    minute: golarionMinute,
                    second: golarionSecond,
                },
            }, calendar);
            // Use S&S's dateToWorldTime() utility to get correct worldTime
            const correctWorldTime = engine.dateToWorldTime(golarionCalendarDate);
            Logger.debug('S&S calendar conversion result:', {
                inputDate: golarionCalendarDate.toObject(),
                outputWorldTime: correctWorldTime,
            });
            return correctWorldTime;
        }
        catch (error) {
            Logger.error('Error converting PF2e date using S&S calendar utilities:', error instanceof Error ? error : undefined);
            return null;
        }
    }
    /**
     * Check for time synchronization issues between Foundry and PF2e
     */
    checkPF2eTimeSync() {
        const foundryTime = game.time?.worldTime || 0;
        // Since we're using standard worldTime, both systems should be synchronized
        // This method now primarily serves as a monitoring function
        Logger.debug('PF2e time sync check - using standard Foundry worldTime:', {
            foundryTime,
            message: 'Both PF2e and S&S using same worldTime base',
        });
        // Emit hook for any widgets that want to know about time updates
        Hooks.callAll('seasons-stars:pf2eTimeSync', {
            foundryTime,
            synchronized: true,
        });
    }
    /**
     * Get the active PF2e integration instance
     */
    static getInstance() {
        return PF2eIntegration.instance;
    }
    /**
     * Check if PF2e integration is active
     */
    isIntegrationActive() {
        return this.isActive;
    }
    /**
     * Cleanup integration when module is disabled
     */
    destroy() {
        if (this.syncMonitorInterval) {
            clearInterval(this.syncMonitorInterval);
            this.syncMonitorInterval = null;
        }
        this.isActive = false;
    }
}
PF2eIntegration.instance = null;
// Time monitoring - start periodic sync checking when ready
Hooks.on('ready', () => {
    const integration = PF2eIntegration.getInstance();
    if (!integration?.isIntegrationActive())
        return;
    const syncInterval = setInterval(() => {
        integration.checkPF2eTimeSync();
    }, 30000); // Check every 30 seconds
    // Store interval for cleanup
    integration.syncMonitorInterval = syncInterval;
});
// Main integration entry point - register time source with S&S core
Hooks.on('seasons-stars:pf2e:systemDetected', (compatibilityManager) => {
    Logger.debug('PF2e system detected - registering time source with compatibility manager');
    // Initialize PF2e integration
    const integration = PF2eIntegration.initialize();
    // Create time source function that uses the integration's logic
    const pf2eTimeSourceFunction = () => {
        return integration.getPF2eWorldTime();
    };
    // Register with the compatibility manager
    compatibilityManager.registerTimeSource('pf2e', pf2eTimeSourceFunction);
});

/**
 * Seasons & Stars - Main Module Entry Point
 * A clean calendar and timekeeping module for Foundry VTT v13+
 */
// Import styles
// Module instances
let calendarManager;
let notesManager;
// Register scene controls at top level (critical timing requirement)
SeasonsStarsSceneControls.registerControls();
// Register Errors and Echoes hook at top level (RECOMMENDED - eliminates timing issues)
Hooks.once('errorsAndEchoesReady', (errorsAndEchoesAPI) => {
    // E&E is guaranteed to be ready when this hook is called
    try {
        Logger.debug('Registering with Errors and Echoes via hook');
        errorsAndEchoesAPI.register({
            moduleId: 'seasons-and-stars',
            // Context provider - adds useful debugging information
            contextProvider: () => {
                const context = {};
                // Add current calendar information - safe property access
                if (calendarManager) {
                    const currentDate = calendarManager.getCurrentDate();
                    const activeCalendar = calendarManager.getActiveCalendar();
                    context.currentDate = currentDate
                        ? `${currentDate.year}-${currentDate.month}-${currentDate.day}`
                        : 'unknown';
                    context.activeCalendarId = activeCalendar?.id || 'unknown';
                    context.calendarEngineAvailable = !!calendarManager.getActiveEngine();
                }
                // Add widget state - simple property checks don't need try-catch
                const activeWidgets = [];
                if (CalendarWidget.getInstance?.()?.rendered)
                    activeWidgets.push('main');
                if (CalendarMiniWidget.getInstance?.()?.rendered)
                    activeWidgets.push('mini');
                if (CalendarGridWidget.getInstance?.()?.rendered)
                    activeWidgets.push('grid');
                context.activeWidgets = activeWidgets;
                // Add system information - basic property access
                context.gameSystem = game.system?.id || 'unknown';
                context.foundryVersion = game.version || 'unknown';
                context.smallTimeDetected = !!document.querySelector('#smalltime-app');
                return context;
            },
            // Error filter - focus on errors relevant to S&S functionality
            errorFilter: (error) => {
                const stack = error.stack || '';
                const message = error.message || '';
                // Always report errors that mention our module explicitly
                if (stack.includes('seasons-and-stars') ||
                    message.includes('seasons-and-stars') ||
                    message.includes('S&S') ||
                    stack.includes('CalendarManager') ||
                    stack.includes('CalendarWidget') ||
                    stack.includes('CalendarEngine') ||
                    stack.includes('NotesManager')) {
                    return false; // Don't filter (report this error)
                }
                // Report time/calendar related errors that might affect us
                if (message.includes('worldTime') ||
                    message.includes('game.time') ||
                    message.includes('calendar') ||
                    message.includes('dateToWorldTime') ||
                    message.includes('worldTimeToDate') ||
                    (message.includes('time') && stack.includes('foundry'))) {
                    return false; // Don't filter (time system errors affect us)
                }
                // Report widget positioning and UI errors
                if (message.includes('widget') ||
                    message.includes('SmallTime') ||
                    message.includes('player list') ||
                    (message.includes('position') && stack.includes('ui')) ||
                    message.includes('ApplicationV2')) {
                    return false; // Don't filter (UI errors might affect our widgets)
                }
                // Report integration-related errors
                if (message.includes('Simple Calendar') ||
                    message.includes('simple-calendar') ||
                    message.includes('compatibility') ||
                    message.includes('bridge') ||
                    stack.includes('integration')) {
                    return false; // Don't filter (integration errors affect us)
                }
                // Report foundry core time system errors
                if (stack.includes('foundry.js') &&
                    (message.includes('time') || message.includes('world') || message.includes('scene'))) {
                    return false; // Don't filter (core time system issues)
                }
                // Filter out errors from unrelated modules (unless they mention calendar/time)
                const unrelatedModules = [
                    'dice-so-nice',
                    'lib-wrapper',
                    'socketlib',
                    'combat-utility-belt',
                    'enhanced-terrain-layer',
                    'token-action-hud',
                    'foundryvtt-forien-quest-log',
                ];
                for (const module of unrelatedModules) {
                    if (stack.includes(module) &&
                        !message.includes('calendar') &&
                        !message.includes('time') &&
                        !stack.includes('seasons-and-stars')) {
                        return true; // Filter out (unrelated module error)
                    }
                }
                // Default: filter out most other errors unless they seem time/calendar related
                if (message.includes('calendar') || message.includes('time') || message.includes('date')) {
                    return false; // Don't filter (might be related)
                }
                return true; // Filter out everything else
            },
        });
        Logger.debug('Successfully registered with Errors and Echoes via hook');
    }
    catch (error) {
        Logger.error('Failed to register with Errors and Echoes via hook', error instanceof Error ? error : new Error(String(error)));
    }
});
/**
 * Module initialization
 */
Hooks.once('init', async () => {
    Logger.debug('Initializing module');
    // Register module settings
    registerSettings();
    // Register Handlebars helpers
    registerQuickTimeButtonsHelper();
    // Register settings preview functionality
    registerSettingsPreviewHooks();
    // Register keyboard shortcuts (must be in init hook)
    Logger.debug('Registering keyboard shortcuts');
    SeasonsStarsKeybindings.registerKeybindings();
    // Note: Note editing hooks temporarily disabled - see KNOWN-ISSUES.md
    // registerNoteEditingHooks();
    // Initialize note categories after settings are available
    initializeNoteCategories();
    // Initialize managers first
    calendarManager = new CalendarManager();
    notesManager = new NotesManager();
    Logger.debug('Module initialized');
});
/**
 * Early setup during setupGame - for future module initialization needs
 */
Hooks.once('setupGame', () => {
    Logger.debug('Early setup during setupGame');
    // Reserved for future setup needs
});
/**
 * Setup after Foundry is ready
 */
Hooks.once('ready', async () => {
    Logger.debug('Setting up module');
    // Load calendars first (without reading settings)
    await calendarManager.loadBuiltInCalendars();
    // Register calendar-specific settings now that calendars are loaded
    registerCalendarSettings();
    // Complete calendar manager initialization (read settings and set active calendar)
    await calendarManager.completeInitialization();
    // Initialize notes manager
    await notesManager.initialize();
    // Register notes cleanup hooks for external journal deletion
    registerNotesCleanupHooks();
    // Register with Memory Mage if available
    registerMemoryMageIntegration();
    // Expose API
    setupAPI();
    // Note: Errors and Echoes registration moved to top-level hook for better timing
    // Register UI component hooks
    CalendarWidget.registerHooks();
    CalendarMiniWidget.registerHooks();
    CalendarGridWidget.registerHooks();
    CalendarMiniWidget.registerSmallTimeIntegration();
    // Register widget factories for CalendarWidgetManager
    Logger.debug('Registering widget factories');
    CalendarWidgetManager.registerWidget('main', () => new WidgetWrapper(CalendarWidget, 'show', 'hide', 'toggle', 'getInstance', 'rendered'));
    CalendarWidgetManager.registerWidget('mini', () => new WidgetWrapper(CalendarMiniWidget, 'show', 'hide', 'toggle', 'getInstance', 'rendered'));
    CalendarWidgetManager.registerWidget('grid', () => new WidgetWrapper(CalendarGridWidget, 'show', 'hide', 'toggle', 'getInstance', 'rendered'));
    // Scene controls registered at top level for timing requirements
    Logger.debug('Registering macros');
    SeasonsStarsSceneControls.registerMacros();
    // Show default widget if enabled in settings
    if (game.settings?.get('seasons-and-stars', 'showTimeWidget')) {
        const defaultWidget = game.settings?.get('seasons-and-stars', 'defaultWidget') || 'main';
        switch (defaultWidget) {
            case 'mini':
                CalendarMiniWidget.show();
                break;
            case 'grid':
                CalendarGridWidget.show();
                break;
            case 'main':
            default:
                CalendarWidget.show();
                break;
        }
    }
    // Fire ready hook for compatibility modules
    Hooks.callAll('seasons-stars:ready', {
        manager: calendarManager,
        api: game.seasonsStars?.api,
    });
    Logger.info('Module ready');
});
/**
 * Register module settings
 */
function registerSettings() {
    if (!game.settings)
        return;
    // Core user settings (most important first)
    // Calendar setting registered early with basic choices, updated later when calendars load
    game.settings.register('seasons-and-stars', 'activeCalendar', {
        name: 'SEASONS_STARS.settings.active_calendar',
        hint: 'SEASONS_STARS.settings.active_calendar_hint',
        scope: 'world',
        config: true,
        type: String,
        default: 'gregorian',
        choices: { gregorian: 'Gregorian Calendar' }, // Basic default, updated later
        onChange: async (value) => {
            if (calendarManager) {
                await calendarManager.setActiveCalendar(value);
            }
        },
    });
    game.settings.register('seasons-and-stars', 'showTimeWidget', {
        name: 'Show Time Widget',
        hint: 'Display a small time widget on the UI',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
    });
    game.settings.register('seasons-and-stars', 'defaultWidget', {
        name: 'SEASONS_STARS.settings.default_widget',
        hint: 'SEASONS_STARS.settings.default_widget_hint',
        scope: 'client',
        config: true,
        type: String,
        default: 'main',
        choices: {
            main: 'SEASONS_STARS.settings.default_widget_main',
            mini: 'SEASONS_STARS.settings.default_widget_mini',
            grid: 'SEASONS_STARS.settings.default_widget_grid',
        },
    });
    game.settings.register('seasons-and-stars', 'showNotifications', {
        name: 'Show Notifications',
        hint: 'Display warning and error notifications in the UI',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
    });
    game.settings.register('seasons-and-stars', 'calendarClickBehavior', {
        name: 'Calendar Click Behavior',
        hint: 'Choose what happens when you click on a date in the calendar grid. "Set Current Date" immediately changes the world time (current behavior). "View Date Details" shows date information and flavor text without changing the date.',
        scope: 'client',
        config: true,
        type: String,
        default: 'setDate',
        choices: {
            setDate: 'Set Current Date',
            viewDetails: 'View Date Details',
        },
    });
    game.settings.register('seasons-and-stars', 'quickTimeButtons', {
        name: 'Quick Time Buttons',
        hint: 'Comma-separated time values for quick advancement buttons. Supports: 15, 30m, 1h, 2d, 1w. Negative values go backward. Examples: "10,30,60" or "-1h,15m,30m,1h"',
        scope: 'world',
        config: true,
        type: String,
        default: '15,30,60,240',
        onChange: () => {
            // Trigger widget refresh when settings change
            try {
                if (game.seasonsStars?.manager) {
                    Hooks.callAll('seasons-stars:settingsChanged', 'quickTimeButtons');
                }
            }
            catch (error) {
                Logger.warn('Failed to trigger quick time buttons settings refresh:', error);
            }
        },
    });
    // Notes system settings
    game.settings.register('seasons-and-stars', 'allowPlayerNotes', {
        name: 'Allow Player Notes',
        hint: 'Allow players to create calendar notes',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
    });
    game.settings.register('seasons-and-stars', 'defaultPlayerVisible', {
        name: 'Default Player Visibility',
        hint: 'Make new notes visible to players by default',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
    });
    game.settings.register('seasons-and-stars', 'defaultPlayerEditable', {
        name: 'Default Player Editable',
        hint: 'Make new notes editable by players by default',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
    });
    // Note categories configuration - stored as Object for complex data
    game.settings.register('seasons-and-stars', 'noteCategories', {
        name: 'Note Categories Configuration',
        hint: 'Configuration for note categories and tags',
        scope: 'world',
        config: false, // Not shown in config UI, managed by category system
        type: Object,
        default: null,
    });
    // Development and debugging settings (last for developers)
    game.settings.register('seasons-and-stars', 'debugMode', {
        name: 'Debug Mode',
        hint: 'Enable debug logging for troubleshooting (developers only)',
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
    });
}
/**
 * Update calendar setting choices after calendars are loaded
 */
function registerCalendarSettings() {
    if (!game.settings)
        return;
    // Get available calendars and create choices
    const calendars = calendarManager.getAllCalendars();
    const choices = CalendarLocalization.createCalendarChoices(calendars);
    // Re-register the setting with updated choices to overwrite the basic one
    game.settings.register('seasons-and-stars', 'activeCalendar', {
        name: 'SEASONS_STARS.settings.active_calendar',
        hint: 'SEASONS_STARS.settings.active_calendar_hint',
        scope: 'world',
        config: true,
        type: String,
        default: 'gregorian',
        choices: choices,
        onChange: async (value) => {
            if (calendarManager) {
                await calendarManager.setActiveCalendar(value);
            }
        },
    });
    Logger.debug('Updated calendar setting with full choices', { choices });
}
/**
 * Setup the main Seasons & Stars API
 */
function setupAPI() {
    const api = {
        getCurrentDate: (calendarId) => {
            try {
                Logger.api('getCurrentDate', { calendarId });
                // Input validation using utility
                ValidationUtils.validateCalendarId(calendarId);
                if (calendarId) {
                    // Get date from specific calendar
                    const calendar = calendarManager.getCalendar(calendarId);
                    const engine = calendarManager.getActiveEngine();
                    if (!calendar || !engine) {
                        const error = new Error(`Calendar not found: ${calendarId}`);
                        Logger.error('Calendar not found in getCurrentDate', error);
                        throw error;
                    }
                    const worldTime = game.time?.worldTime || 0;
                    const result = engine.worldTimeToDate(worldTime);
                    Logger.api('getCurrentDate', { calendarId }, result);
                    return result;
                }
                // Get date from active calendar
                const currentDate = calendarManager.getCurrentDate();
                if (!currentDate) {
                    Logger.warn('No current date available from calendar manager');
                    return null;
                }
                const result = currentDate;
                Logger.api('getCurrentDate', undefined, result.toObject());
                return result;
            }
            catch (error) {
                Logger.error('Failed to get current date', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        setCurrentDate: async (date) => {
            try {
                Logger.api('setCurrentDate', { date });
                // Input validation
                if (!date || typeof date !== 'object') {
                    const error = new Error('Date must be a valid CalendarDate object');
                    Logger.error('Invalid date parameter', error);
                    throw error;
                }
                if (typeof date.year !== 'number' ||
                    typeof date.month !== 'number' ||
                    typeof date.day !== 'number') {
                    const error = new Error('Date must have numeric year, month, and day properties');
                    Logger.error('Invalid date structure', error);
                    throw error;
                }
                await calendarManager.setCurrentDate(date);
                Logger.api('setCurrentDate', { date }, 'success');
                return true;
            }
            catch (error) {
                Logger.error('Failed to set current date', error instanceof Error ? error : new Error(String(error)));
                return false;
            }
        },
        advanceTime: async (amount, unit) => {
            try {
                Logger.api('advanceTime', { amount, unit });
                // Input validation using utilities
                ValidationUtils.validateFiniteNumber(amount, 'amount');
                ValidationUtils.validateString(unit, 'unit', false); // Don't allow empty strings
                // Route to appropriate method based on unit
                switch (unit.toLowerCase()) {
                    case 'day':
                    case 'days':
                        await calendarManager.advanceDays(amount);
                        break;
                    case 'hour':
                    case 'hours':
                        await calendarManager.advanceHours(amount);
                        break;
                    case 'minute':
                    case 'minutes':
                        await calendarManager.advanceMinutes(amount);
                        break;
                    case 'week':
                    case 'weeks':
                        await calendarManager.advanceWeeks(amount);
                        break;
                    case 'month':
                    case 'months':
                        await calendarManager.advanceMonths(amount);
                        break;
                    case 'year':
                    case 'years':
                        await calendarManager.advanceYears(amount);
                        break;
                    default:
                        const error = new Error(`Unsupported time unit: ${unit}`);
                        Logger.error('Unsupported time unit', error);
                        throw error;
                }
                Logger.api('advanceTime', { amount, unit }, 'success');
            }
            catch (error) {
                Logger.error('Failed to advance time', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        advanceDays: async (days, calendarId) => {
            return APIWrapper.wrapAPIMethod('advanceDays', { days, calendarId }, params => {
                APIWrapper.validateNumber(params.days, 'Days');
                APIWrapper.validateCalendarId(params.calendarId);
            }, () => calendarManager.advanceDays(days));
        },
        advanceHours: async (hours, calendarId) => {
            return APIWrapper.wrapAPIMethod('advanceHours', { hours, calendarId }, params => {
                APIWrapper.validateNumber(params.hours, 'Hours');
                APIWrapper.validateCalendarId(params.calendarId);
            }, () => calendarManager.advanceHours(hours));
        },
        advanceMinutes: async (minutes, calendarId) => {
            return APIWrapper.wrapAPIMethod('advanceMinutes', { minutes, calendarId }, params => {
                APIWrapper.validateNumber(params.minutes, 'Minutes');
                APIWrapper.validateCalendarId(params.calendarId);
            }, () => calendarManager.advanceMinutes(minutes));
        },
        advanceWeeks: async (weeks, calendarId) => {
            return APIWrapper.wrapAPIMethod('advanceWeeks', { weeks, calendarId }, params => {
                APIWrapper.validateNumber(params.weeks, 'Weeks');
                APIWrapper.validateCalendarId(params.calendarId);
            }, () => calendarManager.advanceWeeks(weeks));
        },
        advanceMonths: async (months, calendarId) => {
            return APIWrapper.wrapAPIMethod('advanceMonths', { months, calendarId }, params => {
                APIWrapper.validateNumber(params.months, 'Months');
                APIWrapper.validateCalendarId(params.calendarId);
            }, () => calendarManager.advanceMonths(months));
        },
        advanceYears: async (years, calendarId) => {
            return APIWrapper.wrapAPIMethod('advanceYears', { years, calendarId }, params => {
                APIWrapper.validateNumber(params.years, 'Years');
                APIWrapper.validateCalendarId(params.calendarId);
            }, () => calendarManager.advanceYears(years));
        },
        formatDate: (date, options) => {
            try {
                Logger.api('formatDate', { date, options });
                // Input validation using APIWrapper helpers
                APIWrapper.validateCalendarDate(date, 'Date');
                const activeCalendar = calendarManager.getActiveCalendar();
                if (!activeCalendar) {
                    throw new Error('No active calendar set');
                }
                const calendarDate = new CalendarDate(date, activeCalendar);
                const result = calendarDate.format(options);
                Logger.api('formatDate', { date, options }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to format date', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        dateToWorldTime: (date, calendarId) => {
            try {
                Logger.api('dateToWorldTime', { date, calendarId });
                // Input validation using APIWrapper helpers
                APIWrapper.validateCalendarDate(date, 'Date');
                APIWrapper.validateOptionalString(calendarId, 'Calendar ID');
                const engine = calendarId
                    ? calendarManager.engines?.get(calendarId)
                    : calendarManager.getActiveEngine();
                if (!engine) {
                    throw new Error(`No engine available for calendar: ${calendarId || 'active'}`);
                }
                const result = engine.dateToWorldTime(date);
                Logger.api('dateToWorldTime', { date: date.toObject?.() || date, calendarId }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to convert date to world time', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        worldTimeToDate: (timestamp, calendarId) => {
            try {
                Logger.api('worldTimeToDate', { timestamp, calendarId });
                // Input validation using APIWrapper helpers
                APIWrapper.validateNumber(timestamp, 'Timestamp');
                APIWrapper.validateOptionalString(calendarId, 'Calendar ID');
                const engine = calendarId
                    ? calendarManager.engines?.get(calendarId)
                    : calendarManager.getActiveEngine();
                if (!engine) {
                    throw new Error(`No engine available for calendar: ${calendarId || 'active'}`);
                }
                const result = engine.worldTimeToDate(timestamp);
                Logger.api('worldTimeToDate', { timestamp, calendarId }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to convert world time to date', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        getActiveCalendar: () => {
            try {
                Logger.api('getActiveCalendar');
                const result = calendarManager.getActiveCalendar();
                Logger.api('getActiveCalendar', undefined, result?.id || 'none');
                return result;
            }
            catch (error) {
                Logger.error('Failed to get active calendar', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        setActiveCalendar: async (calendarId) => {
            try {
                Logger.api('setActiveCalendar', { calendarId });
                // Input validation
                if (typeof calendarId !== 'string' || calendarId.trim() === '') {
                    const error = new Error('Calendar ID must be a non-empty string');
                    Logger.error('Invalid calendar ID parameter', error);
                    throw error;
                }
                await calendarManager.setActiveCalendar(calendarId);
                Logger.api('setActiveCalendar', { calendarId }, 'success');
            }
            catch (error) {
                Logger.error('Failed to set active calendar', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        getAvailableCalendars: () => {
            try {
                Logger.api('getAvailableCalendars');
                const result = calendarManager.getAvailableCalendars();
                Logger.api('getAvailableCalendars', undefined, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to get available calendars', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        loadCalendar: (data) => {
            try {
                Logger.api('loadCalendar', { calendarId: data?.id || 'unknown' });
                // Input validation
                if (!data || typeof data !== 'object') {
                    const error = new Error('Calendar data must be a valid object');
                    Logger.error('Invalid calendar data parameter', error);
                    throw error;
                }
                if (!data.id || typeof data.id !== 'string') {
                    const error = new Error('Calendar data must have a valid id string');
                    Logger.error('Invalid calendar data structure', error);
                    throw error;
                }
                calendarManager.loadCalendar(data);
                Logger.api('loadCalendar', { calendarId: data.id }, 'success');
            }
            catch (error) {
                Logger.error('Failed to load calendar', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        // Calendar metadata methods (required for compatibility bridge)
        getMonthNames: (calendarId) => {
            try {
                Logger.api('getMonthNames', { calendarId });
                // Input validation
                if (calendarId !== undefined && typeof calendarId !== 'string') {
                    const error = new Error('Calendar ID must be a string');
                    Logger.error('Invalid calendar ID parameter', error);
                    throw error;
                }
                const calendar = calendarId
                    ? calendarManager.getCalendar(calendarId)
                    : calendarManager.getActiveCalendar();
                if (!calendar?.months) {
                    Logger.warn(`No months found for calendar: ${calendarId || 'active'}`);
                    return [];
                }
                const result = calendar.months.map(month => month.name);
                Logger.api('getMonthNames', { calendarId }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to get month names', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        getWeekdayNames: (calendarId) => {
            try {
                Logger.api('getWeekdayNames', { calendarId });
                // Input validation
                if (calendarId !== undefined && typeof calendarId !== 'string') {
                    const error = new Error('Calendar ID must be a string');
                    Logger.error('Invalid calendar ID parameter', error);
                    throw error;
                }
                const calendar = calendarId
                    ? calendarManager.getCalendar(calendarId)
                    : calendarManager.getActiveCalendar();
                if (!calendar?.weekdays) {
                    Logger.warn(`No weekdays found for calendar: ${calendarId || 'active'}`);
                    return [];
                }
                const result = calendar.weekdays.map(day => day.name);
                Logger.api('getWeekdayNames', { calendarId }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to get weekday names', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        // Optional enhanced features (basic implementations)
        getSunriseSunset: (date, calendarId) => {
            try {
                Logger.api('getSunriseSunset', { date, calendarId });
                // Input validation
                if (!date || typeof date !== 'object') {
                    const error = new Error('Date must be a valid ICalendarDate object');
                    Logger.error('Invalid date parameter', error);
                    throw error;
                }
                if (calendarId !== undefined && typeof calendarId !== 'string') {
                    const error = new Error('Calendar ID must be a string');
                    Logger.error('Invalid calendar ID parameter', error);
                    throw error;
                }
                // Basic implementation - can be enhanced with calendar-specific data later
                // For now, return reasonable defaults (6 AM sunrise, 6 PM sunset)
                const result = { sunrise: 6, sunset: 18 };
                Logger.api('getSunriseSunset', { date, calendarId }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to get sunrise/sunset', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
        getSeasonInfo: (date, calendarId) => {
            try {
                Logger.api('getSeasonInfo', { date, calendarId });
                // Input validation
                if (!date || typeof date !== 'object') {
                    const error = new Error('Date must be a valid ICalendarDate object');
                    Logger.error('Invalid date parameter', error);
                    throw error;
                }
                if (typeof date.year !== 'number' ||
                    typeof date.month !== 'number' ||
                    typeof date.day !== 'number') {
                    const error = new Error('Date must have valid year, month, and day numbers');
                    Logger.error('Invalid date structure', error);
                    throw error;
                }
                if (calendarId !== undefined && typeof calendarId !== 'string') {
                    const error = new Error('Calendar ID must be a string');
                    Logger.error('Invalid calendar ID parameter', error);
                    throw error;
                }
                const calendar = calendarId
                    ? calendarManager.getCalendar(calendarId)
                    : calendarManager.getActiveCalendar();
                if (!calendar ||
                    !calendar.seasons ||
                    calendar.seasons.length === 0) {
                    Logger.warn(`No seasons found for calendar: ${calendarId || 'active'}`);
                    const result = { name: 'Unknown', icon: 'none' };
                    Logger.api('getSeasonInfo', { date, calendarId }, result);
                    return result;
                }
                // Basic season detection - find season containing this date
                // This is a simple implementation that can be enhanced later
                const currentSeason = calendar.seasons.find(season => {
                    // Simple logic: match by rough month ranges
                    // This could be enhanced with proper calendar-aware season calculation
                    if (season.startMonth && season.endMonth) {
                        return date.month >= season.startMonth && date.month <= season.endMonth;
                    }
                    return false;
                });
                if (currentSeason) {
                    const result = {
                        name: currentSeason.name,
                        icon: currentSeason.icon || currentSeason.name.toLowerCase(),
                    };
                    Logger.api('getSeasonInfo', { date, calendarId }, result);
                    return result;
                }
                // Fallback: use first season or default
                const fallbackSeason = calendar.seasons[0];
                const result = {
                    name: fallbackSeason?.name || 'Unknown',
                    icon: fallbackSeason?.icon || fallbackSeason?.name?.toLowerCase() || 'none',
                };
                Logger.api('getSeasonInfo', { date, calendarId }, result);
                return result;
            }
            catch (error) {
                Logger.error('Failed to get season info', error instanceof Error ? error : new Error(String(error)));
                throw error;
            }
        },
    };
    // Expose API to global game object
    if (game) {
        game.seasonsStars = {
            api,
            manager: calendarManager,
            notes: notesManager,
            categories: noteCategories, // Will be available by this point since ready runs after init
            integration: SeasonsStarsIntegration.detect(),
        };
    }
    // Expose API to window for debugging
    window.SeasonsStars = {
        api,
        manager: calendarManager,
        notes: notesManager,
        integration: SeasonsStarsIntegration.detect() || null,
        CalendarWidget,
        CalendarMiniWidget,
        CalendarGridWidget,
        CalendarSelectionDialog,
    };
    Logger.debug('API and bridge integration exposed');
    Logger.debug('Module initialization complete');
}
/**
 * Module cleanup
 */
Hooks.once('destroy', () => {
    Logger.debug('Module shutting down');
    // Clean up global references
    if (game.seasonsStars) {
        delete game.seasonsStars;
    }
    if (window.SeasonsStars) {
        delete window.SeasonsStars;
    }
});
/**
 * Register with Memory Mage module if available
 */
function registerMemoryMageIntegration() {
    try {
        // Check if Memory Mage is available (standard Foundry module pattern)
        const memoryMage = game.memoryMage || game.modules?.get('memory-mage')?.api;
        if (!memoryMage) {
            Logger.debug('Memory Mage not available - skipping memory monitoring integration');
            return;
        }
        Logger.debug('Registering with Memory Mage for memory monitoring');
        // Register self-reporting memory usage
        memoryMage.registerModule('seasons-and-stars', () => {
            const optimizer = notesManager?.getPerformanceOptimizer?.();
            const widgetMemory = calculateWidgetMemory();
            const calendarMemory = calculateCalendarMemory();
            return {
                estimatedMB: (optimizer?.getMemoryUsage() || 0) + widgetMemory + calendarMemory,
                details: {
                    notesCache: optimizer?.getMetrics()?.totalNotes || 0,
                    activeWidgets: getActiveWidgetCount(),
                    loadedCalendars: calendarManager?.getLoadedCalendars?.()?.length || 0,
                    cacheSize: optimizer?.getMetrics()?.cacheHitRate || 0,
                },
            };
        });
        // Register cleanup handler for memory pressure
        memoryMage.registerCleanupHandler?.(() => {
            Logger.info('Memory Mage triggered cleanup: memory pressure detected');
            // Perform memory cleanup
            const optimizer = notesManager?.getPerformanceOptimizer?.();
            if (optimizer) {
                optimizer.relieveMemoryPressure?.();
            }
            // Clear other caches if available
            if (calendarManager?.clearCaches) {
                calendarManager.clearCaches?.();
            }
            // Force close widgets if memory is critically low
            CalendarWidget.closeAll?.();
            CalendarGridWidget.closeAll?.();
        });
        Logger.debug('Memory Mage integration registered successfully');
    }
    catch (error) {
        Logger.warn('Failed to register with Memory Mage - module will continue without memory monitoring:', error);
    }
}
/**
 * Calculate estimated memory usage of active widgets
 */
function calculateWidgetMemory() {
    let memory = 0;
    // Base widget overhead (small)
    const activeWidgets = getActiveWidgetCount();
    memory += activeWidgets * 0.05; // 50KB per widget
    return memory;
}
/**
 * Calculate estimated memory usage of loaded calendars
 */
function calculateCalendarMemory() {
    const loadedCalendars = calendarManager?.getLoadedCalendars?.()?.length || 0;
    return loadedCalendars * 0.02; // 20KB per calendar
}
/**
 * Get count of active widgets
 */
function getActiveWidgetCount() {
    let count = 0;
    if (CalendarWidget.getInstance?.()?.rendered)
        count++;
    if (CalendarMiniWidget.getInstance?.()?.rendered)
        count++;
    if (CalendarGridWidget.getInstance?.()?.rendered)
        count++;
    return count;
}
/**
 * Register hooks to clean up notes when journals are deleted externally
 */
function registerNotesCleanupHooks() {
    // Hook into journal deletion to clean up our notes storage
    Hooks.on('deleteJournalEntry', async (journal, _options, _userId) => {
        Logger.debug('Journal deletion detected', {
            journalId: journal.id,
            journalName: journal.name,
            isCalendarNote: !!journal.flags?.['seasons-and-stars']?.calendarNote,
        });
        try {
            // Check if this was a calendar note
            const flags = journal.flags?.['seasons-and-stars'];
            if (flags?.calendarNote) {
                Logger.info('Calendar note deleted externally, cleaning up storage', {
                    noteId: journal.id,
                    noteName: journal.name,
                });
                // Remove from our storage system
                if (notesManager?.storage) {
                    await notesManager.storage.removeNote(journal.id);
                    Logger.debug('Note removed from storage');
                }
                // Emit our own deletion hook for UI updates
                Hooks.callAll('seasons-stars:noteDeleted', journal.id);
                // Refresh calendar widgets to remove the note from display
                const calendarWidget = CalendarWidget.getInstance?.();
                if (calendarWidget?.rendered) {
                    calendarWidget.render();
                }
                const miniWidget = CalendarMiniWidget.getInstance?.();
                if (miniWidget?.rendered) {
                    miniWidget.render();
                }
                const gridWidget = CalendarGridWidget.getInstance?.();
                if (gridWidget?.rendered) {
                    gridWidget.render();
                }
            }
        }
        catch (error) {
            Logger.error('Failed to clean up deleted calendar note', error instanceof Error ? error : new Error(String(error)));
        }
    });
    Logger.debug('Notes cleanup hooks registered');
}
//# sourceMappingURL=module.js.map
