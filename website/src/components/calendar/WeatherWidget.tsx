import React, { useState, useEffect } from "react";
import { formatHarptosDate } from "../../utils/calendarUtils";
import { generateEnhancedWeather } from "../../utils/weatherUtils";
import type {
  EnhancedWeatherWidgetProps,
  EnhancedWeatherData,
} from "../../types/calendarTypes";

export default function WeatherWidget({
  selectedDay,
  currentDate,
  months,
  compact = false,
  regionName,
  showGameplayEffects = false,
}: EnhancedWeatherWidgetProps) {
  const [currentWeather, setCurrentWeather] =
    useState<EnhancedWeatherData | null>(null);

  // Generate enhanced weather data
  useEffect(() => {
    if (!selectedDay || !months.length) return;

    try {
      // Get enhanced weather for current day
      const monthData = months.find(
        (m) => m.data.month_number === selectedDay.month
      );
      if (!monthData) return;

      const enhanced = generateEnhancedWeather(
        selectedDay,
        monthData,
        undefined,
        regionName
      );
      setCurrentWeather(enhanced);
    } catch (error) {
      console.error("Error generating enhanced weather:", error);
      // Fallback to basic weather
      setCurrentWeather(null);
    }
  }, [selectedDay, months, regionName]);

  // Loading state when no selected day
  if (!selectedDay) {
    return (
      <div className="calendar-widget weather-widget p-4 bg-surface-secondary rounded border-primary shadow-md">
        <div className="text-center text-muted">
          <div className="text-4xl mb-3 animate-pulse">🌤️</div>
          <div className="text-base font-medium mb-1">Weather Forecast</div>
          <div className="text-sm opacity-80">
            Loading weather information...
          </div>
          <div className="mt-3 flex justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-info rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 bg-info rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-info rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state when weather data is unavailable
  if (!currentWeather) {
    return (
      <div className="calendar-widget weather-widget p-4 bg-surface-secondary rounded border-primary shadow-md">
        <div className="text-center text-muted">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-base font-medium">Weather data unavailable</div>
        </div>
      </div>
    );
  }

  const renderCurrentWeather = () => (
    <div className="current-weather space-y-2">
      {/* Main weather display - Ultra compact */}
      <div className="weather-main bg-surface rounded p-2 border border-secondary shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="text-2xl">
                {currentWeather.conditions.emoji}
              </span>
              {currentWeather.alerts && currentWeather.alerts.length > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-error rounded-full"></div>
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-primary">
                {currentWeather.conditions.primary}
              </div>
              <div className="text-xs text-muted">
                {formatHarptosDate(selectedDay, months, "short")}{" "}
                {currentWeather.conditions.secondary &&
                  `• ${currentWeather.conditions.secondary}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-info">
              {currentWeather.temperature.current}°
              {currentWeather.temperature.unit === "fahrenheit" ? "F" : "C"}
            </div>
            <div className="text-xs text-muted">
              {currentWeather.temperature.feels_like}° •{" "}
              {currentWeather.temperature.range.min}°-
              {currentWeather.temperature.range.max}°
            </div>
          </div>
        </div>

        {/* Ultra compact weather grid */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          <div className="bg-surface-tertiary rounded p-1 text-center">
            <div className="text-xs">
              💧{currentWeather.precipitation.chance}%
            </div>
            <div className="text-xs text-muted">
              {currentWeather.precipitation.type}
            </div>
          </div>
          <div className="bg-surface-tertiary rounded p-1 text-center">
            <div className="text-xs">
              💨{currentWeather.wind.speed} miles per hour
            </div>
            <div className="text-xs text-muted">
              {currentWeather.wind.direction}
            </div>
          </div>
          <div className="bg-surface-tertiary rounded p-1 text-center">
            <div className="text-xs">
              💦{currentWeather.atmosphere.humidity}%
            </div>
            <div className="text-xs text-muted">
              {currentWeather.atmosphere.pressure}
            </div>
          </div>
          <div className="bg-surface-tertiary rounded p-1 text-center">
            <div className="text-xs">
              👁️{currentWeather.atmosphere.visibility_miles} miles
            </div>
            <div className="text-xs text-muted">
              {currentWeather.atmosphere.visibility_miles > 5
                ? "Clear"
                : "Poor"}
            </div>
          </div>
        </div>

        {/* Weather description - minimal */}
        <div className="p-1 bg-surface-secondary rounded text-xs text-secondary italic mb-2">
          {currentWeather.conditions.description}
        </div>

        {/* Weather alerts - minimal */}
        {currentWeather.alerts && currentWeather.alerts.length > 0 && (
          <div className="space-y-1">
            {currentWeather.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-1 rounded text-xs ${getAlertSeverityClass(
                  alert.severity
                )}`}
              >
                <div className="flex items-center space-x-1">
                  <span>{alert.emoji}</span>
                  <span className="font-medium">{alert.type}</span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${getSeverityBadgeClass(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <div className="mt-0.5">{alert.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Magical & Supernatural - Ultra compact */}
      {currentWeather.magical_influences && (
        <div className="bg-surface rounded p-2 border border-secondary shadow-md">
          <h3 className="text-xs font-bold text-primary mb-1">✨ Magical</h3>

          <div className="grid grid-cols-2 gap-1 mb-1">
            <div className="bg-surface-secondary rounded p-1">
              <div className="text-xs font-medium text-primary">
                🌪️ Wild Magic:{" "}
                {currentWeather.magical_influences.wild_magic_surge_chance}%
              </div>
              <div className="text-xs text-secondary">
                Modifier:{" "}
                {currentWeather.gameplay_effects?.spellcasting
                  .wild_magic_modifier >= 0
                  ? "+"
                  : ""}
                {
                  currentWeather.gameplay_effects?.spellcasting
                    .wild_magic_modifier
                }
              </div>
            </div>
            <div className="bg-surface-secondary rounded p-1">
              <div className="text-xs font-medium text-primary">
                🌌 Planar:{" "}
                {currentWeather.magical_influences.planar_weather
                  ? "Active"
                  : "Dormant"}
              </div>
              {currentWeather.magical_influences.planar_weather && (
                <div className="text-xs text-muted">Weakened</div>
              )}
            </div>
          </div>

          {currentWeather.magical_influences.elemental_affinities.length >
            0 && (
            <div className="mb-1">
              <div className="text-xs font-medium text-primary mb-1">
                🔥 Elements:
              </div>
              <div className="flex flex-wrap gap-0.5">
                {currentWeather.magical_influences.elemental_affinities.map(
                  (affinity, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 bg-surface-tertiary text-primary rounded text-xs"
                    >
                      {getElementalIcon(affinity)} {affinity}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {currentWeather.magical_influences.divine_influences &&
            currentWeather.magical_influences.divine_influences.length > 0 && (
              <div className="mb-1">
                <div className="text-xs font-medium text-primary mb-1">
                  ⭐ Divine:
                </div>
                <div className="grid grid-cols-2 gap-0.5">
                  {currentWeather.magical_influences.divine_influences
                    .slice(0, 2)
                    .map((influence, index) => (
                      <div
                        key={index}
                        className="bg-surface-tertiary rounded p-0.5 text-xs text-secondary"
                      >
                        {influence}
                      </div>
                    ))}
                </div>
              </div>
            )}

          {showGameplayEffects &&
            currentWeather.gameplay_effects?.spellcasting && (
              <div className="pt-1 border-t border-secondary">
                <div className="text-xs font-medium text-primary mb-1">
                  🔮 Effects:
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {currentWeather.gameplay_effects.spellcasting.effects
                    .slice(0, 2)
                    .map((effect, index) => (
                      <div
                        key={index}
                        className="bg-surface-tertiary rounded p-0.5 text-xs text-secondary"
                      >
                        {effect}
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Ultra compact Gameplay Effects */}
      {showGameplayEffects && currentWeather.gameplay_effects && (
        <div className="bg-surface rounded p-2 border border-secondary shadow-md">
          <h3 className="text-xs font-bold text-primary mb-1">🎲 Effects</h3>

          <div className="grid grid-cols-2 gap-1">
            {/* Travel & Camping combined */}
            <div className="space-y-1">
              <div className="bg-surface-secondary rounded p-1 border border-tertiary">
                <div className="text-xs font-medium text-primary">
                  🚶 Travel
                </div>
                <div className="flex justify-between text-xs">
                  <span>Difficulty:</span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${getDifficultyClass(
                      currentWeather.gameplay_effects.travel.difficulty
                    )}`}
                  >
                    {currentWeather.gameplay_effects.travel.difficulty
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Speed:</span>
                  <span className="font-bold">
                    ×{currentWeather.gameplay_effects.travel.speed_modifier}
                  </span>
                </div>
              </div>

              <div className="bg-surface-secondary rounded p-1 border border-tertiary">
                <div className="text-xs font-medium text-primary">
                  🏕️ Camping
                </div>
                <div className="flex justify-between text-xs">
                  <span>Comfort:</span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${getComfortClass(
                      currentWeather.gameplay_effects.camping.comfort_level
                    )}`}
                  >
                    {currentWeather.gameplay_effects.camping.comfort_level
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Difficulty Class:</span>
                  <span className="font-bold">
                    {currentWeather.gameplay_effects.camping
                      .survival_dc_modifier >= 0
                      ? "+"
                      : ""}
                    {
                      currentWeather.gameplay_effects.camping
                        .survival_dc_modifier
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Perception & Social combined */}
            <div className="space-y-1">
              <div className="bg-surface-secondary rounded p-1 border border-tertiary">
                <div className="text-xs font-medium text-primary">
                  👁️ Vision
                </div>
                <div className="flex justify-between text-xs">
                  <span>Range:</span>
                  <span className="font-bold">
                    {Math.round(
                      (currentWeather.gameplay_effects.visibility.range_feet /
                        5280) *
                        100
                    ) / 100}{" "}
                    miles
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Perception:</span>
                  <span className="font-bold">
                    {currentWeather.gameplay_effects.visibility
                      .perception_modifier >= 0
                      ? "+"
                      : ""}
                    {
                      currentWeather.gameplay_effects.visibility
                        .perception_modifier
                    }
                  </span>
                </div>
              </div>

              <div className="bg-surface-secondary rounded p-1 border border-tertiary">
                <div className="text-xs font-medium text-primary">
                  😊 Social
                </div>
                <div className="flex justify-between text-xs">
                  <span>Mood:</span>
                  <span className="font-medium">
                    {currentWeather.gameplay_effects.social.mood_modifier}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Indoor:</span>
                  <span className="font-medium">
                    {currentWeather.gameplay_effects.social.indoor_preference
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="calendar-widget weather-widget p-2 bg-surface-secondary rounded border border-primary shadow-md">
      {renderCurrentWeather()}
    </div>
  );
}

// Helper functions
function getAlertSeverityClass(severity: string): string {
  switch (severity.toLowerCase()) {
    case "extreme":
      return "border-error bg-surface text-error";
    case "high":
      return "border-warning bg-surface text-warning";
    case "moderate":
      return "border-warning bg-surface text-warning";
    case "low":
      return "border-info bg-surface text-info";
    default:
      return "border-secondary bg-surface text-secondary";
  }
}

function getSeverityBadgeClass(severity: string): string {
  switch (severity.toLowerCase()) {
    case "extreme":
      return "bg-error text-primary";
    case "high":
      return "bg-warning text-surface";
    case "moderate":
      return "bg-warning text-surface";
    case "low":
      return "bg-info text-primary";
    default:
      return "bg-secondary text-primary";
  }
}

function getElementalIcon(element: string): string {
  switch (element.toLowerCase()) {
    case "fire":
      return "🔥";
    case "water":
      return "💧";
    case "earth":
      return "🌍";
    case "air":
      return "💨";
    case "ice":
      return "❄️";
    case "lightning":
      return "⚡";
    case "nature":
      return "🌿";
    case "shadow":
      return "🌑";
    case "light":
      return "✨";
    default:
      return "🔮";
  }
}

function getDifficultyClass(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-success text-primary";
    case "moderate":
      return "bg-warning text-surface";
    case "hard":
      return "bg-warning text-surface";
    case "extreme":
      return "bg-error text-primary";
    default:
      return "bg-secondary text-primary";
  }
}

function getComfortClass(comfort: string): string {
  switch (comfort.toLowerCase()) {
    case "excellent":
      return "bg-success text-primary";
    case "good":
      return "bg-success text-primary";
    case "fair":
      return "bg-warning text-surface";
    case "poor":
      return "bg-warning text-surface";
    case "dangerous":
      return "bg-error text-primary";
    default:
      return "bg-secondary text-primary";
  }
}
