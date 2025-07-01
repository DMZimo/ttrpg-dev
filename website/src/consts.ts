// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Campaign Hub";
export const SITE_DESCRIPTION =
  "Adventures in the Dessarin Valley - A D&D Campaign Journal for Players";

// Social Links
export const DISCORD_INVITE = "https://discord.gg/cNv4wN5t64";
export const FOUNDRY_VTT_URL = "http://109.67.171.166:31000/"; // Add your Foundry VTT URL here

// Timezone Configuration
export const TIMEZONE = "Asia/Jerusalem";

// Campaign Date and Time Configuration
// Update these values after each session to reflect the current campaign date/time
export const CAMPAIGN_DATE = {
  year: 1491,
  month: 4, // 1-12 (Hammer to Nightal)
  day: 18, // 1-30
  hour: 8, // 0-23 (24-hour format)
  minute: 0, // 0-59
};

// Campaign Settings
export const CAMPAIGN_SETTINGS = {
  // Whether to show advanced calendar features
  showAdvancedTools: true,
  // Default calendar view mode
  defaultViewMode: "month" as "month" | "year" | "season",
  // Whether to show weather information
  showWeather: true,
  // Whether to show moon phases
  showMoonPhases: true,
  // Whether to highlight special days
  highlightSpecialDays: true,
};
