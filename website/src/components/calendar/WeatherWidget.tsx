import React, { useState, useEffect } from "react";
import {
  formatHarptosDate,
  formatHarptosTime,
  getWeatherForDate,
  getMoonPhase,
} from "../../utils/gameCalendarUtils";
import type {
  WeatherWidgetProps,
  WeatherForecastData,
  CalendarDayData,
} from "./types";
import type { HarptosDate } from "../../utils/gameCalendarUtils";

export default function WeatherWidget({
  selectedDay,
  currentDate,
  months,
  compact = false,
  showExtendedForecast = false,
  showHistoricalWeather = false,
}: WeatherWidgetProps) {
  const [forecastDays, setForecastDays] = useState<WeatherForecastData[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "current" | "forecast" | "history"
  >("current");

  // Generate forecast data for the next few days
  useEffect(() => {
    if (!selectedDay) return;

    const forecast: WeatherForecastData[] = [];
    const startDate = selectedDay;

    // Generate 5-day forecast starting from selected day
    for (let i = 0; i < 5; i++) {
      const forecastDate: HarptosDate = {
        ...startDate,
        day: startDate.day + i,
      };

      // Handle month overflow (simplified)
      if (forecastDate.day > 30) {
        forecastDate.day = forecastDate.day - 30;
        forecastDate.month = forecastDate.month + 1;
        if (forecastDate.month > 12) {
          forecastDate.month = 1;
          forecastDate.year = forecastDate.year + 1;
        }
      }

      const weather = getWeatherForDate(forecastDate, months);
      const moon = getMoonPhase(forecastDate, []);

      // Generate weather alerts based on conditions
      const alerts = generateWeatherAlerts(weather, forecastDate);

      forecast.push({
        date: forecastDate,
        weather: {
          ...weather,
          temperatureRange: generateTemperatureRange(weather.temperature),
          precipitation: generatePrecipitation(weather.condition),
          wind: generateWindData(weather.condition),
          humidity: generateHumidity(weather.condition),
          visibility: generateVisibility(weather.condition),
        },
        moon,
        alerts,
      });
    }

    setForecastDays(forecast);
  }, [selectedDay, months]);

  if (!selectedDay) {
    return (
      <div className="weather-widget p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🌤️</div>
          <div className="text-sm">Select a day to view weather forecast</div>
        </div>
      </div>
    );
  }

  const renderCurrentWeather = () => (
    <div className="current-weather space-y-4">
      {/* Main weather display */}
      <div className="weather-main bg-white/60 dark:bg-black/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{selectedDay.weather.emoji}</span>
            <div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {selectedDay.weather.condition}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatHarptosDate(selectedDay, months, "long")}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {selectedDay.weather.temperature}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Temperature
            </div>
          </div>
        </div>

        <div className="weather-description text-sm text-gray-700 dark:text-gray-300 mb-4">
          {selectedDay.weather.description}
        </div>

        {/* Weather details grid */}
        <div className="weather-details grid grid-cols-2 gap-3 text-xs">
          {forecastDays[0]?.weather.precipitation && (
            <div className="detail-item bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <div className="text-gray-500 dark:text-gray-400">
                Precipitation
              </div>
              <div className="font-medium text-blue-600 dark:text-blue-400">
                {forecastDays[0].weather.precipitation.chance}%{" "}
                {forecastDays[0].weather.precipitation.type}
              </div>
            </div>
          )}

          {forecastDays[0]?.weather.wind && (
            <div className="detail-item bg-green-50 dark:bg-green-900/30 rounded p-2">
              <div className="text-gray-500 dark:text-gray-400">Wind</div>
              <div className="font-medium text-green-600 dark:text-green-400">
                {forecastDays[0].weather.wind.speed}{" "}
                {forecastDays[0].weather.wind.direction}
              </div>
            </div>
          )}

          {forecastDays[0]?.weather.humidity && (
            <div className="detail-item bg-purple-50 dark:bg-purple-900/30 rounded p-2">
              <div className="text-gray-500 dark:text-gray-400">Humidity</div>
              <div className="font-medium text-purple-600 dark:text-purple-400">
                {forecastDays[0].weather.humidity}%
              </div>
            </div>
          )}

          {forecastDays[0]?.weather.visibility && (
            <div className="detail-item bg-orange-50 dark:bg-orange-900/30 rounded p-2">
              <div className="text-gray-500 dark:text-gray-400">Visibility</div>
              <div className="font-medium text-orange-600 dark:text-orange-400">
                {forecastDays[0].weather.visibility}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moon phase */}
      <div className="moon-phase bg-white/60 dark:bg-black/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedDay.moon.emoji}</span>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {selectedDay.moon.phase}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {selectedDay.moon.description}
            </div>
          </div>
        </div>
      </div>

      {/* Weather alerts */}
      {forecastDays[0]?.alerts && forecastDays[0].alerts.length > 0 && (
        <div className="weather-alerts space-y-2">
          {forecastDays[0].alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-item p-3 rounded-lg border ${getAlertStyles(
                alert.severity
              )}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{alert.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">
                    {alert.type} Alert - {alert.severity}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {alert.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderForecast = () => (
    <div className="forecast-view space-y-3">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        5-Day Weather Forecast
      </div>
      {forecastDays.map((forecast, index) => (
        <div
          key={index}
          className="forecast-day bg-white/60 dark:bg-black/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{forecast.weather.emoji}</span>
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {index === 0
                    ? "Today"
                    : formatHarptosDate(forecast.date, months, "short")}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {forecast.weather.condition}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {forecast.weather.temperature}
              </div>
              {forecast.weather.precipitation && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {forecast.weather.precipitation.chance}% rain
                </div>
              )}
            </div>
          </div>

          {forecast.alerts && forecast.alerts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {forecast.alerts.map((alert, alertIndex) => (
                <span
                  key={alertIndex}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs ${getAlertBadgeStyles(
                    alert.severity
                  )}`}
                >
                  {alert.emoji} {alert.type}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderHistoricalWeather = () => (
    <div className="historical-weather space-y-3">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Historical Weather Patterns
      </div>
      <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Historical weather data for this time of year shows typical conditions
          similar to current forecast. This region typically experiences{" "}
          {selectedDay.weather.condition.toLowerCase()} weather during this
          season.
        </div>
      </div>
    </div>
  );

  return (
    <div className={`weather-widget ${compact ? "compact" : ""}`}>
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
        {/* Widget Header */}
        <div className="weather-header bg-white/60 dark:bg-black/30 px-4 py-3 border-b border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              🌤️ Weather Forecast
            </div>
            {showExtendedForecast && (
              <div className="flex space-x-1">
                <button
                  onClick={() => setSelectedTab("current")}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedTab === "current"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Current
                </button>
                <button
                  onClick={() => setSelectedTab("forecast")}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedTab === "forecast"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Forecast
                </button>
                {showHistoricalWeather && (
                  <button
                    onClick={() => setSelectedTab("history")}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      selectedTab === "history"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    History
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Widget Content */}
        <div className="weather-content p-4">
          {selectedTab === "current" && renderCurrentWeather()}
          {selectedTab === "forecast" && renderForecast()}
          {selectedTab === "history" && renderHistoricalWeather()}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function generateTemperatureRange(temperature: string): {
  min: number;
  max: number;
} {
  // Extract numeric value from temperature string and generate range
  const match = temperature.match(/(-?\d+)/);
  if (match) {
    const temp = parseInt(match[1]);
    return {
      min: temp - 5,
      max: temp + 5,
    };
  }
  return { min: 15, max: 25 }; // Default range
}

function generatePrecipitation(condition: string): {
  chance: number;
  type: string;
} {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain") || lowerCondition.includes("storm")) {
    return { chance: 80, type: "rain" };
  } else if (lowerCondition.includes("snow")) {
    return { chance: 70, type: "snow" };
  } else if (lowerCondition.includes("cloud")) {
    return { chance: 30, type: "light rain" };
  }
  return { chance: 10, type: "none" };
}

function generateWindData(condition: string): {
  speed: string;
  direction: string;
} {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("storm")) {
    return { speed: "25-40 mph", direction: "Variable" };
  } else if (lowerCondition.includes("breezy")) {
    return { speed: "10-20 mph", direction: "SW" };
  }
  return { speed: "5-15 mph", direction: "W" };
}

function generateHumidity(condition: string): number {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain") || lowerCondition.includes("storm")) {
    return 85;
  } else if (lowerCondition.includes("cloud")) {
    return 65;
  }
  return 45;
}

function generateVisibility(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("storm") || lowerCondition.includes("heavy")) {
    return "2-5 miles";
  } else if (
    lowerCondition.includes("cloud") ||
    lowerCondition.includes("mist")
  ) {
    return "5-10 miles";
  }
  return "10+ miles";
}

function generateWeatherAlerts(
  weather: any,
  date: HarptosDate
): Array<{
  type: "weather" | "astronomical" | "magical";
  severity: "low" | "moderate" | "high" | "extreme";
  message: string;
  emoji: string;
}> {
  const alerts = [];
  const condition = weather.condition.toLowerCase();

  // Weather alerts
  if (condition.includes("storm")) {
    alerts.push({
      type: "weather" as const,
      severity: "high" as const,
      message: "Severe thunderstorms expected. Seek shelter and avoid travel.",
      emoji: "⚡",
    });
  } else if (condition.includes("heavy rain")) {
    alerts.push({
      type: "weather" as const,
      severity: "moderate" as const,
      message: "Heavy rainfall may cause flooding in low-lying areas.",
      emoji: "🌧️",
    });
  }

  // Magical weather (random chance based on D&D settings)
  if (Math.random() < 0.1) {
    // 10% chance of magical weather
    alerts.push({
      type: "magical" as const,
      severity: "low" as const,
      message: "Traces of wild magic detected in the atmosphere.",
      emoji: "✨",
    });
  }

  return alerts;
}

function getAlertStyles(severity: string): string {
  switch (severity) {
    case "extreme":
      return "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200";
    case "high":
      return "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200";
    case "moderate":
      return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200";
    default:
      return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200";
  }
}

function getAlertBadgeStyles(severity: string): string {
  switch (severity) {
    case "extreme":
      return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200";
    case "high":
      return "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200";
    case "moderate":
      return "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200";
    default:
      return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200";
  }
}
