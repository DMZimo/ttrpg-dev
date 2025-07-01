export interface CharacterClass {
  name: string;
  level: number;
  subclass?: string;
}

export interface CharacterRole {
  name: string;
}

export interface CharacterData {
  owner: string;
  isPublic: boolean;
  publishDate?: Date;
  lastUpdated?: Date;
  tags?: string[];
  name: string;
  race: string;
  subrace?: string;
  background?: string;
  portrait?: string;
  token?: string;
  class?: CharacterClass[];
  type: "pc" | "sidekick" | "npc";
  description?: string;
  birthdate?: Date;
  birthplace?: string;
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
  hp: number;
  ac: number;
  gradient?: string;
  roles?: CharacterRole[];
}

export interface Character {
  id: string;
  data: CharacterData;
}

export interface CharacterFilters {
  search: string;
  type: "all" | "pc" | "npc" | "sidekick";
  status: "all" | "alive" | "dead" | "missing" | "retired" | "inactive";
  location: "all" | "red-larch" | "villain" | "cult" | "other";
  tags: string[];
  sortBy: "name" | "level" | "recent" | "type" | "status";
  sortOrder: "asc" | "desc";
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

export function getCharacterTypeStyle(
  type: CharacterData["type"],
  isVillain: boolean = false
) {
  if (isVillain) {
    return {
      border: "border-red-200 dark:border-red-800",
      gradient:
        "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      accent: "text-red-600 dark:text-red-400",
      tagColor: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    };
  }

  switch (type) {
    case "pc":
      return {
        border: "border-blue-200 dark:border-blue-800",
        gradient:
          "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
        accent: "text-blue-600 dark:text-blue-400",
        tagColor:
          "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      };
    case "npc":
      return {
        border: "border-green-200 dark:border-green-800",
        gradient:
          "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
        accent: "text-green-600 dark:text-green-400",
        tagColor:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      };
    case "sidekick":
      return {
        border: "border-orange-200 dark:border-orange-800",
        gradient:
          "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
        accent: "text-orange-600 dark:text-orange-400",
        tagColor:
          "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      };
    default:
      return {
        border: "border-gray-200 dark:border-gray-800",
        gradient: "bg-white dark:bg-gray-800",
        accent: "text-gray-600 dark:text-gray-400",
        tagColor:
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
      };
  }
}

export function sortCharacters(
  characters: Character[],
  sortBy: CharacterFilters["sortBy"],
  sortOrder: CharacterFilters["sortOrder"]
): Character[] {
  return [...characters].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.data.name.localeCompare(b.data.name);
        break;
      case "level":
        const aLevel = a.data.class?.[0]?.level || 0;
        const bLevel = b.data.class?.[0]?.level || 0;
        comparison = aLevel - bLevel;
        break;
      case "recent":
        const aDate = a.data.lastUpdated || a.data.publishDate || new Date(0);
        const bDate = b.data.lastUpdated || b.data.publishDate || new Date(0);
        comparison = bDate.getTime() - aDate.getTime();
        break;
      case "type":
        const typeOrder = { pc: 0, sidekick: 1, npc: 2 };
        comparison = typeOrder[a.data.type] - typeOrder[b.data.type];
        break;
      case "status":
        comparison = a.data.status.localeCompare(b.data.status);
        break;
      default:
        comparison = a.data.name.localeCompare(b.data.name);
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
}

export function filterCharacters(
  characters: Character[],
  filters: CharacterFilters
): Character[] {
  return characters.filter((character) => {
    const { data } = character;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        data.name,
        data.race,
        data.subrace,
        data.background,
        data.description,
        ...(data.roles?.map((r) => r.name) || []),
        ...(data.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== "all" && data.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status !== "all" && data.status !== filters.status) {
      return false;
    }

    // Location filter
    if (filters.location !== "all") {
      const tags = data.tags || [];
      switch (filters.location) {
        case "red-larch":
          if (!tags.includes("red-larch")) return false;
          break;
        case "villain":
          if (!tags.includes("villain") && !tags.includes("antagonist"))
            return false;
          break;
        case "cult":
          if (!tags.some((tag) => tag.includes("cult"))) return false;
          break;
        case "other":
          if (
            tags.includes("red-larch") ||
            tags.includes("villain") ||
            tags.includes("antagonist") ||
            tags.some((tag) => tag.includes("cult"))
          ) {
            return false;
          }
          break;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const characterTags = data.tags || [];
      if (!filters.tags.every((tag) => characterTags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}
