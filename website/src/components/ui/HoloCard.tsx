import type { ReactNode, CSSProperties } from "react";

interface HoloCardProps {
  /**
   * Background image URL for the card
   */
  backgroundImage: string;
  /**
   * Holographic mask image URL (optional)
   */
  holoMask?: string;
  /**
   * Background overlay opacity (0-1)
   */
  backgroundOpacity?: number;
  /**
   * Holographic mask opacity when hovered (0-1)
   */
  holoOpacity?: number;
  /**
   * CSS class names to apply to the container
   */
  className?: string;
  /**
   * Inline styles for the container
   */
  style?: CSSProperties;
  /**
   * Data attribute for holo image identification
   */
  holoImage?: string;
  /**
   * Content to render inside the card
   */
  children: ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const HoloCard = ({
  backgroundImage,
  holoMask,
  backgroundOpacity = 0.3,
  holoOpacity = 0.15,
  className = "",
  style = {},
  holoImage = "default",
  children,
  onClick,
}: HoloCardProps) => {
  // Construct the CSS custom properties for the holographic effect
  const holoStyle: CSSProperties = {
    ...style,
    "--holo-opacity": holoOpacity,
    "--background-opacity": backgroundOpacity,
    ...(holoMask && { "--holo-mask": `url('${holoMask}')` }),
  } as CSSProperties;

  return (
    <>
      <div
        className={`holo-card ${className}`}
        style={holoStyle}
        data-holo-image={holoImage}
        onClick={onClick}
      >
        {/* Background image layer */}
        <div
          className="holo-card__background"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
          }}
        />

        {/* Content slot */}
        <div className="holo-card__content">{children}</div>
      </div>

      <style>{`
        .holo-card {
          position: relative;
          overflow: hidden;
          cursor: ${onClick ? "pointer" : "default"};
        }

        .holo-card__background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: var(--background-opacity, 0.3);
          transition: opacity 0.3s ease;
        }

        .holo-card__content {
          position: relative;
          height: 100%;
          z-index: 3;
        }

        /* Subtle shimmer overlay */
        .holo-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255, 255, 255, 0.03) 45%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 55%,
            transparent 70%
          );
          opacity: 0;
          transform: translateX(-100%) skewX(-20deg);
          transition: all 1.2s ease;
          pointer-events: none;
          z-index: 1;
        }

        .holo-card:hover::before {
          opacity: 1;
          transform: translateX(150%) skewX(-20deg);
        }

        /* Holo mask overlay effect */
        .holo-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: var(--holo-mask);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          mix-blend-mode: overlay;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 2;
        }

        .holo-card:hover::after {
          opacity: var(--holo-opacity, 0.15);
        }

        /* Subtle filter effects without scaling */
        .holo-card:hover .holo-card__content {
          filter: contrast(1.02) saturate(1.05) brightness(1.02);
          transition: filter 0.3s ease;
        }

        /* Enhanced hover effect for background */
        .holo-card:hover .holo-card__background {
          opacity: calc(var(--background-opacity, 0.3) + 0.1);
        }
      `}</style>
    </>
  );
};
