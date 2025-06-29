import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

//  Journal collection for campaign sessions.
const journal = defineCollection({
  // Load Markdown and MDX files in the `src/content/journal/` directory.
  loader: glob({ base: "./src/content/journal", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      session_number: z.number(),
      session_title: z.string(),
      cover_image: image().optional(),
      previous_session: z.string().optional(),
      next_session: z.string().optional(),
      is_public: z.boolean().default(false),
      publish_date_iso: z.coerce.date(),
      last_updated_iso: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      session_start: z.coerce.date(),
      session_end: z.coerce.date(),
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
      npcs_encountered: z
        .array(
          z.object({
            name: z.string(),
            link: z.string().optional(),
            first_encounter: z.boolean().optional(),
          })
        )
        .optional(),
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
    hp: z.number(),
    ac: z.number(),
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

// Holidays collection for special days and festivals
const holidays = defineCollection({
  loader: glob({
    base: "./src/content/timekeeping/holidays",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).optional(),
    type: z
      .enum(["holiday", "seasonal", "astronomical", "religious"])
      .default("holiday"),
    observance: z.enum(["major", "minor", "local"]).optional(),
    date: z.union([
      z.object({
        specialDay: z.enum([
          "midwinter",
          "greengrass",
          "midsummer",
          "shieldmeet",
          "highharvestide",
          "feast-of-the-moon",
        ]),
      }),
      z.object({
        month: z.number().min(1).max(12),
        day: z.number().min(1).max(30),
      }),
    ]),
    duration: z.number().default(1),
    recurring: z.boolean().default(true),
    description: z.string(),
    culturalSignificance: z.string().optional(),
    origins: z.string().optional(),
    traditions: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
    mechanicalEffects: z.array(z.string()).optional(),
    associatedDeities: z.array(z.string()).optional(),
    rituals: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Months collection for calendar months
const months = defineCollection({
  loader: glob({
    base: "./src/content/timekeeping/months",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    name: z.string(),
    pronunciation: z.object({
      common: z.string(),
      ipa: z.string(),
    }),
    elvish_name: z.string(),
    elvish_pronunciation: z.string(),
    alias: z.string(),
    Description: z.string(),
    month_number: z.number().min(1).max(12),
    season: z.enum(["spring", "summer", "autumn", "winter"]),
    tags: z.array(z.string()),
    activities: z.array(
      z.union([
        z.string(),
        z.object({
          social_activities: z
            .object({
              indoor_crafts: z.boolean().optional(),
              storytelling: z.boolean().optional(),
              outdoor_work: z.boolean().optional(),
              community_projects: z.boolean().optional(),
              outdoor_festivals: z.boolean().optional(),
              trading_activities: z.boolean().optional(),
              outdoor_celebrations: z.boolean().optional(),
              romantic_activities: z.boolean().optional(),
              market_activities: z.boolean().optional(),
              summer_festivals: z.boolean().optional(),
              outdoor_markets: z.boolean().optional(),
              harvest_festivals: z.boolean().optional(),
              community_feasts: z.boolean().optional(),
              harvest_celebrations: z.boolean().optional(),
              preparation_activities: z.boolean().optional(),
              indoor_preparation: z.boolean().optional(),
              community_gathering: z.boolean().optional(),
              indoor_activities: z.boolean().optional(),
              solemn_observances: z.boolean().optional(),
              indoor_celebrations: z.boolean().optional(),
              religious_observances: z.array(z.string()).optional(),
            })
            .optional(),
        }),
      ])
    ),
    agriculture: z.object({
      growing_season: z.boolean(),
      harvest_activities: z.array(z.string()),
      planting_activities: z.array(z.string()),
    }),
    economy: z.object({
      trade_conditions: z.enum(["poor", "fair", "good", "excellent"]),
      typical_prices: z
        .object({
          food_modifier: z.number(),
          fuel_modifier: z.number(),
          travel_modifier: z.number(),
        })
        .optional(),
    }),
    cultural_significance: z.object({
      themes: z.array(z.string()),
      common_sayings: z.array(z.string()).optional(),
    }),
    weather: z.array(
      z.union([
        z.object({
          description: z.string(),
        }),
        z.object({
          temperature: z.string(),
        }),
        z.object({
          precipitation: z.string(),
        }),
        z.object({
          schema: z.array(
            z.union([
              z.object({
                temperature_range_celsius: z.object({
                  min: z.number(),
                  max: z.number(),
                }),
              }),
              z.object({
                precipitation_chance_percent: z.object({
                  min: z.number(),
                  max: z.number(),
                }),
              }),
              z.object({
                storm_chance_percent: z.object({
                  min: z.number(),
                  max: z.number(),
                }),
              }),
              z.object({
                wind_speed_kph: z.object({
                  min: z.number(),
                  max: z.number(),
                }),
              }),
            ])
          ),
        }),
        z.object({
          events: z.array(
            z.object({
              name: z.string(),
              probability: z.number(),
              mechanics: z.array(z.string()).optional(),
            })
          ),
        }),
        z.object({
          regional_variations: z.array(
            z.object({
              region: z.string(),
              temperature_modifier: z.number().optional(),
              precipitation_modifier: z.number().optional(),
              storm_modifier: z.number().optional(),
            })
          ),
        }),
        z.object({
          daylight: z.object({
            sunrise_hour: z.number(),
            sunset_hour: z.number().optional(),
            daylight_hours: z.number(),
            long_night_effects: z.boolean(),
          }),
        }),
      ])
    ),
    travel: z.object({
      difficulty: z.enum(["easy", "moderate", "hard", "extreme"]),
      speed_modifier: z.number(),
      random_encounter_modifier: z.number(),
    }),
    adventure_hooks: z.array(z.string()),
  }),
});

// Seasons collection for seasonal information
const seasons = defineCollection({
  loader: glob({
    base: "./src/content/timekeeping/seasons",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    name: z.string(),
    type: z.literal("season"),
    months: z.array(z.string()).length(3),
    description: z.string(),
    characteristics: z.object({
      weather: z.string(),
      daylight: z.string(),
      activity: z.string(),
    }),
    tags: z.array(z.string()),
  }),
});

// Celestial bodies collection for astronomical objects
const celestial = defineCollection({
  loader: glob({
    base: "./src/content/atlas/celestial",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    // === IDENTITY ===
    name: z.string(),
    type: z.enum(["star", "planet", "moon", "asteroid-cluster"]),
    subtype: z.enum([
      "primary-star",
      "terrestrial-planet",
      "gas-giant",
      "natural-satellite",
      "inhabited-cluster",
      "uninhabited-cluster",
    ]),
    aliases: z.array(z.string()).optional(),

    // === CLASSIFICATION ===
    spelljammer: z.object({
      size: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]),
      shape: z.enum(["spherical", "cluster", "irregular"]).optional(),
      body: z.enum(["fire", "earth", "air", "water"]).optional(),
      code: z.string().optional(),
    }),

    // === PHYSICAL ===
    physical: z.object({
      diameter_miles: z.number().positive(),
      mass_earth: z.number().positive().optional(),
      gravity_earth: z.number().positive().optional(),
      atmosphere: z.enum([
        "none",
        "breathable",
        "toxic",
        "magical",
        "variable",
      ]),
      temperature: z.enum(["molten", "hot", "temperate", "cold", "variable"]),
      composition: z.string(),
    }),

    // === ORBITAL ===
    orbital: z.object({
      primary: z.string().nullable(), // Reference to primary body or null for stars
      distance_miles: z.number().nonnegative().optional(),
      period_days: z.number().positive().optional(),
      rotation_hours: z.number().positive().nullable().optional(),
      axial_tilt: z.number().min(0).max(180).optional(),
      eccentricity: z.number().min(0).max(1).nullable().optional(),
    }),

    // === RELATIONSHIPS ===
    satellites: z.array(z.string()).optional(),
    companions: z.array(z.string()).optional(),
    children: z.array(z.string()).optional(),

    // === VISIBILITY ===
    visibility: z.object({
      magnitude: z.number().nullable().optional(),
      color: z.string().optional(),
      phases: z.boolean().optional(),
      naked_eye: z.boolean().optional(),
    }),

    // === CYCLES ===
    cycles: z.object({
      primary: z.number().positive().optional(),
      phases: z.number().positive().nullable().optional(),
      seasons: z.boolean().optional(),
    }),

    // === CULTURAL ===
    cultural: z.object({
      deities: z.array(z.string()).optional(),
      mythology: z.string().optional(),
      significance: z.string().optional(),
      calendar_use: z.string().optional(),
    }),

    // === INHABITANTS ===
    inhabited: z.boolean(),
    inhabitants: z.array(z.string()).optional(),
    settlements: z
      .array(
        z.object({
          name: z.string(),
          type: z.string().optional(),
          population: z
            .enum(["Unknown", "Small", "Medium", "Large"])
            .optional(),
        })
      )
      .optional(),

    // === SPECIAL ===
    special: z.object({
      magical_effects: z.array(z.string()).optional(),
      portals: z.array(z.string()).optional(),
      unique_features: z.array(z.string()).optional(),
      dangers: z.array(z.string()).optional(),
    }),

    // === GAME ===
    game: z.object({
      mechanical_effects: z.array(z.string()).optional(),
      spellcasting_mods: z.string().optional(),
      navigation_bonus: z.string().optional(),
    }),

    // === META ===
    tags: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    updated: z.string().optional(),
  }),
});

// Timeline events collection for campaign events
const events = defineCollection({
  loader: glob({
    base: "./src/content/timekeeping/events",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    type: z.literal("timeline-event"),
    title: z.string(),
    description: z.string(),
    sessionNumber: z.number().optional(),
    eventDate: z.coerce.date(),
    experienceGained: z.number().optional(),
    relatedCharacters: z.array(z.string()).optional(),
    relatedLocations: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Calendar systems collection for different calendar implementations
const calendarSystems = defineCollection({
  loader: glob({
    base: "./src/content/timekeeping/calendar-systems",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    type: z.literal("calendar-system"),
    yearLength: z.number(),
    monthsPerYear: z.number(),
    daysPerMonth: z.number(),
    hoursPerDay: z.number(),
    creator: z.string().optional(),
    adoption: z.string().optional(),
    regions: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  journal,
  characters,
  holidays,
  months,
  seasons,
  celestial,
  events,
  calendarSystems,
};
