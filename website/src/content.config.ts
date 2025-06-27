import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const journal = defineCollection({
  // Load Markdown and MDX files in the `src/content/journal/` directory.
  loader: glob({ base: "./src/content/journal", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      // Basic metadata
      session_number: z.number(),
      session_title: z.string(),
      cover_image: image().optional(),
      previous_session: z.string().optional(),
      next_session: z.string().optional(),
      is_public: z.boolean().default(false),
      publish_date_iso: z.coerce.date(),
      last_updated_iso: z.coerce.date(),
      tags: z.array(z.string()).optional(),

      // Session timing
      session_start: z.coerce.date(),
      session_end: z.coerce.date(),

      // In-game Geospatial tracking
      ingame_start: z.coerce.date(),
      ingame_end: z.coerce.date(),
      primary_location: z.string().optional(),
      locations_visited: z
        .array(
          z.object({
            name: z.string(),
            link: z.string().optional(),
          })
        )
        .optional(),

      // Social tracking
      npcs_encountered: z
        .array(
          z.object({
            name: z.string(),
            link: z.string().optional(),
            first_encounter: z.boolean().optional(),
          })
        )
        .optional(),

      // Combat and Challenges
      combat_encounters: z
        .array(
          z.object({
            name: z.string(),
            weather: z.array(z.string()).optional(),
            terrain: z.array(z.string()).optional(),
            date: z.coerce.date().optional(),
            rounds: z.number().optional(),
            outcome: z
              .enum(["victory", "defeat", "retreat", "negotiated"])
              .optional(),
            enemies: z
              .array(
                z.object({
                  name: z.string(),
                  type: z.string().optional(),
                  equipment: z.array(z.string()).optional(),
                  count: z.number().optional(),
                  difficulty: z.number().optional(),
                  experience: z.number().optional(),
                })
              )
              .optional(),
          })
        )
        .optional(),

      // Characters Progression
      characters_involved: z
        .array(
          z.object({
            name: z.string(),
            link: z.string(),
            status: z.enum(["alive", "injured", "dead"]),
            rewards: z
              .array(
                z.union([
                  z.object({
                    experience: z.number(),
                  }),
                  z.object({
                    loot: z.array(
                      z.object({
                        name: z.string(),
                        rarity: z
                          .enum([
                            "common",
                            "uncommon",
                            "rare",
                            "very rare",
                            "legendary",
                            "artifact",
                            "unidentified",
                          ])
                          .optional(),
                        quantity: z.number().optional(),
                        value: z.number().optional(),
                        coin: z
                          .enum(["copper", "silver", "gold", "platinum"])
                          .optional(),
                      })
                    ),
                  }),
                  z.object({
                    currency: z.object({
                      copper: z.number().optional(),
                      silver: z.number().optional(),
                      gold: z.number().optional(),
                      platinum: z.number().optional(),
                    }),
                  }),
                ])
              )
              .optional(),
          })
        )
        .optional(),

      // Group Rewards
      group_rewards: z
        .array(
          z.union([
            z.object({
              loot: z.array(
                z.object({
                  name: z.string(),
                  rarity: z
                    .enum([
                      "common",
                      "uncommon",
                      "rare",
                      "very rare",
                      "legendary",
                      "artifact",
                      "unidentified",
                    ])
                    .optional(),
                  quantity: z.number().optional(),
                  value: z.number().optional(),
                  coin: z
                    .enum(["copper", "silver", "gold", "platinum"])
                    .optional(),
                })
              ),
            }),
            z.object({
              currency: z.object({
                copper: z.number().optional(),
                silver: z.number().optional(),
                gold: z.number().optional(),
                platinum: z.number().optional(),
              }),
            }),
          ])
        )
        .optional(),

      // Character Development
      level_ups: z
        .array(
          z.object({
            character: z.string(),
            new_level: z.number(),
          })
        )
        .optional(),
    }),
});

