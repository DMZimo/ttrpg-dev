/**
 * Enhanced Weather Utilities for TTRPG Campaign
 *
 * Provides sophisticated weather generation, persistence logic,
 * and regional variation support for D&D campaigns.
 */

import type { CollectionEntry } from "astro:content";
import type { HarptosDate } from "./calendarUtils";
import type {
  EnhancedWeatherData,
  GameplayEffects,
  WeatherAlert,
  WeatherTrend,
  RegionalWeatherModifiers,
  WeatherHistory,
} from "../types/calendarTypes";

// === Seeded Random Number Generator for Persistence ===

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextInRange(min, max + 1));
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

/**
 * Generate a deterministic seed from date components for weather persistence
 */
function generateDateSeed(date: HarptosDate, regionName?: string): number {
  const regionHash = regionName
    ? regionName.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    : 0;

  return (
    (date.year * 10000 + date.month * 100 + date.day) * 1000 +
    Math.abs(regionHash)
  );
}

// === Weather Persistence Cache ===
const weatherCache = new Map<string, EnhancedWeatherData>();

function getCacheKey(date: HarptosDate, regionName?: string): string {
  return `${date.year}-${date.month}-${date.day}${
    regionName ? `-${regionName}` : ""
  }`;
}

// === Note: Type definitions moved to calendarTypes.ts ===

// === Weather Persistence State ===
let weatherHistoryCache: WeatherHistory[] = [];
const WEATHER_MEMORY_DAYS = 7; // Keep 7 days of weather history for trends

/**
 * Analyze weather trends from previous weather data
 */
function analyzeWeatherTrend(
  previousWeather?: EnhancedWeatherData
): WeatherTrend {
  if (!previousWeather) {
    return {
      direction: "stable",
      confidence: 0.5,
      persistence_factor: 0.3,
      seasonal_progression: true,
    };
  }

  // Simple trend analysis - can be enhanced with more sophisticated logic
  const recentHistory = weatherHistoryCache.slice(-3);

  if (recentHistory.length < 2) {
    return {
      direction: "stable",
      confidence: 0.6,
      persistence_factor: 0.4,
      seasonal_progression: true,
    };
  }

  // Analyze temperature trends
  const tempTrend = analyzeTemperatureTrend(recentHistory);
  const precipTrend = analyzePrecipitationTrend(recentHistory);

  let direction: WeatherTrend["direction"] = "stable";
  let confidence = 0.7;

  if (tempTrend > 0.5 && precipTrend > 0.5) {
    direction = "improving";
    confidence = 0.8;
  } else if (tempTrend < -0.5 && precipTrend < -0.5) {
    direction = "worsening";
    confidence = 0.8;
  } else if (Math.abs(tempTrend) > 1 || Math.abs(precipTrend) > 1) {
    direction = "variable";
    confidence = 0.6;
  }

  return {
    direction,
    confidence,
    persistence_factor: 0.6, // Higher persistence for more realistic weather
    seasonal_progression: true,
  };
}

// === Core Weather Generation Functions ===

/**
 * Generate enhanced weather data for a specific date with persistence logic
 */
export function generateEnhancedWeather(
  date: HarptosDate,
  monthData: CollectionEntry<"months">,
  previousWeather?: EnhancedWeatherData,
  regionName?: string
): EnhancedWeatherData {
  // Check cache first for persistence
  const cacheKey = getCacheKey(date, regionName);
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Generate deterministic random generator for this date
  const seed = generateDateSeed(date, regionName);
  const rng = new SeededRandom(seed);

  // Extract weather schema from month data
  const weatherSchema = extractWeatherSchemaFromMonth(monthData);
  const regionalModifiers = getRegionalModifiers(monthData, regionName);

  // Get previous day weather for trend analysis
  const prevDay = { ...date, day: date.day - 1 };
  const previousDayWeather =
    weatherCache.get(getCacheKey(prevDay, regionName)) || previousWeather;

  const weatherTrend = analyzeWeatherTrend(previousDayWeather);
  const seasonalFactors = calculateSeasonalFactors(date, monthData);

  // Generate persistent weather conditions
  const conditions = generatePersistentWeatherConditions(
    weatherSchema,
    regionalModifiers,
    seasonalFactors,
    previousDayWeather,
    weatherTrend,
    rng
  );

  // Generate alerts and gameplay effects
  const alerts = generateIntelligentWeatherAlerts(conditions, date, rng);
  const gameplayEffects = calculateGameplayEffects(conditions);

  const enhancedWeather: EnhancedWeatherData = {
    date,
    conditions: conditions.conditions,
    temperature: conditions.temperature,
    precipitation: conditions.precipitation,
    wind: conditions.wind,
    atmosphere: conditions.atmosphere,
    magical_influences: conditions.magical_influences,
    alerts,
    gameplay_effects: gameplayEffects,
    trend: weatherTrend,
  };

  // Cache the generated weather for future requests
  weatherCache.set(cacheKey, enhancedWeather);

  return enhancedWeather;
}

