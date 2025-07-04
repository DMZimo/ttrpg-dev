---
# Character Metadata
owner: "TheFlightlessDutchman"
is_public: true
publish_date_iso: 2025-06-28T00:00:00
last_updated_iso: 2025-06-28T00:00:00
tags: [pc, aasimar, paladin, noble, conquest, waterdeep]

# Character Details
type: "pc" # pc, npc, or sidekick
status: "alive" # alive, dead, missing, unknown
active: true
portrait: "aldor-irion-portrait.png"
token: "aldor-irion-token.png"
color: "#FFD700" # Gold color for Aasimar

# Character Attributes
name: "Aldor Irion"
race: "Aasimar"
subrace: "Scourge"
background: "Noble"
birthplace: "Waterdeep"
culture: "Waterdhavian"
description: "A noble Aasimar Paladin, Aldor Irion is a scion of the once-great House Irion, now seeking to restore his family's honor through conquest and leadership. With a commanding presence and a heart of fire, he rides into the unknown to carve out a new destiny for his lineage."
birthdate: 1471-01-20
size: "Medium"
languages:
  - name: "Common"
  - name: "Celestial"
  - name: "Elvish"
  - name: "Draconic"
  - name: "Infernal"
  - name: "Thieves' Cant" # Aldor has learned this from his rogue training, useful for covert communication
  - name: "Dwarvish" # As a noble, he has had dealings with various cultures in Waterdeep
  - name: "Gnomish" # Knowledge of gnomish culture is common among Waterdeep's elite
  - name: "Halfling" # Familiarity with halfling culture, often seen in Waterdeep's North Ward
  - name: "Orcish" # Understanding of orc culture, useful for dealing with frontier threats
  - name: "Giant" # Knowledge of giant culture, often relevant in the North
  - name: "Sylvan" # Familiarity with the language of fey creatures, useful in the wilderness
  - name: "Undercommon" # Useful for dealing with the Underdark and its denizens

# Visuals
physical_description:
  gender: "male"
  hair: "Long, silver hair reaching past his shoulders"
  eyes: "Silver flecked eyes that shine with a celestial light"
  skin: "Pale, with a faint golden sheen"
  build: "Athletic, with a strong and imposing presence"
  height:
    - feet: "6"
      inches: "2"
  weight: "180 lbs"
  physical_prose: "The Aasimar in front of you is a striking figure, with long silver hair that cascades down his back, framing a face that is both regal and fierce. His silver flecked eyes seem to glow with an inner light, hinting at his celestial heritage. His skin is pale, almost luminescent, and he carries himself with the confidence of a noble born to lead. Clad in polished armor adorned with the sigil of House Irion, he exudes an aura of authority and purpose."

# Character Roles
roles: ["tank", "melee", "support", "ranged", "caster"]

# Character Stats
ability_scores:
  str: 15
  dex: 10
  con: 16
  int: 13
  wis: 14
  cha: 19

# Derived stats
proficiency_bonus: 2
saving_throws:
  wis: 4
  cha: 6

# Classes and levels
classes:
  - name: "Paladin"
    level: 2
    subclass: "Oath of Conquest"
  - name: "Rogue"
    level: 2
    subclass: "Mastermind"
hp: 22
ac: 18
mr: 18

