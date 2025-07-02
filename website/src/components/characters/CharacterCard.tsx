import React from "react";

interface Character {
  id: string;
  data: {
    // Character Metadata
    owner: string;
    is_public: boolean;
    publish_date_iso?: Date;
    last_updated_iso?: Date;
    tags?: string[];

    // Character Details
    type: "pc" | "sidekick" | "npc";
    status:
      | "alive"
      | "injured"
      | "dead"
      | "missing"
      | "retired"
      | "absent"
      | "traveling"
      | "captured"
      | "incapacitated"
      | "inactive";
    active: boolean;
    portrait?: string;
    token?: string;
    color?: string;

    // Character Attributes
    name: string;
    race: string;
    subrace: string;
    background?: string;
    birthplace?: string;
    description?: string;
    birthdate?: Date;
    size?: string;
    languages?: Array<{
      name: string;
    }>;

    // Character Roles
    roles?: string[];

    // Character Stats
    ability_scores?: {
      str: number;
      dex: number;
      con: number;
      int: number;
      wis: number;
      cha: number;
    };

    // Derived stats
    proficiency_bonus?: number;
    saving_throws?: {
      str?: number;
      dex?: number;
      con?: number;
      int?: number;
      wis?: number;
      cha?: number;
    };

    // Classes and levels
    classes?: Array<{
      name: string;
      level: number;
      subclass?: string | null;
    }>;
    hp?: number;
    ac?: number;

    // Skills
    skills?: Array<{
      name: string;
      modifier: number;
    }>;
    other_skills?: Array<{
      name: string;
    }>;

    // Spellcasting
    spellcasting?: {
      ability: string;
      spell_attack_bonus: number;
      spell_save_dc: number;
    } | null;

    // Character Relationships
    organization?: {
      name: string;
      disposition: number;
    };
    enclave?: {
      name: string;
      disposition: number;
    };
    affiliations?: Array<{
      name: string;
      disposition: number;
    }> | null;
    cult?: {
      name: "Water" | "Earth" | "Air" | "Fire" | "Eye";
      disposition: number;
    } | null;
    allies?: string[] | null;
    enemies?: string[] | null;

    // Character motivations and traits
    personality_traits?: string[] | null;
    ideals?: string[] | null;
    bonds?: string[] | null;
    flaws?: string[] | null;

    // Legacy fields (keeping for backward compatibility)
    publishDate?: Date;
    lastUpdated?: Date;
    isPublic: boolean;
    class: Array<{
      name: string;
      level: number;
      subclass?: string;
    }>;
  };
}

