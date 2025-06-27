# Calendar Components Documentation

The calendar system has been broken down into modular, interactive components for better maintainability and reusability.

## Component Structure

### Core Files

- **`src/utils/fantasyCalendar.ts`** - All types, constants, and utility functions
- **`src/pages/calendar.astro`** - Main calendar page that orchestrates all components

### Components

#### 1. `CalendarGrid.astro`

- **Purpose**: Main calendar display with 30-day grid layout
- **Features**:
  - Interactive day selection
  - Holiday highlighting
  - Moon phase display
  - Current day highlighting
  - Click events for date selection

#### 2. `CalendarNavigation.astro`

- **Purpose**: Navigation controls for months and years
- **Features**:
  - Previous/Next month navigation
  - Year navigation
  - Quick jump to current month
  - Month quick-select dropdown
  - Keyboard shortcuts (arrow keys, Home)

#### 3. `CurrentDateWidget.astro`

- **Purpose**: Current campaign date and time display
- **Features**:
  - Formatted date display
  - Current time with formal names
  - Season indicators
  - Moon phase display
  - Holiday notifications
  - Tenday progress bar
  - Quick action buttons (sync time, advance day)

#### 4. `HolidaysList.astro`

- **Purpose**: Display and manage holidays and festivals
- **Features**:
  - Season filtering
  - Holiday details modal
  - Interactive holiday cards
  - Add custom holidays (planned)
  - Share functionality

#### 5. `CalendarTools.astro`

- **Purpose**: Advanced calendar utilities and tools
- **Features**:
  - Date converter (Earth ↔ Faerûn)
  - Holiday planner
  - Moon phase tracker
  - Weather tracker
  - Export/Import functionality
  - Print support
  - Advanced tools toggle

#### 6. `CalendarLegend.astro`

- **Purpose**: Visual guide and help documentation
- **Features**:
  - Visual indicators explanation
  - Symbol meanings
  - Keyboard shortcuts
  - Interactive features guide
  - Calendar system information
  - Tips & tricks section

#### 7. `MonthDetails.astro`

- **Purpose**: Detailed month information and time examples
- **Features**:
  - Month metadata display
  - Season progress indicator
  - Time period examples
  - Custom time setter
  - Interactive time selection

## Interactive Features

### Events System

The components communicate through custom events:

- `dateSelected` - When a user clicks a calendar day
- `timeSelected` - When a user selects a time period
- `timeUpdate` - When time is synced or updated
- `advanceDay` - When advancing the campaign day
- `timeFormatToggle` - When switching time formats

### URL Parameters

- `year` - Display specific year
- `month` - Display specific month
- `holidaySeason` - Filter holidays by season
- `advanced` - Show advanced tools

### Keyboard Shortcuts

- `←` / `→` - Previous/Next month
- `↑` / `↓` - Previous/Next year
- `Home` - Go to current month
- `Esc` - Close modals

## Usage Examples

### Basic Calendar Display

```astro
<CalendarGrid
  year={1491}
  month={4}
  currentDate={currentDate}
/>
```

### Navigation with Current Context

```astro
<CalendarNavigation
  currentDate={currentDate}
  displayYear={1491}
  displayMonth={4}
/>
```

### Holiday Filtering

```astro
<HolidaysList
  filterBySeason="spring"
  maxHolidays={6}
/>
```

## Customization

### Adding New Features

1. Add new utility functions to `fantasyCalendar.ts`
2. Create new component in `src/components/calendar/`
3. Import and use in main calendar page
4. Add custom events for component communication

### Styling

- Each component uses Tailwind CSS classes
- Dark mode support included
- Responsive design considerations
- Hover and focus states for interactivity

### Data Management

- All calendar data centralized in `fantasyCalendar.ts`
- Components receive data via props
- Client-side state managed through events
- URL parameters for state persistence

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for party synchronization
2. **Custom Events**: Player-created events and reminders
3. **Weather Integration**: Detailed weather tracking and patterns
4. **Timeline View**: Alternative calendar visualization
5. **Export Formats**: PDF, iCal, JSON export options
6. **Themes**: Multiple visual themes for different campaigns
7. **Plugins**: Modular extensions for specific game systems

## Benefits of Component Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used in different contexts
3. **Testability**: Isolated components are easier to test
4. **Performance**: Smaller bundle sizes and better caching
5. **Developer Experience**: Clearer code organization
6. **User Experience**: More interactive and responsive interface
