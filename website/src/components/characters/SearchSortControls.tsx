import React from "react";
import { Button } from "../ui/Button";
import { CHARACTER_SORT_OPTIONS } from "../../consts";
import type { CharacterFilters } from "../../types/characterFiltersTypes";

interface SearchSortControlsProps {
  filters: CharacterFilters;
  updateFilters: (newFilters: Partial<CharacterFilters>) => void;
  filteredCount: number;
  totalCount: number;
}

const SearchSortControls: React.FC<SearchSortControlsProps> = ({
  filters,
  updateFilters,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="px-2 py-3 flex gap-1 w-full bg-surface-secondary border-b-4 border-red-500 ">
      <input
        type="text"
        placeholder="Search characters..."
        value={filters.search}
        onChange={(e) => updateFilters({ search: e.target.value })}
        className="px-1 py-2 border border-gray-300 
                   bg-white text-gray-900"
        aria-label="Search characters"
      />
      {/* Sort Controls */}
      <Button
        onClick={() =>
          updateFilters({
            sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
          })
        }
        variant="primary"
        size="sm"
        className="w-8 max-w-8"
        title={filters.sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        {filters.sortOrder === "asc" ? "↑" : "↓"}
      </Button>

      <Button
        onClick={() => {
          // Find current option index
          const currentIndex = CHARACTER_SORT_OPTIONS.findIndex(
            (option) => option.value === filters.sortBy
          );
          // Get next option (cycle back to first if at end)
          const nextIndex = (currentIndex + 1) % CHARACTER_SORT_OPTIONS.length;

          // Update filter with next sort option
          updateFilters({
            sortBy: CHARACTER_SORT_OPTIONS[nextIndex].value,
          });
        }}
        variant="primary"
        size="sm"
        className="flex-1 justify-between min-w-14 w-14 max-w-14"
      >
        <span>
          {CHARACTER_SORT_OPTIONS.find(
            (option) => option.value === filters.sortBy
          )?.label ||
            filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)}
        </span>
      </Button>
      <div className="text-center text-sm text-gray-400">
        🔍
        <br />
        {filteredCount}/{totalCount}
      </div>
    </div>
  );
};

export default SearchSortControls;
