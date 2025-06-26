import React, { useState, useEffect } from "react";

export interface AnnouncementConfig {
  id: string;
  message: string;
  icon?: string;
  type?: "info" | "warning" | "success" | "error" | "campaign";
  autoHideDelay?: number; // in milliseconds, 0 means no auto-hide
  dismissible?: boolean;
  priority?: number; // higher numbers show first
  startDate?: Date;
  endDate?: Date;
  showOnPages?: string[]; // specific pages to show on, empty means all pages
  hideOnPages?: string[]; // specific pages to hide on
}

interface AnnouncementBannerProps {
  announcements: AnnouncementConfig[];
  currentPath?: string;
}

const ANNOUNCEMENT_STYLES = {
  info: "bg-gradient-to-r from-accent-600 to-accent-500 text-inverse",
  warning: "bg-gradient-to-r from-gold-600 to-gold-500 text-inverse",
  success: "bg-gradient-to-r from-green-600 to-green-500 text-inverse",
  error: "bg-gradient-to-r from-red-600 to-red-500 text-inverse",
  campaign: "bg-gradient-to-r from-ddb-red-dark to-ddb-red text-inverse",
};

const DEFAULT_ICONS = {
  info: "ℹ️",
  warning: "⚠️",
  success: "✅",
  error: "❌",
  campaign: "🎲",
};

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  announcements,
  currentPath = "/",
}) => {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<
    Set<string>
  >(new Set());
  const [timers, setTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Load dismissed announcements from localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem("dismissed-announcements");
    if (dismissed) {
      try {
        const dismissedArray = JSON.parse(dismissed);
        setDismissedAnnouncements(new Set(dismissedArray));
      } catch (error) {
        console.error("Failed to parse dismissed announcements:", error);
      }
    }
  }, []);

  // Filter and sort announcements
  const activeAnnouncements = announcements
    .filter((announcement) => {
      // Check if dismissed
      if (dismissedAnnouncements.has(announcement.id)) {
        return false;
      }

      // Check date range
      const now = new Date();
      if (announcement.startDate && now < announcement.startDate) {
        return false;
      }
      if (announcement.endDate && now > announcement.endDate) {
        return false;
      }

      // Check page restrictions
      if (announcement.showOnPages && announcement.showOnPages.length > 0) {
        if (
          !announcement.showOnPages.some((page) => currentPath.startsWith(page))
        ) {
          return false;
        }
      }

      if (announcement.hideOnPages && announcement.hideOnPages.length > 0) {
        if (
          announcement.hideOnPages.some((page) => currentPath.startsWith(page))
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 1); // Show only the highest priority announcement

  // Set up auto-hide timers
  useEffect(() => {
    // Clear existing timers
    timers.forEach((timer) => clearTimeout(timer));
    const newTimers = new Map<string, NodeJS.Timeout>();

    activeAnnouncements.forEach((announcement) => {
      if (announcement.autoHideDelay && announcement.autoHideDelay > 0) {
        const timer = setTimeout(() => {
          dismissAnnouncement(announcement.id);
        }, announcement.autoHideDelay);
        newTimers.set(announcement.id, timer);
      }
    });

    setTimers(newTimers);

    // Cleanup on unmount
    return () => {
      newTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [activeAnnouncements.map((a) => a.id).join(",")]);

  const dismissAnnouncement = (announcementId: string) => {
    const newDismissed = new Set(dismissedAnnouncements);
    newDismissed.add(announcementId);
    setDismissedAnnouncements(newDismissed);

    // Save to localStorage
    localStorage.setItem(
      "dismissed-announcements",
      JSON.stringify(Array.from(newDismissed))
    );

    // Clear timer if exists
    const timer = timers.get(announcementId);
    if (timer) {
      clearTimeout(timer);
      const newTimers = new Map(timers);
      newTimers.delete(announcementId);
      setTimers(newTimers);
    }
  };

  if (activeAnnouncements.length === 0) {
    return null;
  }

  const announcement = activeAnnouncements[0];
  const styleClass = ANNOUNCEMENT_STYLES[announcement.type || "info"];
  const icon = announcement.icon || DEFAULT_ICONS[announcement.type || "info"];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[1001] py-2 px-4 transition-transform duration-300 ${styleClass}`}
      role="banner"
      aria-live="polite"
    >
      <div className="px-6 flex items-center justify-center gap-3 relative w-full max-w-screen-xl mx-auto">
        {icon && (
          <span className="text-xl animate-bounce flex-shrink-0">{icon}</span>
        )}
        <span className="font-medium text-sm text-center flex-1">
          {announcement.message}
        </span>
        {announcement.dismissible !== false && (
          <button
            onClick={() => dismissAnnouncement(announcement.id)}
            className="absolute right-4 rounded p-1 transition-colors hover:bg-white/20 flex-shrink-0"
            aria-label="Close announcement"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Utility function to clear all dismissed announcements (useful for testing)
export const clearDismissedAnnouncements = () => {
  localStorage.removeItem("dismissed-announcements");
};

// Hook to get the height of the announcement banner for layout adjustments
export const useAnnouncementHeight = (
  announcements: AnnouncementConfig[],
  currentPath?: string
) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("dismissed-announcements");
    const dismissedSet = dismissed ? new Set(JSON.parse(dismissed)) : new Set();

    const hasActiveAnnouncement = announcements.some((announcement) => {
      if (dismissedSet.has(announcement.id)) return false;

      const now = new Date();
      if (announcement.startDate && now < announcement.startDate) return false;
      if (announcement.endDate && now > announcement.endDate) return false;

      if (announcement.showOnPages && announcement.showOnPages.length > 0) {
        if (
          !announcement.showOnPages.some((page) =>
            (currentPath || "/").startsWith(page)
          )
        ) {
          return false;
        }
      }

      if (announcement.hideOnPages && announcement.hideOnPages.length > 0) {
        if (
          announcement.hideOnPages.some((page) =>
            (currentPath || "/").startsWith(page)
          )
        ) {
          return false;
        }
      }

      return true;
    });

    setHeight(hasActiveAnnouncement ? 42 : 0);
  }, [announcements, currentPath]);

  return height;
};
