# Button Components Usage Guide

This guide shows how to use the consolidated button system with the new `Button.tsx` and `HeroButton.tsx` components.

## Button.tsx - General Purpose Button

Use this for most buttons throughout the site. It replaces the old `SocialButton.astro` and provides consistent styling with the herobutton classes from global.css.

### Basic Usage

```tsx
import { Button, IconButton } from "@/components/ui/Button";

// Primary button (uses herobutton-primary class)
<Button variant="primary">Save Changes</Button>

// Secondary button (uses herobutton-secondary class)
<Button variant="secondary">Cancel</Button>

// Ghost button (minimal styling)
<Button variant="ghost">Learn More</Button>

// Icon button (replaces SocialButton - perfect for social icons)
<Button variant="icon" ariaLabel="Twitter">
  <TwitterIcon />
</Button>

// With href (renders as anchor)
<Button variant="primary" href="/journal">
  View Journal
</Button>
```

### Variants

- **primary**: Main action buttons (D&D Beyond red)
- **secondary**: Secondary actions (outlined)
- **ghost**: Minimal styling for subtle actions
- **icon**: Square icon buttons (replaces SocialButton)

### Sizes

- **sm**: Small buttons (px-3 py-1.5)
- **md**: Medium buttons (px-4 py-2) - default
- **lg**: Large buttons (px-6 py-3)

### Icon Button Helper

```tsx
import { IconButton } from "@/components/ui/Button";

<IconButton
  icon={<TwitterIcon />}
  ariaLabel="Follow on Twitter"
  href="https://twitter.com/example"
  size="md"
/>;
```

## HeroButton.tsx - Hero Section Buttons

Use this for prominent buttons in hero sections and landing areas. These have more dramatic styling and animations.

### HeroButton Basic Usage

```tsx
import { HeroButton, ArrowRightIcon, MapIcon } from "@/components/ui/HeroButton";

// Primary hero button
<HeroButton
  variant="primary"
  href="/journal/latest"
  icon={<ArrowRightIcon />}
>
  Read Full Chronicle
</HeroButton>

// Secondary hero button
<HeroButton variant="secondary" fullWidth>
  Join Discord Server
</HeroButton>

// With custom icon positioning
<HeroButton
  variant="primary"
  icon={<MapIcon />}
  iconPosition="left"
  size="xl"
>
  Explore Map
</HeroButton>
```

### HeroButton Variants

- **primary**: Uses `herobutton-primary` class with enhanced animations
- **secondary**: Uses `herobutton-secondary` class with enhanced animations

### HeroButton Sizes

- **md**: Medium hero buttons
- **lg**: Large hero buttons - default
- **xl**: Extra large hero buttons for major CTAs

### Helper Components

```tsx
import { HeroPrimaryButton, HeroSecondaryButton } from "@/components/ui/HeroButton";

<HeroPrimaryButton href="/atlas" icon={<MapIcon />}>
  Explore Map
</HeroPrimaryButton>

<HeroSecondaryButton onClick={joinDiscord}>
  Join Discord
</HeroSecondaryButton>
```

## Migration Examples

### From SocialButton.astro

**Before:**

```astro
<SocialButton href="https://twitter.com" label="Twitter">
  <TwitterIcon />
</SocialButton>
```

**After:**

```tsx
<Button variant="icon" href="https://twitter.com" ariaLabel="Twitter">
  <TwitterIcon />
</Button>
```

### From HeroSection herobutton classes

**Before:**

```astro
<a href="/journal" class="herobutton-primary px-6 py-3 inline-flex items-center gap-2">
  <span>Read Full Chronicle</span>
  <svg>...</svg>
</a>
```

**After:**

```tsx
<HeroButton variant="primary" href="/journal" icon={<ArrowRightIcon />}>
  Read Full Chronicle
</HeroButton>
```

## Common Patterns

### Loading State

```tsx
<Button variant="primary" disabled className="button-loading">
  Saving...
</Button>
```

### Button Groups

```tsx
<div className="btn-group">
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="primary">Month</Button>
</div>
```

### Full Width Mobile

```tsx
<HeroButton variant="primary" fullWidth className="sm:w-auto">
  Mobile Full Width, Desktop Auto
</HeroButton>
```

## Accessibility Features

Both components include:

- Proper ARIA labels
- Screen reader support for icon buttons
- Focus states with visible outlines
- Disabled state handling
- Semantic HTML (button vs anchor based on props)

## Styling

All styles are defined in `global.css` using CSS custom properties that automatically adapt to light/dark themes. The components use existing utility classes and the established design tokens.