/**
 * Extract weather schema from month collection data for procedural generation
 */
function extractWeatherSchemaFromMonth(monthData: CollectionEntry<"months">) {
  const weather = monthData.data.weather;
  let weatherSchema: any = {
    temperature: { min: 15, max: 25, variance: 5 },
    precipitation: { min: 20, max: 40, intensity: "moderate", type: "rain" },
    wind: { speed: { min: 10, max: 20 }, direction: "W" },
    atmosphere: {
      humidity: { min: 40, max: 60 },
      pressure: "normal",
      visibility: { min: 8, max: 12 },
    },
    magical_influences: {
      wild_magic_surge_chance: 0,
      elemental_affinities: [],
      planar_weather: false,
      divine_influences: [],
    },
    events: [],
    regional_variations: [],
    daylight: {
      sunrise_hour: 6,
      sunset_hour: 18,
      daylight_hours: 12,
    },
    weather_patterns: {
      persistence_factor: 0.6,
      trend_probability: 70,
      seasonal_progression: true,
      climate_stability: "stable",
    },
  };

  // Parse weather schema from month data
  for (const weatherItem of weather) {
    if ("schema" in weatherItem && weatherItem.schema) {
      for (const schemaItem of weatherItem.schema) {
        if ("temperature_range_celsius" in schemaItem) {
          weatherSchema.temperature = {
            ...weatherSchema.temperature,
            ...schemaItem.temperature_range_celsius,
          };
        }
        if ("precipitation_chance_percent" in schemaItem) {
          weatherSchema.precipitation = {
            ...weatherSchema.precipitation,
            min: schemaItem.precipitation_chance_percent.min,
            max: schemaItem.precipitation_chance_percent.max,
            intensity:
              schemaItem.precipitation_chance_percent.intensity || "moderate",
            type: schemaItem.precipitation_chance_percent.type || "rain",
            duration_hours:
              schemaItem.precipitation_chance_percent.duration_hours,
          };
        }
        if ("storm_chance_percent" in schemaItem) {
          weatherSchema.storms = {
            min: schemaItem.storm_chance_percent.min,
            max: schemaItem.storm_chance_percent.max,
            severity: schemaItem.storm_chance_percent.severity || "moderate",
            type: schemaItem.storm_chance_percent.type || "thunderstorm",
          };
        }
        if ("wind_speed_kph" in schemaItem) {
          weatherSchema.wind = {
            ...weatherSchema.wind,
            speed: schemaItem.wind_speed_kph,
            direction: schemaItem.wind_speed_kph.direction || "W",
            gusts: schemaItem.wind_speed_kph.gusts || false,
          };
        }
        if ("atmosphere" in schemaItem) {
          weatherSchema.atmosphere = {
            ...weatherSchema.atmosphere,
            humidity: schemaItem.atmosphere.humidity_percent,
            pressure: schemaItem.atmosphere.pressure || "normal",
            visibility: schemaItem.atmosphere.visibility_miles,
          };
        }
        if ("magical_influences" in schemaItem) {
          weatherSchema.magical_influences = {
            ...weatherSchema.magical_influences,
            ...schemaItem.magical_influences,
          };
        }
      }
    }

    if ("events" in weatherItem && weatherItem.events) {
      weatherSchema.events = weatherItem.events;
    }

    if (
      "regional_variations" in weatherItem &&
      weatherItem.regional_variations
    ) {
      weatherSchema.regional_variations = weatherItem.regional_variations;
    }

    if ("daylight" in weatherItem && weatherItem.daylight) {
      weatherSchema.daylight = {
        ...weatherSchema.daylight,
        ...weatherItem.daylight,
      };
    }

    if ("weather_patterns" in weatherItem && weatherItem.weather_patterns) {
      weatherSchema.weather_patterns = {
        ...weatherSchema.weather_patterns,
        ...weatherItem.weather_patterns,
      };
    }
  }

  return weatherSchema;
}

/**
 * Generate persistent weather conditions using deterministic random generation
 */
