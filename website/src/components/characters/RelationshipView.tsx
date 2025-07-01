import React, { useState } from "react";

interface Character {
  id: string;
  data: {
    name: string;
    type: string;
    tags?: string[];
    portrait?: string;
    token?: string;
  };
}

interface RelationshipViewProps {
  characters: Character[];
}

const RelationshipView: React.FC<RelationshipViewProps> = ({ characters }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"network" | "list">("list");

  // Group characters by relationships/locations
  const getRelationshipGroups = () => {
    const groups: { [key: string]: Character[] } = {
      "Player Party": characters.filter((c) => c.data.type === "pc"),
      "Red Larch Council": characters.filter(
        (c) =>
          c.data.tags?.includes("red-larch") &&
          (c.data.tags?.includes("council") ||
            c.data.tags?.includes("authority"))
      ),
      "Fire Cult": characters.filter((c) => c.data.tags?.includes("fire-cult")),
      "Water Cult": characters.filter((c) =>
        c.data.tags?.includes("water-cult")
      ),
      "Air Cult": characters.filter((c) => c.data.tags?.includes("air-cult")),
      "Earth Cult": characters.filter((c) =>
        c.data.tags?.includes("earth-cult")
      ),
      "Red Larch Residents": characters.filter(
        (c) =>
          c.data.tags?.includes("red-larch") &&
          !c.data.tags?.includes("council") &&
          !c.data.tags?.includes("authority")
      ),
      "Merchants & Traders": characters.filter(
        (c) =>
          c.data.tags?.includes("merchant") || c.data.tags?.includes("trader")
      ),
    };

    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([_, chars]) => chars.length > 0)
    );
  };

  const relationshipGroups = getRelationshipGroups();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          🕸️ Character Relationships
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("network")}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "network"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Network View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-6">
          {Object.entries(relationshipGroups).map(
            ([groupName, groupCharacters]) => (
              <div key={groupName} className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {groupName} ({groupCharacters.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedCharacter(character.id)}
                    >
                      <a
                        href={`/characters/${character.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {character.data.name}
                      </a>
                      {character.data.tags &&
                        character.data.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {character.data.tags
                              .slice(0, 2)
                              .map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Network View Coming Soon
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive relationship network visualization is under development.
            For now, use the List View to explore character relationships.
          </p>
        </div>
      )}
    </div>
  );
};

export default RelationshipView;
