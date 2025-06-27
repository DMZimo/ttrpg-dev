import React, { useState, useEffect, useRef } from "react";

interface NavigationProps {
  currentPath: string;
}

interface NavItem {
  href: string;
  icon: string;
  label: string;
  description: string;
}

const partyItems: NavItem[] = [
  {
    href: "/party",
    icon: "",
    label: "Party",
    description: "Group dynamics & relationships",
  },
  {
    href: "/characters",
    icon: "",
    label: "Characters",
    description: "Player characters & stats",
  },
  {
    href: "/quests",
    icon: "",
    label: "Quests",
    description: "Current & past quests",
  },
  {
    href: "/rumors",
    icon: "",
    label: "Rumors",
    description: "Potential adventures",
  },
];

const worldItems: NavItem[] = [
  {
    href: "/atlas",
    icon: " ️",
    label: "Atlas",
    description: "Maps & locations",
  },
  {
    href: "/locations",
    icon: "🏰",
    label: "Locations",
    description: "Cities, dungeons & landmarks",
  },
  {
    href: "/npcs",
    icon: " ️",
    label: "NPCs",
    description: "Non-player characters",
  },
  {
    href: "/lore",
    icon: "📜",
    label: "Lore",
    description: "History & world building",
  },
  {
    href: "/timekeeping",
    icon: "📅",
    label: "Calendar",
    description: "Calendar of Harptos & time tracking",
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
    icon: " ",
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
    icon: " ",
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

interface DropdownProps {
  label: string;
  icon: string;
  items: NavItem[];
  currentPath: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  icon,
  items,
  currentPath,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if any item in this dropdown is active
  const isActive = items.some(
    (item) =>
      currentPath === item.href || currentPath.startsWith(item.href + "/")
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden ${
          isActive
            ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:-translate-y-0.5"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-lg transition-transform duration-200 hover:scale-110">
          {icon}
        </span>
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${
            isOpen ? "rotate-180 text-gray-600 dark:text-gray-300" : ""
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z" />
        </svg>
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 z-[1000] transition-all duration-200 ${
          isOpen
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-xl p-3 min-w-[220px] shadow-xl">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 mb-1 last:mb-0 ${
                currentPath === item.href ||
                currentPath.startsWith(item.href + "/")
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  return (
    <div className="flex items-center gap-1">
      <a
        href="/journal"
        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden ${
          currentPath === "/journal" || currentPath.startsWith("/journal/")
            ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:-translate-y-0.5"
        }`}
      >
        <span>Campaign Journal</span>
        {(currentPath === "/journal" ||
          currentPath.startsWith("/journal/")) && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
        )}
      </a>
      <Dropdown
        label="The Party"
        icon="⚔️"
        items={partyItems}
        currentPath={currentPath}
      />

      <Dropdown
        label="The World"
        icon="🌍"
        items={worldItems}
        currentPath={currentPath}
      />
      <Dropdown
        label="Codex"
        icon="📚"
        items={codexItems}
        currentPath={currentPath}
      />
    </div>
  );
};
