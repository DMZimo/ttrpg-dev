---
month_number: 11
name: "Uktar"
pronunciation:
  common: "UHK-tar"
  ipa: "/ˈʌktɑr/"
elvish_name: "Tath Mhaoth"
elvish_pronunciation: "tath muh-HOWTH"
alias: "The Rotting"
Description: "Autumn's end as nature completes its cycle and prepares for winter"
season: "autumn"
tags:
  - "autumn"
  - "decay"
  - "preparation"
  - "transition"

activities:
  - "Final winter preparations"
  - "Food preservation"
  - "Reflection and planning"
  - "Ancestor honoring"
  - social_activities:
      indoor_activities: true
      solemn_observances: true
      religious_observances:
        - "death and rebirth ceremonies"
        - "ancestor veneration"

agriculture:
  growing_season: false
  harvest_activities:
    - "Final root storage"
    - "Late mushroom gathering"
  planting_activities: []

economy:
  trade_conditions: "fair" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 1.0 # normal prices
    fuel_modifier: 1.3 # 30% more expensive
    travel_modifier: 1.4 # 40% more expensive

cultural_significance:
  themes:
    - "endings"
    - "death_and_rebirth"
    - "acceptance"
    - "final_preparation"
  common_sayings:
    - "Uktar teaches that all must pass"
    - "In decay lies the seed of renewal"

weather:
  - description: "Cold and damp with decay setting in"
  - temperature: "Cold and damp"
  - precipitation: "Cold rains and early snow"
  - schema:
      - temperature_range_celsius:
          min: 0
          max: 10
      - precipitation_chance_percent:
          min: 50
          max: 80
      - storm_chance_percent:
          min: 25
          max: 60
      - wind_speed_kph:
          min: 12
          max: 40
  - events:
      - name: "Bone-chilling Rain"
        probability: 30
        mechanics:
          - "Cold rain penetrates all but the best gear."
          - "Constitution save DC 12 every 2 hours or gain exhaustion."
          - "Fires are difficult to start and maintain."
      - name: "Early Snow"
        probability: 20
        mechanics:
          - "First snow of the season surprises travelers."
          - "Travel becomes more difficult."
          - "Warning of winter's approach."
      - name: "Creeping Mists"
        probability: 25
        mechanics:
          - "Thick fog reduces visibility to 30 feet."
          - "Navigation becomes challenging."
          - "Eerie atmosphere affects morale."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +2 # degrees warmer
      - region: "The North"
        temperature_modifier: -3 # degrees colder
      - region: "Anauroch Desert"
        precipitation_modifier: -60 # percent less precipitation
  - daylight:
      sunrise_hour: 7
      sunset_hour: 16
      daylight_hours: 9
      long_night_effects: true

travel:
  difficulty: "hard" # easy/moderate/hard/extreme
  speed_modifier: 0.75 # 75% of normal speed
  random_encounter_modifier: 1.2 # 20% more likely

adventure_hooks:
  - "Undead rising as the veil grows thin"
  - "Communities facing winter supply shortages"
  - "Ancient mysteries revealed in dying lands"
  - "Desperate creatures seeking winter shelter"
---

# Uktar

## The Rotting

Uktar is the eleventh month of the year in the Calendar of Harptos, known as "The Rotting." This somber name reflects the natural process of decay that occurs as autumn reaches its end, with fallen leaves decomposing and the last vestiges of the growing season giving way to winter's approach.

- **Month**: 11 of 12
- **Days**: 30
- **Season**: Autumn
- **Common Name**: The Rotting

## Autumn's End

Uktar marks the transition from autumn's abundance to winter's austerity. The decomposition of fallen leaves enriches the soil for next year's growth, making this month essential to the natural cycle despite its seemingly morbid name.

## Notable Events

The month ends with the **Feast of the Moon** (between Uktar 30 and Nightal 1), a solemn festival honoring the dead and celebrating the connection between life and death.

## Activities

- Final winter preparations
- Preservation of the last perishable goods
- Reflection on the year's accomplishments
- Honoring ancestors and deceased community members
- Checking food stores and winter supplies
- Reinforcing shelters against winter weather
