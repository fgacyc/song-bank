import React from "react";
import { useTheme, type Theme } from "../hooks/useTheme";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";

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

  const displayThemes = themes ?? availableThemes;

  const sizeClasses = {
    sm: "px-2 py-1 text-md",
    md: "px-3 py-2 text-lg",
    lg: "px-4 py-3 text-xl",
  };

  const getThemeIcon = (themeName: Theme) => {
    switch (themeName) {
      case "light":
        return <FiMoon />;
      case "dark":
        return <IoSunnyOutline />;
      default:
        return null;
    }
  };

  const getThemeLabel = (themeName: Theme) => {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1);
  };

  // button variant
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

  // dropdown variant
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

  // toggle variant
  if (variant === "toggle") {
    return (
      <button
        onClick={toggleTheme}
        className={`
          hover:bg-bg-tertiary flex items-center justify-center rounded-md transition-colors
          ${sizeClasses[size]} ${className}
        `}
        aria-label={`Current theme: ${theme}. Click to toggle`}
      >
        {getThemeIcon(theme)}
      </button>
    );
  }

  return null;
};

export default ThemeToggle;
