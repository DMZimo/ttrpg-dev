---
month_number: 9
name: "Eleint"
pronunciation:
  common: "el-EINT"
  ipa: "/ɛˈleɪnt/"
elvish_name: "Tath Vaneth"
elvish_pronunciation: "tath VA-neth"
alias: "The Fading"
Description: "Autumn's arrival with main harvest season and changing leaves"
season: "autumn"
tags:
  - "autumn"
  - "harvest"
  - "fading"
  - "transition"

activities:
  - "Main harvest season"
  - "Winter preparation"
  - "Autumn festivals"
  - "Food preservation"
  - social_activities:
      harvest_celebrations: true
      preparation_activities: true
      religious_observances:
        - "ancestor remembrance ceremonies"
        - "harvest gratitude rituals"

agriculture:
  growing_season: false
  harvest_activities:
    - "Main grain harvest"
    - "Root vegetables"
    - "Tree fruits"
    - "Nuts and seeds"
  planting_activities:
    - "Winter wheat"

economy:
  trade_conditions: "good" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 0.8 # 20% less expensive
    fuel_modifier: 0.9 # 10% less expensive
    travel_modifier: 1.0 # normal prices

cultural_significance:
  themes:
    - "transition"
    - "gratitude"
    - "preparation"
    - "reflection"
  common_sayings:
    - "Eleint teaches that all things fade"
    - "The wise harvest before winter's bite"

weather:
  - description: "Cooling weather with changing colors"
  - temperature: "Mild to cool"
  - precipitation: "Moderate autumn rains"
  - schema:
      - temperature_range_celsius:
          min: 10
          max: 22
      - precipitation_chance_percent:
          min: 30
          max: 60
      - storm_chance_percent:
          min: 15
          max: 45
      - wind_speed_kph:
          min: 8
          max: 30
  - events:
      - name: "Autumn Storm"
        probability: 20
        mechanics:
          - "Strong winds strip leaves from trees."
          - "Heavy rain makes roads muddy."
          - "Harvesting becomes more difficult."
          - "Travel speed reduced by 25%."
      - name: "Perfect Harvest Weather"
        probability: 35
        mechanics:
          - "Clear, crisp days ideal for harvest work."
          - "Agricultural activities have advantage."
          - "Travel is pleasant and efficient."
      - name: "Early Frost"
        probability: 10
        mechanics:
          - "Unexpected frost damages late crops."
          - "Constitution save DC 10 for unprotected plants."
          - "Warning of winter's approach."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +2 # degrees warmer
      - region: "The North"
        temperature_modifier: -3 # degrees colder
      - region: "Anauroch Desert"
        temperature_modifier: +5 # degrees warmer
        precipitation_modifier: -50 # percent less precipitation
  - daylight:
      sunrise_hour: 6
      sunset_hour: 18
      daylight_hours: 12
      long_night_effects: false

travel:
  difficulty: "moderate" # easy/moderate/hard/extreme
  speed_modifier: 0.9 # 90% of normal speed
  random_encounter_modifier: 1.0 # normal encounter rate

adventure_hooks:
  - "Protecting harvest from raiders and monsters"
  - "Investigating mysterious crop failures"
  - "Preparing communities for harsh winter"
  - "Ancient autumn rituals requiring completion"
  - "transition"
---

# Eleint

## The Fading

Eleint is the ninth month of the year and marks the beginning of autumn in the Calendar of Harptos. Known as "The Fading," this month represents the gradual decline of summer's power and the arrival of harvest season.

- **Month**: 9 of 12
- **Days**: 30
- **Season**: Autumn
- **Common Name**: The Fading

## Autumn's Arrival

Eleint brings cooler weather, changing leaf colors, and the main harvest season. The name "The Fading" refers to the gradual shortening of days and the fading of summer's intense heat.

## Notable Events

The **Autumn Equinox** occurs on the 21st of Eleint, marking equal day and night as autumn officially begins. The month ends with **Highharvestide** (between Eleint 30 and Marpenoth 1).

## Activities

- Main harvest season for most crops
- Communities prepare for winter
- Autumn festivals and markets celebrate the harvest
- Animals and plants begin preparing for winter dormancy
