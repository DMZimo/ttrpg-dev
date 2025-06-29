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
      - precipitation_chance_percent:
          min: 40
          max: 90
      - storm_chance_percent:
          min: 20
          max: 60
      - wind_speed_kph:
          min: 10
          max: 40
  - events:
      - name: "Spring Thunderstorm"
        probability: 30
        mechanics:
          - "Heavy rain reduces visibility to 60 feet."
          - "Lightning strikes possible; DC 15 Dexterity save to avoid 2d6 lightning damage."
          - "Flooding may occur in low-lying areas."
          - "Strong winds impose disadvantage on ranged attacks."
      - name: "Hailstorm"
        probability: 10
        mechanics:
          - "Creatures in the open take 1d4 bludgeoning damage each round."
          - "Crops may be damaged; Survival DC 15 to protect them."
          - "Visibility reduced to 30 feet."
      - name: "Gentle Spring Rain"
        probability: 25
        mechanics:
          - "Light precipitation provides advantage on Nature checks for plant growth."
          - "Travel speed reduced by 10%."
          - "Perception checks relying on sight have disadvantage."
  - regional_variations:
      - region: "Sword Coast"
        storm_modifier: +10 # percent more storms
      - region: "The North"
        temperature_modifier: -2 # degrees colder
      - region: "Anauroch Desert"
        precipitation_modifier: -60 # percent less precipitation
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
