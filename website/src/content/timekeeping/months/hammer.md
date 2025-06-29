---
month_number: 1
name: "Hammer"
pronunciation:
  common: "HAM-mer"
  ipa: "/'hæm.mɜr/"
elvish_name: "Kae-Auglath"
elvish_pronunciation: "KEI-aug-lath"
alias: "Deepwinter"
Description: "The coldest month, marking the depth of winter"
season: "winter"
tags:
  - "winter"
  - "cold"
  - "harsh"
  - "survival"

activities:
  - "Indoor crafts and storytelling"
  - "Ice fishing and winter hunting"
  - "Preparation for Midwinter festival"
  - "Maintenance of tools and equipment"
  - social_activities:
      indoor_crafts: true
      storytelling: true
      religious_observances:
        - "prayers for warmth"
        - "ancestor veneration"

agriculture:
  growing_season: false
  harvest_activities: []
  planting_activities: []

economy:
  trade_conditions: "poor" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 1.2 # 20% more expensive
    fuel_modifier: 1.5 # 50% more expensive
    travel_modifier: 2.0 # 100% more expensive

cultural_significance:
  themes:
    - "endurance"
    - "preparation"
    - "community_survival"
  common_sayings:
    - "Hammer's the teacher, Road's the anvil"
    - "Only fools travel in Hammer"

weather:
  - description: "Cold and harsh with frequent snow"
  - temperature: "Freezing to very cold"
  - precipitation: "Heavy snow and ice storms"
  - schema:
      - temperature_range_celsius:
          min: -15
          max: 2
      - precipitation_chance_percent:
          min: 60
          max: 95
      - storm_chance_percent:
          min: 30
          max: 70
      - wind_speed_kph:
          min: 15
          max: 50
  - events:
      - name: "Blizzard"
        probability: 10
        mechanics:
          - "Creatures must succeed on a DC 12 Constitution saving throw every hour or gain one level of exhaustion."
          - "Visibility is reduced to 30 feet."
          - "Travel speed is halved."
          - "Ranged attacks are made with disadvantage."
      - name: "Ice storm"
        probability: 10
        mechanics:
          - "Creatures must succeed on a DC 12 Constitution saving throw every hour or gain one level of exhaustion."
          - "Area becomes difficult terrain."
          - "Dexterity saving throw DC 12 to avoid falling prone when moving."
          - "Ranged attacks are made with disadvantage."
      - name: "Clear cold snap"
        probability: 15
        mechanics:
          - "Creatures without cold weather gear must succeed on a DC 10 Constitution saving throw every 4 hours or take 1d4 cold damage."
          - "Visibility is normal."
      - name: "Frozen morning"
        probability: 15
        mechanics:
          - "Surfaces are slippery; Dexterity (Acrobatics) check DC 10 to avoid slipping when dashing. Knocked prone on a failure."
          - "Travel speed reduced by 25%."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +2 # degrees warmer
      - region: "The North"
        temperature_modifier: -5 # degrees colder
      - region: "Anauroch Desert"
        precipitation_modifier: -40 # percent less precipitation
  - daylight:
      sunrise_hour: 8
      sunset_hour: 16
      daylight_hours: 8
      long_night_effects: true

travel:
  difficulty: "extreme" # easy/moderate/hard/extreme
  speed_modifier: 0.5 # half normal speed
  random_encounter_modifier: 1.3 # 30% more likely

adventure_hooks:
  - "Isolated communities running out of supplies"
  - "Monsters driven closer to civilization by cold"
  - "Ancient ruins more accessible due to frozen waterways"
---

# Hammer - Deepwinter

Hammer is the first month of the year in the Calendar of Harptos and represents the harshest period of winter. Named for the hammer-like blows of winter storms, this month tests the endurance of all who live through it.

## Climate and Weather

Hammer brings the most severe weather of the year:

- **Temperature**: Consistently below freezing across most of Faerûn
- **Precipitation**: Heavy snowfall and dangerous ice storms
- **Winds**: Bitter northern winds that cut through even the warmest clothing
- **Daylight**: Short days with long, dark nights

## Life During Hammer

### Urban Areas

Cities and towns during Hammer become havens of warmth and community. Markets may be sparse, but taverns overflow with locals seeking warmth and companionship. The wealthy burn through stockpiled firewood while the poor huddle together for survival.

### Rural Communities

Farming communities focus on survival during Hammer. Livestock require constant care and shelter, while families rely heavily on preserved foods from the previous harvest. This is a time for indoor crafts, tool maintenance, and planning for the coming year.

### Travel and Trade

Travel during Hammer is dangerous and often impossible. Roads become impassable due to snow and ice, and even the hardiest merchants avoid long journeys. Sea travel is particularly treacherous with frozen harbors and violent storms.

## Cultural Significance

Hammer holds special meaning as a test of character and preparation. Communities that plan well and support each other thrive, while those that don't may face serious hardship. The month teaches the values of:

- **Preparation and foresight**
- **Community support and sharing**
- **Endurance and perseverance**
- **Respect for nature's power**

## Festivals and Observances

The month culminates in **Midwinter**, the great festival that marks the symbolic turning point from the death of the old year to the hope of the new. This celebration provides a crucial morale boost during the darkest time.

## Game Mechanics

During Hammer:

- **Survival checks** may be required for outdoor travel
- **Cold weather effects** apply consistently
- **Food and fuel costs** increase in many areas
- **Travel times** are significantly extended
- **Random encounters** may include winter-specific dangers

## Agriculture and Economy

### Agriculture

- **Growing Season**: False
- **Harvest Activities**: None
- **Planting Activities**: None

### Economy

- **Trade Conditions**: Poor
- **Typical Prices**:
  - **Food Modifier**: 1.2 (20% more expensive)
  - **Fuel Modifier**: 1.5 (50% more expensive)
  - **Travel Modifier**: 2.0 (100% more expensive)

---

_Part of the Calendar of Harptos - see other [months](../months/) and [timekeeping](../timekeeping/) information._
