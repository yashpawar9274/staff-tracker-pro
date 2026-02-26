import { useRef, useCallback, useState, useEffect } from "react";

interface SwipeableOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  maxSwipe?: number;
}

export function useSwipeable({ onSwipeLeft, onSwipeRight, threshold = 80, maxSwipe = 100 }: SwipeableOptions) {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isTracking = useRef(false);
  const isHorizontal = useRef<boolean | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = 0;
    isTracking.current = true;
    isHorizontal.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isTracking.current) return;

    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Determine direction lock on first significant move
    if (isHorizontal.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
    }

    if (!isHorizontal.current) return;

    // Clamp the offset
    const clamped = Math.max(-maxSwipe, Math.min(maxSwipe, dx));
    currentX.current = clamped;
    setOffsetX(clamped);
    setIsSwiping(true);
  }, [maxSwipe]);

  const handleTouchEnd = useCallback(() => {
    isTracking.current = false;

    if (Math.abs(currentX.current) >= threshold) {
      if (currentX.current < 0 && onSwipeLeft) {
        // Keep it swiped to show action was triggered
        setOffsetX(-maxSwipe);
        onSwipeLeft();
      } else if (currentX.current > 0 && onSwipeRight) {
        setOffsetX(maxSwipe);
        onSwipeRight();
      } else {
        setOffsetX(0);
      }
    } else {
      setOffsetX(0);
    }

    setTimeout(() => setIsSwiping(false), 300);
  }, [threshold, maxSwipe, onSwipeLeft, onSwipeRight]);

  const resetSwipe = useCallback(() => {
    setOffsetX(0);
    setIsSwiping(false);
  }, []);

  return {
    offsetX,
    isSwiping,
    resetSwipe,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
