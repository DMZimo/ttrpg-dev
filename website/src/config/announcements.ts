import type { AnnouncementConfig } from "../components/layout/AnnouncementBanner";

// Central configuration for all site announcements
export const ANNOUNCEMENTS: AnnouncementConfig[] = [
  {
    id: "next-session-june-30",
    message: "Next session: Sunday, June 30th at 7PM EST",
    type: "campaign",
    icon: "🎲",
    autoHideDelay: 10000, // Auto-hide after 10 seconds
    dismissible: true,
    priority: 100,
    // Uncomment to set date restrictions
    // startDate: new Date("2025-06-26"),
    // endDate: new Date("2025-06-30"),
    // showOnPages: ["/", "/journal"], // Only show on homepage and journal pages
    // hideOnPages: ["/admin"], // Hide on admin pages
  },

  // Example of other announcement types:

  // {
  //   id: "maintenance-notice",
  //   message: "Scheduled maintenance tonight at 11 PM EST - expect brief downtime",
  //   type: "warning",
  //   icon: "🔧",
  //   autoHideDelay: 0, // Don't auto-hide
  //   dismissible: true,
  //   priority: 90,
  //   startDate: new Date("2025-06-26"),
  //   endDate: new Date("2025-06-27"),
  // },

  // {
  //   id: "new-feature-announcement",
  //   message: "New character sheets are now available! Check them out in the Characters section.",
  //   type: "success",
  //   icon: "🆕",
  //   autoHideDelay: 15000,
  //   dismissible: true,
  //   priority: 80,
  //   showOnPages: ["/", "/characters"],
  // },

  // {
  //   id: "urgent-notice",
  //   message: "Emergency: Session moved to Monday due to weather. Check Discord for updates.",
  //   type: "error",
  //   icon: "🚨",
  //   autoHideDelay: 0,
  //   dismissible: false, // Can't be dismissed
  //   priority: 200,
  // },
];

// Utility functions for managing announcements

export const getActiveAnnouncements = (
  currentPath?: string
): AnnouncementConfig[] => {
  const dismissed =
    typeof window !== "undefined"
      ? localStorage.getItem("dismissed-announcements")
      : null;
  const dismissedSet = dismissed ? new Set(JSON.parse(dismissed)) : new Set();

  return ANNOUNCEMENTS.filter((announcement) => {
    // Check if dismissed
    if (dismissedSet.has(announcement.id)) {
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
  }).sort((a, b) => (b.priority || 0) - (a.priority || 0));
};

export const hasActiveAnnouncements = (currentPath?: string): boolean => {
  return getActiveAnnouncements(currentPath).length > 0;
};

// Development helpers
export const clearAllDismissedAnnouncements = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("dismissed-announcements");
  }
};

export const addAnnouncement = (announcement: AnnouncementConfig) => {
  ANNOUNCEMENTS.push(announcement);
};

export const removeAnnouncement = (id: string) => {
  const index = ANNOUNCEMENTS.findIndex((a) => a.id === id);
  if (index > -1) {
    ANNOUNCEMENTS.splice(index, 1);
  }
};
