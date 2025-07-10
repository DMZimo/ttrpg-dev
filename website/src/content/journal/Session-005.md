---
# Session Metadata
session_number: 5
session_title: Session 5 - Lance Rock Investigation
cover_image: "@/assets/sessions/session-3-cover.jpg"
previous_session: "Session-4"
next_session: "Session-6"
is_public: false
session_start: 2025-07-07T21:00:00
session_end: 2025-07-08T01:00:00
publish_date_iso: 2025-07-07T00:00:00
last_updated_iso: 2025-07-07T00:00:00
tags:
  - session-report
  - investigation
  - plague

# In-Game Geospatial Metadata
ingame_start: 1491-04-18T09:00:00
ingame_end: null
primary_location: "Red Larch"
locations_visited:
  - name: "Lance Rock"
    link: "/atlas/lance-rock"

# Social Metadata
npcs_encountered:
  - name: "Endrith Vallivoe"
    link: "/npcs/endrith-vallivoe"
    first_encounter: false

  - name: "Harburk Tuthmarillar"
    link: "/npcs/harburk-tuthmarillar"
    first_encounter: false

  - name: "Helvur Tarnlar"
    link: "/npcs/helvur-tarnlar"
    first_encounter: true

  - name: "Maegla Tarnlar"
    link: "/npcs/maegla-tarnlar"
    first_encounter: true

  - name: "Garlen Harlathurl"
    link: "/npcs/garlen-harlathurl"
    first_encounter: true

  - name: "Ilmeth Waelvur"
    link: "/npcs/ilmeth-waelvur"
    first_encounter: false

combat_encounters:
  - name: "Lance Rock Cave - Entry Zombie"
    date: 1491-04-18T15:30:00
    terrain:
      - "Cave"
      - "Underground"
    weather:
      - "Clear"
    rounds: 2
    outcome: "victory"
    enemies:
      - name: "Zombie"
        type: "undead"
        count: 1
        difficulty: 0.25
        experience: 50
        equipment:
          - "Natural weapons"
        notes: "Body sprawled in cave entrance, animated when touched"

  - name: "Lance Rock Cave - Guard Cave Ambush"
    date: 1491-04-18T15:45:00
    terrain:
      - "Cave"
      - "Underground"
    weather:
      - "Clear"
    rounds: 3
    outcome: "victory"
    enemies:
      - name: "Zombie"
        type: "undead"
        count: 2
        difficulty: 0.25
        experience: 50
        equipment:
          - "Rock box trap"
          - "Natural weapons"
        notes: "Zombies on ledge dropped rock box, then jumped down to attack"

  - name: "Lance Rock Cave - Corpse Storage"
    date: 1491-04-18T16:00:00
    terrain:
      - "Cave"
      - "Underground"
    weather:
      - "Clear"
    rounds: 2
    outcome: "victory"
    enemies:
      - name: "Skeleton"
        type: "undead"
        count: 3
        difficulty: 0.25
        experience: 50
        equipment:
          - "Shortswords"
          - "Natural weapons"
        notes: "Hidden among other corpses, attacked when disturbed"

  - name: "Lance Rock Cave - Dancing Dead Performance"
    date: 1491-04-18T16:15:00
    terrain:
      - "Cave"
      - "Underground"
    weather:
      - "Clear"
    rounds: 4
    outcome: "victory"
    enemies:
      - name: "Zombie (Bear Costume)"
        type: "undead"
        count: 1
        difficulty: 0.25
        experience: 50
        equipment:
          - "Bear costume"
          - "Natural weapons"
        notes: "Performed grotesque comedy before attacking"
      - name: "Zombie (Lady Costume)"
        type: "undead"
        count: 1
        difficulty: 0.25
        experience: 50
        equipment:
          - "Frilly dress"
          - "Thick makeup"
          - "Natural weapons"
        notes: "Dressed as a lady, part of macabre performance"
      - name: "Zombie (Jester Costume)"
        type: "undead"
        count: 1
        difficulty: 0.25
        experience: 50
        equipment:
          - "Jester outfit"
          - "Jingling bells"
          - "Natural weapons"
        notes: "Costumed jester zombie with bells"

  - name: "Lance Rock Cave - Workshop Defense"
    date: 1491-04-18T16:30:00
    terrain:
      - "Cave"
      - "Underground"
    weather:
      - "Clear"
    rounds: 5
    outcome: "victory"
    enemies:
      - name: "Zombie (Hooded Figure)"
        type: "undead"
        count: 1
        difficulty: 0.25
        experience: 50
        equipment:
          - "Dark hood"
          - "Bone needle"
          - "Natural weapons"
        notes: "Posed as working necromancer at corpse table"
      - name: "Crawling Claw"
        type: "undead"
        count: 5
        difficulty: 0
        experience: 10
        equipment:
          - "Natural weapons"
        notes: "Hidden among body parts in baskets"
      - name: "Skeleton"
        type: "undead"
        count: 4
        difficulty: 0.25
        experience: 50
        equipment:
          - "Natural weapons"
        notes: "Guarding the western passage"

  - name: "Lance Rock Cave - Confronting Oreioth"
    date: 1491-04-18T16:45:00
    terrain:
      - "Cave"
      - "Underground"
    weather:
      - "Clear"
    rounds: 6
    outcome: "victory"
    enemies:
      - name: "Oreioth (Lord of Lance Rock)"
        type: "humanoid"
        count: 1
        difficulty: 2
        experience: 450
        equipment:
          - "Wand of Magic Missiles"
          - "Necromancer robes"
        notes: "Self-styled 'Lord of Lance Rock', insane necromancer who turned to black flame upon death"

# Characters Progression
characters_involved:
  - name: "Aldor Irion"
    link: "/characters/aldor-irion"
    status: "alive"
    rewards:
      - currency:
          gold: 60
          silver: 6

  - name: "Daijo"
    link: "/characters/daijo"
    status: "alive"
    rewards:
      - currency:
          gold: 60
          silver: 6
      - loot:
          - name: "Dwarven Astronomical Journal"
            rarity: "uncommon"
            quantity: 1

  - name: "Finn Quickfoot"
    link: "/characters/finn-quickfoot"
    status: "alive"
    rewards:
      - currency:
          gold: 60

  - name: "Jain Farstrider"
    link: "/characters/jain-farstrider"
    status: "alive"
    rewards:
      - currency:
          gold: 60

  - name: "Crinis"
    link: "/characters/crinis"
    status: "alive"

# Shared Rewards
group_rewards:
  - currency:
      copper: 19
  - loot:
      - name: "Shortbow"
        rarity: "common"
        quantity: 3
      - name: "Shortsword"
        rarity: "common"
        quantity: 3
---

## Loot

Shortbow x2
Shortsword x2
Copper Coins x19

Crinis takes an arrow to the chest from a skeleton and falls unconscious. The party manages to defeat the skeletons and zombies, but not before Crinis is gravely injured. (2 deth saves, 1 fail, 1 success)

The amber gem serves as a key to unlock L4 and is consumed

Both cave collapse triggers have been set off by Oreioth.

Aldor got burried in the rubble of the cave entrance, but was rescued with efforts of Jain.

The party escapes the cave as a hwrrowing voice echos from the darkness, "Leave and never return! Least the plague of Lance Rock takes you!"