# Skills
skills:
  - name: "Acrobatics"
    ability: "dex"
    modifier: 0
    passive: 10
    proficient: false
    expertise: false
    key: "acr"
  - name: "Animal Handling"
    ability: "wis"
    modifier: 2
    passive: 12
    proficient: false
    expertise: false
    key: "ani"
  - name: "Arcana"
    ability: "int"
    modifier: 1
    passive: 11
    proficient: false
    expertise: false
    key: "arc"
  - name: "Athletics"
    ability: "str"
    modifier: 4
    passive: 14
    proficient: true
    expertise: false
    key: "ath"
  - name: "Deception"
    ability: "cha"
    modifier: 4
    passive: 14
    proficient: false
    expertise: false
    key: "dec"
  - name: "History"
    ability: "int"
    modifier: 3
    passive: 13
    proficient: true
    expertise: false
    key: "his"
  - name: "Insight"
    ability: "wis"
    modifier: 2
    passive: 12
    proficient: false
    expertise: false
    key: "ins"
  - name: "Intimidation"
    ability: "cha"
    modifier: 6
    passive: 16
    proficient: true
    expertise: false
    key: "itm"
  - name: "Investigation"
    ability: "int"
    modifier: 1
    passive: 11
    proficient: false
    expertise: false
    key: "inv"
  - name: "Medicine"
    ability: "wis"
    modifier: 2
    passive: 12
    proficient: false
    expertise: false
    key: "med"
  - name: "Nature"
    ability: "int"
    modifier: 1
    passive: 11
    proficient: false
    expertise: false
    key: "nat"
  - name: "Perception"
    ability: "wis"
    modifier: 2
    passive: 12
    proficient: false
    expertise: false
    key: "prc"
  - name: "Performance"
    ability: "cha"
    modifier: 4
    passive: 14
    proficient: false
    expertise: false
    key: "prf"
  - name: "Persuasion"
    ability: "cha"
    modifier: 6
    passive: 16
    proficient: true
    expertise: false
    key: "per"
  - name: "Religion"
    ability: "int"
    modifier: 1
    passive: 11
    proficient: false
    expertise: false
    key: "rel"
  - name: "Sleight of Hand"
    ability: "dex"
    modifier: 0
    passive: 10
    proficient: false
    expertise: false
    key: "slt"
  - name: "Stealth"
    ability: "dex"
    modifier: 0
    passive: 10
    proficient: false
    expertise: false
    key: "ste"
  - name: "Survival"
    ability: "wis"
    modifier: 2
    passive: 12
    proficient: false
    expertise: false
    key: "sur"

# Tools
tools:
  - name: "Chess Set"
    ability: "int"
    modifier: 3
    proficient: true
    expertise: false
    key: "chess"

# Spellcasting
spellcasting:
  ability: "cha"
  spell_attack_bonus: 6
  spell_save_dc: 14

# Character Relationships
organization:
  name: "House Irion"
  disposition: 50
enclave:
  name: "Lord's Alliance"
  disposition: 50
affiliations:
  - name: "Waterdeep Noble Houses"
    disposition: 50
  - name: "Waterdeep North Ward"
    disposition: 50
cult: null
allies: ["Daijo", "Finn Quickfoot", "Jain Farstrider", "House Irion Retainers"]
enemies: []

# Character motivations and traits
personality_traits:
  - "If you do me an injury, I will crush you, ruin your name, and salt your fields."
  - "No one could doubt by looking at my regal bearing that I am a cut above the unwashed masses."
ideals:
  - "Responsibility. It is my duty to respect the authority of those above me, just as those below me must respect mine. (Lawful)"
bonds:
  - "I will face any challenge to win the approval of my family."
flaws:
  - "In fact, the world does revolve around me."
---

# Aldor Irion

## Background

Born beneath the gilded ceilings of a crumbling estate in Waterdeep's North Ward, Aldor Irion grew up on the edge of splendor and shame. His family, once proud nobles, had lost nearly everything, lands seized, titles stripped, and honour tarnished by scandal and cowardice in war. To the city's elite, the Irion name was worth less than mud. But to Aldor, it was still a source of pride.

Aasimar blood ran strong through him, marked by silver flecked eyes and a voice that carried like a trumpet's call. From a young age, Aldor trained with ruthless discipline, finding strength in doctrine. He swore that he would undo his family's shame, and conquer new lands for them to rule over.

Now, Aldor rides north, beyond the comforts of court and coin, to the untamed frontier. He decides to start out in the Dressarin Valley, where rumours of cults and chaos have reached his ears, an opportunity wrapped in danger. He seeks not only to crush the disorder that festers there, but to carve a new dominion through steel and fire. In this savage place, he will plant the banner of House Irion anew.
