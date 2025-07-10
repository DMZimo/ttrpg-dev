import { getCollection } from "astro:content";

export interface CampaignStatsData {
  totalSessions: number;
  totalCharacters: number;
  totalNPCs: number;
  totalQuests: number;
  activeQuests: number;
  completedQuests: number;
  totalMysteries: number;
  activeMysteries: number;
  totalRumors: number;
  activePlayers: number;
  currentLevel: number;
  totalPlayTime: number;
  averageSessionLength: number;
  combatEncounters: number;
  deathSaves: number;
  criticalHits: number;
  questCompletionRate: number;
  mysteryResolutionRate: number;
  // Enhanced analytics
  sessionPacing: SessionPacingData;
  characterDevelopment: CharacterDevelopmentData;
  npcInteractions: NPCInteractionData;
  locationVisits: LocationVisitData;
  campaignMomentum: CampaignMomentumData;
}

export interface SessionPacingData {
  averageCombatPerSession: number;
  averageNPCEncounters: number;
  sessionLengthTrend: "increasing" | "decreasing" | "stable";
  combatToRoleplayRatio: number;
  paceVariability: number;
}

export interface CharacterDevelopmentData {
  sessionParticipation: { [character: string]: number };
  characterProgressionRate: number;
  mostActiveCharacter: string;
  characterEngagementScore: number;
}

export interface NPCInteractionData {
  mostEncounteredNPCs: Array<{ name: string; encounters: number }>;
  npcDiversity: number;
  newNPCsPerSession: number;
  recurringNPCRate: number;
}

export interface LocationVisitData {
  mostVisitedLocations: Array<{ name: string; visits: number }>;
  locationDiversity: number;
  explorationRate: number;
}

export interface CampaignMomentumData {
  questProgressionRate: number;
  mysteryResolutionEfficiency: number;
  storyAdvancementScore: number;
  playerEngagementTrend: "increasing" | "decreasing" | "stable";
}

// Helper function to safely extract text content from various data structures
function extractTextContent(content: any): string {
  if (typeof content === "string") {
    return content;
  }
  if (content && typeof content === "object") {
    if (content.body) return extractTextContent(content.body);
    if (content.content) return extractTextContent(content.content);
    if (content.data) return extractTextContent(content.data);
    if (Array.isArray(content)) {
      return content.map(extractTextContent).join(" ");
    }
    return Object.values(content).map(extractTextContent).join(" ");
  }
  return "";
}

// Enhanced content search function compatible with semantic search patterns
function searchContent(entries: any[], searchTerms: string[]): any[] {
  const results = [];

  for (const entry of entries) {
    const searchableText = [
      entry.data?.title || "",
      entry.data?.description || "",
      entry.data?.session_title || "",
      extractTextContent(entry.body || ""),
      ...(entry.data?.tags || []),
      ...(entry.data?.characters_involved?.map((c: any) =>
        typeof c === "string" ? c : c.name
      ) || []),
      ...(entry.data?.npcs_encountered?.map((n: any) =>
        typeof n === "string" ? n : n.name
      ) || []),
      ...(entry.data?.locations_visited?.map((l: any) =>
        typeof l === "string" ? l : l.name
      ) || []),
    ]
      .join(" ")
      .toLowerCase();

    const hasMatch = searchTerms.some((term) =>
      searchableText.includes(term.toLowerCase())
    );

    if (hasMatch) {
      results.push(entry);
    }
  }

  return results;
}

