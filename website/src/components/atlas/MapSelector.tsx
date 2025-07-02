import React from "react";
import type { AtlasMap } from "@/types";

interface MapSelectorProps {
  maps: AtlasMap[];
  currentMapId: string;
  onMapChange: (mapId: string) => void;
}

export function MapSelector({
  maps,
  currentMapId,
  onMapChange,
}: MapSelectorProps) {
  // Group maps by scale for better organization
  const groupedMaps = maps.reduce((acc, map) => {
    const scale = map.scale;
    if (!acc[scale]) {
      acc[scale] = [];
    }
    acc[scale].push(map);
    return acc;
  }, {} as Record<string, AtlasMap[]>);

  // Order scales from largest to smallest
  const scaleOrder = ["continental", "regional", "local", "detailed"];

  const getScaleIcon = (scale: string) => {
    switch (scale) {
      case "continental":
        return "🌍";
      case "regional":
        return "🗺️";
      case "local":
        return "📍";
      case "detailed":
        return "🔍";
      default:
        return "🗺️";
    }
  };

  const getScaleTitle = (scale: string) => {
    switch (scale) {
      case "continental":
        return "Continental";
      case "regional":
        return "Regional";
      case "local":
        return "Local Area";
      case "detailed":
        return "Detailed";
      default:
        return "Maps";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "continent":
        return "🌍";
      case "region":
        return "🏞️";
      case "area":
        return "📍";
      case "settlement":
        return "🏘️";
      default:
        return "🗺️";
    }
  };

  // Build navigation hierarchy
  const getMapHierarchy = (map: AtlasMap): AtlasMap[] => {
    const hierarchy: AtlasMap[] = [];
    let currentMap = map;

    while (currentMap) {
      hierarchy.unshift(currentMap);
      if (currentMap.parentMap) {
        const parent = maps.find((m) => m.id === currentMap.parentMap);
        currentMap = parent!;
      } else {
        break;
      }
    }

    return hierarchy;
  };

  const currentMap = maps.find((m) => m.id === currentMapId);
  const hierarchy = currentMap ? getMapHierarchy(currentMap) : [];

  return (
    <div className="map-selector p-4">
      {/* Current Map Hierarchy */}
      {hierarchy.length > 1 && (
        <div className="current-hierarchy mb-6">
          <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
            Current Location
          </h3>
          <div className="hierarchy-path bg-surface-elevated border border-primary p-3">
            {hierarchy.map((map, index) => (
              <div key={map.id} className="flex items-center">
                {index > 0 && <div className="text-muted mx-2">→</div>}
                <button
                  onClick={() => onMapChange(map.id)}
                  className={`text-left transition-colors ${
                    map.id === currentMapId
                      ? "text-hero-red font-bold"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  <span className="mr-2">{getTypeIcon(map.type)}</span>
                  {map.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Maps */}
      <div className="available-maps space-y-6">
        {scaleOrder.map((scale) => {
          const scaleMaps = groupedMaps[scale];
          if (!scaleMaps || scaleMaps.length === 0) return null;

          return (
            <div key={scale} className="scale-group">
              {/* Scale Header */}
              <div className="scale-header flex items-center gap-3 mb-4 pb-2 border-b border-primary">
                <span className="text-lg">{getScaleIcon(scale)}</span>
                <h3 className="text-lg font-bold text-primary">
                  {getScaleTitle(scale)}
                </h3>
                <span className="text-sm text-muted bg-surface-tertiary px-2 py-1 ml-auto">
                  {scaleMaps.length}
                </span>
              </div>

              {/* Maps in this scale */}
              <div className="grid gap-3">
                {scaleMaps.map((map) => {
                  const isSelected = map.id === currentMapId;
                  const hasChildren = maps.some((m) => m.parentMap === map.id);

                  return (
                    <div
                      key={map.id}
                      onClick={() => onMapChange(map.id)}
                      className={`map-card cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.02] ${
                        isSelected
                          ? "border-hero-red bg-hero-red bg-opacity-10 shadow-lg"
                          : "border-primary bg-surface-elevated hover:border-accent-500 hover:bg-surface-tertiary"
                      }`}
                    >
                      {/* Map Preview */}
                      <div className="map-preview relative overflow-hidden h-32 border-b border-primary">
                        <img
                          src={map.image.src}
                          alt={map.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-hero-red bg-opacity-20 flex items-center justify-center">
                            <div className="text-white text-2xl">📍</div>
                          </div>
                        )}

                        {/* Map Type Badge */}
                        <div className="absolute top-2 left-2 bg-surface-elevated border border-primary px-2 py-1 text-xs font-medium text-primary">
                          <span className="mr-1">{getTypeIcon(map.type)}</span>
                          {map.type.replace("-", " ")}
                        </div>
                      </div>

                      {/* Map Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-primary text-lg leading-tight">
                            {map.name}
                          </h4>
                          {isSelected && (
                            <div className="text-hero-red ml-2">✓</div>
                          )}
                        </div>

                        <p className="text-sm text-secondary mb-3 line-clamp-2">
                          {map.description}
                        </p>

                        {/* Map Metadata */}
                        <div className="space-y-1 text-xs text-muted">
                          <div className="flex justify-between">
                            <span>Scale:</span>
                            <span className="capitalize">{map.scale}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="capitalize">
                              {map.type.replace("-", " ")}
                            </span>
                          </div>
                          {map.parentMap && (
                            <div className="flex justify-between">
                              <span>Parent:</span>
                              <span className="capitalize">
                                {maps.find((m) => m.id === map.parentMap)
                                  ?.name || "Unknown"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Child Maps Indicator */}
                        {hasChildren && (
                          <div className="mt-3 pt-3 border-t border-primary">
                            <div className="text-xs text-accent-500 font-medium">
                              🔍 Contains detailed maps
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation */}
      {maps.length > 4 && (
        <div className="quick-nav mt-6 pt-6 border-t border-primary">
          <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {maps.slice(0, 4).map((map) => (
              <button
                key={map.id}
                onClick={() => onMapChange(map.id)}
                className={`quick-nav-btn p-2 text-left text-sm border transition-colors ${
                  map.id === currentMapId
                    ? "border-hero-red bg-hero-red bg-opacity-10 text-hero-red"
                    : "border-primary text-secondary hover:border-accent-500 hover:text-primary"
                }`}
              >
                <span className="mr-2">{getTypeIcon(map.type)}</span>
                {map.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
