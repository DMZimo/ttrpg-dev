import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

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
}) => {
  // Base styles for all buttons
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  // Variant styles using button classes from global.css
  const variantStyles = {
    primary: "btn-primary shadow-card hover:shadow-card-hover",
    secondary: "btn-secondary shadow-card hover:shadow-card-hover",
    ghost:
      "bg-transparent border-transparent text-primary hover:bg-surface-tertiary hover:text-accent-500 focus:ring-accent-500",
    icon: "btn-icon shadow-card hover:shadow-card-hover",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-lg gap-2",
  };

  // Special sizing for icon variant
  const iconSizeStyles = {
    sm: "w-8 h-8 rounded-md",
    md: "w-10 h-10 rounded-lg",
    lg: "w-12 h-12 rounded-lg",
  };

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${variant === "icon" ? iconSizeStyles[size] : sizeStyles[size]}
    ${className}
  `.trim();

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
        {children}
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
      {children}
    </button>
  );
};

// Utility component for common icon buttons
export const IconButton: React.FC<
  Omit<ButtonProps, "variant"> & { icon: React.ReactNode }
> = ({ icon, children, ...props }) => {
  return (
    <Button {...props} variant="icon">
      {icon}
      {children}
    </Button>
  );
};
