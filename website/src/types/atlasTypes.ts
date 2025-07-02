export interface AtlasMap {
  id: string;
  name: string;
  description: string;
  image: any; // ImageMetadata from Astro
  type: string;
  scale: string;
  parentMap?: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface AtlasLocation {
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  data: any; // The original content data
  coordinates: {
    lat: number;
    lng: number;
  };
  mapId: string; // Which map this location should be displayed on
}

export interface LocationData {
  // Common fields
  name: string;
  type: string;
  aliases?: string[];
  tags?: string[];
  sources?: string[];
  updated?: string;

  // Geographic
  geographic?: {
    area_sq_miles?: number;
    terrain_type?: string;
    elevation_feet?: number;
    climate?: string;
    major_rivers?: string[];
    major_roads?: string[];
  };

  // Political
  political?: {
    government_type?: string;
    ruler?: string;
    capital?: string;
    population?: number;
    allegiances?: string[];
  };

  // Demographics (for settlements)
  demographics?: {
    population?: number;
    size_category?: string;
    dominant_race?: string;
    racial_mix?: Array<{
      race: string;
      percentage: number;
    }>;
  };

  // Governance (for settlements)
  governance?: {
    government_type?: string;
    ruler?: string;
    laws?: string;
    guards?: string;
  };

  // Economy (for settlements)
  economy?: {
    wealth_level?: string;
    primary_trade?: string[];
    currency?: string;
    taxation?: string;
  };

  // Hierarchy
  parent_continent?: string;
  parent_region?: string;
  sub_regions?: string[];
  major_settlements?: string[];
  points_of_interest?: string[];

  // Atlas meta
  atlas_order?: number;
  map_available?: boolean;
}

export interface FilterOptions {
  categories: string[];
  types: string[];
}

export interface MapViewerRef {
  focusLocation: (location: AtlasLocation | null) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}
