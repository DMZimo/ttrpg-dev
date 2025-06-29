---
month_number: 8
name: "Eleasis"
pronunciation:
  common: "el-EE-ah-sis"
  ipa: "/ɛˈliəsɪs/"
elvish_name: "Alurar"
elvish_pronunciation: "al-UR-ar"
alias: "Highsun"
Description: "Summer abundance peaks and early harvest begins"
season: "summer"
tags:
  - "summer"
  - "harvest"
  - "abundance"
  - "prosperity"

activities:
  - "Early harvest"
  - "Market abundance"
  - "Preservation work"
  - "Continued travel"
  - social_activities:
      harvest_festivals: true
      community_feasts: true
      religious_observances:
        - "harvest blessing ceremonies"
        - "prosperity rituals"

agriculture:
  growing_season: true
  harvest_activities:
    - "Early grains"
    - "Summer fruits"
    - "Vegetables"
  planting_activities:
    - "Fall preparations"

economy:
  trade_conditions: "excellent" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 0.7 # 30% less expensive
    fuel_modifier: 0.6 # 40% less expensive
    travel_modifier: 0.8 # 20% less expensive

cultural_significance:
  themes:
    - "abundance"
    - "prosperity"
    - "celebration"
    - "fulfillment"
  common_sayings:
    - "Eleasis rewards the prepared"
    - "When Highsun shines, all prosper"

weather:
  - description: "Continued hot weather with peak sunshine"
  - temperature: "Very warm and sunny"
  - precipitation: "Light occasional showers"
  - schema:
      - temperature_range_celsius:
          min: 18
          max: 32
      - precipitation_chance_percent:
          min: 10
          max: 35
      - storm_chance_percent:
          min: 5
          max: 30
      - wind_speed_kph:
          min: 5
          max: 20
  - events:
      - name: "Peak Sunshine"
        probability: 40
        mechanics:
          - "Maximum daylight and clear skies."
          - "Solar-powered magic gets advantage."
          - "Perfect conditions for drying and preservation."
          - "Heat management becomes important."
      - name: "Gentle Evening Shower"
        probability: 20
        mechanics:
          - "Refreshing rain in late afternoon."
          - "Cools the air and settles dust."
          - "Plants get needed moisture."
      - name: "Harvest Moon Nights"
        probability: 15
        mechanics:
          - "Bright moonlit nights aid harvest work."
          - "Extra work hours possible."
          - "Romantic and peaceful atmosphere."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +1 # degrees warmer
      - region: "The North"
        temperature_modifier: -4 # degrees colder
      - region: "Anauroch Desert"
        temperature_modifier: +8 # degrees warmer
        precipitation_modifier: -85 # percent less precipitation
  - daylight:
      sunrise_hour: 5
      sunset_hour: 20
      daylight_hours: 15
      long_night_effects: false

travel:
  difficulty: "easy" # easy/moderate/hard/extreme
  speed_modifier: 1.0 # normal speed
  random_encounter_modifier: 0.8 # 20% less likely

adventure_hooks:
  - "Bandits targeting wealthy harvest caravans"
  - "Celebrations masking political intrigue"
  - "Magical rituals requiring peak sunlight"
  - "Trade disputes over abundant resources"
  - "sunshine"
---

# Eleasis

## Highsun

Eleasis is the eighth month of the year in the Calendar of Harptos, known as "Highsun." This month represents the peak of summer's abundance, when the sun reaches its full power and early harvests begin.

- **Month**: 8 of 12
- **Days**: 30
- **Season**: Summer
- **Common Name**: Highsun

## Summer's Peak

Eleasis continues the peak summer conditions with abundant sunshine and warm weather. Many early crops reach maturity, and communities begin the first wave of harvest activities.

## Notable Events

The month begins with **Midsummer** (between Flamerule 30 and Eleasis 1), and in leap years, **Shieldmeet** follows immediately after.

## Activities

- Early harvest of summer crops begins
- Markets overflow with fresh produce
- Communities prepare for the main harvest season
- Travel and trade continue at optimal levels
