---
# === IDENTITY ===
name: "Celestial Body Name"
type: "star|planet|moon|asteroid-cluster"
subtype: "primary-star|terrestrial-planet|natural-satellite|inhabited-cluster"
aliases: ["Alternative Name 1", "Alternative Name 2"]

# === CLASSIFICATION ===
spelljammer:
  size: "A|B|C|D|E|F|G|H"  # Spelljammer size classification
  shape: "spherical|cluster|irregular"
  body: "fire|earth|air|water"  # Primary elemental type
  code: "H●F"  # Combined classification code

# === PHYSICAL ===
physical:
  diameter_miles: 864000  # Single value or range
  mass_earth: 333000  # Relative to Earth/Toril
  gravity_earth: 28.0  # Relative to Earth/Toril
  atmosphere: "none|breathable|toxic|magical"
  temperature: "variable|hot|cold|temperate"
  composition: "rocky|gaseous|molten|mixed"

# === ORBITAL ===
orbital:
  primary: "the-sun"  # What this body orbits (file reference)
  distance_miles: 93000000  # Average distance from primary
  period_days: 365.25  # Orbital period
  rotation_hours: 24  # Rotation period (null if tidally locked)
  axial_tilt: 23.5  # In degrees
  eccentricity: 0.017  # Optional: orbital eccentricity

# === RELATIONSHIPS ===
satellites: ["selune", "tears-of-selune"]  # Bodies orbiting this one
companions: []  # Bodies in same orbit (like asteroid clusters)
children: []  # Bodies in orbit around this one's satellites

# === VISIBILITY ===
visibility:
  magnitude: -26.8  # Apparent magnitude from Toril
  color: "golden-white"
  phases: true|false  # Whether body shows phases
  naked_eye: true|false  # Visible to naked eye

# === CYCLES ===
cycles:
  primary: 365.25  # Main cycle (usually orbital period)
  phases: 29.5  # Phase cycle if applicable
  seasons: true|false  # Whether body affects seasons

# === CULTURAL ===
cultural:
  deities: ["Amaunator", "Lathander"]
  mythology: "Brief creation myth"
  significance: "Role in culture and religion"
  calendar_use: "How used in timekeeping"

# === INHABITANTS ===
inhabited: true|false
inhabitants: ["Humans", "Elves", "Beholders"]
settlements:
  - name: "Settlement Name"
    type: "city|outpost|fortress"
    population: "Large|Medium|Small"

# === SPECIAL ===
special:
  magical_effects: ["Effect 1", "Effect 2"]
  portals: ["Portal Type 1", "Portal Type 2"]
  unique_features: ["Feature 1", "Feature 2"]
  dangers: ["Danger 1", "Danger 2"]

# === GAME ===
game:
  mechanical_effects: ["Game effect 1", "Game effect 2"]
  spellcasting_mods: "+1 fire spells during day"
  navigation_bonus: "+2 to navigation checks"

# === META ===
tags: ["star", "primary", "fire"]
sources: ["SJR2 Realmspace", "Other Source"]
updated: "2025-06-29"
---