interface CharacterCardProps {
  character: Character;
  variant?: "default" | "compact" | "detailed";
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  variant = "default",
}) => {
  const { data } = character;

  // Determine card styling based on character type and custom color
  const getCardStyling = () => {
    // Use custom color if available
    if (data.color) {
      // For custom colors, we'll use a neutral base and rely on CSS custom properties or inline styles
      return {
        border: "border-primary",
        gradient: "bg-surface-secondary",
        accent: "text-primary",
        tagColor: "bg-surface-tertiary text-secondary",
        customColor: data.color,
      };
    }

    // Fallback to type-based styling
    switch (data.type) {
      case "pc":
        return {
          border: "border-primary",
          gradient: "bg-surface-secondary",
          accent: "text-primary",
          tagColor: "bg-surface-tertiary text-secondary",
        };
      case "npc":
        if (
          data.tags?.includes("villain") ||
          data.tags?.includes("antagonist")
        ) {
          return {
            border: "border-primary",
            gradient: "bg-surface-secondary",
            accent: "text-primary",
            tagColor: "bg-surface-tertiary text-secondary",
          };
        } else if (data.tags?.includes("red-larch")) {
          return {
            border: "border-primary",
            gradient: "bg-surface-secondary",
            accent: "text-primary",
            tagColor: "bg-surface-tertiary text-secondary",
          };
        }
        return {
          border: "border-primary",
          gradient: "bg-surface-secondary",
          accent: "text-primary",
          tagColor: "bg-surface-tertiary text-secondary",
        };
      default:
        return {
          border: "border-primary",
          gradient: "bg-surface",
          accent: "text-tertiary",
          tagColor: "bg-surface-tertiary text-secondary",
        };
    }
  };

  const styling = getCardStyling();

  const getStatusIcon = () => {
    switch (data.status) {
      case "alive":
        return "💚";
      case "dead":
        return "💀";
      case "missing":
        return "❓";
      case "retired":
        return "🏠";
      case "inactive":
        return "💤";
      default:
        return "❔";
    }
  };

  const getTypeIcon = () => {
    switch (data.type) {
      case "pc":
        return "⚔️";
      case "npc":
        return "👤";
      case "sidekick":
        return "🤝";
      default:
        return "❔";
    }
  };

  // Get portrait image path
  const getPortraitPath = () => {
    if (data.portrait) {
      return `/src/assets/portraits/${data.portrait}`;
    }

    // Fallback to placeholder
    return "/src/assets/portraits/placeholder-portrait.png";
  };

  // Get enclave banner for enclave affiliation
  const getEnclaveBanner = () => {
    // Check enclave field first
    if (data.enclave) {
      const enclaveName = data.enclave.name.toLowerCase();
      switch (enclaveName) {
        case "emerald enclave":
          return "/src/assets/banners/emerald-enclave-banner.png";
        case "harpers":
          return "/src/assets/banners/harpers-banner.png";
        case "lords' alliance":
        case "lords alliance":
          return "/src/assets/banners/lords-alliance-banner.png";
        case "order of the gauntlet":
          return "/src/assets/banners/order-of-the-gauntlet-banner.png";
        case "zhentarim":
          return "/src/assets/banners/zhentarim-banner.png";
      }
    }

    // Check organization field as fallback
    if (data.organization) {
      const orgName = data.organization.name.toLowerCase();
      switch (orgName) {
        case "emerald enclave":
          return "/src/assets/banners/emerald-enclave-banner.png";
        case "harpers":
          return "/src/assets/banners/harpers-banner.png";
        case "lords' alliance":
        case "lords alliance":
          return "/src/assets/banners/lords-alliance-banner.png";
        case "order of the gauntlet":
          return "/src/assets/banners/order-of-the-gauntlet-banner.png";
        case "zhentarim":
          return "/src/assets/banners/zhentarim-banner.png";
      }
    }

    // Check tags for enclave affiliation
    if (data.tags) {
      if (data.tags.includes("emerald-enclave")) {
        return "/src/assets/banners/emerald-enclave-banner.png";
      }
      if (data.tags.includes("harpers")) {
        return "/src/assets/banners/harpers-banner.png";
      }
      if (data.tags.includes("lords-alliance")) {
        return "/src/assets/banners/lords-alliance-banner.png";
      }
      if (data.tags.includes("order-of-the-gauntlet")) {
        return "/src/assets/banners/order-of-the-gauntlet-banner.png";
      }
      if (data.tags.includes("zhentarim")) {
        return "/src/assets/banners/zhentarim-banner.png";
      }
    }

    return null;
  };

  // Get cult icon for cult members
  const getCultIcon = () => {
    if (!data.cult?.name) return null;

    const cultName = data.cult.name;

    switch (cultName) {
      case "Fire":
        return "/src/assets/icons/cult-icon-fire.webp";
      case "Water":
        return "/src/assets/icons/cult-icon-water.webp";
      case "Air":
        return "/src/assets/icons/cult-icon-air.webp";
      case "Earth":
        return "/src/assets/icons/cult-icon-earth.webp";
      case "Eye":
        // No icon for Eye cult yet, could add one later
        return null;
      default:
        return null;
    }
  };

  // Get class icon for character classes
  const getClassIcon = (className: string) => {
    const classNameLower = className.toLowerCase();
    // Handle special case for "Commoner" which doesn't have a standard D&D class icon
    if (classNameLower === "commoner") {
      return `/src/assets/icons/class-icon-fighter.svg`; // Use fighter as fallback
    }
    return `/src/assets/icons/class-icon-${classNameLower}.svg`;
  };

  // Get current level for display (cumulative)
  const getCurrentLevel = () => {
    const classes = data.classes || data.class || [];
    if (classes.length > 0) {
      return classes.reduce((total, classInfo) => total + classInfo.level, 0);
    }
    return null;
  };

  // Get all classes with levels
  const getAllClasses = () => {
    return data.classes || data.class || [];
  };

  // Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  // Get ability score modifier
  const getAbilityModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  // Format ability modifier with + or - sign
  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const enclaveBanner = getEnclaveBanner();

  return (
    <div
      className={`
      ${styling.gradient} ${styling.border} border rounded-lg shadow-lg
      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
      relative flex flex-col
    `}
      style={
        styling.customColor
          ? {
              borderColor: styling.customColor + "40",
              background: `linear-gradient(135deg, ${styling.customColor}10, ${styling.customColor}20)`,
            }
          : {}
      }
    >
      <div className="flex gap-4 p-4 relative">
        {/* Avatar positioned at top left */}
        <div
          className={`absolute -top-2 -left-2 rounded-full z-10 ${
            data.type === "pc" ? "shadow-lg" : ""
          }`}
          style={
            data.type === "pc" && data.color
              ? {
                  boxShadow: `0 10px 15px -3px ${data.color}40, 0 4px 6px -2px ${data.color}20`,
                }
              : data.type === "pc"
              ? {
                  boxShadow:
                    "0 10px 15px -3px rgb(217 119 6 / 0.25), 0 4px 6px -2px rgb(217 119 6 / 0.125)",
                }
              : {}
          }
        >
          <div className="relative">
            <div className="relative w-32 h-32">
              <img
                src={getPortraitPath()}
                alt={`${data.name} portrait`}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/src/assets/portraits/placeholder-portrait.png";
                }}
              />
              {/* Portrait Frame Overlay */}
              <img
                src="/src/assets/ui/portrait-frame.webp"
                alt="Portrait frame"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Level Badge - Top Left */}
            {getCurrentLevel() && (
              <div className="absolute -top-1 -left-3.5 flex items-center">
                <div className="relative">
                  <img
                    src="/src/assets/ui/level-badge.webp"
                    alt="Level Badge"
                    className="w-12 h-12 drop-shadow-md"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                    {getCurrentLevel()}
                  </span>
                </div>
              </div>
            )}

            {/* Status Icon - Only show if not alive - Top Right */}
            {data.status !== "alive" && (
              <div className="absolute -top-1 -right-1 text-lg bg-surface-elevated rounded-full p-1 shadow-md">
                <span title={`Status: ${data.status}`}>{getStatusIcon()}</span>
              </div>
            )}

            {/* Cult Icon - Bottom Center */}
            {getCultIcon() && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 shadow-md">
                <div className="relative w-full h-full">
                  {/* Background with cult-specific color */}
                  <div
                    className={`absolute inset-0 rounded-full ${
                      data.cult?.name === "Fire"
                        ? "bg-red-400"
                        : data.cult?.name === "Water"
                        ? "bg-blue-400"
                        : data.cult?.name === "Air"
                        ? "bg-sky-300"
                        : data.cult?.name === "Earth"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    }`}
                  />
                  {/* Cult Icon */}
                  <img
                    src={getCultIcon()!}
                    alt="Cult affiliation"
                    className="absolute inset-0 w-full h-full object-contain py-3.5 px-1"
                    title={
                      data.cult?.name
                        ? `${data.cult.name} Cult`
                        : "Cult Affiliation"
                    }
                  />
                  {/* Frame Overlay */}
                  <img
                    src="/src/assets/ui/cult-icon-frame.webp"
                    alt="Cult icon frame"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  {/* Frame Color Overlay */}
                  <div
                    className={`absolute inset-0 rounded-full pointer-events-none mix-blend-multiply ${
                      data.cult?.name === "Fire"
                        ? "bg-red-400"
                        : data.cult?.name === "Water"
                        ? "bg-blue-400"
                        : data.cult?.name === "Air"
                        ? "bg-sky-300"
                        : data.cult?.name === "Earth"
                        ? "bg-yellow-400"
                        : "bg-violet-400"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Enclave Banner - Below Avatar */}
          {enclaveBanner && (
            <div className="absolute top-[110px] left-6 -z-10">
              <img
                src={enclaveBanner}
                alt="Enclave banner"
                className="w-20 h-auto object-contain opacity-90 drop-shadow-sm"
              />
            </div>
          )}
        </div>
        {/* Main Character Info Section */}
        <div className="flex-1">
          <div className="relative">
            <div className="pl-28 pr-1">
              {/* Character Basic Info */}
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-primary mb-1">
                  <a
                    href={`/characters/${character.id}`}
                    className={`${styling.accent} hover:underline transition-colors`}
                    style={
                      styling.customColor ? { color: styling.customColor } : {}
                    }
                  >
                    {data.name}
                  </a>
                </h3>
                <p className="text-sm text-secondary mb-1">
                  {data.subrace ? `${data.subrace} ${data.race}` : data.race}
                </p>
                {((data.classes && data.classes.length > 0) ||
                  (data.class && data.class.length > 0)) && (
                  <div className="space-y-1">
                    {getAllClasses().map((classInfo, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 p-1 shadow-sm">
                            <img
                              src={getClassIcon(classInfo.name)}
                              alt={`${classInfo.name} class icon`}
                              className="w-full h-full object-contain filter brightness-0 invert"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary font-medium">
                            {getOrdinalSuffix(classInfo.level)} level{" "}
                            {classInfo.name}
                          </p>
                          {classInfo.subclass && (
                            <p className="text-xs text-tertiary truncate">
                              {classInfo.subclass}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  {/* Location */}
                  {data.birthplace && (
                    <div className="text-xs text-muted mb-2 flex items-center">
                      <span>Originally from {data.birthplace}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pl-28 pr-1">
            {/* Description */}
            {data.description && variant !== "compact" && (
              <p className="text-sm text-secondary line-clamp-2 mb-3">
                {data.description}
              </p>
            )}

            {/* Roles & Tags */}
            <div className="space-y-2">
              {data.roles && data.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.roles.slice(0, 3).map((role, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${styling.tagColor}`}
                    >
                      {role}
                    </span>
                  ))}
                  {data.roles.length > 3 && (
                    <span className="text-xs text-muted">
                      +{data.roles.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded bg-surface-tertiary text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                  {data.tags.length > 4 && (
                    <span className="text-xs text-muted">
                      +{data.tags.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ability Scores Section - Bottom of Card */}
      {data.ability_scores && (
        <div className="bg-surface-tertiary border-primary">
          <div className="grid grid-cols-6">
            {Object.entries(data.ability_scores)
              .filter(([, score]) => score !== undefined)
              .map(([ability, score]) => {
                const modifier = getAbilityModifier(score!);
                const abilityShort = ability.toUpperCase();

                return (
                  <div
                    key={ability}
                    className="flex flex-col items-center bg-surface-elevated border border-primary"
                  >
                    {/* Ability Name */}
                    <div className="text-xs font-semibold text-tertiary mb-1">
                      {abilityShort}
                    </div>

                    {/* Score */}
                    <div className="text-lg font-bold text-primary leading-none">
                      {score}
                    </div>

                    {/* Modifier */}
                    <div
                      className={`text-xs font-bold px-1.5 py-0.5 rounded mt-1 ${
                        modifier >= 0
                          ? "bg-success text-primary"
                          : "bg-hero-red text-primary"
                      }`}
                    >
                      {formatModifier(modifier)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
