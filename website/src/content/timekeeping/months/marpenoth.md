---
month_number: 10
name: "Marpenoth"
pronunciation:
  common: "MAR-pen-oth"
  ipa: "/ˈmɑrpɛnɒθ/"
elvish_name: "Ileldyon"
elvish_pronunciation: "il-EL-dyon"
alias: "Leaffall"
Description: "Autumn's peak when leaves fall and nature prepares for winter"
season: "autumn"
tags:
  - "autumn"
  - "leaffall"
  - "decline"
  - "preparation"

activities:
  - "Final harvesting"
  - "Food preservation"
  - "Leaf collection"
  - "Final outdoor festivals"
  - social_activities:
      indoor_preparation: true
      community_gathering: true
      religious_observances:
        - "death and renewal ceremonies"
        - "preparation rituals"

agriculture:
  growing_season: false
  harvest_activities:
    - "Late root vegetables"
    - "Final fruit collection"
    - "Seed gathering"
  planting_activities: []

economy:
  trade_conditions: "fair" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 0.9 # 10% less expensive
    fuel_modifier: 1.1 # 10% more expensive
    travel_modifier: 1.2 # 20% more expensive

cultural_significance:
  themes:
    - "change"
    - "letting_go"
    - "preparation"
    - "natural_cycles"
  common_sayings:
    - "Marpenoth teaches release"
    - "What falls feeds what grows"

weather:
  - description: "Cool autumn weather with falling leaves"
  - temperature: "Cool and crisp"
  - precipitation: "Frequent autumn rains"
  - schema:
      - temperature_range_celsius:
          min: 5
          max: 18
      - precipitation_chance_percent:
          min: 40
          max: 70
      - storm_chance_percent:
          min: 20
          max: 50
      - wind_speed_kph:
          min: 10
          max: 35
  - events:
      - name: "Autumn Windstorm"
        probability: 25
        mechanics:
          - "Strong winds strip remaining leaves."
          - "Visibility reduced by falling debris."
          - "Ranged attacks have disadvantage."
          - "Flying creatures must make DC 15 checks to maintain control."
      - name: "First Hard Frost"
        probability: 20
        mechanics:
          - "Killing frost ends growing season."
          - "Water sources begin to freeze."
          - "Cold weather effects begin to apply."
      - name: "Melancholy Rain"
        probability: 30
        mechanics:
          - "Steady rain creates reflective mood."
          - "Travel speed reduced by 15%."
          - "Wisdom-based checks have slight advantage."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +3 # degrees warmer
      - region: "The North"
        temperature_modifier: -2 # degrees colder
      - region: "Anauroch Desert"
        temperature_modifier: +6 # degrees warmer
        precipitation_modifier: -40 # percent less precipitation
  - daylight:
      sunrise_hour: 7
      sunset_hour: 17
      daylight_hours: 10
      long_night_effects: false

travel:
  difficulty: "moderate" # easy/moderate/hard/extreme
  speed_modifier: 0.85 # 85% of normal speed
  random_encounter_modifier: 1.1 # 10% more likely

adventure_hooks:
  - "Creatures seeking winter shelter near settlements"
  - "Lost travelers caught in early storms"
  - "Ancient secrets revealed by falling leaves"
  - "Communities needing help with winter preparations"
---

# Marpenoth

## Leaffall

Marpenoth is the tenth month of the year in the Calendar of Harptos, known as "Leaffall." This month represents the height of autumn when leaves turn brilliant colors and begin to fall, creating a carpet of gold, red, and brown across the landscape.

- **Month**: 10 of 12
- **Days**: 30
- **Season**: Autumn
- **Common Name**: Leaffall

## Autumn's Peak

Marpenoth brings the most dramatic autumn colors and the steady decline of temperatures. The name "Leaffall" captures the iconic image of this month - trees shedding their colorful foliage as nature prepares for winter dormancy.

## Notable Events

The month begins with **Highharvestide** (between Eleint 30 and Marpenoth 1), celebrating the completion of the harvest season.

## Activities

- Final harvesting of late crops
- Preparation of preserved foods for winter
- Collection of fallen leaves for various uses
- Final outdoor festivals before winter's arrival
- Migration preparations for traveling communities