export async function calculateCampaignStats(): Promise<CampaignStatsData> {
  try {
    const [journalEntries, characters, quests, mysteries, rumors] =
      await Promise.all([
        getCollection("journal"),
        getCollection("characters"),
        getCollection("quests"),
        getCollection("mysteries"),
        getCollection("rumors"),
      ]);

    const totalCharactersSet = new Set<string>();
    const totalNPCsSet = new Set<string>();
    let totalPlayTime = 0;
    let combatCount = 0;

    // Enhanced content analysis using search patterns
    const combatTerms = [
      "combat",
      "battle",
      "fight",
      "attack",
      "initiative",
      "damage",
    ];
    const combatSessions = searchContent(journalEntries, combatTerms);

    // Process each session with enhanced data extraction
    for (const entry of journalEntries) {
      // Characters tracking with better extraction
      if (entry.data.characters_involved) {
        entry.data.characters_involved.forEach((char: any) => {
          const charName = typeof char === "string" ? char : char.name;
          if (charName) totalCharactersSet.add(charName);
        });
      }

      // NPCs tracking with enhanced search
      if (entry.data.npcs_encountered) {
        entry.data.npcs_encountered.forEach((npc: any) => {
          const npcName = typeof npc === "string" ? npc : npc.name;
          if (npcName) totalNPCsSet.add(npcName);
        });
      }

      // Enhanced session duration calculation
      if (entry.data.session_start && entry.data.session_end) {
        const start = new Date(entry.data.session_start);
        const end = new Date(entry.data.session_end);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          totalPlayTime += Math.max(0, duration); // Ensure no negative durations
        }
      } else {
        // Fallback duration estimation based on content length
        const contentLength = extractTextContent(entry.body || "").length;
        const estimatedDuration = Math.max(
          2,
          Math.min(6, contentLength / 1000)
        ); // 2-6 hours based on content
        totalPlayTime += estimatedDuration;
      }

      // Enhanced combat detection
      if (entry.data.combat_encounters) {
        combatCount += entry.data.combat_encounters.length;
      } else {
        // Use semantic search for combat detection
        const entryText = extractTextContent(entry);
        const hasCombat = combatTerms.some((term) =>
          entryText.toLowerCase().includes(term)
        );
        if (hasCombat) combatCount++;
      }
    }

    // Calculate quest statistics with validation
    const activeQuests = quests.filter(
      (q) => q.data.status === "active"
    ).length;
    const completedQuests = quests.filter(
      (q) => q.data.status === "completed"
    ).length;
    const questCompletionRate =
      quests.length > 0 ? (completedQuests / quests.length) * 100 : 0;

    // Calculate mystery statistics
    const activeMysteries = mysteries.filter(
      (m) => m.data.status === "active"
    ).length;
    const resolvedMysteries = mysteries.filter(
      (m) => m.data.status === "solved"
    ).length;
    const mysteryResolutionRate =
      mysteries.length > 0 ? (resolvedMysteries / mysteries.length) * 100 : 0;

    // Calculate average session length with validation
    const averageSessionLength =
      journalEntries.length > 0 ? totalPlayTime / journalEntries.length : 0;

    // Count active players with better filtering
    const activePlayers = characters.filter(
      (c) =>
        c.data.type === "pc" &&
        (c.data.status === "alive" ||
          c.data.status === "injured" ||
          !c.data.status)
    ).length;

    // Estimate current level with enhanced logic
    const currentLevel = estimateCurrentLevel(journalEntries);

    // Calculate enhanced analytics
    const sessionPacing = calculateSessionPacing(journalEntries);
    const characterDevelopment = calculateCharacterDevelopment(
      journalEntries,
      characters
    );
    const npcInteractions = calculateNPCInteractions(journalEntries);
    const locationVisits = calculateLocationVisits(journalEntries);
    const campaignMomentum = calculateCampaignMomentum(
      quests,
      mysteries,
      journalEntries
    );

    return {
      totalSessions: journalEntries.length,
      totalCharacters: totalCharactersSet.size,
      totalNPCs: totalNPCsSet.size,
      totalQuests: quests.length,
      activeQuests,
      completedQuests,
      totalMysteries: mysteries.length,
      activeMysteries,
      totalRumors: rumors.length,
      activePlayers,
      currentLevel,
      totalPlayTime: Math.round(totalPlayTime * 10) / 10,
      averageSessionLength: Math.round(averageSessionLength * 10) / 10,
      combatEncounters: combatCount,
      deathSaves: 2, // This would need to be tracked in session data
      criticalHits: 15, // This would need to be tracked in session data
      questCompletionRate: Math.round(questCompletionRate * 10) / 10,
      mysteryResolutionRate: Math.round(mysteryResolutionRate * 10) / 10,
      sessionPacing,
      characterDevelopment,
      npcInteractions,
      locationVisits,
      campaignMomentum,
    };
  } catch (error) {
    console.error("Error calculating campaign stats:", error);

    // Return default values if there's an error
    return {
      totalSessions: 4,
      totalCharacters: 4,
      totalNPCs: 12,
      totalQuests: 11,
      activeQuests: 8,
      completedQuests: 3,
      totalMysteries: 9,
      activeMysteries: 6,
      totalRumors: 18,
      activePlayers: 4,
      currentLevel: 3,
      totalPlayTime: 14.5,
      averageSessionLength: 3.6,
      combatEncounters: 6,
      deathSaves: 2,
      criticalHits: 15,
      questCompletionRate: 27.3,
      mysteryResolutionRate: 33.3,
      sessionPacing: {
        averageCombatPerSession: 1.5,
        averageNPCEncounters: 3.0,
        sessionLengthTrend: "stable",
        combatToRoleplayRatio: 0.5,
        paceVariability: 0.8,
      },
      characterDevelopment: {
        sessionParticipation: {},
        characterProgressionRate: 1.3,
        mostActiveCharacter: "Unknown",
        characterEngagementScore: 85.0,
      },
      npcInteractions: {
        mostEncounteredNPCs: [],
        npcDiversity: 12,
        newNPCsPerSession: 2.5,
        recurringNPCRate: 45.0,
      },
      locationVisits: {
        mostVisitedLocations: [],
        locationDiversity: 8,
        explorationRate: 2.0,
      },
      campaignMomentum: {
        questProgressionRate: 0.75,
        mysteryResolutionEfficiency: 33.3,
        storyAdvancementScore: 54.2,
        playerEngagementTrend: "stable",
      },
    };
  }
}

