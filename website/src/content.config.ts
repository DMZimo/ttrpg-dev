import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

//  Journal collection for campaign sessions.
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

// Characters collection of all player and non-player characters used in the campaign.
// Character types:
// - Player Character (pc): Main characters controlled by players.
// - Sidekick (sidekick): Same as characters, but used by guests or as secondary characters/role fillers.
// - Non-Player Character (npc): Characters controlled by the DM, including allies, enemies, and neutral characters.
const characters = defineCollection({
  loader: glob({ base: "./src/content/characters", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    owner: z.string().default("DM"),
    isPublic: z.boolean().default(false),
    publishDate: z.coerce.date().optional(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),

    // Basic character info
    name: z.string(),
    race: z.string(),
    subrace: z.string(),
    background: z.string().optional(),
    class: z
      .array(
        z.object({
          name: z.string(),
          level: z.number().min(1).max(20).default(1),
          subclass: z.string().optional(),
        })
      )
      .default([]),
    type: z.enum(["pc", "sidekick", "npc"]).default("pc"),

    description: z.string().optional(),
    birthdate: z.coerce.date().optional(),
    birthplace: z.string().optional(),
    status: z
      .enum([
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
      ])
      .default("alive"),

    // Stats and health
    hp: z.number(),
    ac: z.number(),

    // Character appearance and styling
    gradient: z.string().optional(),
    roles: z
      .array(
        z.object({
          name: z.string(),
        })
      )
      .optional(),
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
  characters,
  campaign,
};
