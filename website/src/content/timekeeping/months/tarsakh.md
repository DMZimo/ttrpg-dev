---
month_number: 4
name: "Tarsakh"
pronunciation:
  common: "TAR-sack"
  ipa: "/ˈtɑrsæk/"
elvish_name: "N'iarrna"
elvish_pronunciation: "VEL-bri-ARR-nah"
alias: "The Claw of the Storms"
Description: "The stormy month that brings life-giving rains"
season: "spring"
tags:
  - "spring"
  - "storms"
  - "renewal"
  - "planting"

activities:
  - "Spring planting"
  - "Road and building repairs"
  - "Storm preparation"
  - "Water management"
  - social_activities:
      outdoor_festivals: true
      market_activities: true
      religious_observances:
        - "storm blessing ceremonies"
        - "fertility rituals"

agriculture:
  growing_season: true
  harvest_activities: []
  planting_activities:
    - "Most crop varieties"
    - "Fruit trees"
    - "Herb gardens"

economy:
  trade_conditions: "good" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 1.0 # normal prices
    fuel_modifier: 0.9 # 10% less expensive
    travel_modifier: 1.2 # 20% more expensive

cultural_significance:
  themes:
    - "growth"
    - "change"
    - "nature_power"
    - "renewal"
  common_sayings:
    - "Tarsakh's storms bring tomorrow's harvest"
    - "No rainbow without the storm's claw"

weather:
  - description: "Variable with frequent spring storms"
  - temperature: "Cool to mild"
  - precipitation: "Heavy rains and thunderstorms"
  - schema:
      - temperature_range_celsius:
          min: 5
          max: 18
          variance: 3
          feels_like_modifier: -1
      - precipitation_chance_percent:
          min: 40
          max: 90
          intensity: "moderate"
          type: "rain"
          duration_hours:
            min: 2
            max: 8
      - storm_chance_percent:
          min: 20
          max: 60
          severity: "moderate"
          type: "thunderstorm"
      - wind_speed_kph:
          min: 10
          max: 40
          direction: "SW"
          gusts: true
      - atmosphere:
          humidity_percent:
            min: 60
            max: 85
          pressure: "low"
          visibility_miles:
            min: 3
            max: 10
      - magical_influences:
          wild_magic_surge_chance: 8
          elemental_affinities: ["water", "air"]
          planar_weather: false
          divine_influences: ["Talos", "Chauntea"]
  - events:
      - name: "Spring Thunderstorm"
        probability: 30
        duration:
          min_hours: 2
          max_hours: 6
        severity: "moderate"
        triggers: ["pressure drops", "wind direction change"]
        mechanics:
          - "Heavy rain reduces visibility to 60 feet."
          - "Lightning strikes possible; DC 15 Dexterity save to avoid 2d6 lightning damage."
          - "Flooding may occur in low-lying areas."
          - "Strong winds impose disadvantage on ranged attacks."
        effects:
          travel: ["Speed reduced by half", "DC 15 survival for safe passage"]
          combat: ["Disadvantage on ranged attacks", "Lightning damage risk"]
          spellcasting:
            ["Air and water spells gain +1 DC", "Wild magic surge on 1-2"]
          social: ["Communities gather indoors", "Storytelling popular"]
      - name: "Hailstorm"
        probability: 10
        duration:
          min_hours: 1
          max_hours: 3
        severity: "major"
        mechanics:
          - "Creatures in the open take 1d4 bludgeoning damage each round."
          - "Crops may be damaged; Survival DC 15 to protect them."
          - "Visibility reduced to 30 feet."
        effects:
          travel: ["Extremely dangerous", "Seek immediate shelter"]
          combat: ["1d4 damage per round in open", "Cover essential"]
      - name: "Gentle Spring Rain"
        probability: 25
        duration:
          min_hours: 4
          max_hours: 12
        severity: "minor"
        mechanics:
          - "Light precipitation provides advantage on Nature checks for plant growth."
          - "Travel speed reduced by 10%."
          - "Perception checks relying on sight have disadvantage."
        effects:
          travel: ["Slight speed reduction", "Roads muddy but passable"]
          social: ["Farming activities enhanced", "Romantic atmosphere"]
  - regional_variations:
      - region: "Sword Coast"
        storm_modifier: 10
        precipitation_modifier: 5
        coastal_effects: true
        special_conditions: ["Sea fog common", "Salt spray effects"]
      - region: "The North"
        temperature_modifier: -2
        precipitation_modifier: -10
        storm_modifier: -5
        elevation_effects:
          high_altitude: false
          mountain_effects: true
        special_conditions: ["Late snow possible", "River ice breakup"]
      - region: "Anauroch Desert"
        temperature_modifier: 5
        precipitation_modifier: -60
        storm_modifier: -15
        humidity_modifier: -25
        special_conditions:
          ["Dust storms replace rain", "Extreme temperature swings"]
        magical_zones:
          - name: "The Shoal of Thirst"
            effect: "Water magic suppressed"
      - region: "Cormyr"
        temperature_modifier: 1
        precipitation_modifier: 0
        storm_modifier: 5
        special_conditions: ["Purple Dragon patrols increased during storms"]
      - region: "Dalelands"
        temperature_modifier: 0
        precipitation_modifier: 8
        storm_modifier: 3
        elevation_effects:
          mountain_effects: true
        special_conditions:
          ["Valley flooding common", "Elven weather magic influence"]
  - weather_patterns:
      persistence_factor: 0.7
      trend_probability: 65
      seasonal_progression: true
      climate_stability: "variable"
  - daylight:
      sunrise_hour: 6
      sunset_hour: 19
      daylight_hours: 13
      long_night_effects: false

travel:
  difficulty: "moderate" # easy/moderate/hard/extreme
  speed_modifier: 0.85 # 85% of normal speed
  random_encounter_modifier: 1.0 # normal encounter rate

adventure_hooks:
  - "Storm-damaged bridges need urgent repair"
  - "Flash floods reveal ancient ruins"
  - "Weather-mages manipulating storms"
  - "Farmers needing protection from crop thieves"
---
