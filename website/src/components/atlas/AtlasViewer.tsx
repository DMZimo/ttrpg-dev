import React, { useState, useEffect, useRef } from "react";
import { MapViewer } from "./MapViewer.tsx";
import { LocationsList } from "./LocationsList.tsx";
import { MapSelector } from "./MapSelector.tsx";
import { SearchAndFilter } from "./SearchAndFilter.tsx";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"maps" | "locations" | "search">(
    "locations"
  );

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

  // Responsive sidebar control
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="atlas-viewer w-full flex relative bg-surface sharp-corners overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Sidebar */}
      <div
        className={`atlas-sidebar ${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden bg-surface-secondary border-r border-primary flex flex-col lg:relative absolute inset-y-0 left-0 z-20`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header p-4 pt-20 border-b border-primary bg-surface-elevated">
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
        {/* Map Controls */}
        <div className="map-controls p-4 bg-surface-secondary border-b border-primary flex items-center justify-between">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-icon w-10 h-10 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>

          {/* Current Map Info */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary">
                {currentMap.name}
              </h2>
              <p className="text-sm text-secondary">{currentMap.description}</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border border-primary overflow-hidden">
              <button
                onClick={() => mapViewerRef.current?.zoomIn()}
                className="btn-icon w-8 h-8 text-sm"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => mapViewerRef.current?.zoomOut()}
                className="btn-icon w-8 h-8 text-sm"
                title="Zoom Out"
              >
                −
              </button>
            </div>

            <button
              onClick={() => mapViewerRef.current?.resetView()}
              className="btn-secondary px-3 py-2 text-sm"
              title="Reset view"
            >
              🎯 Reset View
            </button>

            {/* Breadcrumb Navigation */}
            {currentMap.parentMap && (
              <button
                onClick={() => {
                  const parentMap = maps.find(
                    (m) => m.id === currentMap.parentMap
                  );
                  if (parentMap) handleMapChange(parentMap.id);
                }}
                className="btn-secondary px-3 py-2 text-sm"
                title="Go to parent map"
              >
                ↗️ {maps.find((m) => m.id === currentMap.parentMap)?.name}
              </button>
            )}
          </div>
        </div>

        {/* Map Viewer */}
        <div className="map-container flex-1 relative overflow-hidden">
          <MapViewer
            ref={mapViewerRef}
            map={currentMap}
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
