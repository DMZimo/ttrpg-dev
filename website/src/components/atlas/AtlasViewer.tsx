import React, { useState, useEffect, useRef } from "react";
import { MapContainer } from "./MapContainer.tsx";
import { LocationsList } from "./LocationsList.tsx";
import { MapSelector } from "./MapSelector.tsx";
import { SearchAndFilter } from "./SearchAndFilter.tsx";
import { ReadingPanel } from "./ReadingPanel.tsx";
import type { AtlasMap, AtlasLocation, MapViewerRef } from "@/types";

interface AtlasViewerProps {
  maps: AtlasMap[];
  locations: AtlasLocation[];
  defaultMapId: string;
}

export default function AtlasViewer({
  maps,
  locations,
  defaultMapId,
}: AtlasViewerProps) {
  // State management
  const [currentMapId, setCurrentMapId] = useState(defaultMapId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [sidebarTab, setSidebarTab] = useState<"maps" | "locations" | "search">(
    "locations"
  );
  const [readingPanelLocation, setReadingPanelLocation] = useState<AtlasLocation | null>(null);
  const [readingPanelMap, setReadingPanelMap] = useState<AtlasMap | null>(null);
  const [isReadingPanelVisible, setIsReadingPanelVisible] = useState(false);

  // References
  const mapViewerRef = useRef<MapViewerRef>(null);

  // Get current map
  const currentMap = maps.find((map) => map.id === currentMapId) || maps[0];

  // Filter locations based on current map, search, and filters
  const filteredLocations = locations.filter((location) => {
    // Map filter
    const isOnCurrentMap =
      location.mapId === currentMapId ||
      (currentMap.type === "continent" && location.category !== "settlement") ||
      (currentMap.type === "region" && location.category !== "continent");

    // Search filter
    const matchesSearch =
      !searchQuery ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (location.description &&
        location.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Type filter
    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(location.category) ||
      selectedFilters.includes(location.type);

    return isOnCurrentMap && matchesSearch && matchesFilter;
  });

  // Handle location selection
  const handleLocationSelect = (location: AtlasLocation) => {
    setSelectedLocationId(location.id);

    // Switch to appropriate map if needed
    if (location.mapId !== currentMapId) {
      setCurrentMapId(location.mapId);
    }

    // Focus the location on the map
    setTimeout(() => {
      mapViewerRef.current?.focusLocation(location);
    }, 100);
  };

  // Handle location click from map (opens reading panel)
  const handleLocationClick = (location: AtlasLocation, relatedMap?: AtlasMap | null) => {
    setReadingPanelLocation(location);
    setReadingPanelMap(relatedMap || null);
    setIsReadingPanelVisible(true);
    setSelectedLocationId(location.id);

    // Switch to appropriate map if needed
    if (location.mapId !== currentMapId) {
      setCurrentMapId(location.mapId);
    }

    // Focus the location on the map
    setTimeout(() => {
      mapViewerRef.current?.focusLocation(location);
    }, 100);
  };

  // Handle reading panel close
  const handleReadingPanelClose = () => {
    setIsReadingPanelVisible(false);
    setReadingPanelLocation(null);
    setReadingPanelMap(null);
  };

  // Handle map change from reading panel
  const handleReadingPanelMapChange = (mapId: string) => {
    setCurrentMapId(mapId);
    setSelectedLocationId(null);
  };

  // Handle map change
  const handleMapChange = (mapId: string) => {
    setCurrentMapId(mapId);
    setSelectedLocationId(null);
  };

  // Get unique filter options
  const filterOptions = {
    categories: [...new Set(locations.map((l) => l.category))],
    types: [...new Set(locations.map((l) => l.type))],
  };

  return (
    <div
      className="atlas-viewer w-full pt-18 flex relative bg-surface sharp-corners overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Sidebar */}
      <div className="atlas-sidebar w-80 bg-surface-secondary border-r border-primary flex flex-col">
        {/* Sidebar Header */}
        <div className="sidebar-header p-4 border-b border-primary bg-surface-elevated">
          {/* Tab Navigation */}
          <div className="flex border border-primary overflow-hidden">
            <button
              onClick={() => setSidebarTab("maps")}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                sidebarTab === "maps"
                  ? "bg-hero-red text-white"
                  : "bg-surface hover:bg-surface-tertiary text-secondary"
              }`}
            >
              🗺️ Maps
            </button>
            <button
              onClick={() => setSidebarTab("locations")}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                sidebarTab === "locations"
                  ? "bg-hero-red text-white"
                  : "bg-surface hover:bg-surface-tertiary text-secondary"
              }`}
            >
              🏰 Locations
            </button>
            <button
              onClick={() => setSidebarTab("search")}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                sidebarTab === "search"
                  ? "bg-hero-red text-white"
                  : "bg-surface hover:bg-surface-tertiary text-secondary"
              }`}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content flex-1 overflow-y-auto">
          {sidebarTab === "maps" && (
            <MapSelector
              maps={maps}
              currentMapId={currentMapId}
              onMapChange={handleMapChange}
            />
          )}

          {sidebarTab === "locations" && (
            <LocationsList
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              onLocationSelect={handleLocationSelect}
              onLocationInfo={handleLocationClick}
            />
          )}

          {sidebarTab === "search" && (
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilters={selectedFilters}
              onFiltersChange={setSelectedFilters}
              filterOptions={filterOptions}
              resultCount={filteredLocations.length}
            />
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer p-4 border-t border-primary bg-surface-elevated">
          <div className="text-xs text-muted space-y-1">
            <div>Current Map: {currentMap.name}</div>
            <div>
              Showing: {filteredLocations.length} of {locations.length}{" "}
              locations
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="atlas-main flex-1 flex flex-col relative">
        {/* Map Viewer */}
        <div className="map-container flex-1 relative overflow-hidden">
          <MapContainer
            ref={mapViewerRef}
            map={currentMap}
            maps={maps}
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={handleLocationSelect}
            onLocationClick={handleLocationClick}
            onMapChange={handleMapChange}
          />
        </div>
      </div>

      {/* Reading Panel */}
      <ReadingPanel
        location={readingPanelLocation}
        relatedMap={readingPanelMap}
        onClose={handleReadingPanelClose}
        onMapChange={handleReadingPanelMapChange}
        isVisible={isReadingPanelVisible}
      />
    </div>
  );
}
