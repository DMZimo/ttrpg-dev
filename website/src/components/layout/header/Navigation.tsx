import React from "react";

interface NavigationProps {
  currentPath: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const createNavLink = (href: string, label: string, icon?: string) => (
    <a
      href={href}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium relative overflow-hidden ${
        currentPath === href || currentPath.startsWith(href + "/")
          ? "text-hero-red bg-surface-tertiary"
          : "text-secondary hover:text-primary hover:bg-surface-secondary hover:-translate-y-0.5"
      }`}
      style={{ transition: "var(--transition)" }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      {(currentPath === href || currentPath.startsWith(href + "/")) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-hero-red" />
      )}
    </a>
  );

  const createLockedLink = (label: string, icon?: string) => (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-muted cursor-not-allowed relative">
      {icon && <span className="text-lg opacity-50">{icon}</span>}
      <span className="opacity-50">{label}</span>
      <span className="text-xs bg-surface-tertiary px-2 py-1 rounded text-tertiary ml-2">
        Coming Soon
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-1">
      {createNavLink("/journal", "Journal", "📔")}
      {createNavLink("/atlas", "Atlas", "🗺️")}
      {createNavLink("/party", "Party", "👥")}
      {createNavLink("/timekeeping", "Time & Weather", "🌤️")}
      {createNavLink("/characters", "People", "🏘️")}
      {createLockedLink("Factions", "⚜️")}
    </div>
  );
};
