# HoloCard Component

A reusable holographic hover effect component extracted from the HeroSection, providing a beautiful shimmer and overlay effect for images.

## Features

- **Shimmer Effect**: A subtle shimmer animation that slides across the card on hover
- **Holographic Overlay**: Optional holographic mask image overlay with customizable opacity
- **Background Enhancement**: Background image with adjustable opacity and hover enhancement
- **Content Filter**: Subtle contrast, saturation, and brightness enhancement on hover
- **Fully Self-Contained**: All styles are included within the component
- **TypeScript Support**: Full TypeScript definitions for both Astro and React variants

## Astro Usage

```astro
---
import HoloCard from '../components/ui/HoloCard.astro';
import backgroundImage from '../assets/my-background.jpg';
import holoMask from '../assets/my-holo-mask.jpg';
---

<HoloCard
  backgroundImage={backgroundImage.src}
  holoMask={holoMask.src}
  backgroundOpacity={0.3}
  holoOpacity={0.15}
  class="w-full h-64"
  holoImage="my-card"
>
  <div class="p-6 h-full flex flex-col justify-center">
    <h3 class="text-xl font-bold text-primary mb-3">
      Your Content Here
    </h3>
    <p class="text-secondary">
      This content will appear over the holographic background effect.
    </p>
  </div>
</HoloCard>
```

## React/TSX Usage

```tsx
import { HoloCard } from "../components/ui/HoloCard";
import backgroundImage from "../assets/my-background.jpg";
import holoMask from "../assets/my-holo-mask.jpg";

export function MyComponent() {
  return (
    <HoloCard
      backgroundImage={backgroundImage}
      holoMask={holoMask}
      backgroundOpacity={0.3}
      holoOpacity={0.15}
      className="w-full h-64"
      holoImage="my-card"
      onClick={() => console.log("Card clicked!")}
    >
      <div className="p-6 h-full flex flex-col justify-center">
        <h3 className="text-xl font-bold text-primary mb-3">
          Your Content Here
        </h3>
        <p className="text-secondary">
          This content will appear over the holographic background effect.
        </p>
      </div>
    </HoloCard>
  );
}
```

## Props

### Astro Component Props

| Prop                | Type     | Default      | Description                                    |
| ------------------- | -------- | ------------ | ---------------------------------------------- |
| `backgroundImage`   | `string` | **Required** | URL/path to the background image               |
| `holoMask`          | `string` | `undefined`  | URL/path to the holographic mask image         |
| `backgroundOpacity` | `number` | `0.3`        | Opacity of the background image (0-1)          |
| `holoOpacity`       | `number` | `0.15`       | Opacity of the holographic mask on hover (0-1) |
| `class`             | `string` | `""`         | CSS classes to apply to the container          |
| `style`             | `string` | `""`         | Inline styles for the container                |
| `holoImage`         | `string` | `"default"`  | Data attribute for identification              |

### React Component Props

| Prop                | Type            | Default      | Description                                    |
| ------------------- | --------------- | ------------ | ---------------------------------------------- |
| `backgroundImage`   | `string`        | **Required** | URL/path to the background image               |
| `holoMask`          | `string`        | `undefined`  | URL/path to the holographic mask image         |
| `backgroundOpacity` | `number`        | `0.3`        | Opacity of the background image (0-1)          |
| `holoOpacity`       | `number`        | `0.15`       | Opacity of the holographic mask on hover (0-1) |
| `className`         | `string`        | `""`         | CSS classes to apply to the container          |
| `style`             | `CSSProperties` | `{}`         | Inline styles for the container                |
| `holoImage`         | `string`        | `"default"`  | Data attribute for identification              |
| `children`          | `ReactNode`     | **Required** | Content to render inside the card              |
| `onClick`           | `() => void`    | `undefined`  | Optional click handler                         |

## Animation Details

1. **Shimmer Effect**: A linear gradient moves across the card from left to right with a skewed transform
2. **Holographic Overlay**: The holo mask image fades in with `mix-blend-mode: overlay`
3. **Content Enhancement**: Subtle filter adjustments (contrast, saturation, brightness)
4. **Background Enhancement**: Background opacity increases slightly on hover

## Customization

### Custom Animation Duration

You can override the animation timing by applying custom CSS:

```css
.my-custom-holo-card::before {
  transition: all 2s ease; /* Slower shimmer */
}

.my-custom-holo-card::after {
  transition: opacity 0.8s ease; /* Slower mask fade */
}
```

### Custom Shimmer Colors

Modify the shimmer gradient by overriding the `::before` pseudo-element:

```css
.my-custom-holo-card::before {
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255, 215, 0, 0.1) 45%,
    /* Gold shimmer */ rgba(255, 215, 0, 0.2) 50%,
    rgba(255, 215, 0, 0.1) 55%,
    transparent 70%
  );
}
```

## Accessibility

- The component preserves cursor behavior (pointer if clickable, default otherwise)
- All animations respect `prefers-reduced-motion` preferences (can be enhanced)
- Content remains fully accessible to screen readers
- Focus states can be added by styling the `:focus-visible` pseudo-class

## Performance

- Uses CSS transforms and opacity for smooth hardware-accelerated animations
- Minimal JavaScript footprint
- Images are loaded normally (consider lazy loading for large collections)
- CSS custom properties allow for efficient dynamic styling