function generatePersistentWeatherConditions(
  weatherSchema: any,
  regionalModifiers: RegionalWeatherModifiers | null,
  seasonalFactors: any,
  previousWeather?: EnhancedWeatherData,
  weatherTrend?: WeatherTrend,
  rng?: SeededRandom
): any {
  if (!rng) {
    rng = new SeededRandom(Date.now());
  }

  // Generate base temperature using schema
  const tempBase = rng.nextInRange(
    weatherSchema.temperature.min,
    weatherSchema.temperature.max
  );

  // Apply seasonal adjustments
  let adjustedTemp = tempBase + (seasonalFactors.temperatureTrend || 0);

  // Apply weather persistence if we have previous weather
  if (previousWeather && weatherTrend) {
    const persistenceFactor =
      weatherSchema.weather_patterns.persistence_factor || 0.6;
    const tempDifference = adjustedTemp - previousWeather.temperature.current;
    adjustedTemp =
      previousWeather.temperature.current +
      tempDifference * (1 - persistenceFactor);
  }

  // Apply regional modifiers
  if (regionalModifiers) {
    adjustedTemp += regionalModifiers.temperature_modifier;
  }

  // Generate precipitation
  let precipChance = rng.nextInRange(
    weatherSchema.precipitation.min,
    weatherSchema.precipitation.max
  );
  if (regionalModifiers) {
    precipChance = Math.max(
      0,
      Math.min(100, precipChance + regionalModifiers.precipitation_modifier)
    );
  }

  // Apply seasonal precipitation trends
  precipChance += seasonalFactors.precipitationTrend || 0;
  precipChance = Math.max(0, Math.min(100, precipChance));

  // Determine precipitation type based on temperature
  let precipType: "none" | "rain" | "snow" | "sleet" | "hail" | "mixed" =
    "none";
  let precipIntensity: "none" | "light" | "moderate" | "heavy" = "none";

  if (precipChance > 20) {
    if (adjustedTemp < -2) {
      precipType = "snow";
    } else if (adjustedTemp < 2) {
      precipType = rng.next() > 0.5 ? "sleet" : "mixed";
    } else if (adjustedTemp > 25 && rng.next() > 0.9) {
      precipType = "hail";
    } else {
      precipType = "rain";
    }

    // Determine intensity
    if (precipChance > 80) {
      precipIntensity = "heavy";
    } else if (precipChance > 60) {
      precipIntensity = "moderate";
    } else {
      precipIntensity = "light";
    }
  }

  // Generate wind
  const windSpeed = rng.nextInRange(
    weatherSchema.wind.speed.min,
    weatherSchema.wind.speed.max
  );
  const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const windDirection =
    weatherSchema.wind.direction === "variable"
      ? rng.choice(windDirections)
      : weatherSchema.wind.direction;

  // Generate atmosphere
  const humidity = rng.nextInRange(
    weatherSchema.atmosphere.humidity.min,
    weatherSchema.atmosphere.humidity.max
  );
  const visibility = rng.nextInRange(
    weatherSchema.atmosphere.visibility.min,
    weatherSchema.atmosphere.visibility.max
  );

  // Apply weather effects to visibility
  let adjustedVisibility = visibility;
  if (precipIntensity === "heavy") {
    adjustedVisibility *= 0.3;
  } else if (precipIntensity === "moderate") {
    adjustedVisibility *= 0.6;
  } else if (precipIntensity === "light") {
    adjustedVisibility *= 0.8;
  }

  // Generate conditions based on temperature and precipitation
  const conditions = generateConditionsFromWeather(
    adjustedTemp,
    precipType,
    precipIntensity,
    rng
  );

  // Generate magical influences
  const magicalInfluences =
    weatherSchema.magical_influences.wild_magic_surge_chance > 0 ||
    weatherSchema.magical_influences.elemental_affinities.length > 0 ||
    weatherSchema.magical_influences.planar_weather ||
    weatherSchema.magical_influences.divine_influences.length > 0
      ? {
          wild_magic_surge_chance:
            weatherSchema.magical_influences.wild_magic_surge_chance || 0,
          elemental_affinities:
            weatherSchema.magical_influences.elemental_affinities || [],
          planar_weather:
            weatherSchema.magical_influences.planar_weather || false,
          divine_influences:
            weatherSchema.magical_influences.divine_influences || [],
        }
      : undefined;

  return {
    conditions,
    temperature: {
      current: Math.round(adjustedTemp),
      feels_like: Math.round(adjustedTemp + rng.nextInRange(-3, 3)),
      range: {
        min: weatherSchema.temperature.min,
        max: weatherSchema.temperature.max,
      },
      unit: "celsius" as const,
    },
    precipitation: {
      chance: Math.round(precipChance),
      intensity: precipIntensity,
      type: precipType,
      duration_hours:
        precipIntensity !== "none" ? rng.nextInRange(1, 8) : undefined,
    },
    wind: {
      speed: Math.round(windSpeed),
      direction: windDirection,
      gusts: windSpeed > 25 && rng.next() > 0.7,
      description: getWindDescription(windSpeed),
    },
    atmosphere: {
      humidity: Math.round(humidity),
      pressure: weatherSchema.atmosphere.pressure,
      visibility_miles: Math.round(adjustedVisibility * 10) / 10,
    },
    magical_influences: magicalInfluences,
  };
}

