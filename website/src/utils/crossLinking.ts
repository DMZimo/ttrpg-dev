/**
 * Automatic cross-linking system for D&D campaign content
 * Automatically creates links between related content (NPCs, locations, quests, etc.)
 */

// Types for our linkable content
interface LinkableContent {
  id: string;
  name: string;
  type: "character" | "location" | "quest" | "mystery" | "rumor" | "session";
  url: string;
  aliases?: string[];
  tags?: string[];
}

// Cache for performance
let contentCache: LinkableContent[] | null = null;

/**
 * Build a comprehensive content index for cross-linking
 */
export async function buildContentIndex(): Promise<LinkableContent[]> {
  if (contentCache) return contentCache;

  const { getCollection } = await import("astro:content");
  const index: LinkableContent[] = [];

  try {
    // Index characters
    const characters = await getCollection("characters");
    characters.forEach((char) => {
      index.push({
        id: char.id,
        name: char.data.name,
        type: "character",
        url: `/characters/${char.id}`,
        aliases: [
          char.data.name,
          ...(char.data.tags || [])
            .filter((tag) => tag.includes("alias-"))
            .map((tag) => tag.replace("alias-", "")),
        ],
        tags: char.data.tags || [],
      });
    });

    // Index locations
    const continents = await getCollection("continents");
    const regions = await getCollection("regions");
    const settlements = await getCollection("settlements");

    [...continents, ...regions, ...settlements].forEach((location) => {
      index.push({
        id: location.id,
        name: location.data.name,
        type: "location",
        url: `/atlas/${location.id}`,
        aliases: [location.data.name],
        tags: location.data.tags || [],
      });
    });

    // Index quests
    const quests = await getCollection("quests");
    quests.forEach((quest) => {
      index.push({
        id: quest.id,
        name: quest.data.title,
        type: "quest",
        url: `/campaign/quests/${quest.id}`,
        aliases: [quest.data.title],
        tags: quest.data.tags || [],
      });
    });

    // Index mysteries
    const mysteries = await getCollection("mysteries");
    mysteries.forEach((mystery) => {
      index.push({
        id: mystery.id,
        name: mystery.data.title,
        type: "mystery",
        url: `/campaign/mysteries/${mystery.id}`,
        aliases: [mystery.data.title],
        tags: mystery.data.tags || [],
      });
    });

    // Index rumors
    const rumors = await getCollection("rumors");
    rumors.forEach((rumor) => {
      index.push({
        id: rumor.id,
        name: rumor.data.title,
        type: "rumor",
        url: `/campaign/rumors/${rumor.id}`,
        aliases: [rumor.data.title],
        tags: rumor.data.tags || [],
      });
    });

    // Index journal sessions
    const journal = await getCollection("journal");
    journal.forEach((session) => {
      const sessionTitle =
        session.data.session_title || `Session ${session.data.session_number}`;
      index.push({
        id: session.id,
        name: sessionTitle,
        type: "session",
        url: `/journal/${session.id}`,
        aliases: [
          sessionTitle,
          `Session ${session.data.session_number}`,
          `S${session.data.session_number}`,
        ],
        tags: session.data.tags || [],
      });
    });

    contentCache = index;
    return index;
  } catch (error) {
    console.error("Error building content index:", error);
    return [];
  }
}

/**
 * Create automatic links in text content
 */
