import React, { useState, useEffect, useRef } from "react";
import { Brand } from "./Brand.tsx";
import { CampaignStats } from "./CampaignStats.tsx";
import { Navigation } from "./Navigation.tsx";
import { Search } from "./Search.tsx";
import type { CampaignStatsData } from "../../../utils/campaignStats.ts";
import { DISCORD_INVITE, FOUNDRY_VTT_URL } from "../../../consts.ts";
import { useAnnouncementHeight } from "../AnnouncementBanner.tsx";
import { ANNOUNCEMENTS } from "../../../config/announcements.ts";

interface HeaderProps {
  currentPath?: string;
  campaignStats?: CampaignStatsData;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = "/",
  campaignStats,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  // Get the announcement height for layout calculations
  const announcementHeight = useAnnouncementHeight(ANNOUNCEMENTS, currentPath);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state
      setIsScrolled(currentScrollY > 10);

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const throttledScroll = throttle(handleScroll, 16);
    window.addEventListener("scroll", throttledScroll);

    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  useEffect(() => {
    // Update reading progress
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      const progressBar = document.getElementById("reading-progress");
      if (progressBar) {
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
      }
    };

    const throttledProgress = throttle(updateReadingProgress, 16);
    window.addEventListener("scroll", throttledProgress);

    return () => window.removeEventListener("scroll", throttledProgress);
  }, []);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSearchOpen) setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  const handleBrandClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      {/* Main Header */}
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 z-[1000] transition-all duration-300 backdrop-blur-md ${
          announcementHeight > 0 ? `top-[${announcementHeight}px]` : "top-0"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"} ${
          isScrolled
            ? "bg-surface/95 border-b border-border-secondary shadow-card"
            : "bg-surface/95 border-b border-border-primary/50"
        }`}
      >
        <nav className="px-6 h-16 flex items-center justify-between w-full">
          {/* Brand */}
          <Brand onClick={handleBrandClick} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <Navigation currentPath={currentPath} />
          </div>

          {/* Campaign Stats (Desktop) */}
          <div className="hidden lg:block">
            {campaignStats && <CampaignStats {...campaignStats} />}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-surface-elevated border border-primary rounded-lg text-tertiary hover:text-primary hover:bg-surface-tertiary hover:border-focus hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Search"
              title="Search"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Reading Progress Bar */}
      <div
        id="reading-progress"
        className={`fixed left-0 h-0.5 z-[1002] transition-all duration-300 ${
          announcementHeight > 0
            ? isVisible
              ? `top-[${58 + announcementHeight - 42}px]`
              : "top-0"
            : isVisible
            ? "top-[64px]"
            : "top-0"
        }`}
        style={{
          width: "0%",
          background: `linear-gradient(to right, rgb(var(--accent-600)), rgb(var(--gold-500)))`,
        }}
      />

      {/* Search Overlay */}
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastExecTime = 0;

  return ((...args: any[]) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}
