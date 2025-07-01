import type { Character, CharacterFilters } from "@/types/characterTypes";

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
      ...(character.data.roles?.map((r) => r.name) || []),
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
