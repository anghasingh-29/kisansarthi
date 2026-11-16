import { useEffect, useState } from "react";
import { useAccessibility } from "@/lib/accessibility";

export function ReadingRuler() {
  const { settings } = useAccessibility();
  const [y, setY] = useState(220);

  useEffect(() => {
    if (!settings.readingRuler || typeof window === "undefined") return;

    setY(Math.round(window.innerHeight * 0.35));

    const onPointerMove = (e: MouseEvent) => {
      setY(e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) setY(touch.clientY);
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        if (rect.height > 0) {
          setY(Math.round(rect.top + rect.height / 2));
        }
      }
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("focusin", onFocusIn, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("focusin", onFocusIn);
    };
  }, [settings.readingRuler]);

  if (!settings.readingRuler) return null;

  const bandHalf = 28;
  const topPx = Math.max(0, y - bandHalf);

  return (
    <div
      aria-hidden="true"
      data-testid="reading-ruler"
      className="pointer-events-none fixed inset-x-0 z-30 border-y-2 border-primary/70 bg-primary/10"
      style={{
        top: `${topPx}px`,
        height: `${bandHalf * 2}px`,
      }}
    />
  );
}