// Unified timekeeping collection - all calendar-related content
const timekeeping = defineCollection({
  loader: glob({ base: "./src/content/timekeeping", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    // Basic metadata
    title: z.string().optional(),
    name: z.string().optional(), // For holidays, months, etc.
    description: z.string().optional(),
    type: z.enum([
      "calendar-system",
      "time-period",
      "historical-era",
      "dating-system",
      "holiday",
      "month",
      "celestial-body",
      "season",
      "moon",
      "celestial",
      "seasonal",
    ]),

    // Month-specific fields
    commonName: z.string().optional(),
    monthNumber: z.number().min(1).max(12).optional(),
    season: z.enum(["winter", "spring", "summer", "autumn"]).optional(),
    days: z.number().default(30).optional(),

    // Holiday-specific fields
    date: z
      .union([
        z.string(), // For legacy string dates like "21st of Eleint"
        z.object({
          month: z.number().optional(), // 1-12 for regular dates
          day: z.number().optional(), // 1-30 for regular dates
          specialDay: z.string().optional(), // for inter-month festivals
        }),
      ])
      .optional(),
    observance: z.enum(["major", "minor", "regional", "local"]).optional(),
    duration: z.number().default(1).optional(), // days
    isRecurring: z.boolean().default(true).optional(),
    leapYearOnly: z.boolean().default(false).optional(),

    // Celestial body fields
    celestialType: z
      .enum(["moon", "planet", "star", "constellation", "comet"])
      .optional(),
    appearance: z.string().optional(),
    cycle: z
      .object({
        period: z.number(), // in days
        phases: z.array(z.string()).optional(),
      })
      .optional(),

    // Seasonal characteristics
    weather: z
      .object({
        typical: z.string().optional(),
        temperature: z.string().optional(),
        precipitation: z.string().optional(),
        storms: z.string().optional(),
        winds: z.string().optional(),
      })
      .optional(),

    // Cultural context
    significance: z.string().optional(),
    origins: z.string().optional(),
    traditions: z.array(z.string()).optional(),
    activities: z.array(z.string()).optional(),
    festivals: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
    cultures: z.array(z.string()).optional(),
    deities: z.array(z.string()).optional(),

    // Agricultural/economic
    crops: z.array(z.string()).optional(),
    trade: z.string().optional(),

    // Celestial events
    celestialEvents: z.array(z.string()).optional(),

    // Historical significance
    historicalEvents: z
      .array(
        z.object({
          year: z.number(),
          event: z.string(),
        })
      )
      .optional(),

    // Game mechanics
    mechanicalEffects: z.array(z.string()).optional(),
    seasonalEffects: z.array(z.string()).optional(),
    weatherEffects: z.string().optional(),
    survivalChallenges: z.array(z.string()).optional(),
    spellcastingEffects: z.string().optional(),

    // Calendar system details
    yearLength: z.number().optional(), // in days
    monthsPerYear: z.number().optional(),
    daysPerMonth: z.number().optional(),
    weekLength: z.number().optional(),
    hoursPerDay: z.number().optional(),
    timekeepingMethods: z.array(z.string()).optional(),

    // System relationships
    creator: z.string().optional(),
    adoption: z.string().optional(),
    predecessors: z.array(z.string()).optional(),
    successors: z.array(z.string()).optional(),
    contemporaries: z.array(z.string()).optional(),

    // Related content
    relatedHolidays: z.array(z.string()).optional(),
    relatedContent: z.array(z.string()).optional(),

    // Metadata
    tags: z.array(z.string()).optional(),
    aliases: z.array(z.string()).optional(),
  }),
});

// Characters collection of all player and non-player characters used in the campaign.
// Character types:
// - Player Character (PC): Main characters controlled by players.
// - Sidekick: Same as characters, but used by guests or as secondary characters/role fillers.
// - Non-Player Character (NPC): Characters controlled by the DM, including allies, enemies, and neutral characters.
const characters = defineCollection({
  loader: glob({ base: "./src/content/characters", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    // Basic character info
    name: z.string(),
    race: z.string(),
    class: z.string(),
    level: z.number().default(1),
    description: z.string().optional(),

    // Stats and health
    hp: z.object({
      current: z.number(),
      max: z.number(),
    }),
    ac: z.number(),
    status: z
      .enum(["healthy", "injured", "unconscious", "absent"])
      .default("healthy"),

    // Character appearance and styling
    gradient: z.string().optional(),
    roles: z
      .array(
        z.object({
          name: z.string(),
          style: z.string(),
        })
      )
      .optional(),

    // Metadata
    tags: z.array(z.string()).optional(),
    aliases: z.array(z.string()).optional(),
    isPlayerCharacter: z.boolean().default(true),
    active: z.boolean().default(true),
  }),
});

// Party collection for quests, mysteries, rumors, etc.
const campaign = defineCollection({
  loader: glob({ base: "./src/content/campaign", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    // Content type
    type: z.enum(["quest", "mystery", "rumor", "timeline-event"]),

    // Basic info
    title: z.string(),
    description: z.string().optional(),
    status: z
      .enum(["active", "completed", "failed", "abandoned", "paused"])
      .default("active"),

    // Quest-specific fields
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    difficulty: z
      .enum(["trivial", "easy", "medium", "hard", "deadly"])
      .optional(),
    progress: z.number().min(0).max(100).default(0),
    questGiver: z.string().optional(),
    location: z.string().optional(),
    reward: z.string().optional(),

    // Mystery-specific fields
    cluesFound: z.array(z.string()).optional(),
    totalClues: z.number().optional(),

    // Timeline event fields
    sessionNumber: z.number().optional(),
    eventDate: z.coerce.date().optional(),
    experienceGained: z.number().optional(),

    // General fields
    tags: z.array(z.string()).optional(),
    relatedCharacters: z.array(z.string()).optional(),
    relatedLocations: z.array(z.string()).optional(),

    // Metadata
    startDate: z.coerce.date().optional(),
    completedDate: z.coerce.date().optional(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

export const collections = {
  journal,
  timekeeping,
  characters,
  campaign,
};
