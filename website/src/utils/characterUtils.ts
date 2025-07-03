import type {
  Character,
  CharacterFilters,
  CharacterData,
} from "@/types/characterTypes";

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
        const aClasses = a.data.classes || a.data.class || [];
        const bClasses = b.data.classes || b.data.class || [];
        const aLevel = aClasses[0]?.level || 0;
        const bLevel = bClasses[0]?.level || 0;
        comparison = aLevel - bLevel;
        break;
      case "recent":
        const aDate =
          a.data.last_updated_iso ||
          a.data.lastUpdated ||
          a.data.publish_date_iso ||
          a.data.publishDate ||
          new Date(0);
        const bDate =
          b.data.last_updated_iso ||
          b.data.lastUpdated ||
          b.data.publish_date_iso ||
          b.data.publishDate ||
          new Date(0);
        comparison = new Date(bDate).getTime() - new Date(aDate).getTime();
        break;
      case "type":
        const typeOrder = { pc: 0, sidekick: 1, npc: 2 };
        comparison = typeOrder[a.data.type] - typeOrder[b.data.type];
        break;
      case "status":
        comparison = a.data.status.localeCompare(b.data.status);
        break;
      case "race":
        comparison = a.data.race.localeCompare(b.data.race);
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
        ...(data.roles || []),
        ...(data.tags || []),
        data.birthplace,
      ]
        .filter(Boolean)
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

    // Active filter
    if (filters.active !== "all") {
      const isActive = data.active;
      if (filters.active === "active" && !isActive) return false;
      if (filters.active === "inactive" && isActive) return false;
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

    // Race filter
    if (filters.race !== "all" && data.race !== filters.race) {
      return false;
    }

    // Class filter
    if (filters.class !== "all") {
      const classes = data.classes || data.class || [];
      if (
        !classes.some(
          (c) => c.name.toLowerCase() === filters.class.toLowerCase()
        )
      ) {
        return false;
      }
    }

    // Role filter
    if (filters.role !== "all") {
      if (!data.roles?.includes(filters.role)) {
        return false;
      }
    }

    // Enclave filter
    if (filters.enclave !== "all") {
      if (data.enclave?.name !== filters.enclave) {
        return false;
      }
    }

    // Organization filter
    if (filters.organization !== "all") {
      if (data.organization?.name !== filters.organization) {
        return false;
      }
    }

    // Cult filter
    if (filters.cult !== "all") {
      if (data.cult?.name !== filters.cult) {
        return false;
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

export function getCharacterStats(characters: Character[]) {
  const stats = {
    total: characters.length,
    byType: {
      pc: characters.filter((c) => c.data.type === "pc").length,
      npc: characters.filter((c) => c.data.type === "npc").length,
      sidekick: characters.filter((c) => c.data.type === "sidekick").length,
    },
    byStatus: {
      alive: characters.filter((c) => c.data.status === "alive").length,
      dead: characters.filter((c) => c.data.status === "dead").length,
      missing: characters.filter((c) => c.data.status === "missing").length,
      other: characters.filter(
        (c) => !["alive", "dead", "missing"].includes(c.data.status)
      ).length,
    },
    byLocation: {
      redLarch: characters.filter((c) => c.data.tags?.includes("red-larch"))
        .length,
      villains: characters.filter(
        (c) =>
          c.data.tags?.includes("villain") ||
          c.data.tags?.includes("antagonist")
      ).length,
      cults: {
        fire: characters.filter((c) => c.data.tags?.includes("fire-cult"))
          .length,
        water: characters.filter((c) => c.data.tags?.includes("water-cult"))
          .length,
        air: characters.filter((c) => c.data.tags?.includes("air-cult")).length,
        earth: characters.filter((c) => c.data.tags?.includes("earth-cult"))
          .length,
      },
    },
  };

  // Calculate average level
  const charactersWithLevels = characters.filter(
    (c) => c.data.class?.[0]?.level
  );
  const averageLevel =
    charactersWithLevels.length > 0
      ? charactersWithLevels.reduce(
          (sum, c) => sum + (c.data.class![0].level || 1),
          0
        ) / charactersWithLevels.length
      : 0;

  // Get class distribution
  const classDistribution: Record<string, number> = {};
  characters.forEach((c) => {
    if (c.data.class?.[0]?.name) {
      const className = c.data.class[0].name;
      classDistribution[className] = (classDistribution[className] || 0) + 1;
    }
  });

  return {
    ...stats,
    averageLevel: Math.round(averageLevel * 10) / 10,
    classDistribution: Object.entries(classDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
  };
}

export function groupCharactersByRelationship(characters: Character[]) {
  const groups: Record<string, Character[]> = {
    "Player Party": characters.filter((c) => c.data.type === "pc"),
    "Red Larch Council": characters.filter(
      (c) =>
        c.data.tags?.includes("red-larch") &&
        (c.data.tags?.includes("council") || c.data.tags?.includes("authority"))
    ),
    "Fire Cult": characters.filter((c) => c.data.tags?.includes("fire-cult")),
    "Water Cult": characters.filter((c) => c.data.tags?.includes("water-cult")),
    "Air Cult": characters.filter((c) => c.data.tags?.includes("air-cult")),
    "Earth Cult": characters.filter((c) => c.data.tags?.includes("earth-cult")),
    "Red Larch Residents": characters.filter(
      (c) =>
        c.data.tags?.includes("red-larch") &&
        !c.data.tags?.includes("council") &&
        !c.data.tags?.includes("authority")
    ),
    "Merchants & Traders": characters.filter(
      (c) =>
        c.data.tags?.includes("merchant") || c.data.tags?.includes("trader")
    ),
    "Villains & Antagonists": characters.filter(
      (c) =>
        c.data.tags?.includes("villain") || c.data.tags?.includes("antagonist")
    ),
  };

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, chars]) => chars.length > 0)
  );
}

