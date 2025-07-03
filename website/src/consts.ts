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

// Character Constants - extracted from content.config.ts schema
export const CHARACTER_TYPES = ["pc", "sidekick", "npc"] as const;

export const CHARACTER_STATUSES = [
  "alive",
  "injured",
  "dead",
  "missing",
  "retired",
  "absent",
  "traveling",
  "captured",
  "incapacitated",
  "inactive",
] as const;

export const CHARACTER_ROLES = [
  "tank",
  "support",
  "ranged",
  "melee",
  "caster",
] as const;

export const CHARACTER_CLASSES = [
  "artificer",
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
] as const;

export const CHARACTER_LOCATIONS = [
  "red-larch",
  "villain",
  "cult",
  "other",
] as const;

export const CHARACTER_CULTS = [
  "Water",
  "Earth",
  "Air",
  "Fire",
  "Eye",
] as const;

export const CHARACTER_SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "level", label: "Level" },
  { value: "recent", label: "Recent" },
  { value: "type", label: "Type" },
  { value: "status", label: "Status" },
  { value: "race", label: "Race" },
] as const;