/**
 * Generate weather conditions description from weather parameters
 */
function generateConditionsFromWeather(
  temp: number,
  precipType: string,
  precipIntensity: string,
  rng: SeededRandom
) {
  let primary = "Clear";
  let emoji = "☀️";
  let description = "Pleasant weather";

  // Temperature-based base conditions
  if (temp < -10) {
    primary = "Freezing";
    emoji = "🥶";
    description = "Dangerously cold conditions";
  } else if (temp < 0) {
    primary = "Very Cold";
    emoji = "❄️";
    description = "Very cold weather";
  } else if (temp < 10) {
    primary = "Cold";
    emoji = "🌤️";
    description = "Cold and crisp weather";
  } else if (temp < 20) {
    primary = "Cool";
    emoji = "⛅";
    description = "Pleasant cool weather";
  } else if (temp < 30) {
    primary = "Warm";
    emoji = "☀️";
    description = "Comfortable warm weather";
  } else if (temp < 35) {
    primary = "Hot";
    emoji = "🌞";
    description = "Hot weather conditions";
  } else {
    primary = "Scorching";
    emoji = "🔥";
    description = "Dangerously hot conditions";
  }

  // Override with precipitation if present
  if (precipIntensity !== "none") {
    switch (precipType) {
      case "rain":
        if (precipIntensity === "heavy") {
          primary = "Heavy Rain";
          emoji = "🌧️";
          description = "Heavy rainfall";
        } else if (precipIntensity === "moderate") {
          primary = "Rain";
          emoji = "🌦️";
          description = "Moderate rainfall";
        } else {
          primary = "Light Rain";
          emoji = "🌦️";
          description = "Light drizzle";
        }
        break;
      case "snow":
        if (precipIntensity === "heavy") {
          primary = "Heavy Snow";
          emoji = "🌨️";
          description = "Heavy snowfall";
        } else if (precipIntensity === "moderate") {
          primary = "Snow";
          emoji = "❄️";
          description = "Moderate snowfall";
        } else {
          primary = "Light Snow";
          emoji = "🌨️";
          description = "Light snow flurries";
        }
        break;
      case "sleet":
        primary = "Sleet";
        emoji = "🌨️";
        description = "Freezing rain and sleet";
        break;
      case "hail":
        primary = "Hail";
        emoji = "🧊";
        description = "Hailstorm";
        break;
      case "mixed":
        primary = "Mixed Precipitation";
        emoji = "🌦️";
        description = "Mixed rain and snow";
        break;
    }
  }

  return {
    primary,
    emoji,
    description,
  };
}

/**
 * Get regional weather modifiers for a specific region
 */
function getRegionalModifiers(
  monthData: CollectionEntry<"months">,
  regionName?: string
): RegionalWeatherModifiers | null {
  if (!regionName) return null;

  const weather = monthData.data.weather;

  for (const weatherItem of weather) {
    if (
      "regional_variations" in weatherItem &&
      weatherItem.regional_variations
    ) {
      const regionalData = weatherItem.regional_variations.find(
        (variation) =>
          variation.region.toLowerCase() === regionName.toLowerCase()
      );

      if (regionalData) {
        return {
          region: regionalData.region,
          temperature_modifier: regionalData.temperature_modifier || 0,
          precipitation_modifier: regionalData.precipitation_modifier || 0,
          storm_modifier: regionalData.storm_modifier || 0,
          wind_modifier: regionalData.wind_modifier || 0,
          humidity_modifier: regionalData.humidity_modifier || 0,
          special_conditions: regionalData.special_conditions || [],
          coastal_effects: regionalData.coastal_effects || false,
          elevation_effects: regionalData.elevation_effects
            ? {
                high_altitude:
                  regionalData.elevation_effects.high_altitude || false,
                mountain_effects:
                  regionalData.elevation_effects.mountain_effects || false,
              }
            : undefined,
          magical_zones: regionalData.magical_zones,
        };
      }
    }
  }

  return null;
}

