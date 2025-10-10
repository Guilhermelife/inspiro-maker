import { useEffect } from "react";
import { useTheme } from "next-themes";

export const useTimeBasedTheme = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    const applyTimeBasedTheme = () => {
      if (theme === "system") {
        const hour = new Date().getHours();
        const timeBasedTheme = hour >= 6 && hour < 18 ? "light" : "dark";
        
        // Only update if different from current system theme
        if (systemTheme !== timeBasedTheme) {
          setTheme(timeBasedTheme);
        }
      }
    };

    // Apply immediately
    applyTimeBasedTheme();

    // Check every minute for time changes
    const interval = setInterval(applyTimeBasedTheme, 60000);

    return () => clearInterval(interval);
  }, [theme, systemTheme, setTheme]);

  return { theme, setTheme };
};
