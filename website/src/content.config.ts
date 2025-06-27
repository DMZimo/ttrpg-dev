import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const journal = defineCollection({
  // Load Markdown and MDX files in the `src/content/journal/` directory.
  loader: glob({ base: "./src/content/journal", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      // Basic metadata
      title: z.string().optional(),
      description: z.string().optional(),

      // Aliases and CSS classes
      aliases: z.array(z.string()).optional(),
      cssclasses: z.array(z.string()).optional(),

      // Tags
      tags: z.array(z.string()).optional(),

      // Session-specific fields
      session_number: z.number().optional(),
      session_title: z.string().optional(),
      session_start: z.coerce.date().optional(),
      session_end: z.coerce.date().optional(),
      session_date: z.coerce.date().optional(),
      duration: z.coerce.date().optional(),
      session_length_hours: z.number().optional(),

      // Location and Setting
      primary_location: z.string().optional(),
      locations_visited: z.array(z.string()).optional(),
      weather: z.string().optional(),
      time_of_day: z.string().optional(),
      season: z.string().optional(),

      // Character and NPC references (as objects with name and link)
      characters_involved: z
        .array(
          z.union([
            z.string(), // For backward compatibility
            z.object({
              name: z.string(),
              link: z.string().optional(),
              status: z
                .enum(["active", "injured", "absent", "deceased"])
                .optional(),
            }),
          ])
        )
        .optional(),
      npcs_encountered: z
        .array(
          z.union([
            z.string(), // For backward compatibility
            z.object({
              name: z.string(),
              link: z.string().optional(),
              relationship: z
                .enum(["ally", "enemy", "neutral", "unknown"])
                .optional(),
              first_encounter: z.boolean().optional(),
            }),
          ])
        )
        .optional(),

      // Combat and Challenges
      combat_encounters: z
        .array(
          z.object({
            name: z.string(),
            difficulty: z
              .enum(["trivial", "easy", "medium", "hard", "deadly"])
              .optional(),
            outcome: z
              .enum(["victory", "defeat", "retreat", "negotiated"])
              .optional(),
          })
        )
        .optional(),
      skill_challenges: z
        .array(
          z.object({
            name: z.string(),
            difficulty: z.number().optional(),
            outcome: z.enum(["success", "failure", "partial"]).optional(),
          })
        )
        .optional(),

      // Story and Plot
      main_events: z.array(z.string()).optional(),
      plot_hooks_introduced: z.array(z.string()).optional(),
      plot_hooks_resolved: z.array(z.string()).optional(),
      mysteries_discovered: z.array(z.string()).optional(),
      clues_found: z.array(z.string()).optional(),

      // Items and Rewards
      loot_gained: z
        .array(
          z.object({
            item: z.string(),
            value: z.string().optional(),
            rarity: z
              .enum([
                "common",
                "uncommon",
                "rare",
                "very rare",
                "legendary",
                "artifact",
              ])
              .optional(),
          })
        )
        .optional(),
      magic_items_found: z.array(z.string()).optional(),
      currency_gained: z
        .object({
          copper: z.number().optional(),
          silver: z.number().optional(),
          gold: z.number().optional(),
          platinum: z.number().optional(),
        })
        .optional(),

      // Character Development
      experience_gained: z.number().optional(),
      level_ups: z.array(z.string()).optional(),
      new_abilities: z.array(z.string()).optional(),
      character_moments: z
        .array(
          z.object({
            character: z.string(),
            moment: z.string(),
            type: z
              .enum([
                "heroic",
                "tragic",
                "comedic",
                "dramatic",
                "character_development",
              ])
              .optional(),
          })
        )
        .optional(),

      // Session Quality and Notes
      dm_notes: z.string().optional(),
      player_feedback: z.array(z.string()).optional(),
      memorable_quotes: z
        .array(
          z.object({
            quote: z.string(),
            character: z.string(),
          })
        )
        .optional(),

      // Session navigation
      previous_session: z.string().optional(),
      next_session: z.string().optional(),

      // Standard content collection fields
      pubDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      cover_image: image().optional(),
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

export const collections = {
  journal,
  timekeeping,
};
