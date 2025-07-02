import React from "react";
import type { AtlasLocation } from "@/types";

interface LocationsListProps {
  locations: AtlasLocation[];
  selectedLocationId: string | null;
  onLocationSelect: (location: AtlasLocation) => void;
}

export function LocationsList({
  locations,
  selectedLocationId,
  onLocationSelect,
}: LocationsListProps) {
  // Group locations by category
  const groupedLocations = locations.reduce((acc, location) => {
    const category = location.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(location);
    return acc;
  }, {} as Record<string, AtlasLocation[]>);

  // Sort each group
  Object.keys(groupedLocations).forEach((category) => {
    groupedLocations[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "continent":
        return "🌍";
      case "region":
        return "🏞️";
      case "settlement":
        return "🏘️";
      default:
        return "📍";
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "continent":
        return "Continents";
      case "region":
        return "Regions";
      case "settlement":
        return "Settlements";
      default:
        return "Other";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
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

  const getPopulationInfo = (location: AtlasLocation) => {
    const data = location.data;
    if (data.demographics?.population) {
      return data.demographics.population.toLocaleString();
    }
    if (data.political?.population) {
      return data.political.population.toLocaleString();
    }
    return null;
  };

  const getRulerInfo = (location: AtlasLocation) => {
    const data = location.data;
    return data.governance?.ruler || data.political?.ruler;
  };

  return (
    <div className="locations-list p-4">
      {Object.keys(groupedLocations).length === 0 ? (
        <div className="empty-state text-center py-8">
          <div className="text-4xl mb-4">🗺️</div>
          <div className="text-lg font-medium text-primary mb-2">
            No locations found
          </div>
          <div className="text-sm text-secondary">
            Try adjusting your search or filter criteria.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {["continent", "region", "settlement"].map((category) => {
            const categoryLocations = groupedLocations[category];
            if (!categoryLocations || categoryLocations.length === 0)
              return null;

            return (
              <div key={category} className="category-group">
                {/* Category Header */}
                <div className="category-header flex items-center gap-3 mb-4 pb-2 border-b border-primary">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <h3 className="text-lg font-bold text-primary">
                    {getCategoryTitle(category)}
                  </h3>
                  <span className="text-sm text-muted bg-surface-tertiary px-2 py-1 ml-auto">
                    {categoryLocations.length}
                  </span>
                </div>

                {/* Locations */}
                <div className="space-y-3">
                  {categoryLocations.map((location) => {
                    const isSelected = location.id === selectedLocationId;
                    const population = getPopulationInfo(location);
                    const ruler = getRulerInfo(location);

                    return (
                      <div
                        key={location.id}
                        onClick={() => onLocationSelect(location)}
                        className={`location-card p-4 border cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02] ${
                          isSelected
                            ? "border-hero-red bg-hero-red bg-opacity-10 shadow-lg"
                            : "border-primary bg-surface-elevated hover:border-accent-500 hover:bg-surface-tertiary"
                        }`}
                      >
                        {/* Location Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {getTypeIcon(location.type)}
                            </span>
                            <div>
                              <h4 className="font-bold text-primary text-lg leading-tight">
                                {location.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-accent-500 font-medium capitalize">
                                  {location.type.replace("-", " ")}
                                </span>
                                {location.data.aliases &&
                                  location.data.aliases.length > 0 && (
                                    <span className="text-xs text-muted">
                                      • {location.data.aliases[0]}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="text-hero-red">📍</div>
                          )}
                        </div>

                        {/* Location Info */}
                        <div className="space-y-2 mb-3">
                          {population && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted">👥</span>
                              <span className="text-secondary">
                                Population:{" "}
                                <span className="text-primary font-medium">
                                  {population}
                                </span>
                              </span>
                            </div>
                          )}

                          {ruler && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted">👑</span>
                              <span className="text-secondary">
                                Ruler:{" "}
                                <span className="text-primary font-medium">
                                  {ruler}
                                </span>
                              </span>
                            </div>
                          )}

                          {location.data.parent_region && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted">📍</span>
                              <span className="text-secondary">
                                Region:{" "}
                                <span className="text-primary font-medium capitalize">
                                  {location.data.parent_region.replace(
                                    "-",
                                    " "
                                  )}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Location Description */}
                        {location.description && (
                          <p className="text-sm text-secondary line-clamp-3 leading-relaxed">
                            {location.description.slice(0, 150)}
                            {location.description.length > 150 && "..."}
                          </p>
                        )}

                        {/* Location Tags */}
                        {location.data.tags &&
                          location.data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {location.data.tags
                                .slice(0, 3)
                                .map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="tag text-xs px-2 py-1 bg-accent-900 bg-opacity-20 text-accent-400 border border-accent-700"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              {location.data.tags.length > 3 && (
                                <span className="text-xs text-muted">
                                  +{location.data.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                        {/* Hover/Selection Indicator */}
                        <div
                          className={`absolute inset-x-0 bottom-0 h-1 transition-all duration-200 ${
                            isSelected
                              ? "bg-hero-red"
                              : "bg-transparent group-hover:bg-accent-500"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
