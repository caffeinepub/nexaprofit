import { useEffect, useRef } from 'react';
import type { Route } from '@/router/useHashRoute';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

interface UseInactivityTimeoutOptions {
  currentRoute: Route;
  onTimeout: () => void;
}

/**
 * Hook that monitors user activity and triggers a callback after 15 minutes of inactivity.
 * Excludes home page ('/') and dashboard ('/dashboard') from timeout behavior.
 * Resets timer on mouse movement, key presses, clicks/taps, and scrolling.
 */
export function useInactivityTimeout({ currentRoute, onTimeout }: UseInactivityTimeoutOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only apply timeout to routes other than '/' and '/dashboard'
    const shouldApplyTimeout = currentRoute !== '/' && currentRoute !== '/dashboard';

    if (!shouldApplyTimeout) {
      // Clean up any existing timeout if we're on an excluded route
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Reset the inactivity timer
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, INACTIVITY_TIMEOUT);
    };

    // Initialize timer
    resetTimer();

    // Activity event listeners
    const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentRoute, onTimeout]);
}