export function getAvailableTags(characters: Character[]): string[] {
  const tagSet = new Set<string>();
  characters.forEach((character) => {
    character.data.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function createCharacterSearchIndex(characters: Character[]) {
  return characters.map((character) => ({
    id: character.id,
    searchText: [
      character.data.name,
      character.data.race,
      character.data.subrace,
      character.data.background,
      character.data.description,
      ...(character.data.roles || []),
      ...(character.data.tags || []),
      character.data.birthplace,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }));
}

export function formatCharacterLevel(character: Character): string {
  if (!character.data.class || character.data.class.length === 0) {
    return "";
  }

  const primaryClass = character.data.class[0];
  let result = `${primaryClass.name} ${primaryClass.level}`;

  if (primaryClass.subclass) {
    result += ` (${primaryClass.subclass})`;
  }

  // Handle multiclass
  if (character.data.class.length > 1) {
    const otherClasses = character.data.class.slice(1);
    const otherClassStrings = otherClasses.map((c) => `${c.name} ${c.level}`);
    result += ` / ${otherClassStrings.join(" / ")}`;
  }

  return result;
}

export function getCharacterDisplayName(character: Character): string {
  return character.data.name;
}

export function getCharacterSubtitle(character: Character): string {
  const parts = [];

  if (character.data.subrace) {
    parts.push(`${character.data.subrace} ${character.data.race}`);
  } else {
    parts.push(character.data.race);
  }

  if (character.data.class && character.data.class.length > 0) {
    parts.push(character.data.class[0].name);
  }

  if (character.data.background) {
    parts.push(character.data.background);
  }

  return parts.join(" • ");
}

export function getCharacterAge(birthdate: Date, campaignDate: Date): number {
  const diffTime = Math.abs(campaignDate.getTime() - birthdate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365);
}

export function getPortraitPath(portrait?: string): string {
  if (portrait) {
    return `/src/assets/portraits/${portrait}`;
  }
  return "/src/assets/portraits/placeholder-portrait.png";
}

export function getTokenPath(token?: string): string {
  if (token) {
    return `/src/assets/tokens/${token}`;
  }
  return "/src/assets/tokens/placeholder-token.webp";
}

export function getCultIcon(
  tags?: string[],
  cult?: { name: string }
): string | null {
  // Check direct cult field first
  if (cult?.name) {
    switch (cult.name.toLowerCase()) {
      case "fire":
        return "/src/assets/icons/cult-icon-fire.svg";
      case "water":
        return "/src/assets/icons/cult-icon-water.svg";
      case "air":
        return "/src/assets/icons/cult-icon-air.svg";
      case "earth":
        return "/src/assets/icons/cult-icon-earth.svg";
      case "eye":
        return "/src/assets/icons/cult-icon-eye.svg";
      default:
        return null;
    }
  }

  // Check tags for cult affiliation
  if (!tags) return null;

  if (tags.includes("fire-cult") || tags.includes("eternal-flame")) {
    return "/src/assets/icons/cult-icon-fire.svg";
  }
  if (tags.includes("water-cult") || tags.includes("crushing-wave")) {
    return "/src/assets/icons/cult-icon-water.svg";
  }
  if (tags.includes("air-cult") || tags.includes("howling-hatred")) {
    return "/src/assets/icons/cult-icon-air.svg";
  }
  if (tags.includes("earth-cult") || tags.includes("black-earth")) {
    return "/src/assets/icons/cult-icon-earth.svg";
  }

  return null;
}

export function getEnclaveBanner(
  enclave?: { name: string },
  organization?: { name: string },
  tags?: string[]
): string {
  // Check enclave field first
  if (enclave?.name) {
    const enclaveName = enclave.name.toLowerCase().replace(/\s+/g, "-");
    switch (enclaveName) {
      case "harpers":
        return "/src/assets/banners/harpers-banner.svg";
      case "lords-alliance":
      case "lords alliance":
        return "/src/assets/banners/lords-alliance-banner.svg";
      case "emerald-enclave":
      case "emerald enclave":
        return "/src/assets/banners/emerald-enclave-banner.svg";
      case "order-of-the-gauntlet":
      case "order of the gauntlet":
        return "/src/assets/banners/order-of-the-gauntlet-banner.svg";
      case "zhentarim":
        return "/src/assets/banners/zhentarim-banner.svg";
      default:
        return "/src/assets/banners/unknown-banner.svg";
    }
  }

  // Check organization field as fallback
  if (organization?.name) {
    const orgName = organization.name.toLowerCase().replace(/\s+/g, "-");
    switch (orgName) {
      case "harpers":
        return "/src/assets/banners/harpers-banner.svg";
      case "lords-alliance":
      case "lords alliance":
        return "/src/assets/banners/lords-alliance-banner.svg";
      case "emerald-enclave":
      case "emerald enclave":
        return "/src/assets/banners/emerald-enclave-banner.svg";
      case "order-of-the-gauntlet":
      case "order of the gauntlet":
        return "/src/assets/banners/order-of-the-gauntlet-banner.svg";
      case "zhentarim":
        return "/src/assets/banners/zhentarim-banner.svg";
      default:
        return "/src/assets/banners/unknown-banner.svg";
    }
  }

  // Check tags for enclave affiliation
  if (tags) {
    if (tags.includes("harpers")) {
      return "/src/assets/banners/harpers-banner.svg";
    }
    if (tags.includes("lords-alliance")) {
      return "/src/assets/banners/lords-alliance-banner.svg";
    }
    if (tags.includes("emerald-enclave")) {
      return "/src/assets/banners/emerald-enclave-banner.svg";
    }
    if (tags.includes("order-of-the-gauntlet")) {
      return "/src/assets/banners/order-of-the-gauntlet-banner.svg";
    }
    if (tags.includes("zhentarim")) {
      return "/src/assets/banners/zhentarim-banner.svg";
    }
  }

  return "/src/assets/banners/unknown-banner.svg";
}

export function getClassIcon(className: string): string {
  const classNameLower = className.toLowerCase();

  // Handle special cases
  if (classNameLower === "commoner" || classNameLower === "noble") {
    return "/src/assets/icons/class-icon-fighter.svg"; // fallback
  }

  return `/src/assets/icons/class-icon-${classNameLower}.svg`;
}

export function getRoleIcon(roleName: string): string {
  const roleNameLower = roleName.toLowerCase();
  return `/src/assets/icons/role-icon-${roleNameLower}.png`;
}

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatAbilityModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function getTotalLevel(
  classes?: Array<{ level: number }> | Array<{ level: number }>
): number {
  if (!classes || classes.length === 0) return 0;
  return classes.reduce((total, cls) => total + cls.level, 0);
}

export function getCharacterTypeStyleClass(type: string): string {
  switch (type) {
    case "pc":
      return "type-pc";
    case "npc":
      return "type-npc";
    case "sidekick":
      return "type-sidekick";
    default:
      return "";
  }
}

export function getCharacterStatusStyleClass(status: string): string {
  switch (status) {
    case "alive":
      return "status-alive";
    case "dead":
      return "status-dead";
    case "missing":
      return "status-missing";
    case "injured":
      return "status-injured";
    case "retired":
      return "status-retired";
    case "absent":
      return "status-absent";
    case "traveling":
      return "status-traveling";
    case "captured":
      return "status-captured";
    case "incapacitated":
      return "status-incapacitated";
    case "inactive":
      return "status-inactive";
    default:
      return "";
  }
}

export function formatClassesDisplay(
  classes?: Array<{ name: string; level: number; subclass?: string | null }>
): string {
  if (!classes || classes.length === 0) return "";

  return classes
    .map((cls) => {
      let display = `${cls.name} ${cls.level}`;
      if (cls.subclass) {
        display += ` (${cls.subclass})`;
      }
      return display;
    })
    .join(" / ");
}

export function formatPhysicalDescription(physical?: {
  gender?: string;
  hair?: string;
  eyes?: string;
  skin?: string;
  build?: string;
  height?: Array<{ feet: string; inches: string }>;
  weight?: string;
}): string {
  if (!physical) return "";

  const parts: string[] = [];

  if (physical.gender) parts.push(physical.gender);
  if (physical.build) parts.push(physical.build);
  if (physical.hair) parts.push(`${physical.hair} hair`);
  if (physical.eyes) parts.push(`${physical.eyes} eyes`);
  if (physical.skin) parts.push(`${physical.skin} skin`);

  if (physical.height && physical.height.length > 0) {
    const h = physical.height[0];
    parts.push(`${h.feet}'${h.inches}"`);
  }

  if (physical.weight) parts.push(physical.weight);

  return parts.join(", ");
}

export function formatHeight(
  height?: Array<{ feet: string; inches: string }>
): string {
  if (!height || height.length === 0) return "";
  const h = height[0];
  return `${h.feet}'${h.inches}"`;
}

export function getLanguagesDisplay(
  languages?: Array<{ name: string }>
): string {
  if (!languages || languages.length === 0) return "";
  return languages.map((lang) => lang.name).join(", ");
}
