import React from "react";
import type { Character } from "../../../types/characterTypes";
import acBadge from "@/assets/ui/ac-badge.webp";
import hpBadge from "@/assets/ui/hp-badge.webp";

interface CharacterHeaderProps {
  character: Character;
  variant?: "default" | "compact" | "detailed";
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
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
          return "/src/assets/banners/emerald-enclave-banner.svg";
        case "harpers":
          return "/src/assets/banners/harpers-banner.svg";
        case "lords' alliance":
        case "lords alliance":
        case "lord's alliance": // Added this variant to catch common typo
          return "/src/assets/banners/lords-alliance-banner.svg";
        case "order of the gauntlet":
          return "/src/assets/banners/order-of-the-gauntlet-banner.svg";
        case "zhentarim":
          return "/src/assets/banners/zhentarim-banner.svg";
        default:
          return "/src/assets/banners/unknown-banner.svg";
      }
    }

    // Check organization field as fallback
    if (data.organization) {
      const orgName = data.organization.name.toLowerCase();
      switch (orgName) {
        case "emerald enclave":
          return "/src/assets/banners/emerald-enclave-banner.svg";
        case "harpers":
          return "/src/assets/banners/harpers-banner.svg";
        case "lords' alliance":
        case "lords alliance":
        case "lord's alliance": // Added this variant to catch common typo
          return "/src/assets/banners/lords-alliance-banner.svg";
        case "order of the gauntlet":
          return "/src/assets/banners/order-of-the-gauntlet-banner.svg";
        case "zhentarim":
          return "/src/assets/banners/zhentarim-banner.svg";
        default:
          return "/src/assets/banners/unknown-banner.svg";
      }
    }

    // Check tags for enclave affiliation
    if (data.tags) {
      if (data.tags.includes("emerald-enclave")) {
        return "/src/assets/banners/emerald-enclave-banner.svg";
      }
      if (data.tags.includes("harpers")) {
        return "/src/assets/banners/harpers-banner.svg";
      }
      if (data.tags.includes("lords-alliance")) {
        return "/src/assets/banners/lords-alliance-banner.svg";
      }
      if (data.tags.includes("order-of-the-gauntlet")) {
        return "/src/assets/banners/order-of-the-gauntlet-banner.svg";
      }
      if (data.tags.includes("zhentarim")) {
        return "/src/assets/banners/zhentarim-banner.svg";
      }
    }

    // Return the unknown banner as fallback when no enclave is specified
    return "/src/assets/banners/unknown-banner.svg";
  };

  // Get cult icon for cult members
  const getCultIcon = () => {
    if (!data.cult?.name) return null;

    const cultName = data.cult.name;

    switch (cultName) {
      case "Fire":
        return "/src/assets/icons/cult-icon-fire.svg";
      case "Water":
        return "/src/assets/icons/cult-icon-water.svg";
      case "Air":
        return "/src/assets/icons/cult-icon-air.svg";
      case "Earth":
        return "/src/assets/icons/cult-icon-earth.svg";
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

  // Get role icon for character roles
  const getRoleIcon = (roleName: string) => {
    const roleNameLower = roleName.toLowerCase();
    return `/src/assets/icons/role-icon-${roleNameLower}.png`;
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
      className={`relative flex flex-col
      h-40 w-[500px] mb-18 mr-0 rounded-2xl rounded-tl-[120px]
      ${styling.gradient} ${styling.border} border 
      ${data.type === "pc" ? "shadow-lg" : "shadow"} 
      transition-all duration-300 transform backdrop-blur-sm
    `}
      style={
        styling.customColor
          ? {
              borderColor: styling.customColor + "40",
              background: `linear-gradient(135deg, ${styling.customColor}10, ${styling.customColor}50)`,
              ...(data.type === "pc" && {
                boxShadow: `0 10px 15px -3px ${styling.customColor}40, 0 4px 6px -2px ${styling.customColor}20`,
              }),
            }
          : data.type === "pc"
          ? {
              boxShadow:
                "0 10px 15px -3px rgb(217 119 6 / 0.25), 0 4px 6px -2px rgb(217 119 6 / 0.125)",
            }
          : {}
      }
    >
      <div className="flex gap-4 pt-4 px-2 relative">
        {/* Avatar positioned at top left */}
        <div
          className={`absolute -top-0 -left-5 rounded-full z-10 ${
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
            <img
              src="/src/assets/ui/portrait-background.png"
              alt="portrait background"
              className={"absolute inset-0 w-full h-full rounded-full"}
            />

            <div className="relative w-32 h-32">
              <img
                src={getPortraitPath()}
                alt={`${data.name} portrait`}
                className={`w-full h-full rounded-full object-cover object-top ${
                  data.type === "pc"
                    ? "ring-2 ring-amber-500 ring-opacity-70"
                    : ""
                }`}
                style={
                  data.type === "pc" && data.color
                    ? ({
                        "--tw-ring-color": `${data.color}B3`, // Using B3 for 70% opacity
                      } as React.CSSProperties)
                    : {}
                }
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/src/assets/portraits/placeholder-portrait.png";
                }}
              />
              {/* Death Overlay - Only show if character is dead */}
              {data.status === "dead" && (
                <img
                  src="/src/assets/ui/portrait-overlay-death.png"
                  alt="Death overlay"
                  className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none"
                />
              )}
              {/* Portrait Frame Overlay based on character type */}
              <img
                src={
                  data.type === "pc"
                    ? "/src/assets/ui/portrait-frame-pc.png"
                    : data.type === "npc"
                    ? "/src/assets/ui/portrait-frame-npc.png"
                    : "/src/assets/ui/portrait-frame-sidekick.png"
                }
                alt={`${data.type.toUpperCase()} portrait frame`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Level Badge - Top Left */}
            {getCurrentLevel() && (
              <div className="absolute -top-1 -right-2 flex items-center">
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

            {/* Status Icon - Only show if not alive and not dead - Top Right */}
            {data.status !== "alive" && data.status !== "dead" && (
              <div className="absolute -top-1 -left-1 text-lg bg-surface-elevated rounded-full p-1 shadow-md">
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
                    className="absolute inset-0 w-full h-full object-contain py-3 px-0.5"
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
            <div className="absolute top-[70px] left-0 -z-10">
              <img
                src={enclaveBanner}
                alt="Enclave banner"
                className={`w-32 h-auto object-contain ${
                  data.type === "pc" ? "drop-shadow-md" : "drop-shadow-sm"
                }`}
                style={
                  data.type === "pc" && data.color
                    ? { filter: `drop-shadow(0 4px 3px ${data.color}30)` }
                    : {}
                }
              />
            </div>
          )}
        </div>
        {/* Main Character Info Section */}
        <div className="flex-1">
          <div className="relative flex min-h-32">
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
                          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 p-1 shadow-sm">
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
              </div>
            </div>
            <div className="absolute -top-2.5 -right-0.5">
              {/* Ability Scores Section - Left of Card */}
              {data.ability_scores && (
                <div className="grid grid-cols-3 gap-1.5 right-0 top-6">
                  {Object.entries(data.ability_scores)
                    .filter(([, score]) => score !== undefined)
                    .map(([ability, score]) => {
                      const modifier = getAbilityModifier(score!);
                      const abilityShort = ability.toUpperCase();

                      return (
                        <div
                          key={ability}
                          className="w-12 h-10 flex flex-col items-center bg-surface-elevated shadow-amber-100 shadow-sm rounded-md"
                        >
                          {/* Ability Name */}
                          <div className="text-xs text-tertiary mb-0.5">
                            {abilityShort}
                            {formatModifier(modifier)}
                          </div>

                          {/* Score */}
                          <div className="text-xs font-bold text-primary leading-none">
                            {score}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/*Roles */}
              <div className="flex items-center gap-2 mt-2">
                {data.roles && data.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.roles.map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center group relative"
                      >
                        <img
                          src={getRoleIcon(role)}
                          alt={role}
                          className="w-6 h-6 object-contain"
                          title={role.charAt(0).toUpperCase() + role.slice(1)}
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Combat Stats */}
      <div className="absolute flex w-fit top-36 left-75">
        <div className="grid grid-cols-3 gap-2">
          {data.hp && (
            <div className="text-xs font-semibold text-text-tertiary mb-0.5 w-12 h-12 relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-[#FF5555]">
                HP
              </span>
              <img
                src={hpBadge.src}
                alt="HP Badge"
                className="absolute top-1/2 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/2 w-full h-auto z-10 filter brightness-100 sepia-0 hue-rotate-0 saturate-100 invert-0 opacity-100"
                style={{
                  filter:
                    "sepia(1) hue-rotate(-50deg) saturate(5) brightness(0.9)",
                }}
              />
              <span className="absolute top-5.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold z-20 text-white">
                {data.hp}
              </span>
            </div>
          )}
          {data.ac && (
            <div className="text-xs font-semibold text-text-tertiary w-12 h-12 relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-[#77AAFF]">
                AC
              </span>
              <img
                src={acBadge.src}
                alt="AC Badge"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto z-10 filter brightness-100 sepia-0 hue-rotate-0 saturate-100 invert-0 opacity-100"
                style={{
                  filter:
                    "sepia(1) hue-rotate(-180deg) saturate(5) brightness(0.9)",
                }}
              />
              <span className="absolute top-5.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold z-20 text-white">
                {data.ac}
              </span>
            </div>
          )}
          {data.mr && (
            <div className="text-xs font-semibold text-text-tertiary w-12 h-12 relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-[#77AAFF]">
                MR
              </span>
              <img
                src={acBadge.src}
                alt="AC Badge"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-auto z-10 filter brightness-100 sepia-0 hue-rotate-0 saturate-100 invert-0 opacity-100"
                style={{
                  filter:
                    "sepia(1) hue-rotate(-180deg) saturate(5) brightness(0.9)",
                }}
              />
              <span className="absolute top-5.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-md font-bold z-20 text-white">
                {data.mr}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute flex w-fit top-42 left-24 bg-surface-tertiary p-1 pl-4 rounded">
        {data.owner && (
          <div className="flex gap-1">
            <span className="text-xs text-text-primary break-words">
              Played by <br /> {data.owner}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