// === Helper Functions ===

/**
 * Calculate seasonal factors that influence weather
 */
function calculateSeasonalFactors(
  date: HarptosDate,
  monthData: CollectionEntry<"months">
) {
  const season = date.season;
  const monthProgress = date.day / 30; // Assuming 30-day months

  return {
    season,
    monthProgress,
    temperatureTrend: getSeasonalTemperatureTrend(season, monthProgress),
    precipitationTrend: getSeasonalPrecipitationTrend(season, monthProgress),
  };
}

/**
 * Generate intelligent weather alerts based on conditions
 */
function generateIntelligentWeatherAlerts(
  conditions: any,
  date: HarptosDate,
  rng?: SeededRandom
): WeatherAlert[] {
  if (!rng) {
    rng = new SeededRandom(generateDateSeed(date));
  }

  const alerts: WeatherAlert[] = [];

  // Temperature alerts
  if (conditions.temperature.current <= -10) {
    alerts.push({
      type: "weather",
      severity: "high",
      message: "Extreme cold warning - Frostbite risk high",
      emoji: "🥶",
      mechanical_effects: [
        "Constitution saves required every hour outdoors",
        "Unprotected characters take cold damage",
      ],
    });
  } else if (conditions.temperature.current >= 40) {
    alerts.push({
      type: "weather",
      severity: "high",
      message: "Extreme heat warning - Heat stroke risk high",
      emoji: "🔥",
      mechanical_effects: [
        "Constitution saves required every hour in direct sun",
        "Exhaustion levels accrue faster",
      ],
    });
  }

  // Precipitation alerts
  if (
    conditions.precipitation.chance > 80 &&
    conditions.precipitation.intensity === "heavy"
  ) {
    alerts.push({
      type: "weather",
      severity: "moderate",
      message: "Heavy precipitation expected",
      emoji: conditions.precipitation.type === "snow" ? "🌨️" : "🌧️",
      onset_time: "2-4 hours",
      duration: "6-12 hours",
      mechanical_effects: [
        "Visibility reduced to 60 feet",
        "Ranged attacks at disadvantage",
        "Travel speed reduced by half",
      ],
    });
  }

  // Wind alerts
  if (conditions.wind.speed > 50) {
    alerts.push({
      type: "weather",
      severity: "high",
      message: "High wind warning",
      emoji: "💨",
      mechanical_effects: [
        "Flying creatures must make Strength saves",
        "Ranged weapon attacks heavily affected",
        "Small creatures risk being knocked prone",
      ],
    });
  }

  // Visibility alerts
  if (conditions.atmosphere.visibility_miles < 0.25) {
    alerts.push({
      type: "weather",
      severity: "moderate",
      message: "Dense fog or low visibility conditions",
      emoji: "🌫️",
      mechanical_effects: [
        "Heavily obscured beyond 30 feet",
        "Navigation checks at disadvantage",
        "Surprise attacks more likely",
      ],
    });
  }

  // Magical weather alerts (using deterministic chance based on date)
  if (conditions.magical_influences) {
    if (conditions.magical_influences.wild_magic_surge_chance > 0) {
      alerts.push({
        type: "magical",
        severity: "moderate",
        message: "Weave disturbances. Wild magic surges possible",
        emoji: "✨",
        mechanical_effects: [
          "Wild magic surges more likely",
          "Divination spells may give unexpected results",
        ],
      });
    }

    if (conditions.magical_influences.planar_weather) {
      alerts.push({
        type: "magical",
        severity: "high",
        message: "Planar weather patterns detected",
        emoji: "🌀",
        mechanical_effects: [
          "Reality may be unstable",
          "Planar travel effects possible",
          "Magic items may behave unpredictably",
        ],
      });
    }
  }

  // Seasonal alerts (deterministic based on date)
  const seasonalEventChance = rng.next();
  if (seasonalEventChance < 0.1) {
    // 10% chance for seasonal events
    const season = date.season;
    if (season === "winter" && conditions.temperature.current < -5) {
      alerts.push({
        type: "seasonal",
        severity: "moderate",
        message: "Winter storm conditions developing",
        emoji: "❄️",
        mechanical_effects: [
          "Shelter strongly recommended",
          "Cold damage possible",
          "Travel should be avoided",
        ],
      });
    } else if (season === "summer" && conditions.temperature.current > 35) {
      alerts.push({
        type: "seasonal",
        severity: "moderate",
        message: "Heat wave conditions",
        emoji: "🌞",
        mechanical_effects: [
          "Water consumption doubled",
          "Exhaustion saves more frequent",
          "Seek shade during midday",
        ],
      });
    }
  }

  return alerts;
}

