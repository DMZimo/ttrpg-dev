import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { AtlasMap, AtlasLocation, MapViewerRef } from "@/types";
import { MapLegend } from "./MapLegend";

interface MapContainerProps {
  map: AtlasMap;
  maps: AtlasMap[];
  locations: AtlasLocation[];
  selectedLocationId: string | null;
  onLocationSelect: (location: AtlasLocation) => void;
  onMapChange: (mapId: string) => void;
  onLocationClick?: (
    location: AtlasLocation,
    relatedMap?: AtlasMap | null
  ) => void;
}

export const MapContainer = forwardRef<MapViewerRef, MapContainerProps>(
  (
    {
      map,
      maps,
      locations,
      selectedLocationId,
      onLocationSelect,
      onMapChange,
      onLocationClick,
    },
    ref
  ) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(
      null
    );

    // Create source ID for the current map
    const mapSourceId = `map-${map.id}`;

    // Convert map bounds to MapLibre format
    const mapBounds = useMemo(() => {
      return [
        [map.bounds.west, map.bounds.south], // Southwest corner
        [map.bounds.east, map.bounds.north], // Northeast corner
      ] as [[number, number], [number, number]];
    }, [map.bounds]);

    // Initialize MapLibre map
    useEffect(() => {
      if (!mapContainer.current) return;

      const maplibreMap = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {},
          layers: [],
          // Use local font files - we'll set this up in the public directory
          glyphs: "/fonts/{fontstack}/{range}.pbf",
        },
        center: [
          (map.bounds.west + map.bounds.east) / 2,
          (map.bounds.south + map.bounds.north) / 2,
        ],
        zoom: 1,
        maxZoom: 20,
        minZoom: 0.5,
        attributionControl: false,
      });

      mapInstance.current = maplibreMap;

      // Wait for map to load
      maplibreMap.on("load", () => {
        setMapLoaded(true);
      });

      // Handle location clicks
      maplibreMap.on("click", "locations-layer", (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const locationId = feature.properties?.id;
          const location = locations.find((l) => l.id === locationId);
          if (location) {
            // Check if there's a related map for this location
            const relatedMap = maps.find(
              (m) =>
                m.id === `${location.id}-map` ||
                m.name.toLowerCase().includes(location.name.toLowerCase()) ||
                (location.category === "continent" &&
                  m.type === "continent" &&
                  m.name.includes(location.name)) ||
                (location.category === "region" &&
                  m.type === "region" &&
                  m.name.includes(location.name))
            );

            // Call the location click handler if provided, otherwise use the regular select
            if (onLocationClick) {
              onLocationClick(location, relatedMap);
            } else {
              onLocationSelect(location);
            }
          }
        }
      });

      // Add hover tooltips for locations
      maplibreMap.on("mouseenter", "locations-layer", (e) => {
        maplibreMap.getCanvas().style.cursor = "pointer";
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const locationId = feature.properties?.id;
          const location = locations.find((l) => l.id === locationId);
          setHoveredLocationId(locationId);

          if (location) {
            // Create custom popup content
            const popupContent = `
              <div class="map-tooltip">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-lg">${getTypeIcon(
                    location.type,
                    location.category
                  )}</span>
                  <div>
                    <h3 class="font-bold text-primary">${location.name}</h3>
                    <p class="text-xs text-secondary">${location.type} • ${
              location.category
            }</p>
                  </div>
                </div>
                ${
                  location.description
                    ? `<p class="text-sm text-secondary mb-2">${location.description.slice(
                        0,
                        100
                      )}${location.description.length > 100 ? "..." : ""}</p>`
                    : ""
                }
                ${
                  location.data.demographics?.population
                    ? `<p class="text-xs text-muted">👥 Population: ${location.data.demographics.population.toLocaleString()}</p>`
                    : ""
                }
                ${
                  location.data.governance?.ruler ||
                  location.data.political?.ruler
                    ? `<p class="text-xs text-muted">👑 Ruler: ${
                        location.data.governance?.ruler ||
                        location.data.political?.ruler
                      }</p>`
                    : ""
                }
                <p class="text-xs text-accent-500 mt-2">Click for more information</p>
              </div>
            `;

            // Create and show popup
            const popup = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: 15,
              className: "map-location-popup",
            })
              .setLngLat([location.coordinates.lng, location.coordinates.lat])
              .setHTML(popupContent)
              .addTo(maplibreMap);

            // Store popup reference for cleanup
            (maplibreMap as any).__locationPopup = popup;
          }
        }
      });

      // Handle mouse leave on locations
      maplibreMap.on("mouseleave", "locations-layer", () => {
        maplibreMap.getCanvas().style.cursor = "";
        setHoveredLocationId(null);

        // Remove popup if it exists
        if ((maplibreMap as any).__locationPopup) {
          (maplibreMap as any).__locationPopup.remove();
          (maplibreMap as any).__locationPopup = null;
        }
      });

      return () => {
        maplibreMap.remove();
        mapInstance.current = null;
        setMapLoaded(false);
      };
    }, []);

    // Update map image when map changes
    useEffect(() => {
      if (!mapInstance.current || !mapLoaded) return;

      const maplibreMap = mapInstance.current;

      // Remove all existing map layers and sources (clean slate approach)
      const style = maplibreMap.getStyle();
      if (style && style.layers) {
        style.layers.forEach((layer) => {
          if (layer.id.includes("map-") && layer.id.includes("-layer")) {
            try {
              maplibreMap.removeLayer(layer.id);
            } catch (e) {
              // Layer might not exist, continue
            }
          }
        });
      }

      if (style && style.sources) {
        Object.keys(style.sources).forEach((sourceId) => {
          if (sourceId.includes("map-")) {
            try {
              maplibreMap.removeSource(sourceId);
            } catch (e) {
              // Source might not exist, continue
            }
          }
        });
      }

      // Add new map image source
      maplibreMap.addSource(mapSourceId, {
        type: "image",
        url: map.image.src,
        coordinates: [
          [map.bounds.west, map.bounds.north], // top-left
          [map.bounds.east, map.bounds.north], // top-right
          [map.bounds.east, map.bounds.south], // bottom-right
          [map.bounds.west, map.bounds.south], // bottom-left
        ],
      });

      // Add map image layer
      maplibreMap.addLayer({
        id: `${mapSourceId}-layer`,
        type: "raster",
        source: mapSourceId,
        paint: {
          "raster-opacity": 1,
        },
      });

      // Fit map to bounds with proper animation
      maplibreMap.fitBounds(mapBounds, {
        padding: 20,
        animate: true,
        duration: 1000,
      });
    }, [map.id, mapLoaded, mapSourceId, mapBounds, map.image.src]);

    // Update locations layer
    useEffect(() => {
      if (!mapInstance.current || !mapLoaded) return;

      const maplibreMap = mapInstance.current;

      // Remove existing locations layers and source
      const layersToRemove = ["locations-layer", "locations-labels"];
      layersToRemove.forEach((layerId) => {
        if (maplibreMap.getLayer(layerId)) {
          maplibreMap.removeLayer(layerId);
        }
      });

      if (maplibreMap.getSource("locations")) {
        maplibreMap.removeSource("locations");
      }

      if (locations.length === 0) return;

      // Create GeoJSON from locations
      const locationsGeoJSON = {
        type: "FeatureCollection" as const,
        features: locations.map((location) => ({
          type: "Feature" as const,
          properties: {
            id: location.id,
            name: location.name,
            category: location.category,
            type: location.type,
            description: location.description || "",
          },
          geometry: {
            type: "Point" as const,
            coordinates: [location.coordinates.lng, location.coordinates.lat],
          },
        })),
      };

      // Add locations source
      maplibreMap.addSource("locations", {
        type: "geojson",
        data: locationsGeoJSON,
      });

      // Add locations layer (circles with improved styling)
      maplibreMap.addLayer({
        id: "locations-layer",
        type: "circle",
        source: "locations",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              8,
              ["==", ["get", "id"], hoveredLocationId || ""],
              7,
              [
                "case",
                ["==", ["get", "category"], "continent"],
                6,
                ["==", ["get", "category"], "region"],
                5,
                4,
              ],
            ],
            10,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              20,
              ["==", ["get", "id"], hoveredLocationId || ""],
              16,
              [
                "case",
                ["==", ["get", "category"], "continent"],
                14,
                ["==", ["get", "category"], "region"],
                12,
                10,
              ],
            ],
            20,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              28,
              ["==", ["get", "id"], hoveredLocationId || ""],
              24,
              [
                "case",
                ["==", ["get", "category"], "continent"],
                20,
                ["==", ["get", "category"], "region"],
                16,
                14,
              ],
            ],
          ],
          "circle-color": [
            "case",
            ["==", ["get", "id"], selectedLocationId || ""],
            "#ffffff",
            ["==", ["get", "category"], "continent"],
            "#d97706", // gold-600
            ["==", ["get", "category"], "region"],
            "#7c3aed", // accent-600
            ["==", ["get", "type"], "metropolis"],
            "#7c2d12", // red-900
            ["==", ["get", "type"], "city"],
            "#dc2626", // hero-red
            ["==", ["get", "type"], "town"],
            "#ea580c", // orange-600
            ["==", ["get", "type"], "village"],
            "#ca8a04", // yellow-600
            ["==", ["get", "type"], "hamlet"],
            "#a3a3a3", // neutral-400
            ["==", ["get", "type"], "outpost"],
            "#059669", // emerald-600
            ["==", ["get", "type"], "fort"],
            "#7c3aed", // violet-600
            ["==", ["get", "type"], "ruin"],
            "#6b7280", // gray-500
            "#dc2626", // default hero-red
          ],
          "circle-stroke-color": [
            "case",
            ["==", ["get", "id"], selectedLocationId || ""],
            "#dc2626", // hero-red for selected
            ["==", ["get", "id"], hoveredLocationId || ""],
            "#ffffff",
            ["==", ["get", "category"], "continent"],
            "#fbbf24", // gold-400
            ["==", ["get", "category"], "region"],
            "#a855f7", // accent-400
            "#ffffff", // white for most markers
          ],
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              2,
              ["==", ["get", "id"], hoveredLocationId || ""],
              2,
              1,
            ],
            10,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              4,
              ["==", ["get", "id"], hoveredLocationId || ""],
              3,
              2,
            ],
            20,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              6,
              ["==", ["get", "id"], hoveredLocationId || ""],
              4,
              3,
            ],
          ],
          "circle-opacity": [
            "case",
            ["==", ["get", "id"], selectedLocationId || ""],
            1.0,
            ["==", ["get", "id"], hoveredLocationId || ""],
            0.95,
            0.9,
          ],
          "circle-stroke-opacity": [
            "case",
            ["==", ["get", "id"], selectedLocationId || ""],
            1.0,
            ["==", ["get", "id"], hoveredLocationId || ""],
            0.95,
            0.8,
          ],
        },
      });

      // Add location labels
      maplibreMap.addLayer({
        id: "locations-labels",
        type: "symbol",
        source: "locations",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["opensans-regular"],
          "text-offset": [0, 2.5],
          "text-anchor": "top",
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              10,
              ["==", ["get", "id"], hoveredLocationId || ""],
              9,
              8,
            ],
            10,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              16,
              ["==", ["get", "id"], hoveredLocationId || ""],
              14,
              12,
            ],
            20,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              20,
              ["==", ["get", "id"], hoveredLocationId || ""],
              18,
              16,
            ],
          ],
          "text-allow-overlap": false,
          "text-ignore-placement": false,
        },
        paint: {
          "text-color": [
            "case",
            ["==", ["get", "id"], selectedLocationId || ""],
            "#ffffff",
            ["==", ["get", "id"], hoveredLocationId || ""],
            "#fbbf24", // gold-400
            "#ffffff",
          ],
          "text-halo-color": "#000000",
          "text-halo-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            10,
            2,
            20,
            3,
          ],
          "text-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0,
            3,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              1,
              ["==", ["get", "id"], hoveredLocationId || ""],
              1,
              ["==", ["get", "category"], "continent"],
              1,
              0,
            ],
            5,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              1,
              ["==", ["get", "id"], hoveredLocationId || ""],
              1,
              ["==", ["get", "category"], "continent"],
              1,
              ["==", ["get", "category"], "region"],
              0.8,
              0,
            ],
            8,
            [
              "case",
              ["==", ["get", "id"], selectedLocationId || ""],
              1,
              ["==", ["get", "id"], hoveredLocationId || ""],
              1,
              0.9,
            ],
          ],
        },
      });
    }, [locations, selectedLocationId, hoveredLocationId, mapLoaded, map.id]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focusLocation: (location: AtlasLocation | null) => {
        if (!mapInstance.current || !location) return;

        const maplibreMap = mapInstance.current;

        // Fly to location with appropriate zoom
        maplibreMap.flyTo({
          center: [location.coordinates.lng, location.coordinates.lat],
          zoom: Math.max(maplibreMap.getZoom() + 2, 5),
          duration: 1500,
        });
      },
      zoomIn: () => {
        if (!mapInstance.current) return;
        mapInstance.current.zoomIn({ duration: 300 });
      },
      zoomOut: () => {
        if (!mapInstance.current) return;
        mapInstance.current.zoomOut({ duration: 300 });
      },
      resetView: () => {
        if (!mapInstance.current) return;
        mapInstance.current.fitBounds(mapBounds, {
          padding: 20,
          animate: true,
          duration: 1000,
        });
      },
    }));

    const getTypeIcon = (type: string, category: string) => {
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

    const currentZoom = mapInstance.current?.getZoom() || 1;

    return (
      <div className="map-container w-full h-full relative overflow-hidden bg-surface">
        {/* MapLibre container */}
        <div
          ref={mapContainer}
          className="maplibre-map w-full h-full"
          style={{ minHeight: "400px" }}
        />

        {/* Map Controls - Top Right */}
        <div className="map-controls absolute top-4 right-4 flex flex-col gap-2 z-10">
          {/* Zoom Controls */}
          <div className="flex flex-col gap-1 bg-surface-elevated border border-primary overflow-hidden shadow-lg">
            <button
              onClick={() => mapInstance.current?.zoomIn({ duration: 300 })}
              className="btn-icon w-10 h-10 text-sm hover:bg-surface-secondary"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => mapInstance.current?.zoomOut({ duration: 300 })}
              className="btn-icon w-10 h-10 text-sm hover:bg-surface-secondary"
              title="Zoom Out"
            >
              −
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={() => {
              if (mapInstance.current) {
                mapInstance.current.fitBounds(mapBounds, {
                  padding: 20,
                  animate: true,
                  duration: 1000,
                });
              }
            }}
            className="btn-secondary px-3 py-2 text-sm bg-surface-elevated border border-primary hover:bg-surface-secondary shadow-lg"
            title="Reset view"
          >
            🎯
          </button>

          {/* Breadcrumb Navigation */}
          {map.parentMap && (
            <button
              onClick={() => {
                const parentMap = maps.find((m) => m.id === map.parentMap);
                if (parentMap) onMapChange(parentMap.id);
              }}
              className="btn-secondary px-3 py-2 text-sm bg-surface-elevated border border-primary hover:bg-surface-secondary max-w-[120px] truncate shadow-lg"
              title={`Go to ${maps.find((m) => m.id === map.parentMap)?.name}`}
            >
              ↗️ {maps.find((m) => m.id === map.parentMap)?.name}
            </button>
          )}
        </div>

        {/* Map Scale Indicator */}
        <div className="map-scale absolute bottom-4 left-4 bg-surface-elevated border border-primary px-3 py-2 text-sm text-secondary pointer-events-none shadow-lg">
          Scale: {map.scale} • Zoom: {Math.round(currentZoom * 100) / 100}
        </div>

        {/* Map Legend */}
        <MapLegend
          currentMap={map}
          locations={locations}
          className="absolute bottom-4 right-4 max-w-[200px]"
        />

        {/* Loading indicator */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-surface-secondary bg-opacity-90 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hero-red mx-auto mb-2"></div>
              <div className="text-sm text-secondary">Loading map...</div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

MapContainer.displayName = "MapContainer";
