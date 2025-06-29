---
month_number: 7
name: "Flamerule"
pronunciation:
  common: "FLAME-rule"
  ipa: "/ˈfleɪmruːl/"
elvish_name: "Evaellathull"
elvish_pronunciation: "ev-AEL-lath-UEL"
alias: "Summertide"
Description: "Summer at its peak with hot weather and abundant growth"
season: "summer"
tags:
  - "summer"
  - "heat"
  - "abundance"
  - "peak"

activities:
  - "Crop maintenance"
  - "Outdoor festivals"
  - "Peak travel season"
  - "Harvest preparation"
  - social_activities:
      summer_festivals: true
      outdoor_markets: true
      religious_observances:
        - "sun worship ceremonies"
        - "abundance celebrations"

agriculture:
  growing_season: true
  harvest_activities:
    - "Early summer fruits"
    - "Summer vegetables"
  planting_activities:
    - "Fall crop preparation"

economy:
  trade_conditions: "excellent" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 0.8 # 20% less expensive
    fuel_modifier: 0.6 # 40% less expensive
    travel_modifier: 0.8 # 20% less expensive

cultural_significance:
  themes:
    - "power"
    - "energy"
    - "abundance"
    - "vitality"
  common_sayings:
    - "Flamerule burns away all pretense"
    - "When the flame rules, life flourishes"

weather:
  - description: "Hot and dry with intense sunshine"
  - temperature: "Hot and humid"
  - precipitation: "Occasional thunderstorms"
  - schema:
      - temperature_range_celsius:
          min: 20
          max: 35
      - precipitation_chance_percent:
          min: 15
          max: 40
      - storm_chance_percent:
          min: 10
          max: 35
      - wind_speed_kph:
          min: 5
          max: 25
  - events:
      - name: "Heat Wave"
        probability: 25
        mechanics:
          - "Extreme heat requires Constitution saves DC 12 every hour in direct sun."
          - "Failure results in one level of exhaustion."
          - "Water consumption doubles."
          - "Metal armor becomes unbearably hot."
      - name: "Summer Thunderstorm"
        probability: 20
        mechanics:
          - "Sudden violent storms provide relief from heat."
          - "Heavy rain and lightning."
          - "Flash flooding possible in low areas."
      - name: "Perfect Summer Day"
        probability: 30
        mechanics:
          - "Ideal weather for all activities."
          - "Travel speed increased by 10%."
          - "Morale boosted for all activities."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +1 # degrees warmer
      - region: "The North"
        temperature_modifier: -5 # degrees colder
      - region: "Anauroch Desert"
        temperature_modifier: +10 # degrees warmer
        precipitation_modifier: -80 # percent less precipitation
  - daylight:
      sunrise_hour: 5
      sunset_hour: 21
      daylight_hours: 16
      long_night_effects: false

travel:
  difficulty: "easy" # easy/moderate/hard/extreme
  speed_modifier: 1.0 # normal speed
  random_encounter_modifier: 0.9 # 10% less likely

adventure_hooks:
  - "Drought threatening communities"
  - "Bandits taking advantage of busy trade routes"
  - "Summer festivals hiding sinister plots"
  - "Ancient artifacts powered by solar energy"
---

# Flamerule

## Summertide

Flamerule is the seventh month of the year in the Calendar of Harptos, known as "Summertide." This month represents summer at its peak, with the hottest weather and most abundant growth of the year.

- **Month**: 7 of 12
- **Days**: 30
- **Season**: Summer
- **Common Name**: Summertide

## Peak Summer

Flamerule brings the year's hottest temperatures and longest days. Crops grow rapidly, and outdoor activities reach their peak. The month's name reflects both the intense heat and the flame-like colors of summer sunsets.

## Notable Events

The month ends with **Midsummer**, a major summer festival that falls between Flamerule 30 and Eleasis 1.

## Activities

- Crops grow rapidly and require constant attention
- Outdoor festivals and markets thrive
- Travel is at its easiest with clear roads and good weather
- Communities prepare for the approaching harvest season
