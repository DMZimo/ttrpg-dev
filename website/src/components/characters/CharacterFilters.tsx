import React, { useState } from "react";

interface CharacterFiltersProps {
  onFiltersChange: (filters: CharacterFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export interface CharacterFilters {
  search: string;
  type: "all" | "pc" | "npc" | "sidekick";
  status:
    | "all"
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
  location: "all" | "red-larch" | "villain" | "other";
  tags: string[];
  sortBy: "name" | "level" | "recent" | "type";
  sortOrder: "asc" | "desc";
}

const CharacterFilters: React.FC<CharacterFiltersProps> = ({
  onFiltersChange,
  totalCount,
  filteredCount,
}) => {
  const [filters, setFilters] = useState<CharacterFilters>({
    search: "",
    type: "all",
    status: "all",
    location: "all",
    tags: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<CharacterFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🔍 Character Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          {isExpanded ? "Hide Filters" : "Show All Filters"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search characters by name..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.type}
          onChange={(e) => updateFilters({ type: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Types</option>
          <option value="pc">Player Characters</option>
          <option value="npc">NPCs</option>
          <option value="sidekick">Sidekicks</option>
        </select>

        <select
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Locations</option>
          <option value="red-larch">Red Larch</option>
          <option value="villain">Villains</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="level">Sort by Level</option>
          <option value="recent">Recently Updated</option>
          <option value="type">Sort by Type</option>
        </select>

        <button
          onClick={() =>
            updateFilters({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                     hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  updateFilters({ status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="alive">Alive</option>
                <option value="injured">Injured</option>
                <option value="dead">Dead</option>
                <option value="missing">Missing</option>
                <option value="retired">Retired</option>
                <option value="absent">Absent</option>
                <option value="traveling">Traveling</option>
                <option value="captured">Captured</option>
                <option value="incapacitated">Incapacitated</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCount} of {totalCount} characters
      </div>
    </div>
  );
};

export default CharacterFilters;
