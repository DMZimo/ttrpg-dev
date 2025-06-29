---
month_number: 2
name: "Alturiak"
pronunciation:
  common: "al-TOO-ree-ak"
  ipa: "/ælˈtuːriæk/"
elvish_name: "N'iaughlath"
elvish_pronunciation: "nuh-ee-AUG-lath"
alias: "The Claw of Winter"
Description: "The second month representing winter's strongest grip on the land"
season: "winter"
tags:
  - "winter"
  - "cold"
  - "harsh"
  - "endurance"

activities:
  - "Equipment maintenance"
  - "Food preservation monitoring"
  - "Community support activities"
  - "Indoor crafting"
  - social_activities:
      indoor_crafts: true
      storytelling: true
      religious_observances:
        - "prayers for survival"
        - "community bonding rituals"

agriculture:
  growing_season: false
  harvest_activities: []
  planting_activities: []

economy:
  trade_conditions: "poor" # poor/fair/good/excellent
  typical_prices:
    food_modifier: 1.3 # 30% more expensive
    fuel_modifier: 1.6 # 60% more expensive
    travel_modifier: 2.2 # 120% more expensive

cultural_significance:
  themes:
    - "survival"
    - "community_bonds"
    - "winter_endurance"
  common_sayings:
    - "Alturiak's claw cuts deepest"
    - "When the Claw bites, wise folk hide"

weather:
  - description: "Coldest month with fierce storms and blizzards"
  - temperature: "Severely cold"
  - precipitation: "Heavy snows and ice"
  - schema:
      - temperature_range_celsius:
          min: -20
          max: -2
      - precipitation_chance_percent:
          min: 70
          max: 95
      - storm_chance_percent:
          min: 40
          max: 80
      - wind_speed_kph:
          min: 20
          max: 60
  - events:
      - name: "Ice Storm"
        probability: 15
        mechanics:
          - "Creatures must succeed on a DC 15 Constitution saving throw every hour or gain one level of exhaustion."
          - "Area becomes difficult terrain."
          - "Dexterity saving throw DC 15 to avoid falling prone when moving."
          - "Ranged attacks are made with disadvantage."
      - name: "Whiteout Blizzard"
        probability: 12
        mechanics:
          - "Visibility reduced to 5 feet."
          - "Travel speed reduced to quarter."
          - "Creatures must succeed on a DC 15 Constitution saving throw every hour or gain one level of exhaustion."
          - "All attacks made with disadvantage."
      - name: "Bone-chilling Cold"
        probability: 20
        mechanics:
          - "Creatures without cold weather gear must succeed on a DC 13 Constitution saving throw every 2 hours or take 1d6 cold damage."
          - "Water freezes in 1 hour."
          - "Metal weapons and armor impose disadvantage on attack rolls without proper insulation."
  - regional_variations:
      - region: "Sword Coast"
        temperature_modifier: +3 # degrees warmer
      - region: "The North"
        temperature_modifier: -8 # degrees colder
      - region: "Anauroch Desert"
        precipitation_modifier: -50 # percent less precipitation
  - daylight:
      sunrise_hour: 8
      sunset_hour: 16
      daylight_hours: 8
      long_night_effects: true

travel:
  difficulty: "extreme" # easy/moderate/hard/extreme
  speed_modifier: 0.4 # 40% of normal speed
  random_encounter_modifier: 1.4 # 40% more likely

adventure_hooks:
  - "Desperate communities facing starvation"
  - "Creatures seeking shelter in civilized areas"
  - "Frozen waterways revealing hidden passages"
  - "Ice-locked ships and stranded travelers"
---

# Alturiak

## The Claw of Winter

Alturiak, commonly known as "The Claw of Winter," is the second month of the year in the Calendar of Harptos. This month represents winter at its most severe, when the cold's grip on the land is strongest and most unrelenting.

- **Month**: 2 of 12
- **Days**: 30
- **Season**: Winter
- **Common Name**: The Claw of Winter

## Characteristics

Alturiak is typically the coldest month of the year across most of Faerûn. The name "Claw of Winter" comes from the way the bitter cold seems to reach into every corner of civilization, finding ways through the strongest defenses against the elements.

### Weather Patterns

- **Temperature**: The coldest month of the year in most regions
- **Precipitation**: Heavy snows in northern and mountainous areas
- **Daylight**: Short days with long, dark nights
- **Winds**: Fierce winter storms and blizzards are common

## Regional Variations

### The North

In regions like Icewind Dale and the northern reaches, Alturiak brings truly brutal conditions with temperatures that can freeze exposed skin in minutes.

### The Sword Coast

Coastal areas experience harsh rain mixed with snow, creating treacherous traveling conditions.

### The Heartlands

Agricultural regions hunker down, relying on stored provisions as outdoor work becomes nearly impossible.

## Cultural Significance

Alturiak is a time of endurance and community support. Many traditions focus on helping those less fortunate survive the harsh conditions:

- **Warming Houses**: Communities open public buildings for those without adequate shelter
- **Food Sharing**: Families with surplus supplies share with their neighbors
- **Storytelling Seasons**: Long nights are filled with tales and songs to maintain morale

## Agricultural Notes

This is the deepest part of the agricultural dormancy period. Farmers:

- Check and maintain equipment for spring preparation
- Monitor stored grain and preserved foods
- Care for livestock in protected shelters
- Plan for the coming year's planting

## Associated Festivals

The month begins with **Midwinter**, the special day that falls between Hammer 30 and Alturiak 1, marking the traditional midpoint of winter.

## Travel Considerations

Alturiak is generally considered the worst month for travel:

- Roads are often impassable due to snow and ice
- River crossings become extremely dangerous
- Mountain passes are typically closed
- Outdoor camping requires exceptional preparation

## Economic Impact

Trade typically slows to a minimum during Alturiak, with many merchants waiting for better weather. Essential goods command premium prices, and communities rely heavily on supplies accumulated during autumn.

## Magical Considerations

Cold-based magic is at its strongest during Alturiak, while fire and warmth magic requires more effort to maintain. The month is favored by frost giants and other cold-dwelling creatures for raids and territorial expansion.

## Notable Events

Many historical battles and sieges have been decided by armies' ability to endure Alturiak's harsh conditions. The month is also associated with the testing of character and the forging of strong community bonds through shared hardship.
