import React from "react";
import { Button } from "../ui/Button";
import { CHARACTER_SORT_OPTIONS } from "../../consts";
import type { CharacterFilters } from "../../types/characterTypes";

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
      {/* Combined Sort Control */}
      <Button
        onClick={() => {
          // Find current option index
          const currentIndex = CHARACTER_SORT_OPTIONS.findIndex(
            (option) => option.value === filters.sortBy
          );

          // Calculate the next state
          let nextIndex = currentIndex;
          let nextOrder = filters.sortOrder;

          // If we're at the end of the options with desc order,
          // move to the next option and reset to asc
          if (filters.sortOrder === "desc") {
            nextIndex = (currentIndex + 1) % CHARACTER_SORT_OPTIONS.length;
            nextOrder = "asc";
          } else {
            // Otherwise, keep the same option but change to desc
            nextOrder = "desc";
          }

          // Update filter with next sort option and order
          updateFilters({
            sortBy: CHARACTER_SORT_OPTIONS[nextIndex].value,
            sortOrder: nextOrder,
          });
        }}
        variant="primary"
        size="sm"
        className="flex-1 justify-between min-w-18 w-18 max-w-18"
        title={`Sort by ${
          CHARACTER_SORT_OPTIONS.find(
            (option) => option.value === filters.sortBy
          )?.label || filters.sortBy
        } (${filters.sortOrder === "asc" ? "Ascending" : "Descending"})`}
      >
        <span>
          {CHARACTER_SORT_OPTIONS.find(
            (option) => option.value === filters.sortBy
          )?.label ||
            filters.sortBy.charAt(0).toUpperCase() +
              filters.sortBy.slice(1)}{" "}
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </span>
      </Button>
      <div className="text-center text-sm text-gray-400 min-w-14 w-14 max-w-14">
        🔍
        <br />
        {filteredCount}/{totalCount}
      </div>
    </div>
  );
};

export default SearchSortControls;
