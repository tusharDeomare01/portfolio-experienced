import { useRef, useCallback } from 'react';

/**
 * Custom hook for throttling function calls
 * @param callback - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      } else {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Schedule the call for after the delay
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, delay - (now - lastRun.current));
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttle using requestAnimationFrame for smooth animations
 * @param callback - The function to throttle
 * @returns A throttled version using RAF
 */
export function useThrottleRAF<T extends (...args: any[]) => any>(
  callback: T
): T {
  const rafRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      lastArgsRef.current = args;
      
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
          }
          rafRef.current = null;
        });
      }
    }) as T,
    [callback]
  );
}

