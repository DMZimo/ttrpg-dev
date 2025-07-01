import { useState } from "react";

interface CelestialBody {
  id: string;
  name: string;
  type: "star" | "planet" | "moon" | "asteroid-cluster";
  data: any;
}

interface CelestialDetailPanelProps {
  body: CelestialBody | null;
  onClose: () => void;
}

export default function CelestialDetailPanel({
  body,
  onClose,
}: CelestialDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "physical" | "cultural" | "game"
  >("overview");

  if (!body) return null;

  const { data } = body;

  const tabs = [
    { id: "overview", label: "Overview", icon: "🌌" },
    { id: "physical", label: "Physical", icon: "⚪" },
    { id: "cultural", label: "Cultural", icon: "🏛️" },
    { id: "game", label: "Game Info", icon: "🎲" },
  ];

  const formatNumber = (num: number | undefined) => {
    if (!num) return "Unknown";
    return num.toLocaleString();
  };

  const formatDistance = (miles: number | undefined) => {
    if (!miles) return "Unknown";
    return `${miles.toLocaleString()} miles`;
  };

  const formatPeriod = (days: number | undefined) => {
    if (!days) return "Unknown";
    if (days < 1) return `${(days * 24).toFixed(1)} hours`;
    if (days < 30) return `${days.toFixed(1)} days`;
    if (days < 365) return `${(days / 30.4375).toFixed(1)} months`;
    return `${(days / 365.25).toFixed(1)} years`;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-accent-500/20 shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-surface-secondary border-b border-accent-500/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">{data.name}</h2>
            <p className="text-sm text-secondary capitalize">
              {data.type} • {data.subtype?.replace("-", " ")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-tertiary rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Aliases */}
        {data.aliases && data.aliases.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted mb-1">Also known as:</p>
            <div className="flex flex-wrap gap-1">
              {data.aliases.slice(0, 3).map((alias: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-surface-tertiary px-2 py-1 rounded text-secondary"
                >
                  {alias}
                </span>
              ))}
              {data.aliases.length > 3 && (
                <span className="text-xs text-muted">
                  +{data.aliases.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-surface-secondary border-b border-accent-500/20">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-surface border-b-2 border-gold-600 text-primary"
                  : "text-secondary hover:text-primary hover:bg-surface-tertiary"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="hero-card p-4">
              <h3 className="font-semibold text-primary mb-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted">Type:</span>
                  <p className="text-secondary capitalize">{data.type}</p>
                </div>
                <div>
                  <span className="text-muted">Size Class:</span>
                  <p className="text-secondary">
                    {data.spelljammer?.size || "Unknown"}
                  </p>
                </div>
                {data.inhabited && (
                  <div className="col-span-2">
                    <span className="text-muted">Inhabited:</span>
                    <p className="text-secondary">Yes</p>
                  </div>
                )}
                {data.orbital?.primary && (
                  <div className="col-span-2">
                    <span className="text-muted">Orbits:</span>
                    <p className="text-secondary capitalize">
                      {data.orbital.primary.replace("-", " ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Orbital Information */}
            {data.orbital && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">
                  Orbital Data
                </h3>
                <div className="space-y-2 text-sm">
                  {data.orbital.distance_miles && (
                    <div className="flex justify-between">
                      <span className="text-muted">Distance:</span>
                      <span className="text-secondary">
                        {formatDistance(data.orbital.distance_miles)}
                      </span>
                    </div>
                  )}
                  {data.orbital.period_days && (
                    <div className="flex justify-between">
                      <span className="text-muted">Orbital Period:</span>
                      <span className="text-secondary">
                        {formatPeriod(data.orbital.period_days)}
                      </span>
                    </div>
                  )}
                  {data.orbital.rotation_hours && (
                    <div className="flex justify-between">
                      <span className="text-muted">Day Length:</span>
                      <span className="text-secondary">
                        {data.orbital.rotation_hours} hours
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Visibility */}
            {data.visibility && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">Visibility</h3>
                <div className="space-y-2 text-sm">
                  {data.visibility.naked_eye !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted">Naked Eye:</span>
                      <span className="text-secondary">
                        {data.visibility.naked_eye ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                  {data.visibility.color && (
                    <div className="flex justify-between">
                      <span className="text-muted">Color:</span>
                      <span className="text-secondary">
                        {data.visibility.color}
                      </span>
                    </div>
                  )}
                  {data.visibility.magnitude !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted">Magnitude:</span>
                      <span className="text-secondary">
                        {data.visibility.magnitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "physical" && (
          <div className="space-y-4">
            {/* Physical Properties */}
            {data.physical && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">
                  Physical Properties
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Diameter:</span>
                    <span className="text-secondary">
                      {formatDistance(data.physical.diameter_miles)}
                    </span>
                  </div>
                  {data.physical.mass_earth && (
                    <div className="flex justify-between">
                      <span className="text-muted">Mass (Earth = 1):</span>
                      <span className="text-secondary">
                        {formatNumber(data.physical.mass_earth)}
                      </span>
                    </div>
                  )}
                  {data.physical.gravity_earth && (
                    <div className="flex justify-between">
                      <span className="text-muted">Gravity (Earth = 1):</span>
                      <span className="text-secondary">
                        {data.physical.gravity_earth}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted">Atmosphere:</span>
                    <span className="text-secondary capitalize">
                      {data.physical.atmosphere}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Temperature:</span>
                    <span className="text-secondary capitalize">
                      {data.physical.temperature}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-muted">Composition:</span>
                    <p className="text-secondary mt-1">
                      {data.physical.composition}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Special Features */}
            {data.special &&
              Object.keys(data.special).some(
                (key) => data.special[key]?.length > 0
              ) && (
                <div className="hero-card p-4">
                  <h3 className="font-semibold text-primary mb-3">
                    Special Features
                  </h3>
                  <div className="space-y-3 text-sm">
                    {data.special.magical_effects &&
                      data.special.magical_effects.length > 0 && (
                        <div>
                          <span className="text-muted">Magical Effects:</span>
                          <ul className="text-secondary mt-1 space-y-1">
                            {data.special.magical_effects.map(
                              (effect: string, index: number) => (
                                <li key={index} className="text-xs">
                                  • {effect}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {data.special.unique_features &&
                      data.special.unique_features.length > 0 && (
                        <div>
                          <span className="text-muted">Unique Features:</span>
                          <ul className="text-secondary mt-1 space-y-1">
                            {data.special.unique_features.map(
                              (feature: string, index: number) => (
                                <li key={index} className="text-xs">
                                  • {feature}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {data.special.dangers &&
                      data.special.dangers.length > 0 && (
                        <div>
                          <span className="text-muted">Dangers:</span>
                          <ul className="text-secondary mt-1 space-y-1">
                            {data.special.dangers.map(
                              (danger: string, index: number) => (
                                <li key={index} className="text-xs">
                                  • {danger}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}
          </div>
        )}

        {activeTab === "cultural" && (
          <div className="space-y-4">
            {/* Cultural Significance */}
            {data.cultural && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">
                  Cultural Significance
                </h3>
                <div className="space-y-3 text-sm">
                  {data.cultural.significance && (
                    <div>
                      <span className="text-muted">Significance:</span>
                      <p className="text-secondary mt-1">
                        {data.cultural.significance}
                      </p>
                    </div>
                  )}
                  {data.cultural.mythology && (
                    <div>
                      <span className="text-muted">Mythology:</span>
                      <p className="text-secondary mt-1">
                        {data.cultural.mythology}
                      </p>
                    </div>
                  )}
                  {data.cultural.calendar_use && (
                    <div>
                      <span className="text-muted">Calendar Use:</span>
                      <p className="text-secondary mt-1">
                        {data.cultural.calendar_use}
                      </p>
                    </div>
                  )}
                  {data.cultural.deities &&
                    data.cultural.deities.length > 0 && (
                      <div>
                        <span className="text-muted">Associated Deities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.cultural.deities.map(
                            (deity: string, index: number) => (
                              <span
                                key={index}
                                className="text-xs bg-surface-tertiary px-2 py-1 rounded text-secondary"
                              >
                                {deity}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Inhabitants */}
            {data.inhabited && (data.inhabitants || data.settlements) && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">Inhabitants</h3>
                <div className="space-y-3 text-sm">
                  {data.inhabitants && data.inhabitants.length > 0 && (
                    <div>
                      <span className="text-muted">Races:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.inhabitants
                          .slice(0, 6)
                          .map((race: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-surface-tertiary px-2 py-1 rounded text-secondary"
                            >
                              {race}
                            </span>
                          ))}
                        {data.inhabitants.length > 6 && (
                          <span className="text-xs text-muted">
                            +{data.inhabitants.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {data.settlements && data.settlements.length > 0 && (
                    <div>
                      <span className="text-muted">Major Settlements:</span>
                      <ul className="text-secondary mt-1 space-y-1">
                        {data.settlements.map(
                          (settlement: any, index: number) => (
                            <li key={index} className="text-xs">
                              • {settlement.name}
                              {settlement.type && ` (${settlement.type})`}
                              {settlement.population &&
                                ` - ${settlement.population} population`}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "game" && (
          <div className="space-y-4">
            {/* Game Information */}
            {data.game && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">
                  Game Mechanics
                </h3>
                <div className="space-y-3 text-sm">
                  {data.game.spellcasting_mods && (
                    <div>
                      <span className="text-muted">Spellcasting:</span>
                      <p className="text-secondary mt-1">
                        {data.game.spellcasting_mods}
                      </p>
                    </div>
                  )}
                  {data.game.navigation_bonus && (
                    <div>
                      <span className="text-muted">Navigation:</span>
                      <p className="text-secondary mt-1">
                        {data.game.navigation_bonus}
                      </p>
                    </div>
                  )}
                  {data.game.mechanical_effects &&
                    data.game.mechanical_effects.length > 0 && (
                      <div>
                        <span className="text-muted">Mechanical Effects:</span>
                        <ul className="text-secondary mt-1 space-y-1">
                          {data.game.mechanical_effects.map(
                            (effect: string, index: number) => (
                              <li key={index} className="text-xs">
                                • {effect}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Spelljammer Classification */}
            {data.spelljammer && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">
                  Spelljammer Classification
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Size:</span>
                    <span className="text-secondary">
                      {data.spelljammer.size}
                    </span>
                  </div>
                  {data.spelljammer.shape && (
                    <div className="flex justify-between">
                      <span className="text-muted">Shape:</span>
                      <span className="text-secondary capitalize">
                        {data.spelljammer.shape}
                      </span>
                    </div>
                  )}
                  {data.spelljammer.body && (
                    <div className="flex justify-between">
                      <span className="text-muted">Body Type:</span>
                      <span className="text-secondary capitalize">
                        {data.spelljammer.body}
                      </span>
                    </div>
                  )}
                  {data.spelljammer.code && (
                    <div className="flex justify-between">
                      <span className="text-muted">SJ Code:</span>
                      <span className="text-secondary font-mono">
                        {data.spelljammer.code}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
              <div className="hero-card p-4">
                <h3 className="font-semibold text-primary mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {data.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs bg-accent-500/10 text-accent-400 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
