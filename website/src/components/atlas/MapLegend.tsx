import React from "react";
import type { AtlasMap, AtlasLocation } from "@/types";

interface MapLegendProps {
  currentMap: AtlasMap;
  locations: AtlasLocation[];
  className?: string;
}

export function MapLegend({
  currentMap,
  locations,
  className = "",
}: MapLegendProps) {
  // Get unique location types on this map
  const locationTypes = locations.reduce((acc, location) => {
    const key = `${location.category}-${location.type}`;
    if (!acc[key]) {
      acc[key] = {
        category: location.category,
        type: location.type,
        count: 0,
      };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { category: string; type: string; count: number }>);

  const getLocationColor = (category: string, type: string) => {
    if (category === "continent") return "#d97706"; // gold-600
    if (category === "region") return "#7c3aed"; // accent-600

    switch (type) {
      case "city":
        return "#dc2626"; // hero-red
      case "town":
        return "#ea580c"; // orange-600
      case "village":
      case "hamlet":
        return "#ca8a04"; // yellow-600
      default:
        return "#dc2626"; // default hero-red
    }
  };

  const getLocationIcon = (category: string, type: string) => {
    if (category === "continent") return "🌍";
    if (category === "region") return "🏞️";

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
      default:
        return "📍";
    }
  };

  const formatTypeName = (category: string, type: string) => {
    if (category === "continent") return "Continents";
    if (category === "region") {
      switch (type) {
        case "valley":
          return "Valleys";
        case "forest":
          return "Forests";
        case "kingdom":
          return "Kingdoms";
        default:
          return "Regions";
      }
    }

    switch (type) {
      case "metropolis":
        return "Metropolises";
      case "city":
        return "Cities";
      case "town":
        return "Towns";
      case "village":
        return "Villages";
      case "hamlet":
        return "Hamlets";
      case "outpost":
        return "Outposts";
      case "fort":
        return "Forts";
      case "ruin":
        return "Ruins";
      default:
        return "Settlements";
    }
  };

  const sortedTypes = Object.values(locationTypes).sort((a, b) => {
    // Sort by category first (continent, region, settlement), then by count
    const categoryOrder = { continent: 0, region: 1, settlement: 2 };
    const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] ?? 3;
    const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] ?? 3;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.count - a.count;
  });

  if (sortedTypes.length === 0) {
    return null;
  }

  return (
    <div
      className={`map-legend bg-surface-elevated border border-primary p-3 space-y-2 pointer-events-none shadow-lg ${className}`}
    >
      <div className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
        <span>🗺️</span>
        <span>{currentMap.name}</span>
      </div>

      <div className="text-xs text-muted mb-2">Scale: {currentMap.scale}</div>

      <div className="space-y-1">
        {sortedTypes.map(({ category, type, count }) => (
          <div
            key={`${category}-${type}`}
            className="flex items-center gap-2 text-xs text-secondary"
          >
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px]"
              style={{
                backgroundColor: getLocationColor(category, type),
                borderColor:
                  category === "continent"
                    ? "#fbbf24"
                    : category === "region"
                    ? "#a855f7"
                    : "#f87171",
              }}
            >
              {getLocationIcon(category, type)}
            </div>
            <span className="flex-1">{formatTypeName(category, type)}</span>
            <span className="text-muted">({count})</span>
          </div>
        ))}
      </div>

      {locations.length > 0 && (
        <div className="pt-2 border-t border-primary text-xs text-muted">
          Total: {locations.length} location{locations.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
