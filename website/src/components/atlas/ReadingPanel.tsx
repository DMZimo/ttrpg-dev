import React, { useEffect, useState } from "react";
import type { AtlasLocation, AtlasMap } from "@/types";

interface ReadingPanelProps {
  location: AtlasLocation | null;
  relatedMap?: AtlasMap | null;
  onClose: () => void;
  onMapChange?: (mapId: string) => void;
  isVisible: boolean;
}

export function ReadingPanel({
  location,
  relatedMap,
  onClose,
  onMapChange,
  isVisible,
}: ReadingPanelProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Generate content when location changes
  useEffect(() => {
    if (!location || !isVisible) {
      setContent("");
      return;
    }

    setLoading(true);
    
    // Generate content from location data
    const generatedContent = generateContentFromLocation(location);
    setContent(generatedContent);
    setLoading(false);
  }, [location, isVisible]);

  const generateContentFromLocation = (location: AtlasLocation): string => {
    const data = location.data;
    let content = `# ${location.name}\n\n`;

    // Add basic info with icons
    content += `📍 **Type:** ${location.type.charAt(0).toUpperCase() + location.type.slice(1)}\n`;
    content += `🗺️ **Category:** ${location.category.charAt(0).toUpperCase() + location.category.slice(1)}\n\n`;

    // Add description if available
    if (location.description) {
      content += `${location.description}\n\n`;
    }

    // Add demographic information
    if (data.demographics?.population || data.political?.population) {
      content += `## 👥 Demographics\n\n`;
      
      const population = data.demographics?.population || data.political?.population;
      if (population) {
        content += `**Population:** ${population.toLocaleString()}\n`;
      }
      
      if (data.demographics?.size_category) {
        content += `**Size Category:** ${data.demographics.size_category}\n`;
      }
      
      if (data.demographics?.dominant_race) {
        content += `**Dominant Race:** ${data.demographics.dominant_race}\n`;
      }
      
      if (data.demographics?.racial_mix && data.demographics.racial_mix.length > 0) {
        content += `**Racial Composition:**\n`;
        data.demographics.racial_mix.forEach((mix: any) => {
          content += `- ${mix.race}: ${mix.percentage}%\n`;
        });
      }
      content += `\n`;
    }

    // Add governance information
    if (data.governance?.government_type || data.political?.government_type) {
      content += `## 👑 Governance\n\n`;
      
      const govType = data.governance?.government_type || data.political?.government_type;
      if (govType) {
        content += `**Government Type:** ${govType}\n`;
      }
      
      const ruler = data.governance?.ruler || data.political?.ruler;
      if (ruler) {
        content += `**Ruler:** ${ruler}\n`;
      }
      
      if (data.governance?.laws) {
        content += `**Laws:** ${data.governance.laws}\n`;
      }
      
      if (data.governance?.guards) {
        content += `**Guards:** ${data.governance.guards}\n`;
      }
      
      if (data.political?.allegiances && data.political.allegiances.length > 0) {
        content += `**Allegiances:** ${data.political.allegiances.join(", ")}\n`;
      }
      content += `\n`;
    }

    // Add geographic information
    if (data.geographic) {
      content += `## 🏔️ Geography\n\n`;
      
      if (data.geographic.area_sq_miles) {
        content += `**Area:** ${data.geographic.area_sq_miles.toLocaleString()} square miles\n`;
      }
      
      if (data.geographic.terrain_type) {
        content += `**Terrain:** ${data.geographic.terrain_type}\n`;
      }
      
      if (data.geographic.climate) {
        content += `**Climate:** ${data.geographic.climate}\n`;
      }
      
      if (data.geographic.elevation_feet) {
        content += `**Elevation:** ${data.geographic.elevation_feet.toLocaleString()} feet\n`;
      }
      
      if (data.geographic.major_rivers && data.geographic.major_rivers.length > 0) {
        content += `**Major Rivers:** ${data.geographic.major_rivers.join(", ")}\n`;
      }
      
      if (data.geographic.major_roads && data.geographic.major_roads.length > 0) {
        content += `**Major Roads:** ${data.geographic.major_roads.join(", ")}\n`;
      }
      content += `\n`;
    }

    // Add economy information
    if (data.economy) {
      content += `## 💰 Economy\n\n`;
      
      if (data.economy.wealth_level) {
        content += `**Wealth Level:** ${data.economy.wealth_level}\n`;
      }
      
      if (data.economy.primary_trade && data.economy.primary_trade.length > 0) {
        content += `**Primary Trade:** ${data.economy.primary_trade.join(", ")}\n`;
      }
      
      if (data.economy.currency) {
        content += `**Currency:** ${data.economy.currency}\n`;
      }
      
      if (data.economy.taxation) {
        content += `**Taxation:** ${data.economy.taxation}\n`;
      }
      content += `\n`;
    }

    // Add hierarchy information
    if (data.parent_continent || data.parent_region || data.sub_regions || data.major_settlements) {
      content += `## 🏛️ Hierarchy\n\n`;
      
      if (data.parent_continent) {
        content += `**Continent:** ${data.parent_continent}\n`;
      }
      
      if (data.parent_region) {
        content += `**Region:** ${data.parent_region}\n`;
      }
      
      if (data.sub_regions && data.sub_regions.length > 0) {
        content += `**Sub-regions:** ${data.sub_regions.join(", ")}\n`;
      }
      
      if (data.major_settlements && data.major_settlements.length > 0) {
        content += `**Major Settlements:** ${data.major_settlements.join(", ")}\n`;
      }
      content += `\n`;
    }

    // Add districts (for settlements)
    if (data.districts && data.districts.length > 0) {
      content += `## 🏘️ Districts\n\n`;
      data.districts.forEach((district: string) => {
        content += `- ${district}\n`;
      });
      content += `\n`;
    }

    // Add notable locations
    if (data.notable_locations && data.notable_locations.length > 0) {
      content += `## 🏰 Notable Locations\n\n`;
      data.notable_locations.forEach((location: any) => {
        if (typeof location === 'string') {
          content += `- ${location}\n`;
        } else if (location.name) {
          content += `- **${location.name}**`;
          if (location.description) {
            content += `: ${location.description}`;
          }
          content += `\n`;
        }
      });
      content += `\n`;
    }

    // Add points of interest
    if (data.points_of_interest && data.points_of_interest.length > 0) {
      content += `## ⭐ Points of Interest\n\n`;
      data.points_of_interest.forEach((poi: string) => {
        content += `- ${poi}\n`;
      });
      content += `\n`;
    }

    // Add tags
    if (data.tags && data.tags.length > 0) {
      content += `## 🏷️ Tags\n\n`;
      content += data.tags.map((tag: string) => `\`${tag}\``).join(" ");
      content += `\n\n`;
    }

    return content;
  };

  const formatMarkdown = (markdown: string): string => {
    // Simple markdown to HTML conversion for basic formatting
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-primary mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-primary mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-primary mb-2 mt-4">$1</h3>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="font-semibold text-primary">$1</strong>')
      .replace(/^\*(.*?)\*/gm, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/`(.*?)`/g, '<code class="bg-surface-elevated px-1 py-0.5 text-sm border border-primary">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Reading Panel */}
      <div
        className={`fixed left-4 top-20 bottom-4 w-96 bg-surface border border-primary shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary bg-surface-elevated">
          <div className="flex items-center gap-3">
            {location && (
              <>
                <span className="text-xl">
                  {location.category === "continent"
                    ? "🌍"
                    : location.category === "region"
                    ? "🏞️"
                    : location.type === "city"
                    ? "🏰"
                    : location.type === "town"
                    ? "🏘️"
                    : location.type === "village" || location.type === "hamlet"
                    ? "🏠"
                    : "📍"}
                </span>
                <div>
                  <h2 className="font-bold text-primary text-lg">
                    {location.name}
                  </h2>
                  <p className="text-sm text-secondary">
                    {location.type} • {location.category}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-icon w-8 h-8 text-secondary hover:text-primary"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Related Map Button */}
        {relatedMap && onMapChange && (
          <div className="p-3 border-b border-primary bg-surface-secondary">
            <button
              onClick={() => {
                onMapChange(relatedMap.id);
                onClose();
              }}
              className="w-full btn-secondary py-2 px-3 text-sm flex items-center gap-2 hover:bg-hero-red hover:text-white transition-colors"
            >
              🗺️ View on {relatedMap.name}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 reading-panel-content">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-hero-red"></div>
              <span className="ml-2 text-secondary">Loading...</span>
            </div>
          )}

          {content && !loading && (
            <div
              className="prose prose-sm max-w-none text-primary"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-primary bg-surface-elevated text-xs text-secondary">
          <div className="flex justify-between items-center">
            <span>Atlas Entry</span>
            {location?.data?.updated && (
              <span>Updated: {location.data.updated}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