export function autoLinkContent(
  text: string,
  contentIndex: LinkableContent[],
  currentPageId?: string
): string {
  if (!text || !contentIndex.length) return text;

  let processedText = text;

  // Sort by name length (longest first) to avoid partial matches
  const sortedContent = [...contentIndex].sort(
    (a, b) => b.name.length - a.name.length
  );

  sortedContent.forEach((item) => {
    // Skip linking to current page
    if (currentPageId && item.id === currentPageId) return;

    // Create patterns for matching
    const patterns = [item.name, ...(item.aliases || [])];

    patterns.forEach((pattern) => {
      if (!pattern || pattern.length < 3) return; // Skip very short names

      // Create regex pattern that matches the name but not if it's already inside a link
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(
        `(?<!<a[^>]*>.*?)\\b(${escapedPattern})\\b(?![^<]*</a>)`,
        "gi"
      );

      // Replace with link, but only if not already linked
      processedText = processedText.replace(regex, (match, p1) => {
        // Check if this text is already inside a link
        const beforeMatch = processedText.substring(
          0,
          processedText.indexOf(match)
        );
        const openTags = (beforeMatch.match(/<a[^>]*>/g) || []).length;
        const closeTags = (beforeMatch.match(/<\/a>/g) || []).length;

        if (openTags > closeTags) {
          return match; // Already inside a link
        }

        return `<a href="${item.url}" class="auto-link auto-link--${item.type}" title="${item.name}" data-link-type="${item.type}">${p1}</a>`;
      });
    });
  });

  return processedText;
}

/**
 * Extract related content based on text analysis
 */
