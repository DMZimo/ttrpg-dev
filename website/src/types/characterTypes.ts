import {
  CHARACTER_TYPES,
  CHARACTER_STATUSES,
  CHARACTER_ROLES,
  CHARACTER_LOCATIONS,
  CHARACTER_CULTS,
  CHARACTER_SORT_OPTIONS,
  CHARACTER_CLASSES,
} from "../consts";

export interface CharacterClass {
  name: string;
  level: number;
  subclass?: string;
}

export interface CharacterRole {
  name: string;
}

// Extended character data interface to support both legacy and new schema
export interface CharacterData {
  // Character Metadata
  owner: string;
  isPublic: boolean;
  is_public?: boolean;
  publishDate?: Date;
  lastUpdated?: Date;
  publish_date_iso?: Date;
  last_updated_iso?: Date;
  tags?: string[];

  // Character Details
  type: "pc" | "sidekick" | "npc";
  status:
    | "alive"
    | "injured"
    | "dead"
    | "missing"
    | "retired"
    | "absent"
    | "traveling"
    | "captured"
    | "incapacitated"
    | "inactive";
  active: boolean;
  portrait?: string;
  token?: string;
  color?: string;
  gradient?: string;

  // Character Attributes
  name: string;
  race: string;
  subrace?: string;
  background?: string;
  birthplace?: string;
  culture?: string;
  description?: string;
  birthdate?: Date;
  size?: string;
  languages?: Array<{
    name: string;
  }>;

  // Physical Description
  physical_description?: {
    gender?: string;
    hair?: string;
    eyes?: string;
    skin?: string;
    build?: string;
    height?: Array<{
      feet: string;
      inches: string;
    }>;
    weight?: string;
  };

  // Character Roles
  roles?: ("tank" | "support" | "ranged" | "melee" | "caster")[] | null;

  // Character Stats
  ability_scores?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  // Derived stats
  proficiency_bonus?: number;
  saving_throws?: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
  };

  // Classes and levels (supporting both legacy and new schema)
  class?: CharacterClass[];
  classes?: Array<{
    name: string;
    level: number;
    subclass?: string | null;
  }>;
  hp?: number;
  ac?: number;
  mr?: number;

  // Skills
  skills?: Array<{
    name: string;
    modifier: number;
  }>;
  other_skills?: Array<{
    name: string;
  }>;

  // Spellcasting
  spellcasting?: {
    ability: string;
    spell_attack_bonus: number;
    spell_save_dc: number;
  } | null;

  // Character Relationships
  organization?: {
    name: string;
    disposition: number;
  };
  enclave?: {
    name: string;
    disposition: number;
  } | null;
  affiliations?: Array<{
    name: string;
    disposition: number;
  }> | null;
  cult?: {
    name: "Water" | "Earth" | "Air" | "Fire" | "Eye";
    disposition: number;
  } | null;
  allies?: string[] | null;
  enemies?: string[] | null;

  // Character motivations and traits
  personality_traits?: string[] | null;
  ideals?: string[] | null;
  bonds?: string[] | null;
  flaws?: string[] | null;
}

export interface Character {
  id: string;
  data: CharacterData;
  body?: string;
  collection: "characters";
}

// Enhanced character filters interface with all filter options
export interface CharacterFilters {
  search: string;
  type: "all" | (typeof CHARACTER_TYPES)[number];
  status: "all" | (typeof CHARACTER_STATUSES)[number];
  location: "all" | (typeof CHARACTER_LOCATIONS)[number];
  race: "all" | string;
  enclave: "all" | string;
  cult: "all" | (typeof CHARACTER_CULTS)[number];
  organization: "all" | string;
  class: "all" | (typeof CHARACTER_CLASSES)[number] | string;
  role: "all" | (typeof CHARACTER_ROLES)[number];
  active: "all" | "active" | "inactive";
  tags: string[];
  sortBy: (typeof CHARACTER_SORT_OPTIONS)[number]["value"];
  sortOrder: "asc" | "desc";
}

export interface CharacterFiltersProps {
  onFiltersChange: (filters: CharacterFilters) => void;
  totalCount: number;
  filteredCount: number;
  allTags?: string[];
  allClasses?: string[];
  allRaces?: string[];
  allEnclaves?: string[];
  allCults?: string[];
  allOrganizations?: string[];
}

export interface CharacterRelationship {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  type:
    | "ally"
    | "enemy"
    | "neutral"
    | "family"
    | "friend"
    | "rival"
    | "mentor"
    | "student"
    | "employer"
    | "employee";
  description?: string;
  strength: 1 | 2 | 3 | 4 | 5; // 1 = weak, 5 = strong
}

export interface CharacterGroup {
  id: string;
  name: string;
  description?: string;
  type:
    | "party"
    | "faction"
    | "organization"
    | "family"
    | "cult"
    | "guild"
    | "location";
  memberIds: string[];
  isPublic: boolean;
}

export const CharacterTypeIcons = {
  pc: "⚔️",
  npc: "👤",
  sidekick: "🤝",
} as const;

export const CharacterStatusIcons = {
  alive: "💚",
  injured: "🩹",
  dead: "💀",
  missing: "❓",
  retired: "🏠",
  absent: "🚶",
  traveling: "🧳",
  captured: "⛓️",
  incapacitated: "😵",
  inactive: "💤",
} as const;

export const LocationIcons = {
  "red-larch": "🏘️",
  "fire-cult": "🔥",
  "water-cult": "💧",
  "air-cult": "💨",
  "earth-cult": "🌍",
  villain: "💀",
  merchant: "💰",
  nobility: "👑",
} as const;
