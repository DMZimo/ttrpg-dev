---
month_number: 5
name: "Mirtul"
pronunciation:
  common: "MER-tool"
  ipa: "/ˈmɜrtuːl/"
elvish_name: "Tath Alusuth"
elvish_pronunciation: "tath ah-LOO-suth"
alias: "The Melting"
Description: "When winter's last grip loosens and spring growth accelerates"
season: "spring"
tags:
  - "spring"
  - "melting"
  - "growth"
  - "planting"

activities:
  - "Main planting season"
  - "River navigation resumes"
  - "Spring markets"
  - "Wildlife observation"
  - social_activities:
      outdoor_festivals: true
      trading_activities: true
      religious_observances:
        - "growth blessing ceremonies"
        - "nature appreciation rituals"

agriculture:
  growing_season: true
  harvest_activities:
    - "Early spring greens"
    - "Wild herbs"
  planting_activities:
    - "Main crop planting"
    - "Flower gardens"
    - "Vegetable gardens"

economy:
  trade_conditions: "good" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 0.9 # 10% less expensive
    fuel_modifier: 0.8 # 20% less expensive
    travel_modifier: 1.0 # normal prices

cultural_significance:
  themes:
    - "abundance"
    - "renewal"
    - "freedom"
    - "growth"
  common_sayings:
    - "Mirtul melts all troubles away"
    - "When the ice breaks, so do barriers"

weather:
  - description: "Warm spring weather with occasional showers"
  - temperature: "Mild to warm"
  - precipitation: "Moderate spring rains"
  - schema:
      - temperature_range_celsius:
          min: 8
          max: 20
      - precipitation_chance_percent:
          min: 30
          max: 70
      - storm_chance_percent:
          min: 10
          max: 40
      - wind_speed_kph:
          min: 5
          max: 25
  - events:
      - name: "Spring Shower"
        probability: 35
        mechanics:
          - "Light rain provides advantage on Nature checks for plant growth."
          - "Perception checks relying on sight have slight disadvantage."
          - "Roads become slightly muddy."
      - name: "River Flooding"
        probability: 15
        mechanics:
          - "Swollen rivers may overflow banks."
          - "DC 12 Athletics check to cross safely."
          - "Some bridges may be impassable."
      - name: "Perfect Growing Weather"
        probability: 25
        mechanics:
          - "Ideal conditions for plant growth."
          - "Agricultural activities have advantage."
          - "Travel is pleasant and easy."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +3 # degrees warmer
      - region: "The North"
        temperature_modifier: -2 # degrees colder
      - region: "Anauroch Desert"
        precipitation_modifier: -40 # percent less precipitation
  - daylight:
      sunrise_hour: 5
      sunset_hour: 20
      daylight_hours: 15
      long_night_effects: false

travel:
  difficulty: "easy" # easy/moderate/hard/extreme
  speed_modifier: 1.0 # normal speed
  random_encounter_modifier: 0.9 # 10% less likely

adventure_hooks:
  - "Merchants establishing new trade routes"
  - "Bandits targeting wealthy spring travelers"
  - "Ancient ruins newly accessible by river"
  - "Communities celebrating the end of winter hardship"
---

# Mirtul

## The Melting

Mirtul is the fifth month of the year in the Calendar of Harptos, known as "The Melting." This month sees the final melting of winter snows and the full arrival of spring's growing power.

- **Month**: 5 of 12
- **Days**: 30
- **Season**: Spring
- **Common Name**: The Melting

## Spring's Full Arrival

During Mirtul, the last vestiges of winter disappear even in northern regions. Rivers run high with snowmelt, fields turn green, and farmers engage in the season's main planting activities.

## Notable Events

The month begins with **Greengrass**, a special spring festival day that falls between Tarsakh 30 and Mirtul 1.

## Activities

- Main planting season for most crops
- Rivers and roads become fully navigable again
- Spring festivals and markets return to communities
- Wildlife becomes active after winter hibernation