/**
 * Calculate gameplay effects from weather conditions
 */
function calculateGameplayEffects(conditions: any): GameplayEffects {
  return {
    travel: calculateTravelEffects(conditions),
    camping: calculateCampingEffects(conditions),
    spellcasting: calculateSpellcastingEffects(conditions),
    visibility: calculateVisibilityEffects(conditions),
    social: calculateSocialEffects(conditions),
  };
}

function generateInitialConditions(baseConditions: any) {
  const temp =
    baseConditions.temperature.min +
    Math.random() *
      (baseConditions.temperature.max - baseConditions.temperature.min);

  return {
    conditions: generateConditionsFromTemp(temp, baseConditions),
    temperature: {
      current: Math.round(temp),
      feels_like: Math.round(temp + generateFeelsLikeModifier()),
      range: baseConditions.temperature,
      unit: "celsius" as const,
    },
    precipitation: generatePrecipitation(baseConditions.precipitation),
    wind: generateWind(baseConditions.wind),
    atmosphere: generateAtmosphere(baseConditions.atmosphere),
  };
}

function generateConditionsFromTemp(temp: number, baseConditions: any) {
  if (temp < 0) {
    return {
      primary: "Freezing",
      description: "Dangerously cold conditions",
      emoji: "🥶",
    };
  } else if (temp < 10) {
    return {
      primary: "Cold",
      description: "Cold and crisp weather",
      emoji: "❄️",
    };
  } else if (temp < 20) {
    return {
      primary: "Cool",
      description: "Pleasant cool weather",
      emoji: "🌤️",
    };
  } else if (temp < 30) {
    return {
      primary: "Warm",
      description: "Comfortable warm weather",
      emoji: "☀️",
    };
  } else {
    return {
      primary: "Hot",
      description: "Hot weather conditions",
      emoji: "🔥",
    };
  }
}

function generateFeelsLikeModifier(): number {
  return (Math.random() - 0.5) * 4; // -2 to +2 degrees
}

function generatePrecipitation(basePrec: any) {
  return {
    chance: basePrec.chance || 30,
    intensity: basePrec.intensity || ("moderate" as const),
    type: basePrec.type || ("rain" as const),
    duration_hours: 2 + Math.random() * 6,
  };
}

function generatePrecipitationFromTrend(prevPrec: any, basePrec: any) {
  // Implement trend-based precipitation generation
  return generatePrecipitation(basePrec);
}

function generateWind(baseWind: any) {
  const speed =
    baseWind.speed.min +
    Math.random() * (baseWind.speed.max - baseWind.speed.min);
  return {
    speed: Math.round(speed),
    direction: baseWind.direction || "W",
    gusts: speed > 25,
    description: getWindDescription(speed),
  };
}

function generateWindFromTrend(prevWind: any, baseWind: any) {
  // Implement trend-based wind generation
  return generateWind(baseWind);
}

function generateAtmosphere(baseAtm: any) {
  return {
    humidity:
      baseAtm.humidity.min +
      Math.random() * (baseAtm.humidity.max - baseAtm.humidity.min),
    pressure: baseAtm.pressure || ("normal" as const),
    visibility_miles:
      baseAtm.visibility.min +
      Math.random() * (baseAtm.visibility.max - baseAtm.visibility.min),
  };
}

function generateAtmosphereFromTrend(prevAtm: any, baseAtm: any) {
  // Implement trend-based atmosphere generation
  return generateAtmosphere(baseAtm);
}

function getWindDescription(speed: number): string {
  if (speed < 5) return "Calm";
  if (speed < 15) return "Light breeze";
  if (speed < 25) return "Moderate breeze";
  if (speed < 35) return "Strong breeze";
  return "High winds";
}

function analyzeTemperatureTrend(history: WeatherHistory[]): number {
  if (history.length < 2) return 0;

  const recent = history[history.length - 1].conditions.temperature.current;
  const previous = history[history.length - 2].conditions.temperature.current;

  return recent - previous;
}

function analyzePrecipitationTrend(history: WeatherHistory[]): number {
  if (history.length < 2) return 0;

  const recent = history[history.length - 1].conditions.precipitation.chance;
  const previous = history[history.length - 2].conditions.precipitation.chance;

  return recent - previous;
}

