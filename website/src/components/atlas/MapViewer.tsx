import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { AtlasMap, AtlasLocation, MapViewerRef } from "@/types";

interface MapViewerProps {
  map: AtlasMap;
  maps: AtlasMap[];
  locations: AtlasLocation[];
  selectedLocationId: string | null;
  onLocationSelect: (location: AtlasLocation) => void;
  onMapChange: (mapId: string) => void;
}

export const MapViewer = forwardRef<MapViewerRef, MapViewerProps>(
  (
    { map, maps, locations, selectedLocationId, onLocationSelect, onMapChange },
    ref
  ) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(
      null
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const positionRef = useRef({ x: 0, y: 0 });

    // Keep position ref in sync with state
    useEffect(() => {
      positionRef.current = position;
    }, [position]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focusLocation: (location: AtlasLocation | null) => {
        if (!location || !containerRef.current || !imageRef.current) {
          // Reset view
          setScale(1);
          setPosition({ x: 0, y: 0 });
          return;
        }

        const container = containerRef.current;
        const image = imageRef.current;

        // Calculate the position on the image based on coordinates
        const imageWidth = image.naturalWidth || image.offsetWidth;
        const imageHeight = image.naturalHeight || image.offsetHeight;

        // Convert lat/lng to pixel coordinates (simple linear mapping for now)
        const { bounds } = map;
        const xPercent =
          (location.coordinates.lng - bounds.west) /
          (bounds.east - bounds.west);
        const yPercent =
          1 -
          (location.coordinates.lat - bounds.south) /
            (bounds.north - bounds.south);

        const targetX = xPercent * imageWidth;
        const targetY = yPercent * imageHeight;

        // Center the location in the viewport
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const newScale = Math.max(
          1.5,
          Math.min(3, containerWidth / (imageWidth * 0.3))
        );
        const newX = containerWidth / 2 - targetX * newScale;
        const newY = containerHeight / 2 - targetY * newScale;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
      },
      zoomIn: () => setScale((prev) => Math.min(5, prev * 1.5)),
      zoomOut: () => setScale((prev) => Math.max(0.5, prev / 1.5)),
      resetView: () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      },
    }));

    // Handle mouse wheel zoom with proper event listener registration
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY * -0.001;
        const newScale = Math.max(0.5, Math.min(5, scale + delta));

        if (newScale !== scale) {
          const rect = container.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Zoom towards mouse position
          const factor = newScale / scale;
          const newX = mouseX - factor * (mouseX - position.x);
          const newY = mouseY - factor * (mouseY - position.y);

          setScale(newScale);
          setPosition({ x: newX, y: newY });
        }
      };

      // Register with passive: false to allow preventDefault
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, [scale, position.x, position.y]);

    // Handle drag with immediate response using refs
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".location-marker")) return;

      e.preventDefault();
      setIsDragging(true);

      // Store drag start in ref for immediate access
      dragStartRef.current = {
        x: e.clientX - positionRef.current.x,
        y: e.clientY - positionRef.current.y,
      };
      setDragStart(dragStartRef.current);
    }, []);

    // Handle location click
    const handleLocationClick = useCallback(
      (location: AtlasLocation) => {
        onLocationSelect(location);
      },
      [onLocationSelect]
    );

    // Calculate location positions on the map (memoized for performance)
    const getLocationPosition = useCallback(
      (location: AtlasLocation) => {
        if (!imageRef.current) return { x: 0, y: 0 };

        const image = imageRef.current;
        const { bounds } = map;

        const xPercent =
          (location.coordinates.lng - bounds.west) /
          (bounds.east - bounds.west);
        const yPercent =
          1 -
          (location.coordinates.lat - bounds.south) /
            (bounds.north - bounds.south);

        return {
          x: xPercent * (image.offsetWidth || 800),
          y: yPercent * (image.offsetHeight || 600),
        };
      },
      [map.bounds, map.id]
    );

    // Memoize location positions
    const locationPositions = useMemo(() => {
      return locations.reduce((acc, location) => {
        acc[location.id] = getLocationPosition(location);
        return acc;
      }, {} as Record<string, { x: number; y: number }>);
    }, [locations, getLocationPosition]);

    // Optimized mouse event listeners using refs to avoid re-renders
    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        // Use ref for immediate access without state dependencies
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;

        // Update both ref and state immediately
        positionRef.current = { x: newX, y: newY };
        setPosition({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      // Add event listeners with proper options for better performance
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });

      // Prevent text selection during drag
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
      };
    }, [isDragging]); // Only depend on isDragging

    // Reset position when map changes
    useEffect(() => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }, [map.id]);

    return (
      <div
        ref={containerRef}
        className={`map-viewer w-full h-full overflow-hidden bg-surface relative select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        style={{
          contain: "layout style paint",
          touchAction: "none",
          transform: "translateZ(0)", // Force hardware acceleration
        }}
      >
        {/* Map Image */}
        <div
          className="map-container relative"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: "0 0",
            willChange: isDragging ? "transform" : "auto",
            backfaceVisibility: "hidden",
            perspective: 1000,
          }}
        >
          <img
            ref={imageRef}
            src={map.image.src}
            alt={map.name}
            className="map-image max-w-none select-none block"
            draggable={false}
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "none",
              maxWidth: "none",
              imageRendering: isDragging ? "auto" : "crisp-edges",
            }}
          />

          {/* Location Markers */}
          <div className="location-markers absolute inset-0 pointer-events-none">
            {locations.map((location) => {
              const pos = locationPositions[location.id] || { x: 0, y: 0 };
              const isSelected = location.id === selectedLocationId;
              const isHovered = location.id === hoveredLocationId;

              return (
                <div
                  key={location.id}
                  className={`location-marker absolute pointer-events-auto cursor-pointer transition-transform ${
                    isSelected
                      ? "z-30 scale-125"
                      : isHovered
                      ? "z-20 scale-110"
                      : "z-10"
                  }`}
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => handleLocationClick(location)}
                  onMouseEnter={() => setHoveredLocationId(location.id)}
                  onMouseLeave={() => setHoveredLocationId(null)}
                  title={location.name}
                >
                  {/* Marker Icon */}
                  <div
                    className={`marker-icon w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      location.category === "continent"
                        ? "bg-gold-600 border-gold-400 text-white"
                        : location.category === "region"
                        ? "bg-accent-600 border-accent-400 text-white"
                        : "bg-hero-red border-hero-red-light text-white"
                    } ${isSelected ? "ring-2 ring-white ring-opacity-75" : ""}`}
                  >
                    {location.category === "continent"
                      ? "🌍"
                      : location.category === "region"
                      ? "🏞️"
                      : location.type === "city" || location.type === "town"
                      ? "🏰"
                      : location.type === "village" ||
                        location.type === "hamlet"
                      ? "🏘️"
                      : "📍"}
                  </div>

                  {/* Marker Label */}
                  <div
                    className={`marker-label absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-surface-elevated border border-primary text-xs font-medium text-primary whitespace-nowrap transition-opacity duration-200 ${
                      isSelected || isHovered || scale > 1.5
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    {location.name}
                    {/* Label arrow */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-primary"></div>
                  </div>

                  {/* Selection Pulse Effect */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full border-2 border-white animate-ping"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Scale Indicator */}
        <div className="map-scale absolute bottom-4 left-4 bg-surface-elevated border border-primary px-3 py-2 text-sm text-secondary pointer-events-none">
          Scale: {map.scale} • Zoom: {Math.round(scale * 100)}%
        </div>

        {/* Map Controls - Top Right */}
        <div className="map-controls absolute top-4 right-4 flex flex-col gap-2 z-40">
          {/* Zoom Controls */}
          <div className="flex flex-col gap-1 bg-surface-elevated border border-primary overflow-hidden">
            <button
              onClick={() => setScale((prev) => Math.min(5, prev * 1.5))}
              className="btn-icon w-10 h-10 text-sm hover:bg-surface-secondary"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setScale((prev) => Math.max(0.5, prev / 1.5))}
              className="btn-icon w-10 h-10 text-sm hover:bg-surface-secondary"
              title="Zoom Out"
            >
              −
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="btn-secondary px-3 py-2 text-sm bg-surface-elevated border border-primary hover:bg-surface-secondary"
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
              className="btn-secondary px-3 py-2 text-sm bg-surface-elevated border border-primary hover:bg-surface-secondary max-w-[120px] truncate"
              title={`Go to ${maps.find((m) => m.id === map.parentMap)?.name}`}
            >
              ↗️ {maps.find((m) => m.id === map.parentMap)?.name}
            </button>
          )}
        </div>

        {/* Map Legend */}
        <div className="map-legend absolute bottom-4 right-4 bg-surface-elevated border border-primary p-3 space-y-2 pointer-events-none">
          <div className="text-sm font-medium text-primary mb-2">Legend</div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <div className="w-4 h-4 rounded-full bg-gold-600 border border-gold-400 flex items-center justify-center text-[10px]">
              🌍
            </div>
            <span>Continents</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <div className="w-4 h-4 rounded-full bg-accent-600 border border-accent-400 flex items-center justify-center text-[10px]">
              🏞️
            </div>
            <span>Regions</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <div className="w-4 h-4 rounded-full bg-hero-red border border-hero-red-light flex items-center justify-center text-[10px]">
              🏰
            </div>
            <span>Settlements</span>
          </div>
        </div>
      </div>
    );
  }
);

MapViewer.displayName = "MapViewer";
