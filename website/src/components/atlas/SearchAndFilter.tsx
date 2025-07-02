import React from "react";
import type { FilterOptions } from "@/types";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
  filterOptions: FilterOptions;
  resultCount: number;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedFilters,
  onFiltersChange,
  filterOptions,
  resultCount,
}: SearchAndFilterProps) {
  const handleFilterToggle = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      onFiltersChange(selectedFilters.filter((f) => f !== filter));
    } else {
      onFiltersChange([...selectedFilters, filter]);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
    onSearchChange("");
  };

  const getFilterIcon = (filter: string) => {
    // Category icons
    switch (filter) {
      case "continent":
        return "🌍";
      case "region":
        return "🏞️";
      case "settlement":
        return "🏘️";
      // Settlement type icons
      case "metropolis":
      case "city":
        return "🏰";
      case "town":
        return "🏘️";
      case "village":
      case "hamlet":
        return "🏠";
      case "outpost":
      case "fort":
        return "⛪";
      case "ruin":
        return "🏛️";
      // Region type icons
      case "kingdom":
      case "duchy":
        return "👑";
      case "valley":
        return "🏔️";
      case "forest":
        return "🌲";
      case "mountain-range":
        return "⛰️";
      case "desert":
        return "🏜️";
      case "sea":
        return "🌊";
      default:
        return "📍";
    }
  };

  const formatFilterName = (filter: string) => {
    return filter
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="search-and-filter p-4">
      {/* Search Bar */}
      <div className="search-section mb-6">
        <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
          Search Locations
        </h3>

        <div className="search-input-container relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full px-4 py-3 pl-10 bg-surface border border-primary text-primary placeholder-muted focus:border-hero-red focus:ring-1 focus:ring-hero-red transition-colors"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">
            🔍
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary mb-6 p-3 bg-surface-elevated border border-primary">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary">
            <span className="font-medium text-primary">{resultCount}</span>{" "}
            locations found
          </div>
          {(selectedFilters.length > 0 || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-hero-red hover:text-hero-red-light transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {selectedFilters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-primary">
            <div className="text-xs text-muted mb-2">Active filters:</div>
            <div className="flex flex-wrap gap-1">
              {selectedFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-hero-red bg-opacity-20 text-hero-red border border-hero-red text-xs"
                >
                  <span>{getFilterIcon(filter)}</span>
                  {formatFilterName(filter)}
                  <button
                    onClick={() => handleFilterToggle(filter)}
                    className="ml-1 hover:text-hero-red-light"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Categories */}
      <div className="filter-sections space-y-6">
        {/* Location Categories */}
        <div className="filter-section">
          <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
            Categories
          </h3>
          <div className="space-y-2">
            {filterOptions.categories.map((category) => {
              const isSelected = selectedFilters.includes(category);

              return (
                <label
                  key={category}
                  className="filter-option flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-surface-tertiary border border-transparent hover:border-primary"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleFilterToggle(category)}
                    className="w-4 h-4 text-hero-red bg-surface border-primary focus:ring-hero-red focus:ring-1"
                  />
                  <span className="text-lg">{getFilterIcon(category)}</span>
                  <div className="flex-1">
                    <span
                      className={`font-medium ${
                        isSelected ? "text-hero-red" : "text-primary"
                      }`}
                    >
                      {formatFilterName(category)}
                    </span>
                    <div className="text-xs text-muted">
                      {
                        filterOptions.categories.filter((c) => c === category)
                          .length
                      }{" "}
                      available
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Location Types */}
        {filterOptions.types.length > 0 && (
          <div className="filter-section">
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
              Types
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {filterOptions.types.map((type) => {
                const isSelected = selectedFilters.includes(type);

                return (
                  <label
                    key={type}
                    className="filter-option flex items-center gap-3 p-2 cursor-pointer transition-colors hover:bg-surface-tertiary border border-transparent hover:border-primary"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleFilterToggle(type)}
                      className="w-4 h-4 text-hero-red bg-surface border-primary focus:ring-hero-red focus:ring-1"
                    />
                    <span className="text-sm">{getFilterIcon(type)}</span>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-hero-red" : "text-secondary"
                      }`}
                    >
                      {formatFilterName(type)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {!searchQuery && selectedFilters.length === 0 && (
        <div className="search-tips mt-6 p-3 bg-surface-elevated border border-primary">
          <h4 className="text-sm font-medium text-primary mb-2">Search Tips</h4>
          <ul className="text-xs text-secondary space-y-1">
            <li>• Use the search bar to find locations by name</li>
            <li>• Filter by category (continent, region, settlement)</li>
            <li>• Filter by specific types (city, town, village, etc.)</li>
            <li>• Combine search and filters for precise results</li>
            <li>• Click on any location to view it on the map</li>
          </ul>
        </div>
      )}

      {/* No Results Message */}
      {resultCount === 0 && (searchQuery || selectedFilters.length > 0) && (
        <div className="no-results mt-6 p-4 bg-surface-elevated border border-primary text-center">
          <div className="text-2xl mb-2">🗺️</div>
          <div className="text-sm font-medium text-primary mb-1">
            No locations found
          </div>
          <div className="text-xs text-secondary mb-3">
            Try adjusting your search terms or filters
          </div>
          <button
            onClick={clearAllFilters}
            className="btn-secondary px-3 py-1 text-xs"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