function getSeasonalTemperatureTrend(
  season: string,
  monthProgress: number
): number {
  // Spring: warming trend
  if (season === "spring") return monthProgress * 5;
  // Summer: slight cooling in late summer
  if (season === "summer") return (1 - monthProgress) * 2;
  // Autumn: cooling trend
  if (season === "autumn") return -monthProgress * 5;
  // Winter: gradual warming toward spring
  if (season === "winter") return (monthProgress - 0.5) * 3;

  return 0;
}

function getSeasonalPrecipitationTrend(
  season: string,
  monthProgress: number
): number {
  // Spring: increasing rain
  if (season === "spring") return monthProgress * 10;
  // Summer: decreasing toward mid-summer
  if (season === "summer") return -(monthProgress * 15);
  // Autumn: increasing precipitation
  if (season === "autumn") return monthProgress * 12;
  // Winter: variable
  if (season === "winter") return Math.sin(monthProgress * Math.PI) * 8;

  return 0;
}

function calculateTravelEffects(conditions: any) {
  let speedModifier = 1.0;
  let difficulty: "easy" | "moderate" | "hard" | "extreme" = "easy";
  const safetyNotes: string[] = [];

  // Temperature effects
  if (conditions.temperature.current < -5) {
    speedModifier *= 0.75;
    difficulty = "hard";
    safetyNotes.push("Risk of frostbite and hypothermia");
  } else if (conditions.temperature.current > 35) {
    speedModifier *= 0.8;
    difficulty = "moderate";
    safetyNotes.push("Risk of heat exhaustion");
  }

  // Precipitation effects
  if (conditions.precipitation.chance > 70) {
    speedModifier *= 0.9;
    if (difficulty === "easy") difficulty = "moderate";
    safetyNotes.push("Slippery conditions");
  }

  // Wind effects
  if (conditions.wind.speed > 30) {
    speedModifier *= 0.85;
    if (difficulty === "easy") difficulty = "moderate";
    safetyNotes.push("Strong winds may affect balance");
  }

  // Visibility effects
  if (conditions.atmosphere.visibility_miles < 2) {
    speedModifier *= 0.6;
    difficulty = "hard";
    safetyNotes.push("Very limited visibility");
  }

  return {
    speed_modifier: speedModifier,
    difficulty,
    safety_notes: safetyNotes,
  };
}

function calculateCampingEffects(conditions: any) {
  let comfortLevel: "excellent" | "good" | "fair" | "poor" | "dangerous" =
    "excellent";
  const requiredGear: string[] = [];
  let survivalDcModifier = 0;

  // Start with base comfort, then apply modifiers
  let comfortScore = 4; // excellent = 4, good = 3, fair = 2, poor = 1, dangerous = 0

  // Temperature effects
  if (conditions.temperature.current < -10) {
    comfortScore = Math.min(comfortScore, 0); // dangerous
    requiredGear.push("Extreme cold gear", "Insulated shelter");
    survivalDcModifier += 5;
  } else if (conditions.temperature.current < 0) {
    comfortScore = Math.min(comfortScore, 1); // poor or worse
    requiredGear.push("Winter gear", "Extra blankets");
    survivalDcModifier += 3;
  } else if (conditions.temperature.current < 10) {
    comfortScore = Math.min(comfortScore, 2); // fair or worse
    requiredGear.push("Warm clothing");
    survivalDcModifier += 1;
  }

  // Precipitation effects
  if (conditions.precipitation.chance > 80) {
    comfortScore -= 2;
    requiredGear.push("Waterproof shelter", "Dry gear storage");
    survivalDcModifier += 2;
  } else if (conditions.precipitation.chance > 60) {
    comfortScore -= 1;
    requiredGear.push("Waterproof shelter");
    survivalDcModifier += 1;
  }

  // Wind effects
  if (conditions.wind.speed > 40) {
    comfortScore -= 1;
    requiredGear.push("Windproof shelter");
    survivalDcModifier += 1;
  }

  // Convert score to comfort level
  comfortScore = Math.max(0, Math.min(4, comfortScore));
  const comfortLevels: Array<
    "dangerous" | "poor" | "fair" | "good" | "excellent"
  > = ["dangerous", "poor", "fair", "good", "excellent"];
  comfortLevel = comfortLevels[comfortScore];

  return {
    comfort_level: comfortLevel,
    required_gear: [...new Set(requiredGear)], // Remove duplicates
    survival_dc_modifier: survivalDcModifier,
  };
}

