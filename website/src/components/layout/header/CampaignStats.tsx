import React, { useState } from "react";
import {
  calculateCampaignStats,
  type CampaignStatsData,
} from "@/utils/campaignUtils";

interface CampaignStatsProps {
  campaignStats?: CampaignStatsData;
}

interface StatItem {
  value: number | string;
  label: string;
  icon: string;
  color?: string;
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({
  campaignStats,
  totalSessions = 4,
  totalCharacters = 4,
  totalNPCs = 12,
  totalQuests = 8,
  activePlayers = 4,
  currentLevel = 3,
  totalPlayTime = 14.5,
  combatEncounters = 6,
  deathSaves = 2,
  criticalHits = 15,
}) => {
  // Use campaignStats if provided, otherwise fallback to individual props
  const stats = campaignStats || {
    totalSessions,
    totalCharacters,
    totalNPCs,
    totalQuests,
    activePlayers,
    currentLevel,
    totalPlayTime,
    combatEncounters,
    deathSaves,
    criticalHits,
    activeQuests: 0,
    completedQuests: 0,
    totalMysteries: 0,
    activeMysteries: 0,
    totalRumors: 0,
    averageSessionLength: 0,
    questCompletionRate: 0,
    mysteryResolutionRate: 0,
    sessionPacing: {
      averageCombatPerSession: 0,
      averageNPCEncounters: 0,
      sessionLengthTrend: "stable" as const,
      combatToRoleplayRatio: 0,
      paceVariability: 0,
    },
    characterDevelopment: {
      sessionParticipation: {},
      characterProgressionRate: 0,
      mostActiveCharacter: "Unknown",
      characterEngagementScore: 0,
    },
    npcInteractions: {
      mostEncounteredNPCs: [],
      npcDiversity: 0,
      newNPCsPerSession: 0,
      recurringNPCRate: 0,
    },
    locationVisits: {
      mostVisitedLocations: [],
      locationDiversity: 0,
      explorationRate: 0,
    },
    campaignMomentum: {
      questProgressionRate: 0,
      mysteryResolutionEfficiency: 0,
      storyAdvancementScore: 0,
      playerEngagementTrend: "stable" as const,
    },
  };
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Primary stats (always visible) - using real campaign data
  const primaryStats: StatItem[] = [
    {
      value: stats.totalSessions,
      label: "Sessions",
      icon: "📝",
      description: "Total campaign sessions played",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      value: `Lvl ${stats.currentLevel}`,
      label: "Party Level",
      icon: "⭐",
      description: "Current average party level",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      value: `${stats.totalPlayTime.toFixed(1)}h`,
      label: "Play Time",
      icon: "⏱️",
      description: "Total hours played",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  // Extended stats (shown in tooltip) - enhanced with real data
  const extendedStats: StatItem[] = [
    {
      value: stats.activePlayers,
      label: "Active Players",
      icon: "👥",
      description: "Current active party members",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      value: stats.totalNPCs,
      label: "NPCs Met",
      icon: "🎭",
      description: "Non-player characters encountered",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      value: `${stats.activeQuests}/${stats.totalQuests}`,
      label: "Quests",
      icon: "📜",
      description: "Active quests vs total quests",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      value: stats.combatEncounters,
      label: "Battles",
      icon: "⚔️",
      description: "Combat encounters survived",
      color: "text-red-600 dark:text-red-400",
    },
    {
      value: stats.activeMysteries,
      label: "Mysteries",
      icon: "🔍",
      description: "Active ongoing mysteries",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      value: `${stats.questCompletionRate.toFixed(0)}%`,
      label: "Quest Rate",
      icon: "�",
      description: "Quest completion percentage",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 200); // 200ms delay before hiding
  };

  const handleClick = () => {
    // Navigate to campaign portal
    window.location.href = "/campaign";
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Stats Display */}
      <div
        className="flex items-center gap-3 text-sm cursor-pointer group transition-all duration-200 hover:scale-105"
        onClick={handleClick}
        title="Click to view detailed campaign statistics"
      >
        {primaryStats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            {index > 0 && (
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 opacity-50 group-hover:opacity-70 transition-opacity" />
            )}
            <div className="text-center group-hover:transform group-hover:translate-y-[-1px] transition-transform">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-xs opacity-70">{stat.icon}</span>
                <div className={`font-bold text-lg ${stat.color} leading-none`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Hover indicator */}
        <div className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-xs text-gray-400">
          📊
        </div>
      </div>

      {/* Tooltip with Extended Stats */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Invisible bridge to prevent gap issues */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-full h-2"></div>

          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-xl p-4 min-w-[320px] shadow-xl">
            <div className="text-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                Campaign Statistics
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Click to view party portal
              </p>
            </div>

            {/* Extended Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {extendedStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/50"
                >
                  <span className="text-lg flex-shrink-0">{stat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-semibold text-sm ${stat.color}`}>
                        {stat.value}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {stat.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex justify-center gap-2 text-xs">
                <button
                  onClick={handleClick}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
                >
                  Party Portal
                </button>
                <button
                  onClick={() => (window.location.href = "/campaign")}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Tooltip Arrow */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-200/50 dark:border-b-gray-800/50"></div>
        </div>
      )}
    </div>
  );
};
