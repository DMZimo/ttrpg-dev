import React, { useState, useEffect, useRef } from "react";
import { CampaignStats } from "./CampaignStats.tsx";
import { Navigation } from "./Navigation.tsx";
import { Search } from "./Search.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { MobileMenu } from "./MobileMenu.tsx";
import {
  SITE_TITLE,
  DISCORD_INVITE,
  FOUNDRY_VTT_URL,
} from "../../../consts.ts";

interface HeaderProps {
  currentPath?: string;
  // Add campaign stats as props
  campaignStats?: {
    totalSessions?: number;
    totalCharacters?: number;
    totalNPCs?: number;
    totalQuests?: number;
    activePlayers?: number;
    currentLevel?: number;
    totalPlayTime?: number;
    combatEncounters?: number;
    deathSaves?: number;
    criticalHits?: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = "/",
  campaignStats,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if announcement was previously closed
    const announcementClosed =
      localStorage.getItem("announcement-closed") === "true";
    setShowAnnouncement(!announcementClosed);

    // Auto-hide announcement after 10 seconds
    const timer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

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
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, isMenuOpen]);

  // Manage body overflow when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem("announcement-closed", "true");
  };

  const handleBrandClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      {/* Announcement Banner */}
      {showAnnouncement && (
        <div className="fixed top-0 left-0 right-0 z-[1001] py-2 px-4 transition-transform duration-300 bg-gradient-to-r from-ddb-red-dark to-ddb-red text-inverse">
          <div className="px-6 flex items-center justify-center gap-3 relative w-full">
            <span className="text-xl animate-bounce">🎲</span>
            <span className="font-medium text-sm text-center">
              Next session: Sunday, June 30th at 7PM EST
            </span>
            <button
              onClick={closeAnnouncement}
              className="absolute right-4 rounded p-1 transition-colors hover:bg-white/20"
              aria-label="Close announcement"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 z-[1000] transition-all duration-300 backdrop-blur-md ${
          showAnnouncement ? "top-[42px]" : "top-0"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"} ${
          isScrolled
            ? "bg-surface/95 border-b border-border-secondary shadow-card"
            : "bg-surface/95 border-b border-border-primary/50"
        }`}
      >
        <nav className="px-6 h-16 flex items-center justify-between w-full">
          {/* Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={handleBrandClick}
              className="flex items-center gap-3 font-bold text-xl text-primary hover:text-ddb-red-light transition-colors group"
            >
              <span className="text-2xl group-hover:animate-bounce drop-shadow-sm">
                ⚔️
              </span>
              <span className="bg-gradient-to-r from-accent-600 to-gold-500 bg-clip-text text-transparent">
                {SITE_TITLE}
              </span>
            </button>
          </div>

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

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isMenuOpen
                  ? "bg-accent-500/10 text-accent-500"
                  : "bg-surface-elevated text-tertiary"
              }`}
              aria-label="Toggle mobile menu"
            >
              <div className="flex flex-col gap-1 w-5">
                <span
                  className={`h-0.5 bg-current transition-all duration-200 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 bg-current transition-all duration-200 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 bg-current transition-all duration-200 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Reading Progress Bar */}
      <div
        id="reading-progress"
        className={`fixed left-0 h-0.5 z-[1002] transition-all duration-300 ${
          showAnnouncement
            ? isVisible
              ? "top-[58px]"
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

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentPath={currentPath}
        showAnnouncement={showAnnouncement}
        campaignStats={campaignStats}
      />
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
