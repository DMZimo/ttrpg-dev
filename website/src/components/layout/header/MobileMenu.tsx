import React from "react";
import { CampaignStats } from "./CampaignStats.tsx";
import { DISCORD_INVITE, FOUNDRY_VTT_URL } from "../../../consts.ts";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  showAnnouncement: boolean;
  campaignStats?: {
    totalSessions?: number;
    totalCharacters?: number;
    totalNPCs?: number;
    totalQuests?: number;
    activePlayers?: number;
    currentLevel?: number;
    totalPlayTime?: number;
    combatEncounters?: number;
    deathSaves?: number;
    criticalHits?: number;
  };
}

interface NavItem {
  href: string;
  icon: string;
  label: string;
  description?: string;
}

const partyItems: NavItem[] = [
  {
    href: "/characters",
    icon: "👥",
    label: "Characters",
    description: "Player characters & stats",
  },
  {
    href: "/party",
    icon: "🛡️",
    label: "Party",
    description: "Group dynamics & relationships",
  },
  {
    href: "/journal",
    icon: "�",
    label: "Journal",
    description: "Session notes & stories",
  },
  {
    href: "/quests",
    icon: "⚔️",
    label: "Active Quests",
    description: "Current adventures",
  },
  {
    href: "/completed",
    icon: "�",
    label: "Completed",
    description: "Finished quests & achievements",
  },
  {
    href: "/rumors",
    icon: "�",
    label: "Rumors",
    description: "Potential adventures",
  },
];

const worldItems: NavItem[] = [
  {
    href: "/atlas",
    icon: "�️",
    label: "Atlas",
    description: "Maps & locations",
  },
  {
    href: "/npcs",
    icon: "�️",
    label: "People",
    description: "Non-player characters",
  },
  {
    href: "/lore",
    icon: "📜",
    label: "Lore",
    description: "History & world building",
  },
  {
    href: "/timeline",
    icon: "⏰",
    label: "Timeline",
    description: "Campaign chronology",
  },
];

const codexItems: NavItem[] = [
  {
    href: "/rules",
    icon: "�",
    label: "Rules",
    description: "Game mechanics & rules",
  },
  {
    href: "/dice",
    icon: "🎲",
    label: "Dice Roller",
    description: "Virtual dice & calculators",
  },
  {
    href: "/resources",
    icon: "�",
    label: "Resources",
    description: "Tools & external references",
  },
  {
    href: "/sessions",
    icon: "🎭",
    label: "Sessions",
    description: "Schedule & session info",
  },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPath,
  showAnnouncement,
  campaignStats,
}) => {
  const topOffset = showAnnouncement ? "top-[106px]" : "top-16";

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed ${topOffset} left-0 right-0 bottom-0 bg-surface/98 backdrop-blur-md z-[999] transform transition-transform duration-300 overflow-y-auto ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Campaign Stats (Mobile) */}
        <div className="mb-8 p-4 bg-surface-elevated rounded-xl border border-primary">
          {campaignStats && <CampaignStats {...campaignStats} />}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-6">
          {/* The Party Section */}
          <div>
            <h3 className="text-tertiary text-sm font-semibold uppercase tracking-wide mb-4 px-4">
              The Party
            </h3>
            <div className="space-y-2">
              {partyItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    currentPath === item.href ||
                    currentPath.startsWith(item.href + "/")
                      ? "text-primary bg-accent-500/10 border border-accent-500/30"
                      : "text-secondary bg-surface-elevated border border-primary hover:text-primary hover:bg-surface-tertiary hover:border-accent-500/50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-lg">{item.label}</span>
                    {item.description && (
                      <span className="text-sm text-tertiary">
                        {item.description}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* The World Section */}
          <div>
            <h3 className="text-tertiary text-sm font-semibold uppercase tracking-wide mb-4 px-4">
              The World
            </h3>
            <div className="space-y-2">
              {worldItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    currentPath === item.href ||
                    currentPath.startsWith(item.href + "/")
                      ? "text-primary bg-accent-500/10 border border-accent-500/30"
                      : "text-secondary bg-surface-elevated border border-primary hover:text-primary hover:bg-surface-tertiary hover:border-accent-500/50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-lg">{item.label}</span>
                    {item.description && (
                      <span className="text-sm text-tertiary">
                        {item.description}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Codex Section */}
          <div>
            <h3 className="text-tertiary text-sm font-semibold uppercase tracking-wide mb-4 px-4">
              Codex
            </h3>
            <div className="space-y-2">
              {codexItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    currentPath === item.href ||
                    currentPath.startsWith(item.href + "/")
                      ? "text-primary bg-accent-500/10 border border-accent-500/30"
                      : "text-secondary bg-surface-elevated border border-primary hover:text-primary hover:bg-surface-tertiary hover:border-accent-500/50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-lg">{item.label}</span>
                    {item.description && (
                      <span className="text-sm text-tertiary">
                        {item.description}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Social Links */}
        <div className="mt-8 pt-6 border-t border-secondary">
          <div className="space-y-3">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-4 p-4 bg-surface-elevated border border-primary rounded-xl text-secondary hover:text-accent-500 hover:bg-surface-tertiary hover:border-accent-500/50 transition-all duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <div className="flex flex-col">
                <span className="font-medium">Join Discord</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with other players
                </span>
              </div>
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </a>

            <a
              href={FOUNDRY_VTT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/30 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-200"
            >
              <span className="text-2xl">🎲</span>
              <div className="flex flex-col">
                <span className="font-medium">Join Game Session</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Play on Foundry VTT
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