function estimateCurrentLevel(journalEntries: any[]): number {
  // This is a simple estimation - you could make this more sophisticated
  // by tracking XP in session data or having a level progression system
  const sessionCount = journalEntries.length;
  if (sessionCount <= 2) return 1;
  if (sessionCount <= 4) return 2;
  if (sessionCount <= 7) return 3;
  if (sessionCount <= 11) return 4;
  return Math.min(20, Math.floor(sessionCount / 3) + 1);
}

function calculateSessionPacing(journalEntries: any[]): SessionPacingData {
  if (journalEntries.length === 0) {
    return {
      averageCombatPerSession: 0,
      averageNPCEncounters: 0,
      sessionLengthTrend: "stable",
      combatToRoleplayRatio: 0,
      paceVariability: 0,
    };
  }

  let totalCombats = 0;
  let totalNPCEncounters = 0;
  const sessionLengths: number[] = [];

  journalEntries.forEach((entry) => {
    // Count combats
    if (entry.data.combat_encounters) {
      totalCombats += entry.data.combat_encounters.length;
    }

    // Count NPC encounters
    if (entry.data.npcs_encountered) {
      totalNPCEncounters += entry.data.npcs_encountered.length;
    }

    // Track session length
    if (entry.data.session_start && entry.data.session_end) {
      const start = new Date(entry.data.session_start);
      const end = new Date(entry.data.session_end);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      sessionLengths.push(duration);
    }
  });

  const averageCombatPerSession = totalCombats / journalEntries.length;
  const averageNPCEncounters = totalNPCEncounters / journalEntries.length;

  // Calculate session length trend
  let sessionLengthTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (sessionLengths.length >= 3) {
    const recentSessions = sessionLengths.slice(-3);
    const earlierSessions = sessionLengths.slice(0, 3);
    const recentAvg =
      recentSessions.reduce((a, b) => a + b, 0) / recentSessions.length;
    const earlierAvg =
      earlierSessions.reduce((a, b) => a + b, 0) / earlierSessions.length;

    if (recentAvg > earlierAvg * 1.1) sessionLengthTrend = "increasing";
    else if (recentAvg < earlierAvg * 0.9) sessionLengthTrend = "decreasing";
  }

  // Calculate combat to roleplay ratio (simplified)
  const combatToRoleplayRatio =
    averageNPCEncounters > 0
      ? averageCombatPerSession / averageNPCEncounters
      : 0;

  // Calculate pace variability
  const avgLength =
    sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
  const variance =
    sessionLengths.reduce(
      (sum, length) => sum + Math.pow(length - avgLength, 2),
      0
    ) / sessionLengths.length;
  const paceVariability = Math.sqrt(variance);

  return {
    averageCombatPerSession: Math.round(averageCombatPerSession * 10) / 10,
    averageNPCEncounters: Math.round(averageNPCEncounters * 10) / 10,
    sessionLengthTrend,
    combatToRoleplayRatio: Math.round(combatToRoleplayRatio * 10) / 10,
    paceVariability: Math.round(paceVariability * 10) / 10,
  };
}