export function findRelatedContent(
  text: string,
  contentIndex: LinkableContent[],
  currentPageId?: string,
  limit: number = 10
): LinkableContent[] {
  if (!text || !contentIndex.length) return [];

  const related: Map<string, { item: LinkableContent; score: number }> =
    new Map();
  const textLower = text.toLowerCase();

  contentIndex.forEach((item) => {
    if (currentPageId && item.id === currentPageId) return;

    let score = 0;

    // Check for exact name matches
    if (textLower.includes(item.name.toLowerCase())) {
      score += 10;
    }

    // Check for alias matches
    item.aliases?.forEach((alias) => {
      if (textLower.includes(alias.toLowerCase())) {
        score += 8;
      }
    });

    // Check for tag matches
    item.tags?.forEach((tag) => {
      if (textLower.includes(tag.toLowerCase())) {
        score += 3;
      }
    });

    // Check for partial word matches
    const words = item.name.toLowerCase().split(" ");
    words.forEach((word) => {
      if (word.length > 3 && textLower.includes(word)) {
        score += 2;
      }
    });

    if (score > 0) {
      related.set(item.id, { item, score });
    }
  });

  return Array.from(related.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * Generate backlinks - find content that links to the current page
 */
export async function findBacklinks(
  targetId: string,
  targetName: string,
  contentType: string
): Promise<LinkableContent[]> {
  const { getCollection } = await import("astro:content");
  const backlinks: LinkableContent[] = [];

  try {
    // Check journal entries
    const journal = await getCollection("journal");
    journal.forEach((entry) => {
      const entryData = entry.data as any; // Type assertion for flexibility
      const content = [
        entry.body || "",
        entryData.session_title || "",
        ...(entryData.main_events || []),
        ...(entryData.characters_involved?.map((char: any) => char.name) || []),
        ...(entryData.npcs_encountered?.map((npc: any) =>
          typeof npc === "string" ? npc : npc.name
        ) || []),
        ...(entryData.locations_visited?.map((loc: any) =>
          typeof loc === "string" ? loc : loc.name
        ) || []),
      ]
        .join(" ")
        .toLowerCase();

      if (content.includes(targetName.toLowerCase())) {
        const sessionTitle =
          entryData.session_title || `Session ${entryData.session_number}`;
        backlinks.push({
          id: entry.id,
          name: sessionTitle,
          type: "session",
          url: `/journal/${entry.id}`,
          aliases: [sessionTitle],
        });
      }
    });

    // Check characters
    if (contentType !== "character") {
      const characters = await getCollection("characters");
      characters.forEach((char) => {
        const content = [
          char.body || "",
          char.data.description || "",
          ...(char.data.allies || []),
          ...(char.data.enemies || []),
          ...(char.data.personality_traits || []),
          ...(char.data.ideals || []),
          ...(char.data.bonds || []),
          ...(char.data.flaws || []),
        ]
          .join(" ")
          .toLowerCase();

        if (content.includes(targetName.toLowerCase())) {
          backlinks.push({
            id: char.id,
            name: char.data.name,
            type: "character",
            url: `/characters/${char.id}`,
            aliases: [char.data.name],
          });
        }
      });
    }

    // Check quests
    if (contentType !== "quest") {
      const quests = await getCollection("quests");
      quests.forEach((quest) => {
        const content = [
          quest.body || "",
          quest.data.description || "",
          ...(quest.data.related_characters || []),
          ...(quest.data.related_locations || []),
        ]
          .join(" ")
          .toLowerCase();

        if (content.includes(targetName.toLowerCase())) {
          backlinks.push({
            id: quest.id,
            name: quest.data.title,
            type: "quest",
            url: `/campaign/quests/${quest.id}`,
            aliases: [quest.data.title],
          });
        }
      });
    }
  } catch (error) {
    console.error("Error finding backlinks:", error);
  }

  return backlinks;
}

/**
 * Generate breadcrumb navigation
 */
export function generateBreadcrumbs(
  currentPath: string,
  currentTitle: string
): Array<{ name: string; url: string }> {
  const breadcrumbs = [{ name: "Home", url: "/" }];

  const pathParts = currentPath.split("/").filter(Boolean);

  if (pathParts.length > 0) {
    const section = pathParts[0];

    switch (section) {
      case "characters":
        breadcrumbs.push({ name: "Characters", url: "/characters" });
        if (pathParts.length > 1) {
          breadcrumbs.push({ name: currentTitle, url: currentPath });
        }
        break;
      case "journal":
        breadcrumbs.push({ name: "Journal", url: "/journal" });
        if (pathParts.length > 1) {
          breadcrumbs.push({ name: currentTitle, url: currentPath });
        }
        break;
      case "atlas":
        breadcrumbs.push({ name: "Atlas", url: "/atlas" });
        if (pathParts.length > 1) {
          breadcrumbs.push({ name: currentTitle, url: currentPath });
        }
        break;
      case "campaign":
        breadcrumbs.push({ name: "Campaign", url: "/campaign" });
        if (pathParts.length > 1) {
          const subsection = pathParts[1];
          switch (subsection) {
            case "quests":
              breadcrumbs.push({ name: "Quests", url: "/campaign/quests" });
              break;
            case "mysteries":
              breadcrumbs.push({
                name: "Mysteries",
                url: "/campaign/mysteries",
              });
              break;
            case "rumors":
              breadcrumbs.push({ name: "Rumors", url: "/campaign/rumors" });
              break;
          }
          if (pathParts.length > 2) {
            breadcrumbs.push({ name: currentTitle, url: currentPath });
          }
        }
        break;
      default:
        breadcrumbs.push({ name: currentTitle, url: currentPath });
    }
  }

  return breadcrumbs;
}

/**
 * CSS classes for auto-linked content styling
 */
export const autoLinkStyles = `
  .auto-link {
    @apply text-accent-600 hover:text-accent-700 underline decoration-dotted transition-colors;
  }
  
  .auto-link--character {
    @apply text-blue-600 hover:text-blue-700;
  }
  
  .auto-link--location {
    @apply text-green-600 hover:text-green-700;
  }
  
  .auto-link--quest {
    @apply text-yellow-600 hover:text-yellow-700;
  }
  
  .auto-link--mystery {
    @apply text-purple-600 hover:text-purple-700;
  }
  
  .auto-link--rumor {
    @apply text-orange-600 hover:text-orange-700;
  }
  
  .auto-link--session {
    @apply text-indigo-600 hover:text-indigo-700;
  }
`;

export default {
  buildContentIndex,
  autoLinkContent,
  findRelatedContent,
  findBacklinks,
  generateBreadcrumbs,
  autoLinkStyles,
};
