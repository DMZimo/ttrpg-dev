# D&D Campaign Manager (DNDM) - Simple Hobby Project

## Project Vision

DNDM is a simple command-line tool to help manage D&D sessions by automating common tasks like starting/stopping Foundry VTT and managing campaign notes in Obsidian. This is a hobby project focused on personal productivity during D&D session prep.

**The Problem**: Every D&D session requires the same setup routine - start Foundry VTT, open the right campaign notes, create session templates, etc. This takes time and is easy to forget steps.

**The Solution**: A single `dndm` command that handles the boring stuff so I can focus on the fun parts of DMing.

## Current Status

Single Python implementation (`dndm/`) with basic service management

## Core Features (Next 2-3 Weeks)

### Week 1: Basic Service Management

- **Foundry VTT Control**: Simple start/stop commands to make the server run in the background
- **Basic CLI**: Core `dndm` command with help system

### Week 2: Content Management

- **Obsidian Integration**: Create templates for NPCs, locations, sessions
- **Simple TUI**: Basic terminal interface for common tasks
- **File Organization**: Automated campaign folder structure

### Week 3: Polish & Convenience

- **Status Checking**: See what services are running
- **Quick Setup**: Easy installation script
- **Documentation**: Simple usage guide

## Enhanced Features (Future Development)

### Discord Bot Integration

- **Session Reminders**: Automated Discord notifications for upcoming sessions
- **Player Check-ins**: Bot can ping players for attendance confirmation
- **Campaign Updates**: Post session summaries and important updates to campaign channel
- **Initiative Tracker**: Simple initiative order management in Discord
- **Dice Roller**: Basic dice rolling commands for quick rolls during discussions
- **Character Lookup**: Query character stats and notes from Discord
- **Session Scheduling**: Help coordinate session times with player availability

### Advanced Campaign Management

- **Player Database**: Track player characters, backstories, and progression
- **Quest Tracker**: Automated quest status updates and completion tracking
- **World Timeline**: Maintain chronological events and campaign history
- **NPC Relationship Map**: Visual connections between NPCs and factions
- **Treasure & Loot Management**: Track party inventory and magic items
- **Combat Encounter Builder**: Quick random encounter generation
- **Weather & Calendar System**: Automated in-game date tracking

### Enhanced Foundry Integration

- **Asset Manager**: Bulk upload and organize maps, tokens, and assets
- **Module Updater**: Automated Foundry module management and updates
- **Scene Preloader**: Pre-configure scenes with lighting and walls
- **Playlist Manager**: Organize and queue background music by scene type
- **Backup System**: Automated world backups before each session

### Content Generation Tools

- **Random Generators**: Names, settlements, taverns, and plot hooks
- **Handout Creator**: Generate PDF handouts from Obsidian notes
- **Battle Map Organizer**: Categorize and tag maps by environment/encounter type
- **Session Recap Generator**: Auto-format session notes into player summaries
- **Campaign Website**: Generate simple HTML site from campaign notes

### Quality of Life Features

- **Voice Notes Integration**: Record and transcribe session audio clips
- **Mobile Companion**: Simple web interface for session notes on phone/tablet
- **Player Portal**: Shared access to character sheets and campaign information
- **Analytics Dashboard**: Track session frequency, player participation, story progression
- **Automated Backups**: Regular saves of all campaign data to cloud storage

## Simple Architecture

**Single Python App**: Just the `dndm/` folder

**Core Dependencies**:

- Python 3.8+
- Rich (for terminal UI)
- tmux (for service management)

**Target**: Linux/macOS personal use

## Basic Commands

```bash
dndm start foundry    # Start Foundry VTT server
dndm stop foundry     # Stop Foundry VTT server
dndm status           # Show what's running
dndm tui              # Interactive terminal interface
dndm create npc       # Create NPC template in Obsidian
dndm create session   # Create session notes template

# Discord Bot Commands
dndm discord start    # Start Discord bot
dndm discord remind   # Send session reminder to players
dndm discord schedule # Open scheduling interface

# Advanced Features
dndm backup create    # Create campaign backup
dndm generate tavern  # Generate random tavern
dndm timeline add     # Add event to campaign timeline
dndm players status   # Show player character summary
```

## Current Services

### Foundry VTT

- **URL**: `http://localhost:30000`
- **Purpose**: D&D virtual tabletop
- **Management**: Start/stop via `dndm`

### Campaign Notes (Obsidian)

- **Location**: `gmbinder/` folder
- **Purpose**: Campaign notes and templates
- **Management**: Template creation via `dndm`

## Maybe Later (If Time Permits)

- Campaign website generator
- Backup automation
- More Obsidian templates

## Success Goals

1. **Save 10 minutes per session** by automating startup/shutdown
2. **Consistent note-taking** with templates
3. **Single command** to get everything ready for D&D night
4. **Personal productivity tool** - just for me, not others
