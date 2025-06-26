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

      // Character and NPC references (as objects with name and link)
      characters_involved: z
        .array(
          z.union([
            z.string(), // For backward compatibility
            z.object({
              name: z.string(),
              link: z.string().optional(),
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
            }),
          ])
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

export const collections = { journal };
