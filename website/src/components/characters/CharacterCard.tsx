import React from "react";

interface Character {
  id: string;
  data: {
    name: string;
    race: string;
    subrace?: string;
    background?: string;
    portrait?: string;
    token?: string;
    class?: Array<{
      name: string;
      level: number;
      subclass?: string;
    }>;
    classes?: Array<{
      name: string;
      level: number;
      subclass?: string;
    }>;
    type: "pc" | "npc" | "sidekick";
    description?: string;
    status: string;
    active?: boolean;
    hp?: number;
    ac?: number;
    roles?: Array<{
      name: string;
    }>;
    tags?: string[];
    birthplace?: string;
    lastUpdated?: Date | string;
    color?: string;
    enclave?: {
      name: string;
      disposition: number;
    };
    organization?: {
      name: string;
      disposition: number;
    };
    ability_scores?: {
      str?: number;
      dex?: number;
      con?: number;
      int?: number;
      wis?: number;
      cha?: number;
    };
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
        border: "border-gray-200 dark:border-gray-700",
        gradient:
          "bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80",
        accent: "text-gray-800 dark:text-gray-200",
        tagColor:
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
        customColor: data.color,
      };
    }

    // Fallback to type-based styling
    switch (data.type) {
      case "pc":
        return {
          border: "border-blue-200 dark:border-blue-800",
          gradient:
            "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
          accent: "text-blue-600 dark:text-blue-400",
          tagColor:
            "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        };
      case "npc":
        if (
          data.tags?.includes("villain") ||
          data.tags?.includes("antagonist")
        ) {
          return {
            border: "border-red-200 dark:border-red-800",
            gradient:
              "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
            accent: "text-red-600 dark:text-red-400",
            tagColor:
              "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
          };
        } else if (data.tags?.includes("red-larch")) {
          return {
            border: "border-green-200 dark:border-green-800",
            gradient:
              "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
            accent: "text-green-600 dark:text-green-400",
            tagColor:
              "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
          };
        }
        return {
          border: "border-purple-200 dark:border-purple-800",
          gradient:
            "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
          accent: "text-purple-600 dark:text-purple-400",
          tagColor:
            "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
        };
      default:
        return {
          border: "border-gray-200 dark:border-gray-800",
          gradient: "bg-white dark:bg-gray-800",
          accent: "text-gray-600 dark:text-gray-400",
          tagColor:
            "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
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
    if (!data.tags) return null;

    if (
      data.tags.includes("fire-cult") ||
      data.tags.includes("eternal-flame")
    ) {
      return "/src/assets/icons/eternal_flam-icon.webp";
    }
    if (
      data.tags.includes("water-cult") ||
      data.tags.includes("crushing-wave")
    ) {
      return "/src/assets/icons/crushing-wave-icon.webp";
    }
    if (
      data.tags.includes("air-cult") ||
      data.tags.includes("howling-hatred")
    ) {
      return "/src/assets/icons/howling-hatred-icon.webp";
    }
    if (data.tags.includes("earth-cult") || data.tags.includes("black-earth")) {
      return "/src/assets/icons/black-earth-icon.webp";
    }

    return null;
  };

  // Get current level for display
  const getCurrentLevel = () => {
    const classes = data.classes || data.class || [];
    if (classes.length > 0) {
      return classes[0].level;
    }
    return null;
  };

  // Get ability score modifier
  const getAbilityModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
  };

  return (
    <div
      className={`
      ${styling.gradient} ${styling.border} border rounded-lg shadow-lg overflow-hidden
      hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
      relative
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
      <div className="relative">
        <div className="flex items-center p-6 pb-4">
          <div className="flex-shrink-0 relative">
            <img
              src={getPortraitPath()}
              alt={`${data.name} portrait`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/src/assets/portraits/placeholder-portrait.png";
              }}
            />

            {/* Cult Icon Overlay */}
            {getCultIcon() && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-700 p-1 shadow-md">
                <img
                  src={getCultIcon()!}
                  alt="Cult affiliation"
                  className="w-full h-full object-contain"
                  title={`${data.tags
                    ?.find((tag) => tag.includes("cult"))
                    ?.replace("-cult", "")
                    .replace("-", " ")
                    .toUpperCase()} Cult`}
                />
              </div>
            )}

            {/* Status Icon - Only show if not alive */}
            {data.status !== "alive" && (
              <div className="absolute -top-1 -left-1 text-lg bg-white dark:bg-gray-700 rounded-full p-1 shadow-md">
                <span title={`Status: ${data.status}`}>{getStatusIcon()}</span>
              </div>
            )}
          </div>

          {/* Character Basic Info */}
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {data.subrace ? `${data.subrace} ${data.race}` : data.race}
            </p>
            {((data.classes && data.classes.length > 0) ||
              (data.class && data.class.length > 0)) && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {(data.classes?.[0] || data.class?.[0])?.name}
                {getCurrentLevel() && (
                  <span className="ml-2 inline-flex items-center relative">
                    <img
                      src="/src/assets/ui/level-badge.webp"
                      alt="Level Badge"
                      className="w-8 h-8"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                      {getCurrentLevel()}
                    </span>
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Character Stats */}
          <div className="text-right flex items-center gap-2">
            {data.hp && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                HP: {data.hp}
              </div>
            )}
            {data.ac && (
              <div className="relative inline-flex items-center">
                <img
                  src="/src/assets/ui/ac-badge.webp"
                  alt="AC Badge"
                  className="w-10 h-10"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                  {data.ac}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enclave Banner */}
        {getEnclaveBanner() && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
            <div className="relative">
              <img
                src={getEnclaveBanner()!}
                alt="Enclave affiliation"
                className="h-8 w-auto drop-shadow-lg"
                title={`${
                  data.enclave?.name || data.organization?.name || "Faction"
                } Affiliation`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6 pt-2">
        {/* Location */}
        {data.birthplace && (
          <div className="text-xs text-gray-500 dark:text-gray-500 mb-2 flex items-center">
            <span>📍 {data.birthplace}</span>
          </div>
        )}

        {/* Description */}
        {data.description && variant !== "compact" && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
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
                  {role.name}
                </span>
              ))}
              {data.roles.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
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
                  className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {data.tags.length > 4 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{data.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
