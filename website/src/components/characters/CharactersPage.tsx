import React, { useState, useMemo, useEffect } from "react";
import CharacterCard from "./CharacterCard";
import SearchSortControls from "./SearchSortControls";
import type {
  CharacterFilters as CharacterFiltersType,
  Character,
} from "../../types/characterTypes";
// Dynamic import for CharacterFilters to avoid type-only declaration issue
const CharacterFilters = React.lazy(() => import("./CharacterFilters"));

interface CharactersPageProps {
  characters: Character[];
}

const CharactersPage: React.FC<CharactersPageProps> = ({ characters }) => {
  // Extract all unique values for filter dropdowns
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    characters.forEach((char) => {
      if (char.data.tags) {
        char.data.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [characters]);

  const allRaces = useMemo(() => {
    const raceSet = new Set<string>();
    characters.forEach((char) => {
      if (char.data.race) {
        raceSet.add(char.data.race.toLowerCase());
      }
    });
    return Array.from(raceSet).sort();
  }, [characters]);

  const allClasses = useMemo(() => {
    const classSet = new Set<string>();
    characters.forEach((char) => {
      const classes = char.data.classes || char.data.class || [];
      classes.forEach((cls) => {
        if (cls.name) {
          classSet.add(cls.name.toLowerCase());
        }
      });
    });
    return Array.from(classSet).sort();
  }, [characters]);

  const allEnclaves = useMemo(() => {
    const enclaveSet = new Set<string>();
    characters.forEach((char) => {
      if (char.data.enclave?.name) {
        enclaveSet.add(char.data.enclave.name);
      }
    });
    return Array.from(enclaveSet).sort();
  }, [characters]);

  const allOrganizations = useMemo(() => {
    const orgSet = new Set<string>();
    characters.forEach((char) => {
      if (char.data.organization?.name) {
        orgSet.add(char.data.organization.name);
      }
    });
    return Array.from(orgSet).sort();
  }, [characters]);

  const [filters, setFilters] = useState<CharacterFiltersType>({
    search: "",
    type: "all",
    status: "all",
    location: "all",
    race: "all",
    enclave: "all",
    cult: "all",
    organization: "all",
    class: "all",
    role: "all",
    active: "all",
    tags: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  // Helper function to handle filter updates
  const handleFilterUpdate = (newFilters: Partial<CharacterFiltersType>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

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

    // Apply active filter
    if (filters.active !== "all") {
      filtered = filtered.filter((char) =>
        filters.active === "active" ? char.data.active : !char.data.active
      );
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

    // Apply race filter
    if (filters.race !== "all") {
      filtered = filtered.filter(
        (char) => char.data.race.toLowerCase() === filters.race
      );
    }

    // Apply class filter
    if (filters.class !== "all") {
      filtered = filtered.filter((char) => {
        const classes = char.data.classes || char.data.class || [];
        return classes.some((cls) => cls.name.toLowerCase() === filters.class);
      });
    }

    // Apply role filter
    if (filters.role !== "all") {
      filtered = filtered.filter((char) =>
        char.data.roles?.includes(filters.role)
      );
    }

    // Apply enclave filter
    if (filters.enclave !== "all") {
      filtered = filtered.filter(
        (char) => char.data.enclave?.name === filters.enclave
      );
    }

    // Apply organization filter
    if (filters.organization !== "all") {
      filtered = filtered.filter(
        (char) => char.data.organization?.name === filters.organization
      );
    }

    // Apply cult filter
    if (filters.cult !== "all") {
      filtered = filtered.filter((char) => {
        // Check if the character has a cult affiliation
        if (char.data.cult) {
          return char.data.cult.name === filters.cult;
        }

        // Also check for cult tags as a fallback
        if (char.data.tags) {
          const cultName = filters.cult.toLowerCase();
          return (
            char.data.tags.includes(`${cultName}-cult`) ||
            char.data.tags.includes(cultName)
          );
        }

        return false;
      });
    }

    // Apply tags filter (any tag)
    if (filters.tags.length > 0) {
      filtered = filtered.filter((char) => {
        if (!char.data.tags) return false;
        return filters.tags.some((tag) => char.data.tags?.includes(tag));
      });
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
          aValue = new Date(
            a.data.lastUpdated || a.data.last_updated_iso || 0
          ).getTime();
          bValue = new Date(
            b.data.lastUpdated || b.data.last_updated_iso || 0
          ).getTime();
          break;
        case "type":
          aValue = a.data.type;
          bValue = b.data.type;
          break;
        case "race":
          aValue = a.data.race.toLowerCase();
          bValue = b.data.race.toLowerCase();
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

  // Calculate viewport height for fixed height container
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // Set initial height
    setViewportHeight(window.innerHeight);

    // Update height on resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="flex flex-col bg-gray-50 dark:bg-gray-900"
      style={{
        height: `calc(${viewportHeight}px - 64px)`, // 64px accounts for header only, no footer
      }}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with filters - fixed width, scrollable */}
        <aside className="w-[340px] flex-shrink-0 flex flex-col border-r dark:border-gray-700">
          {/* Search and sort controls at the top */}
          <SearchSortControls
            filters={filters}
            updateFilters={handleFilterUpdate}
            totalCount={characters.length}
            filteredCount={filteredCharacters.length}
          />
          <div className="h-full overflow-y-auto flex-grow characters-sidebar">
            <CharacterFilters
              onFiltersChange={handleFilterUpdate}
              totalCount={characters.length}
              filteredCount={filteredCharacters.length}
              allTags={allTags}
              allClasses={allClasses}
              allRaces={allRaces}
              allEnclaves={allEnclaves}
              allOrganizations={allOrganizations}
              allCults={["Water", "Earth", "Air", "Fire", "Eye"]}
            />
          </div>
        </aside>

        {/* Main content area - flexible width, scrollable */}
        <main className="flex-1 pl-8 pr-2 overflow-y-auto flex flex-col characters-content">
          {/* Character Grid */}
          <div className="grid grid-cols-3 gap-7 pt-8 pb-6 flex-grow">
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
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters to see more characters.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      type: "all",
                      status: "all",
                      location: "all",
                      race: "all",
                      enclave: "all",
                      cult: "all",
                      organization: "all",
                      class: "all",
                      role: "all",
                      active: "all",
                      tags: [],
                      sortBy: "name",
                      sortOrder: "asc",
                    })
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CharactersPage;
