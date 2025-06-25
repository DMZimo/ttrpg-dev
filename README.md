# D&D Campaign Manager (DNDM) - Simple Hobby Project

## Project Vision

DNDM is a simple command-line tool to help manage D&D sessions by automating common tasks like starting/stopping Foundry VTT. This is a hobby project focused on personal productivity during D&D session prep.

## Current Services Configuration

### Foundry VTT Setup

- **URL**: <http://localhost:30000>
- **Purpose**: D&D virtual tabletop
- **Management**: Start/stop via `dndm`

**The Problem**: Every D&D session requires the same setup routine - start Foundry VTT, open reference materials, etc. This takes time and is easy to forget steps.

**The Solution**: A single `dndm` command that handles the boring stuff so I can focus on the fun parts of DMing.

## Current Status

Rust implementation (`dndm/`) with core service management functionality. A minimal Rust port focusing on essential features with significant performance improvements over the previous Python version.

## Project Structure

This repository contains several components:

- **`dndm/`** - Main Rust application for service management
- **`vtt/`** - Foundry VTT installation and configuration
- **`vttdata/`** - Foundry VTT data directory (worlds, modules, assets)
- **`README.md`** - This documentation

## Features

- **Service Management**: Start, stop, and monitor Foundry VTT and website development services
- **Session Management**: Integrated tmux session handling
- **CLI Interface**: Command-line interface for all operations
- **Interactive TUI**: Terminal user interface for real-time service management
- **Status Monitoring**: Real-time service status display

## Installation

### Prerequisites

- Rust 1.70+ (install from [rustup.rs](https://rustup.rs/))
- tmux (for session management)
- Node.js (for Foundry VTT and website services)

### Build

```bash
# Clone and build
cd dndm
cargo build --release

# Install to ~/.cargo/bin (optional)
cargo install --path .
```

## Usage

### Command Line Interface

```bash
# Start all services
dndm start

# Start specific service
dndm start vtt
dndm start web

# Stop services
dndm stop
dndm stop vtt
dndm stop web

# Check status
dndm status

# Attach to service session
dndm attach vtt
dndm attach web

# Interactive TUI mode
dndm tui
```

### Interactive TUI

Launch the TUI with `dndm tui`:

- **↑/↓**: Navigate between services
- **Enter**: Start/stop selected service
- **A**: Attach to selected service session
- **Q**: Quit

## Configuration

The application expects the standard TTRPG workspace structure:

```text
~/zimolabs/ttrpg/
├── vtt/                # Foundry VTT installation
│   └── main.js         # Foundry VTT main file
├── vttdata/            # Foundry VTT data directory
└── website/            # Website development directory (if applicable)
```

**Note**: The dndm codebase may reference `fvtt/` and `fvtt-data/` directories, but the actual workspace uses `vtt/` and `vttdata/` as shown above.

## Services

### Foundry VTT Service

- **Port**: 30000
- **URL**: <http://localhost:30000>
- **Session**: dndm-vtt
- **Command**: `node main.js --dataPath=/home/zimo/zimolabs/ttrpg/vttdata`

### Website (Optional)

- **Port**: 31000
- **URL**: <http://localhost:31000>
- **Session**: dndm-website

## Architecture

This is a minimal conversion focusing on core functionality:

- `dndm/src/main.rs` - CLI entry point
- `dndm/src/config.rs` - Configuration management
- `dndm/src/session.rs` - tmux session management
- `dndm/src/service.rs` - Service lifecycle management
- `dndm/src/ui/` - Display and TUI components

### Implementation Details

The Rust implementation maintains command compatibility with planned operations while providing significant performance improvements. The codebase is organized into modules for clean separation of concerns:

- **CLI Interface**: Command parsing and user interaction
- **Service Management**: Process lifecycle and status monitoring
- **Session Management**: tmux integration for background processes
- **Display Layer**: Status output and interactive TUI

## Performance

The Rust version provides significant performance improvements:

- **Startup time**: ~10ms vs ~200ms (Python)
- **Memory usage**: ~2MB vs ~15MB (Python)
- **Binary size**: ~3MB (single executable)

## Success Goals

1. **Save 10 minutes per session** by automating startup/shutdown
2. **Single command** to get everything ready for D&D night
3. **Personal productivity tool** - just for me, not others

## Development

```bash
# Run in development mode
cargo run -- status

# Run tests
cargo test

# Check code
cargo clippy
cargo fmt
```

## Core Features (Development Roadmap)

### ✅ Week 1: Basic Service Management

- **Foundry VTT Control**: Simple start/stop commands to make the server run in the background
- **Basic CLI**: Core `dndm` command with help system

### 🔄 Week 2: Enhanced Interface

- **Improved TUI**: Enhanced terminal interface for service management
- **File Organization**: Automated service configuration
- **Better Error Handling**: Comprehensive error reporting and recovery

### 📋 Week 3: Polish & Convenience

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
- **Battle Map Organizer**: Categorize and tag maps by environment/encounter type
- **Session Recap Generator**: Auto-format session notes into player summaries
- **Campaign Website**: Generate simple HTML site from campaign notes

### Quality of Life Features

- **Voice Notes Integration**: Record and transcribe session audio clips
- **Mobile Companion**: Simple web interface for session notes on phone/tablet
- **Player Portal**: Shared access to character sheets and campaign information
- **Analytics Dashboard**: Track session frequency, player participation, story progression
- **Automated Backups**: Regular saves of all campaign data to cloud storage

## Planned Commands (Future)

```bash
# Current Commands
dndm start [service]     # Start services
dndm stop [service]      # Stop services
dndm status             # Show service status
dndm tui               # Interactive terminal interface
dndm attach <service>  # Attach to service session

# Future Commands
dndm create session    # Create session notes template

# Discord Bot Commands
dndm discord start     # Start Discord bot
dndm discord remind    # Send session reminder to players
dndm discord schedule  # Open scheduling interface

# Advanced Features
dndm backup create     # Create campaign backup
dndm generate tavern   # Generate random tavern
dndm timeline add      # Add event to campaign timeline
dndm players status    # Show player character summary
```

## Current Services

### Foundry VTT

- **URL**: `http://localhost:30000`
- **Purpose**: D&D virtual tabletop
- **Management**: Start/stop via `dndm`

### Campaign Notes (Future)

- **Purpose**: Campaign notes and templates
- **Management**: Template creation via `dndm`

## Excluded Features

The following features from planned Python version are intentionally excluded from the initial Rust implementation:

- Discord bot scaffolding
- Template management
- Advanced content generation

### Migration Notes

This Rust port maintains command compatibility with planned operations:

- `dndm start` / `dndm stop` work as intended
- `dndm status` provides service information
- Session names and URLs remain consistent
- Core functionality remains identical between versions

## Maybe Later (If Time Permits)

- Campaign website generator
- Backup automation
- Template management system
- Full Discord bot integration
- Advanced content generation tools
