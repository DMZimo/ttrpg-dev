import React from "react";

export type HeroButtonVariant = "primary" | "secondary";
export type HeroButtonSize = "md" | "lg" | "xl";
export type HeroButtonIconType =
  | "book"
  | "map"
  | "dice"
  | "arrow-right"
  | "beer";

interface HeroButtonProps {
  children: React.ReactNode;
  variant?: HeroButtonVariant;
  size?: HeroButtonSize;
  href?: string;
  target?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconType?: HeroButtonIconType;
  iconPosition?: "left" | "right";
}

export const HeroButton: React.FC<HeroButtonProps> = ({
  children,
  variant = "primary",
  size = "lg",
  href,
  target,
  onClick,
  disabled = false,
  className = "",
  ariaLabel,
  title,
  type = "button",
  fullWidth = false,
  icon,
  iconType,
  iconPosition = "right",
}) => {
  // Base styles for hero buttons - more dramatic than regular buttons
  const baseStyles =
    "inline-flex items-center justify-center font-semibold text-transform uppercase tracking-wider transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  // Variant styles using the hero-button classes from global.css
  const variantStyles = {
    primary:
      "hero-button-primary hover:gap-3 shadow-card hover:shadow-card-hover",
    secondary:
      "hero-button-secondary hover:-translate-y-0.5 shadow-card hover:shadow-card-hover",
  };

  // Size styles - more generous spacing for hero buttons
  const sizeStyles = {
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  // Icon gap styles based on size
  const iconGapStyles = {
    md: "gap-2",
    lg: "gap-2",
    xl: "gap-3",
  };

  // Get predefined icon based on iconType
  const getPredefinedIcon = () => {
    if (!iconType) return null;

    const iconSize =
      size === "md" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-6 h-6";

    switch (iconType) {
      case "book":
        return <BookIcon className={iconSize} />;
      case "map":
        return <MapIcon className={iconSize} />;
      case "dice":
        return <DiceIcon className={iconSize} />;
      case "arrow-right":
        return <ArrowRightIcon className={iconSize} />;
      case "beer":
        return <BeerIcon className={iconSize} />;
      default:
        return null;
    }
  };

  // Determine which icon to use (custom icon takes precedence over iconType)
  const finalIcon = icon || getPredefinedIcon();

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${iconGapStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim();

  // Render icon and children in correct order
  const renderContent = () => {
    if (!finalIcon) {
      return children;
    }

    if (iconPosition === "left") {
      return (
        <>
          {finalIcon}
          <span>{children}</span>
        </>
      );
    }

    return (
      <>
        <span>{children}</span>
        {finalIcon}
      </>
    );
  };

  // If href is provided, render as anchor tag
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={combinedStyles}
        aria-label={ariaLabel}
        title={title}
        onClick={onClick}
      >
        {renderContent()}
      </a>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      aria-label={ariaLabel}
      title={title}
    >
      {renderContent()}
    </button>
  );
};

// Utility components for common hero button patterns
export const HeroPrimaryButton: React.FC<Omit<HeroButtonProps, "variant">> = (
  props
) => {
  return <HeroButton {...props} variant="primary" />;
};

export const HeroSecondaryButton: React.FC<Omit<HeroButtonProps, "variant">> = (
  props
) => {
  return <HeroButton {...props} variant="secondary" />;
};

// Icon components for hero buttons
export const BookIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

export const MapIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

export const DiceIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 2L2 7v10l10 5 10-5V7l-10-5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2 7l10 5 10-5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 12v10"
    />
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
);

export const BeerIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18V8a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 4h6v2H8V4z"
    />
  </svg>
);
