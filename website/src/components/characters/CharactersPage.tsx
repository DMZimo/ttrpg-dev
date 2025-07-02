import React, { useState, useMemo } from "react";
import CharacterCard from "./CharacterCard";
import CharacterFilters, {
  type CharacterFilters as CharacterFiltersType,
} from "./CharacterFilters";

interface Character {
  id: string;
  data: {
    // Character Metadata
    owner: string;
    is_public: boolean;
    publish_date_iso?: Date;
    last_updated_iso?: Date;
    tags?: string[];

    // Character Details
    type: "pc" | "sidekick" | "npc";
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
    portrait?: string;
    token?: string;
    color?: string;

    // Character Attributes
    name: string;
    race: string;
    subrace: string;
    background?: string;
    birthplace?: string;
    description?: string;
    birthdate?: Date;
    size?: string;
    languages?: Array<{
      name: string;
    }>;

    // Character Roles
    roles?: string[];

    // Character Stats
    ability_scores?: {
      str: number;
      dex: number;
      con: number;
      int: number;
      wis: number;
      cha: number;
    };

    // Derived stats
    proficiency_bonus?: number;
    saving_throws?: {
      str?: number;
      dex?: number;
      con?: number;
      int?: number;
      wis?: number;
      cha?: number;
    };

    // Classes and levels
    classes?: Array<{
      name: string;
      level: number;
      subclass?: string | null;
    }>;
    hp?: number;
    ac?: number;

    // Skills
    skills?: Array<{
      name: string;
      modifier: number;
    }>;
    other_skills?: Array<{
      name: string;
    }>;

    // Spellcasting
    spellcasting?: {
      ability: string;
      spell_attack_bonus: number;
      spell_save_dc: number;
    } | null;

    // Character Relationships
    organization?: {
      name: string;
      disposition: number;
    };
    enclave?: {
      name: string;
      disposition: number;
    };
    affiliations?: Array<{
      name: string;
      disposition: number;
    }> | null;
    cult?: {
      name: "Water" | "Earth" | "Air" | "Fire" | "Eye";
      disposition: number;
    } | null;
    allies?: string[] | null;
    enemies?: string[] | null;

    // Character motivations and traits
    personality_traits?: string[] | null;
    ideals?: string[] | null;
    bonds?: string[] | null;
    flaws?: string[] | null;

    // Legacy fields (keeping for backward compatibility)
    publishDate?: Date;
    lastUpdated?: Date;
    isPublic: boolean;
    class: Array<{
      name: string;
      level: number;
      subclass?: string;
    }>;
  };
}

interface CharactersPageProps {
  characters: Character[];
}

const CharactersPage: React.FC<CharactersPageProps> = ({ characters }) => {
  const [filters, setFilters] = useState<CharacterFiltersType>({
    search: "",
    type: "all",
    status: "all",
    location: "all",
    tags: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  const filteredCharacters = useMemo(() => {
    let filtered = [...characters];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (char) =>
          char.data.name.toLowerCase().includes(searchTerm) ||
          char.data.description?.toLowerCase().includes(searchTerm) ||
          char.data.background?.toLowerCase().includes(searchTerm) ||
          char.data.race.toLowerCase().includes(searchTerm) ||
          char.data.subrace?.toLowerCase().includes(searchTerm) ||
          char.data.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((char) => char.data.type === filters.type);
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((char) => char.data.status === filters.status);
    }

    // Apply location filter
    if (filters.location !== "all") {
      if (filters.location === "red-larch") {
        filtered = filtered.filter((char) =>
          char.data.tags?.includes("red-larch")
        );
      } else if (filters.location === "villain") {
        filtered = filtered.filter(
          (char) =>
            char.data.tags?.includes("villain") ||
            char.data.tags?.includes("antagonist")
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case "name":
          aValue = a.data.name.toLowerCase();
          bValue = b.data.name.toLowerCase();
          break;
        case "level":
          aValue = a.data.classes?.[0]?.level || a.data.class?.[0]?.level || 0;
          bValue = b.data.classes?.[0]?.level || b.data.class?.[0]?.level || 0;
          break;
        case "recent":
          aValue = new Date(a.data.lastUpdated || 0).getTime();
          bValue = new Date(b.data.lastUpdated || 0).getTime();
          break;
        case "type":
          aValue = a.data.type;
          bValue = b.data.type;
          break;
        default:
          aValue = a.data.name.toLowerCase();
          bValue = b.data.name.toLowerCase();
      }

      if (filters.sortOrder === "desc") {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return filtered;
  }, [characters, filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Persistent Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <CharacterFilters
                onFiltersChange={setFilters}
                totalCount={characters.length}
                filteredCount={filteredCharacters.length}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredCharacters.length > 0 ? (
                filteredCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    variant="default"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No characters found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters to see more characters.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CharactersPage;