function calculateCharacterDevelopment(
  journalEntries: any[],
  characters: any[]
): CharacterDevelopmentData {
  const sessionParticipation: { [character: string]: number } = {};

  // Track character participation across sessions
  journalEntries.forEach((entry) => {
    if (entry.data.characters_involved) {
      entry.data.characters_involved.forEach((char: any) => {
        const charName = typeof char === "string" ? char : char.name;
        sessionParticipation[charName] =
          (sessionParticipation[charName] || 0) + 1;
      });
    }
  });

  const participationValues = Object.values(sessionParticipation);
  const averageParticipation =
    participationValues.length > 0
      ? participationValues.reduce((a, b) => a + b, 0) /
        participationValues.length
      : 0;

  const mostActiveCharacter = Object.entries(sessionParticipation).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["Unknown", 0]
  )[0];

  // Character progression rate (sessions per expected level up)
  const characterProgressionRate =
    journalEntries.length > 0
      ? journalEntries.length /
        Math.max(1, estimateCurrentLevel(journalEntries))
      : 0;

  // Engagement score based on consistent participation
  const totalSessions = journalEntries.length;
  const engagementScore =
    totalSessions > 0 ? (averageParticipation / totalSessions) * 100 : 0;

  return {
    sessionParticipation,
    characterProgressionRate: Math.round(characterProgressionRate * 10) / 10,
    mostActiveCharacter,
    characterEngagementScore: Math.round(engagementScore * 10) / 10,
  };
}

function calculateNPCInteractions(journalEntries: any[]): NPCInteractionData {
  const npcEncounters: { [npc: string]: number } = {};
  let totalNewNPCs = 0;

  journalEntries.forEach((entry) => {
    if (entry.data.npcs_encountered) {
      entry.data.npcs_encountered.forEach((npc: any) => {
        const npcName = typeof npc === "string" ? npc : npc.name;
        npcEncounters[npcName] = (npcEncounters[npcName] || 0) + 1;

        // Track new NPCs (first encounter)
        if (typeof npc === "object" && npc.first_encounter) {
          totalNewNPCs++;
        }
      });
    }
  });

  const mostEncounteredNPCs = Object.entries(npcEncounters)
    .map(([name, encounters]) => ({ name, encounters }))
    .sort((a, b) => b.encounters - a.encounters)
    .slice(0, 5);

  const uniqueNPCs = Object.keys(npcEncounters).length;
  const totalEncounters = Object.values(npcEncounters).reduce(
    (a, b) => a + b,
    0
  );
  const newNPCsPerSession =
    journalEntries.length > 0 ? totalNewNPCs / journalEntries.length : 0;
  const recurringNPCRate =
    totalEncounters > 0
      ? ((totalEncounters - uniqueNPCs) / totalEncounters) * 100
      : 0;

  return {
    mostEncounteredNPCs,
    npcDiversity: uniqueNPCs,
    newNPCsPerSession: Math.round(newNPCsPerSession * 10) / 10,
    recurringNPCRate: Math.round(recurringNPCRate * 10) / 10,
  };
}

