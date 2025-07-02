import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import {
  CHARACTER_TYPES,
  CHARACTER_STATUSES,
  CHARACTER_ROLES,
  CHARACTER_LOCATIONS,
  CHARACTER_CULTS,
  CHARACTER_SORT_OPTIONS,
  CHARACTER_CLASSES,
} from "../../consts";
import type {
  CharacterFilters,
  CharacterFiltersProps,
} from "../../types/characterFiltersTypes";

const CharacterFilters: React.FC<CharacterFiltersProps> = ({
  onFiltersChange,
  totalCount,
  filteredCount,
  allTags = [],
  allClasses = [],
  allRaces = [],
  allEnclaves = [],
  allCults = [],
  allOrganizations = [],
}) => {
  const [filters, setFilters] = useState<CharacterFilters>({
    search: "",
    type: "all",
    status: "all",
    location: "all",
    race: "all",
    enclave: "all",
    cult: "all",
    organization: "all",
    class: "all",
    role: "all",
    active: "all",
    tags: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const updateFilters = (newFilters: Partial<CharacterFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Update filters when selectedTags changes
  useEffect(() => {
    updateFilters({ tags: selectedTags });
  }, [selectedTags]);

  // Function to get icon path for character roles
  const getRoleIconPath = (role: string) => {
    return `/src/assets/icons/role-icon-${role}.png`;
  };

  // Function to get icon path for character classes
  const getClassIconPath = (className: string) => {
    return `/src/assets/icons/class-icon-${className.toLowerCase()}.svg`;
  };

  // Function to get icon path for cults
  const getCultIconPath = (cultName: string) => {
    return `/src/assets/icons/cult-icon-${cultName.toLowerCase()}.webp`;
  };

  // Function to get banner path for enclaves
  const getEnclaveBannerPath = (enclaveName: string) => {
    const normalized = enclaveName.toLowerCase().replace(/\s+/g, "-");
    return `/src/assets/banners/${normalized}-banner.svg`;
  };

  // Function to get icon path for enclaves
  const getEnclaveIconPath = (enclaveName: string) => {
    // Map enclave names to their corresponding icon filename parts
    const enclaveMap: Record<string, string> = {
      "lord's alliance": "alliance",
      "lords alliance": "alliance",
      "emerald enclave": "emerald",
      "order of the gauntlet": "gauntlet",
      harpers: "harpers",
      zhentarim: "zhentarim",
    };

    const normalized = enclaveName.toLowerCase();
    const iconName = enclaveMap[normalized] || normalized.replace(/\s+/g, "");
    return `/src/assets/icons/enclave-icon-${iconName}.svg`;
  };

  return (
    <div className="bg-surface">
      <div className="flex flex-col gap-4 px-1">
        {/* Character Type Filter - with icons */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Character Type
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => updateFilters({ type: "all" })}
              variant={filters.type === "all" ? "primary" : "secondary"}
              size="sm"
              className="rounded-full text-xs"
            >
              All Types
            </Button>
            {CHARACTER_TYPES.map((type) => (
              <Button
                key={type}
                onClick={() => updateFilters({ type })}
                variant={filters.type === type ? "primary" : "secondary"}
                size="sm"
                className={`rounded-full text-xs ${
                  filters.type === "npc" && type === "npc" ? "bg-green-500" : ""
                } ${
                  filters.type === "sidekick" && type === "sidekick"
                    ? "bg-purple-500"
                    : ""
                }`}
              >
                {type === "pc" ? "PCs" : type === "npc" ? "NPCs" : "Sidekicks"}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => updateFilters({ status: "all" })}
              variant={filters.status === "all" ? "primary" : "secondary"}
              size="sm"
              className="rounded-full text-xs"
            >
              All
            </Button>
            {CHARACTER_STATUSES.map((status) => (
              <Button
                key={status}
                onClick={() => updateFilters({ status })}
                variant={filters.status === status ? "primary" : "secondary"}
                size="sm"
                className="rounded-full text-xs"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Active/Inactive Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => updateFilters({ active: "all" })}
              variant={filters.active === "all" ? "primary" : "secondary"}
              size="sm"
              className="rounded-full text-xs"
            >
              All
            </Button>
            <Button
              onClick={() => updateFilters({ active: "active" })}
              variant={filters.active === "active" ? "primary" : "secondary"}
              size="sm"
              className={`rounded-full text-xs ${
                filters.active === "active" ? "bg-green-500" : ""
              }`}
            >
              Active
            </Button>
            <Button
              onClick={() => updateFilters({ active: "inactive" })}
              variant={filters.active === "inactive" ? "primary" : "secondary"}
              size="sm"
              className={`rounded-full text-xs ${
                filters.active === "inactive" ? "bg-red-500" : ""
              }`}
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Locations</option>
            {CHARACTER_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location === "red-larch"
                  ? "Red Larch"
                  : location.charAt(0).toUpperCase() + location.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Character Roles Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Character Role
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => updateFilters({ role: "all" })}
              variant={filters.role === "all" ? "primary" : "secondary"}
              size="sm"
            >
              All Roles
            </Button>
            {CHARACTER_ROLES.map((role) => (
              <Button
                key={role}
                onClick={() => updateFilters({ role })}
                variant={filters.role === role ? "primary" : "secondary"}
                size="sm"
                className="flex items-center gap-1"
              >
                <img
                  src={getRoleIconPath(role)}
                  alt={`${role} role`}
                  className="w-4 h-4"
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          {/* Race Filter */}
          {allRaces.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Race
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateFilters({ race: "all" })}
                  variant={filters.race === "all" ? "primary" : "secondary"}
                  size="sm"
                  className="rounded-full text-xs"
                >
                  All Races
                </Button>
                {allRaces.map((race) => (
                  <Button
                    key={race}
                    onClick={() => updateFilters({ race })}
                    variant={filters.race === race ? "primary" : "secondary"}
                    size="sm"
                    className="rounded-full text-xs"
                  >
                    {race.charAt(0).toUpperCase() + race.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Class Filter */}
          {(allClasses.length > 0 || CHARACTER_CLASSES.length > 0) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateFilters({ class: "all" })}
                  variant={filters.class === "all" ? "primary" : "secondary"}
                  size="sm"
                  className="rounded-full text-xs"
                >
                  All Classes
                </Button>
                {CHARACTER_CLASSES.map((className) => (
                  <Button
                    key={className}
                    onClick={() => updateFilters({ class: className })}
                    variant={
                      filters.class === className ? "primary" : "secondary"
                    }
                    size="sm"
                    className="flex items-center gap-1 rounded-full text-xs"
                  >
                    <img
                      src={getClassIconPath(className)}
                      alt={`${className} class`}
                      className="w-4 h-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {className.charAt(0).toUpperCase() + className.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Enclave Filter */}
          {allEnclaves.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enclave
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateFilters({ enclave: "all" })}
                  variant={filters.enclave === "all" ? "primary" : "secondary"}
                  size="sm"
                  className="rounded-full text-xs"
                >
                  All Enclaves
                </Button>
                {allEnclaves.map((enclave) => (
                  <Button
                    key={enclave}
                    onClick={() => updateFilters({ enclave })}
                    variant={
                      filters.enclave === enclave ? "primary" : "secondary"
                    }
                    size="sm"
                    className="flex items-center gap-1 rounded-full text-xs"
                  >
                    <img
                      src={getEnclaveIconPath(enclave)}
                      alt={`${enclave} enclave`}
                      className="w-4 h-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {enclave}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Organization Filter */}
          {allOrganizations.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => updateFilters({ organization: "all" })}
                  variant={
                    filters.organization === "all" ? "primary" : "secondary"
                  }
                  size="sm"
                  className="rounded-full text-xs"
                >
                  All Organizations
                </Button>
                {allOrganizations.map((org) => (
                  <Button
                    key={org}
                    onClick={() => updateFilters({ organization: org })}
                    variant={
                      filters.organization === org ? "primary" : "secondary"
                    }
                    size="sm"
                    className="rounded-full text-xs"
                  >
                    {org}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Cult Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Elemental Cult
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => updateFilters({ cult: "all" })}
                variant={filters.cult === "all" ? "primary" : "secondary"}
                size="sm"
              >
                All
              </Button>
              {CHARACTER_CULTS.filter((cult) => cult !== "Eye").map((cult) => (
                <Button
                  key={cult}
                  onClick={() => updateFilters({ cult })}
                  variant={filters.cult === cult ? "primary" : "secondary"}
                  size="sm"
                  className="flex items-center justify-center gap-1"
                >
                  <img
                    src={getCultIconPath(cult)}
                    alt={`${cult} cult`}
                    className="w-5 h-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {cult}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags Filter (Multiselect) */}
          {allTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    onClick={() => {
                      const newTags = selectedTags.includes(tag)
                        ? selectedTags.filter((t) => t !== tag)
                        : [...selectedTags, tag];
                      setSelectedTags(newTags);
                    }}
                    variant={
                      selectedTags.includes(tag) ? "primary" : "secondary"
                    }
                    size="sm"
                    className="rounded-full text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterFilters;
