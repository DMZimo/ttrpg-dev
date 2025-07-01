interface AtlasSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  disabled?: boolean;
}

interface AtlasNavigationProps {
  currentSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function AtlasNavigation({
  currentSection,
  onSectionChange,
}: AtlasNavigationProps) {
  const sections: AtlasSection[] = [
    {
      id: "celestial",
      name: "Realmspace",
      description: "Crystal sphere and celestial bodies",
      icon: "🌌",
    },
    {
      id: "faerun",
      name: "Faerûn",
      description: "The main continent",
      icon: "🗺️",
      disabled: true,
    },
    {
      id: "sword-coast",
      name: "Sword Coast",
      description: "Western Faerûn coastline",
      icon: "⚔️",
      disabled: true,
    },
    {
      id: "dessarin-valley",
      name: "Dessarin Valley",
      description: "Our campaign region",
      icon: "🏔️",
      disabled: true,
    },
    {
      id: "red-larch",
      name: "Red Larch",
      description: "Starting town",
      icon: "🏘️",
      disabled: true,
    },
  ];

  return (
    <div className="bg-surface-secondary border-b border-accent-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => !section.disabled && onSectionChange(section.id)}
              disabled={section.disabled}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSection === section.id
                  ? "bg-gold-600 text-white"
                  : section.disabled
                  ? "text-muted cursor-not-allowed opacity-50"
                  : "text-secondary hover:text-primary hover:bg-surface-tertiary"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <div className="text-left">
                <div className="font-medium">{section.name}</div>
                <div className="text-xs opacity-75">{section.description}</div>
              </div>
              {section.disabled && (
                <span className="text-xs bg-surface-tertiary px-2 py-1 rounded text-muted">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
