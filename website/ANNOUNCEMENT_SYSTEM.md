# Announcement System Documentation

The announcement system has been decoupled from the Header component and is now a global, configurable system that appears across the entire website.

## Components

### 1. AnnouncementBanner Component

Location: `src/components/layout/AnnouncementBanner.tsx`

A React component that displays announcements at the top of the page. It handles:

- Multiple announcement types with different styles
- Auto-dismissal timers
- Manual dismissal with localStorage persistence
- Page-specific visibility rules
- Priority-based display order

### 2. Announcement Configuration

Location: `src/config/announcements.ts`

Central configuration file for all announcements across the site.

## Usage

### Adding a New Announcement

Edit `src/config/announcements.ts` and add to the `ANNOUNCEMENTS` array:

```typescript
{
  id: "unique-announcement-id",
  message: "Your announcement message here",
  type: "campaign", // "info" | "warning" | "success" | "error" | "campaign"
  icon: "🎲", // Optional custom icon
  autoHideDelay: 10000, // Auto-hide after 10 seconds (0 = no auto-hide)
  dismissible: true, // Can be manually dismissed
  priority: 100, // Higher numbers show first
  startDate: new Date("2025-06-26"), // Optional start date
  endDate: new Date("2025-06-30"), // Optional end date
  showOnPages: ["/", "/journal"], // Show only on these pages (empty = all pages)
  hideOnPages: ["/admin"], // Hide on these pages
}
```

### Announcement Types and Styles

- `campaign`: Red gradient (D&D Beyond style) - for session announcements
- `info`: Purple gradient - for general information
- `warning`: Gold gradient - for warnings or notices
- `success`: Green gradient - for positive announcements
- `error`: Red gradient - for urgent/error messages

### Configuration Options

- **id**: Unique identifier for the announcement (required)
- **message**: The text to display (required)
- **type**: Visual style type (default: "info")
- **icon**: Custom emoji or icon (defaults based on type)
- **autoHideDelay**: Milliseconds before auto-hide (0 = no auto-hide)
- **dismissible**: Whether users can manually close it (default: true)
- **priority**: Display order for multiple announcements (higher = first)
- **startDate**: When to start showing the announcement
- **endDate**: When to stop showing the announcement
- **showOnPages**: Array of page paths to show on (empty = all pages)
- **hideOnPages**: Array of page paths to hide on

### Page-Specific Announcements

```typescript
// Show only on homepage and journal pages
showOnPages: ["/", "/journal"];

// Hide on admin pages
hideOnPages: ["/admin", "/settings"];

// Show on all character-related pages
showOnPages: ["/characters"];
```

### Priority System

When multiple announcements are active, only the highest priority one is shown:

```typescript
{
  id: "urgent-notice",
  message: "Emergency announcement",
  priority: 200, // This will show first
  // ...
},
{
  id: "regular-notice",
  message: "Regular announcement",
  priority: 100, // This will show second if urgent is dismissed
  // ...
}
```

### Date-Based Announcements

```typescript
{
  id: "session-reminder",
  message: "Session tonight at 7PM!",
  startDate: new Date("2025-06-30T12:00:00"), // Start showing at noon
  endDate: new Date("2025-06-30T23:59:59"), // Stop showing at end of day
  // ...
}
```

## Integration

The announcement system is automatically integrated in:

- `BaseLayout.astro` - for most pages
- `SiteLayout.astro` - alternative layout option

The Header component automatically adjusts its position based on announcement visibility using the `useAnnouncementHeight` hook.

## Utility Functions

Available in `src/config/announcements.ts`:

- `getActiveAnnouncements(currentPath)` - Get announcements for a specific page
- `hasActiveAnnouncements(currentPath)` - Check if any announcements are active
- `clearAllDismissedAnnouncements()` - Reset dismissed announcements (dev helper)
- `addAnnouncement(announcement)` - Dynamically add an announcement
- `removeAnnouncement(id)` - Dynamically remove an announcement

## Development Tips

1. **Testing**: Use `clearAllDismissedAnnouncements()` in browser console to reset dismissed state
2. **Multiple Announcements**: Only the highest priority announcement shows at once
3. **Persistence**: Dismissed announcements are stored in localStorage by announcement ID
4. **Responsive**: Announcements automatically adapt to mobile/desktop layouts

## Example Configurations

### Session Reminder

```typescript
{
  id: "session-june-30",
  message: "Next session: Sunday, June 30th at 7PM EST",
  type: "campaign",
  icon: "🎲",
  autoHideDelay: 10000,
  priority: 100,
}
```

### Maintenance Notice

```typescript
{
  id: "maintenance-tonight",
  message: "Scheduled maintenance tonight 11PM-12AM EST",
  type: "warning",
  icon: "🔧",
  autoHideDelay: 0, // Don't auto-hide
  startDate: new Date("2025-06-30T12:00:00"), // Start showing at noon
  endDate: new Date("2025-07-01T01:00:00"), // Hide after maintenance
}
```

### New Feature

```typescript
{
  id: "new-character-sheets",
  message: "New interactive character sheets now available!",
  type: "success",
  showOnPages: ["/", "/characters"], // Only show on relevant pages
  autoHideDelay: 15000,
}
```
