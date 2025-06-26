import React from "react";
import { SITE_TITLE } from "@/consts";

interface BrandProps {
  onClick?: () => void;
}

export const Brand: React.FC<BrandProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex-shrink-0">
      <button
        onClick={handleClick}
        className="flex items-center gap-3 font-bold text-xl text-primary hover:text-secondary transition-colors group"
      >
        {/* Logo Image */}
        <img
          src="/logo.webp"
          alt="Campaign Logo"
          className="w-8 h-8 object-contain drop-shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-md"
        />

        {/* Site Title */}
        <span className="text-primary group-hover:text-secondary transition-colors">
          {SITE_TITLE}
        </span>
      </button>
    </div>
  );
};
