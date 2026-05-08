import { useEffect } from "react";

/**
 * Add `.is-in-view` to every element matching `.reveal` once it enters the viewport.
 * Static observer — attaches on mount, observes nodes present at that time + any added via mutation.
 * Respects prefers-reduced-motion (CSS handles the no-op fallback).
 */
export const useReveal = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Older browsers: just show everything.
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    const observe = () => {
      document
        .querySelectorAll(".reveal:not(.is-in-view)")
        .forEach((el) => io.observe(el));
    };
    observe();

    // React renders sections async (data fetches → re-render); re-scan a few times.
    const t1 = setTimeout(observe, 200);
    const t2 = setTimeout(observe, 600);
    const t3 = setTimeout(observe, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      io.disconnect();
    };
  }, []);
};
