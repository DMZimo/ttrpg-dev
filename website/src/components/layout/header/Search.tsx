import React, { useEffect, useRef } from "react";

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log("Searching for:", query);
    // This would typically make an API call or search through local content
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputRef.current?.value || "";
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1002] bg-white/98 dark:bg-gray-900/98 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="max-w-2xl mx-auto p-8 pt-32"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="relative mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search campaigns, characters, sessions..."
              className="w-full pl-12 pr-12 py-4 bg-gray-100/80 dark:bg-gray-800/80 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-gray-100 text-lg focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-400/20 dark:focus:ring-blue-500/20 transition-all duration-200"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors"
              aria-label="Close search"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6">
          <div className="mb-4">
            <h4 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide mb-4">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <a
                href="/journal"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200"
                onClick={onClose}
              >
                <span className="text-xl">📖</span>
                <span>View Latest Session</span>
              </a>
              <a
                href="/characters"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200"
                onClick={onClose}
              >
                <span className="text-xl">👥</span>
                <span>Browse Characters</span>
              </a>
              <a
                href="/quests"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all duration-200"
                onClick={onClose}
              >
                <span className="text-xl">⚔️</span>
                <span>View Active Quests</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              ESC
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>
    </div>
  );
};
