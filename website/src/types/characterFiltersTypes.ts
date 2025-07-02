import {
  CHARACTER_TYPES,
  CHARACTER_STATUSES,
  CHARACTER_ROLES,
  CHARACTER_LOCATIONS,
  CHARACTER_CULTS,
  CHARACTER_SORT_OPTIONS,
  CHARACTER_CLASSES,
} from "../consts";

// Character filters for the CharacterFilters component
export interface CharacterFilters {
  search: string;
  type: "all" | (typeof CHARACTER_TYPES)[number];
  status: "all" | (typeof CHARACTER_STATUSES)[number];
  location: "all" | (typeof CHARACTER_LOCATIONS)[number];
  race: "all" | string;
  enclave: "all" | string;
  cult: "all" | (typeof CHARACTER_CULTS)[number];
  organization: "all" | string;
  class: "all" | (typeof CHARACTER_CLASSES)[number] | string;
  role: "all" | (typeof CHARACTER_ROLES)[number];
  active: "all" | "active" | "inactive";
  tags: string[];
  sortBy: (typeof CHARACTER_SORT_OPTIONS)[number]["value"];
  sortOrder: "asc" | "desc";
}

export interface CharacterFiltersProps {
  onFiltersChange: (filters: CharacterFilters) => void;
  totalCount: number;
  filteredCount: number;
  allTags?: string[];
  allClasses?: string[];
  allRaces?: string[];
  allEnclaves?: string[];
  allCults?: string[];
  allOrganizations?: string[];
}
