import { useEffect } from "react";

/**
 * One rAF-throttled scroll listener that drives every scroll-coupled effect
 * via CSS custom properties + transform on parallax targets.
 *
 * Sets:
 *   --scroll-progress  (0..1)   — drives the top progress bar
 *   --hero-fade        (0..1)   — drives intro text fade-on-scroll
 *
 * Updates transform on every `.parallax-y[data-parallax="<factor>"]`
 * with translate3d(0, scrollY * factor * -1, 0).
 *
 * Honours prefers-reduced-motion (no parallax, instant progress).
 */
export const useScrollFx = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const root = document.documentElement;
    let raf = null;
    let parallaxNodes = [];

    const collectParallax = () => {
      parallaxNodes = Array.from(document.querySelectorAll(".parallax-y")).map(
        (el) => ({ el, factor: parseFloat(el.dataset.parallax || "0.15") })
      );
    };

    const update = () => {
      raf = null;
      const scrollY = window.scrollY || 0;
      const docH =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ) - window.innerHeight;
      const progress = docH > 0 ? Math.min(1, scrollY / docH) : 0;

      root.style.setProperty("--scroll-progress", progress.toFixed(4));

      const heroH = window.innerHeight;
      const heroFade = Math.max(0, 1 - scrollY / (heroH * 0.65));
      root.style.setProperty("--hero-fade", heroFade.toFixed(3));

      if (!prefersReduced) {
        for (let i = 0; i < parallaxNodes.length; i++) {
          const { el, factor } = parallaxNodes[i];
          const y = -scrollY * factor;
          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        }
      }
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    collectParallax();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Re-collect parallax nodes after async section mounts
    const t1 = setTimeout(collectParallax, 200);
    const t2 = setTimeout(collectParallax, 800);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
};
