import React from "react";
import { useTheme, type Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  variant?: "buttons" | "dropdown" | "toggle";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabels?: boolean;
  themes?: Theme[];
}

const ThemeToggle = ({
  variant = "buttons",
  size = "md",
  className = "",
  showLabels = true,
  themes,
}: ThemeToggleProps) => {
  const { theme, setTheme, toggleTheme, availableThemes } = useTheme();

  // Use provided themes or fall back to all available themes
  const displayThemes = themes ?? availableThemes;

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  // Theme icons
  const getThemeIcon = (themeName: Theme) => {
    switch (themeName) {
      case "light":
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "dark":
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getThemeLabel = (themeName: Theme) => {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1);
  };

  // Button variant
  if (variant === "buttons") {
    return (
      <div className={`flex gap-2 ${className}`}>
        {displayThemes.map((themeName) => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName)}
            className={`
              flex items-center gap-2 rounded-md border border-border transition-colors
              ${sizeClasses[size]}
              ${
                theme === themeName
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-primary hover:bg-accent hover:text-white"
              }
            `}
            aria-label={`Switch to ${themeName} theme`}
          >
            {getThemeIcon(themeName)}
            {showLabels && <span>{getThemeLabel(themeName)}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className={`
            rounded-md border border-border bg-bg-secondary text-text-primary 
            transition-colors hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent
            ${sizeClasses[size]}
          `}
          aria-label="Select theme"
        >
          {displayThemes.map((themeName) => (
            <option key={themeName} value={themeName}>
              {getThemeLabel(themeName)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Toggle variant (cycles through themes)
  if (variant === "toggle") {
    return (
      <button
        onClick={toggleTheme}
        className={`
          flex items-center gap-2 rounded-md border border-border bg-bg-secondary text-text-primary 
          transition-colors hover:bg-accent hover:text-white
          ${sizeClasses[size]} ${className}
        `}
        aria-label={`Current theme: ${theme}. Click to toggle`}
      >
        {getThemeIcon(theme)}
        {showLabels && <span>{getThemeLabel(theme)}</span>}
      </button>
    );
  }

  return null;
};

export default ThemeToggle;
