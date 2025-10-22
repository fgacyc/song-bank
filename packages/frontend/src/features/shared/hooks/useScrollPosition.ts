import { useState, useEffect } from "react";

interface UseScrollPositionOptions {
  threshold?: number;
  hysteresis?: number;
}

export const useScrollPosition = ({
  threshold = 0,
  hysteresis = 50,
}: UseScrollPositionOptions = {}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      console.log("Window is undefined, returning early");
      return;
    }

    let ticking = false;

    const getScrollY = () => {
      return (
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = getScrollY();
          setScrollY(currentScrollY);

          setIsAboveThreshold((prevState) => {
            const showThreshold = threshold + hysteresis;
            const hideThreshold = threshold - hysteresis;

            let newState;
            if (prevState) {
              newState = currentScrollY >= hideThreshold;
            } else {
              newState = currentScrollY >= showThreshold;
            }

            return newState;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    document.documentElement.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    document.body.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      document.documentElement.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, hysteresis]);

  return { scrollY, isAboveThreshold };
};
