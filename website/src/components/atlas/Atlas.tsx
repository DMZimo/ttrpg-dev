import { useState, useEffect } from "react";
import CelestialMap from "./CelestialMap";
import CelestialDetailPanel from "./CelestialDetailPanel";
import AtlasNavigation from "./AtlasNavigation";

interface CelestialBody {
  id: string;
  name: string;
  type: "star" | "planet" | "moon" | "asteroid-cluster";
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  data: any;
}

interface AtlasProps {
  celestialData: any[];
}

// Define positions for celestial bodies (simplified solar system model)
const celestialPositions: Record<
  string,
  { x: number; y: number; z: number; size: number; color: string }
> = {
  "the-sun": { x: 0, y: 0, z: 0, size: 10, color: "#FFA500" },
  toril: { x: 50, y: 0, z: 0, size: 3, color: "#4A90E2" },
  selune: { x: 58, y: 0, z: 0, size: 1, color: "#E6E6FA" },
  "tears-of-selune": { x: 60, y: 0, z: 2, size: 0.5, color: "#888888" },
  // Add more positions as needed for other celestial bodies
};

export default function Atlas({ celestialData }: AtlasProps) {
  const [currentSection, setCurrentSection] = useState("celestial");
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);

  useEffect(() => {
    // Transform celestial data into renderable bodies
    const bodies: CelestialBody[] = celestialData.map((entry) => {
      const slug = entry.slug || entry.id;
      const position = celestialPositions[slug] || {
        x: 0,
        y: 0,
        z: 0,
        size: 1,
        color: "#FFFFFF",
      };

      return {
        id: slug,
        name: entry.data.name,
        type: entry.data.type,
        position: position,
        size: position.size,
        color: position.color,
        data: entry.data,
      };
    });

    setCelestialBodies(bodies);
  }, [celestialData]);

  const handleBodySelect = (body: CelestialBody | null) => {
    setSelectedBody(body);
  };

  const handleClosePanel = () => {
    setSelectedBody(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <AtlasNavigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      {/* Main Content */}
      <div className="flex-1 relative">
        {currentSection === "celestial" && (
          <div className="relative h-full">
            <CelestialMap
              celestialBodies={celestialBodies}
              onBodySelect={handleBodySelect}
              selectedBody={selectedBody}
            />
            <CelestialDetailPanel
              body={selectedBody}
              onClose={handleClosePanel}
            />
          </div>
        )}

        {currentSection !== "celestial" && (
          <div className="flex items-center justify-center h-full bg-surface">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Coming Soon
              </h3>
              <p className="text-secondary max-w-md">
                This map section is under construction. Check back soon for
                detailed maps of {currentSection.replace("-", " ")}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend for Celestial Map */}
      {currentSection === "celestial" && !selectedBody && (
        <div className="absolute bottom-4 left-4 bg-surface-secondary border border-accent-500/20 rounded-lg p-4 shadow-lg">
          <h4 className="font-semibold text-primary mb-2">Realmspace Legend</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-secondary">Stars</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-secondary">Planets</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-secondary">Moons</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500"></div>
              <span className="text-secondary">Asteroid Clusters</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
