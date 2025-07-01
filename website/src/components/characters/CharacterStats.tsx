import React from "react";

interface Character {
  id: string;
  data: {
    name: string;
    type: "pc" | "npc" | "sidekick";
    status: string;
    class?: Array<{
      name: string;
      level: number;
    }>;
    tags?: string[];
    portrait?: string;
    token?: string;
  };
}

interface CharacterStatsProps {
  characters: Character[];
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ characters }) => {
  const stats = {
    total: characters.length,
    playerCharacters: characters.filter((c) => c.data.type === "pc").length,
    npcs: characters.filter((c) => c.data.type === "npc").length,
    sidekicks: characters.filter((c) => c.data.type === "sidekick").length,
    alive: characters.filter((c) => c.data.status === "alive").length,
    dead: characters.filter((c) => c.data.status === "dead").length,
    redLarch: characters.filter((c) => c.data.tags?.includes("red-larch"))
      .length,
    villains: characters.filter(
      (c) =>
        c.data.tags?.includes("villain") || c.data.tags?.includes("antagonist")
    ).length,
    cults: {
      fire: characters.filter((c) => c.data.tags?.includes("fire-cult")).length,
      water: characters.filter((c) => c.data.tags?.includes("water-cult"))
        .length,
      air: characters.filter((c) => c.data.tags?.includes("air-cult")).length,
      earth: characters.filter((c) => c.data.tags?.includes("earth-cult"))
        .length,
    },
  };

  const averageLevel =
    characters
      .filter((c) => c.data.class && c.data.class.length > 0)
      .reduce((sum, c) => sum + (c.data.class![0].level || 1), 0) /
      characters.filter((c) => c.data.class && c.data.class.length > 0)
        .length || 0;

  const topClasses = characters
    .filter((c) => c.data.class && c.data.class.length > 0)
    .reduce((acc, c) => {
      const className = c.data.class![0].name;
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedClasses = Object.entries(topClasses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          📊 Character Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Characters
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.playerCharacters}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Player Characters
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.npcs}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">NPCs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.sidekicks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Sidekicks
            </div>
          </div>
        </div>
      </div>

      {/* Status & Location Stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🌍 Status & Locations
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.alive}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Alive
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.dead}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Dead</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.redLarch}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Red Larch
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.villains}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Villains
            </div>
          </div>
        </div>
      </div>

      {/* Cult Statistics */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🔥 Elemental Cult Members
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.cults.fire}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              🔥 Fire Cult
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.cults.water}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              💧 Water Cult
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-300">
              {stats.cults.air}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              💨 Air Cult
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.cults.earth}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              🌍 Earth Cult
            </div>
          </div>
        </div>
      </div>

      {/* Class Statistics */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          ⚔️ Class Distribution
        </h3>
        {sortedClasses.length > 0 ? (
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {averageLevel.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Level
              </div>
            </div>
            {sortedClasses.map(([className, count]) => (
              <div
                key={className}
                className="flex justify-between items-center"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {className}
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No class data available
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterStats;