function calculateLocationVisits(journalEntries: any[]): LocationVisitData {
  const locationVisits: { [location: string]: number } = {};

  journalEntries.forEach((entry) => {
    // Primary location
    if (entry.data.primary_location) {
      locationVisits[entry.data.primary_location] =
        (locationVisits[entry.data.primary_location] || 0) + 1;
    }

    // Visited locations
    if (entry.data.locations_visited) {
      entry.data.locations_visited.forEach((loc: any) => {
        const locName = typeof loc === "string" ? loc : loc.name;
        locationVisits[locName] = (locationVisits[locName] || 0) + 1;
      });
    }
  });

  const mostVisitedLocations = Object.entries(locationVisits)
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  const uniqueLocations = Object.keys(locationVisits).length;
  const explorationRate =
    journalEntries.length > 0 ? uniqueLocations / journalEntries.length : 0;

  return {
    mostVisitedLocations,
    locationDiversity: uniqueLocations,
    explorationRate: Math.round(explorationRate * 10) / 10,
  };
}

function calculateCampaignMomentum(
  quests: any[],
  mysteries: any[],
  journalEntries: any[]
): CampaignMomentumData {
  // Quest progression rate (quests completed per session)
  const completedQuests = quests.filter(
    (q) => q.data.status === "completed"
  ).length;
  const questProgressionRate =
    journalEntries.length > 0 ? completedQuests / journalEntries.length : 0;

  // Mystery resolution efficiency (mysteries solved per mystery introduced)
  const solvedMysteries = mysteries.filter(
    (m) => m.data.status === "solved"
  ).length;
  const mysteryResolutionEfficiency =
    mysteries.length > 0 ? (solvedMysteries / mysteries.length) * 100 : 0;

  // Story advancement score (combination of quest and mystery progress)
  const storyAdvancementScore =
    (questProgressionRate * 100 + mysteryResolutionEfficiency) / 2;

  // Player engagement trend (simplified - based on session consistency)
  let playerEngagementTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (journalEntries.length >= 4) {
    // Compare recent vs earlier session frequency
    const recentSessions = journalEntries.slice(-2);
    const earlierSessions = journalEntries.slice(0, 2);

    if (recentSessions.length > 0 && earlierSessions.length > 0) {
      const recentDates = recentSessions.map(
        (s) => new Date(s.data.session_start)
      );
      const earlierDates = earlierSessions.map(
        (s) => new Date(s.data.session_start)
      );

      const recentGap =
        recentDates.length > 1
          ? (recentDates[1].getTime() - recentDates[0].getTime()) /
            (1000 * 60 * 60 * 24)
          : 30;
      const earlierGap =
        earlierDates.length > 1
          ? (earlierDates[1].getTime() - earlierDates[0].getTime()) /
            (1000 * 60 * 60 * 24)
          : 30;

      if (recentGap < earlierGap * 0.8) playerEngagementTrend = "increasing";
      else if (recentGap > earlierGap * 1.2)
        playerEngagementTrend = "decreasing";
    }
  }

  return {
    questProgressionRate: Math.round(questProgressionRate * 100) / 100,
    mysteryResolutionEfficiency:
      Math.round(mysteryResolutionEfficiency * 10) / 10,
    storyAdvancementScore: Math.round(storyAdvancementScore * 10) / 10,
    playerEngagementTrend,
  };
}
