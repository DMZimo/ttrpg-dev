import React, { useState, useEffect } from "react";
import { formatHarptosDate } from "../../utils/gameCalendarUtils";
import { generateEnhancedWeather } from "../../utils/weatherUtils";
import type {
  EnhancedWeatherWidgetProps,
  EnhancedWeatherData,
} from "../../types/weatherTypes";

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

  if (!selectedDay) {
    return (
      <div className="weather-widget p-4 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/40 dark:to-indigo-950/40 rounded-lg border border-blue-200 dark:border-blue-800 shadow-md">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">🌤️</div>
          <div className="text-base font-medium mb-1">Weather Forecast</div>
          <div className="text-sm opacity-80">
            Select a day to view weather information
          </div>
          <div className="mt-3 flex justify-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-300 dark:bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 bg-sky-300 dark:bg-sky-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-indigo-300 dark:bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="weather-widget p-4 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/40 dark:to-indigo-950/40 rounded-lg border border-blue-200 dark:border-blue-800 shadow-md">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-base font-medium">Weather data unavailable</div>
        </div>
      </div>
    );
  }

  const renderCurrentWeather = () => (
    <div className="current-weather space-y-2">
      {/* Main weather display - Ultra compact */}
      <div className="weather-main bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-950/90 rounded p-2 border border-blue-200/60 dark:border-blue-700/60 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="text-2xl">
                {currentWeather.conditions.emoji}
              </span>
              {currentWeather.alerts && currentWeather.alerts.length > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {currentWeather.conditions.primary}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatHarptosDate(selectedDay, months, "short")}{" "}
                {currentWeather.conditions.secondary &&
                  `• ${currentWeather.conditions.secondary}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {currentWeather.temperature.current}°
              {currentWeather.temperature.unit === "fahrenheit" ? "F" : "C"}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentWeather.temperature.feels_like}° •{" "}
              {currentWeather.temperature.range.min}°-
              {currentWeather.temperature.range.max}°
            </div>
          </div>
        </div>

        {/* Ultra compact weather grid */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          <div className="bg-white/60 dark:bg-slate-800/60 rounded p-1 text-center">
            <div className="text-xs">
              💧{currentWeather.precipitation.chance}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentWeather.precipitation.type}
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded p-1 text-center">
            <div className="text-xs">
              💨{currentWeather.wind.speed} miles per hour
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentWeather.wind.direction}
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded p-1 text-center">
            <div className="text-xs">
              💦{currentWeather.atmosphere.humidity}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentWeather.atmosphere.pressure}
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded p-1 text-center">
            <div className="text-xs">
              👁️{currentWeather.atmosphere.visibility_miles} miles
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {currentWeather.atmosphere.visibility_miles > 5
                ? "Clear"
                : "Poor"}
            </div>
          </div>
        </div>

        {/* Weather description - minimal */}
        <div className="p-1 bg-blue-50/60 dark:bg-blue-950/40 rounded text-xs text-gray-700 dark:text-gray-300 italic mb-2">
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
        <div className="bg-gradient-to-br from-purple-50/90 to-indigo-100/90 dark:from-purple-950/60 dark:to-indigo-950/60 rounded p-2 border border-purple-200 dark:border-purple-700 shadow-md">
          <h3 className="text-xs font-bold text-purple-800 dark:text-purple-200 mb-1">
            ✨ Magical
          </h3>

          <div className="grid grid-cols-2 gap-1 mb-1">
            <div className="bg-white/60 dark:bg-purple-900/40 rounded p-1">
              <div className="text-xs font-medium text-purple-800 dark:text-purple-200">
                🌪️ Wild Magic:{" "}
                {currentWeather.magical_influences.wild_magic_surge_chance}%
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300">
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
            <div className="bg-white/60 dark:bg-purple-900/40 rounded p-1">
              <div className="text-xs font-medium text-purple-800 dark:text-purple-200">
                🌌 Planar:{" "}
                {currentWeather.magical_influences.planar_weather
                  ? "Active"
                  : "Dormant"}
              </div>
              {currentWeather.magical_influences.planar_weather && (
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Weakened
                </div>
              )}
            </div>
          </div>

          {currentWeather.magical_influences.elemental_affinities.length >
            0 && (
            <div className="mb-1">
              <div className="text-xs font-medium text-purple-800 dark:text-purple-200 mb-1">
                🔥 Elements:
              </div>
              <div className="flex flex-wrap gap-0.5">
                {currentWeather.magical_influences.elemental_affinities.map(
                  (affinity, index) => (
                    <span
                      key={index}
                      className="px-1 py-0.5 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded text-xs"
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
                <div className="text-xs font-medium text-purple-800 dark:text-purple-200 mb-1">
                  ⭐ Divine:
                </div>
                <div className="grid grid-cols-2 gap-0.5">
                  {currentWeather.magical_influences.divine_influences
                    .slice(0, 2)
                    .map((influence, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-purple-900/40 rounded p-0.5 text-xs text-purple-700 dark:text-purple-300"
                      >
                        {influence}
                      </div>
                    ))}
                </div>
              </div>
            )}

          {showGameplayEffects &&
            currentWeather.gameplay_effects?.spellcasting && (
              <div className="pt-1 border-t border-purple-200 dark:border-purple-700">
                <div className="text-xs font-medium text-purple-800 dark:text-purple-200 mb-1">
                  🔮 Effects:
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {currentWeather.gameplay_effects.spellcasting.effects
                    .slice(0, 2)
                    .map((effect, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-purple-900/40 rounded p-0.5 text-xs text-purple-700 dark:text-purple-300"
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
        <div className="bg-gradient-to-br from-amber-50/90 to-orange-100/90 dark:from-amber-950/60 dark:to-orange-950/60 rounded p-2 border border-amber-200 dark:border-amber-700 shadow-md">
          <h3 className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">
            🎲 Effects
          </h3>

          <div className="grid grid-cols-2 gap-1">
            {/* Travel & Camping combined */}
            <div className="space-y-1">
              <div className="bg-green-50 dark:bg-green-950/40 rounded p-1 border border-green-200 dark:border-green-700">
                <div className="text-xs font-medium text-green-800 dark:text-green-200">
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

              <div className="bg-orange-50 dark:bg-orange-950/40 rounded p-1 border border-orange-200 dark:border-orange-700">
                <div className="text-xs font-medium text-orange-800 dark:text-orange-200">
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
              <div className="bg-blue-50 dark:bg-blue-950/40 rounded p-1 border border-blue-200 dark:border-blue-700">
                <div className="text-xs font-medium text-blue-800 dark:text-blue-200">
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

              <div className="bg-pink-50 dark:bg-pink-950/40 rounded p-1 border border-pink-200 dark:border-pink-700">
                <div className="text-xs font-medium text-pink-800 dark:text-pink-200">
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
    <div className="weather-widget p-2 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/40 dark:to-indigo-950/40 rounded border border-blue-200 dark:border-blue-800 shadow-md">
      {renderCurrentWeather()}
    </div>
  );
}

// Helper functions
function getAlertSeverityClass(severity: string): string {
  switch (severity.toLowerCase()) {
    case "extreme":
      return "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200";
    case "high":
      return "border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-200";
    case "moderate":
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-200";
    case "low":
      return "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200";
    default:
      return "border-gray-500 bg-gray-50 dark:bg-gray-950/40 text-gray-800 dark:text-gray-200";
  }
}

function getSeverityBadgeClass(severity: string): string {
  switch (severity.toLowerCase()) {
    case "extreme":
      return "bg-red-500 text-white";
    case "high":
      return "bg-orange-500 text-white";
    case "moderate":
      return "bg-yellow-500 text-black";
    case "low":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
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
      return "bg-green-500 text-white";
    case "moderate":
      return "bg-yellow-500 text-black";
    case "hard":
      return "bg-orange-500 text-white";
    case "extreme":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function getComfortClass(comfort: string): string {
  switch (comfort.toLowerCase()) {
    case "excellent":
      return "bg-green-500 text-white";
    case "good":
      return "bg-green-400 text-white";
    case "fair":
      return "bg-yellow-500 text-black";
    case "poor":
      return "bg-orange-500 text-white";
    case "dangerous":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}