function calculateSpellcastingEffects(conditions: any) {
  const effects: string[] = [];
  const elementalBonuses: Record<string, number> = {};
  let wildMagicModifier = 0;

  // Temperature effects on elemental magic
  if (conditions.temperature.current < 0) {
    elementalBonuses.ice = 1;
    elementalBonuses.fire = -1;
    effects.push("Ice and cold spells enhanced");
  } else if (conditions.temperature.current > 30) {
    elementalBonuses.fire = 1;
    elementalBonuses.ice = -1;
    effects.push("Fire spells enhanced");
  }

  // Storm effects
  if (conditions.precipitation.chance > 80) {
    elementalBonuses.lightning = 1;
    wildMagicModifier += 1;
    effects.push("Lightning spells enhanced, wild magic more likely");
  }

  return {
    effects,
    elemental_bonuses: elementalBonuses,
    wild_magic_modifier: wildMagicModifier,
  };
}

function calculateVisibilityEffects(conditions: any) {
  let rangeFeet = 5280; // 1 mile in feet
  let perceptionModifier = 0;
  const combatEffects: string[] = [];

  // Base visibility from atmosphere
  rangeFeet = Math.round(conditions.atmosphere.visibility_miles * 5280);

  // Precipitation effects
  if (conditions.precipitation.chance > 70) {
    rangeFeet = Math.min(rangeFeet, 300);
    perceptionModifier -= 2;
    combatEffects.push("Ranged attacks at disadvantage beyond 60 feet");
  }

  return {
    range_feet: rangeFeet,
    perception_modifier: perceptionModifier,
    combat_effects: combatEffects,
  };
}

function calculateSocialEffects(conditions: any) {
  let moodModifier = "neutral";
  let indoorPreference = false;
  const activitySuggestions: string[] = [];

  // Temperature effects
  if (conditions.temperature.current < 5) {
    moodModifier = "somber";
    indoorPreference = true;
    activitySuggestions.push("Tavern visits", "Indoor crafts", "Storytelling");
  } else if (conditions.temperature.current > 25) {
    moodModifier = "cheerful";
    activitySuggestions.push(
      "Outdoor festivals",
      "Market visits",
      "Garden parties"
    );
  }

  // Weather effects
  if (conditions.precipitation.chance > 70) {
    indoorPreference = true;
    activitySuggestions.push(
      "Library visits",
      "Indoor games",
      "Cozy gatherings"
    );
  }

  return {
    mood_modifier: moodModifier,
    indoor_preference: indoorPreference,
    activity_suggestions: activitySuggestions,
  };
}

function updateWeatherHistory(weather: EnhancedWeatherData) {
  weatherHistoryCache.push({
    date: weather.date,
    conditions: weather,
  });

  // Keep only recent history
  if (weatherHistoryCache.length > WEATHER_MEMORY_DAYS) {
    weatherHistoryCache = weatherHistoryCache.slice(-WEATHER_MEMORY_DAYS);
  }
}

// === Export Functions ===

/**
 * Generate a multi-day weather forecast with trend analysis
 */
export function generateWeatherForecast(
  startDate: HarptosDate,
  monthData: CollectionEntry<"months">,
  days: number = 5,
  regionName?: string
): EnhancedWeatherData[] {
  const forecast: EnhancedWeatherData[] = [];
  let previousWeather: EnhancedWeatherData | undefined;

  for (let i = 0; i < days; i++) {
    const forecastDate = { ...startDate, day: startDate.day + i };
    const weather = generateEnhancedWeather(
      forecastDate,
      monthData,
      previousWeather,
      regionName
    );
    forecast.push(weather);
    previousWeather = weather;
  }

  return forecast;
}

/**
 * Get weather history for analysis
 */
export function getWeatherHistory(): WeatherHistory[] {
  return [...weatherHistoryCache];
}

/**
 * Clear weather history (for testing or reset)
 */
export function clearWeatherHistory(): void {
  weatherHistoryCache = [];
}

/**
 * Clear weather cache (for testing or reset)
 */
export function clearWeatherCache(): void {
  weatherCache.clear();
}

/**
 * Generate seasonal weather summary
 */
export function generateSeasonalWeatherSummary(
  season: string,
  monthsData: CollectionEntry<"months">[]
): {
  averageTemperature: number;
  averagePrecipitation: number;
  commonConditions: string[];
  seasonalTrends: string[];
} {
  // Implementation for seasonal weather analysis
  const seasonMonths = monthsData.filter(
    (month) => month.data.season === season
  );

  // Calculate averages and trends
  return {
    averageTemperature: 20, // Placeholder
    averagePrecipitation: 40, // Placeholder
    commonConditions: ["Mild", "Variable"], // Placeholder
    seasonalTrends: ["Warming trend", "Increasing daylight"], // Placeholder
  };
}
