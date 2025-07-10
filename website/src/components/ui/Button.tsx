import React from "react";

// Button icon types
export type ButtonIconType = "book" | "map" | "dice" | "arrow-right" | "beer";

// Combined button variants
export type ButtonVariant =
  // Standard button variants
  | "primary"
  | "secondary"
  | "ghost"
  | "icon"
  // Hero button variants
  | "hero-primary"
  | "hero-secondary";

// Combined button sizes
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  iconType?: ButtonIconType;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
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
  // Determine if this is a hero button
  const isHeroButton = variant.startsWith("hero-");

  // Base styles for all buttons
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  // Variant styles
  const variantStyles = {
    // Standard button variants
    primary: "btn-primary shadow-card hover:shadow-card-hover",
    secondary: "btn-secondary shadow-card hover:shadow-card-hover",
    ghost:
      "bg-transparent border-transparent text-text-primary hover:bg-surface-tertiary hover:text-accent-500 focus:ring-accent-500",
    icon: "btn-icon shadow-card hover:shadow-card-hover",
    // Hero button variants
    "hero-primary":
      "hero-button-primary hover:gap-3 shadow-card hover:shadow-card-hover",
    "hero-secondary":
      "hero-button-secondary hover:-translate-y-0.5 shadow-card hover:shadow-card-hover",
  };

  // Size styles - for standard buttons
  const sizeStyles = {
    sm: "px-2 py-1 text-sm rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-lg gap-2",
    xl: "px-8 py-4 text-lg rounded-xl gap-3",
  };

  // Special sizing for hero buttons
  const heroSizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-lg gap-2",
    xl: "px-8 py-4 text-lg rounded-xl gap-3",
  };

  // Special sizing for icon variant
  const iconSizeStyles = {
    sm: "w-8 h-8 rounded-md",
    md: "w-10 h-10 rounded-lg",
    lg: "w-12 h-12 rounded-lg",
    xl: "w-14 h-14 rounded-xl",
  };

  // Icon size based on button size
  const iconSize =
    size === "sm"
      ? "w-4 h-4"
      : size === "md"
      ? "w-5 h-5"
      : size === "lg"
      ? "w-5 h-5"
      : "w-6 h-6";

  // Get predefined icon based on iconType
  const getPredefinedIcon = () => {
    if (!iconType) return null;

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

  // Choose the appropriate size styles
  const applySizeStyles = () => {
    if (variant === "icon") return iconSizeStyles[size];
    return isHeroButton ? heroSizeStyles[size] : sizeStyles[size];
  };

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${applySizeStyles()}
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
        {variant === "icon" && ariaLabel && (
          <span className="sr-only">{ariaLabel}</span>
        )}
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
      {variant === "icon" && ariaLabel && (
        <span className="sr-only">{ariaLabel}</span>
      )}
      {renderContent()}
    </button>
  );
};

// Utility components for common button variants
export const PrimaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => {
  return <Button {...props} variant="primary" />;
};

export const SecondaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => {
  return <Button {...props} variant="secondary" />;
};

export const HeroButton: React.FC<
  Omit<ButtonProps, "variant"> & { variant?: "primary" | "secondary" }
> = ({ variant = "primary", ...props }) => {
  return <Button {...props} variant={`hero-${variant}`} />;
};

export const HeroPrimaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => {
  return <Button {...props} variant="hero-primary" />;
};

export const HeroSecondaryButton: React.FC<Omit<ButtonProps, "variant">> = (
  props
) => {
  return <Button {...props} variant="hero-secondary" />;
};

// Utility component for common icon buttons
export const IconButton: React.FC<
  Omit<ButtonProps, "variant"> & { icon: React.ReactNode }
> = ({ icon, children, ...props }) => {
  return (
    <Button {...props} variant="icon" icon={icon}>
      {children}
    </Button>
  );
};

// Icon components for buttons
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
