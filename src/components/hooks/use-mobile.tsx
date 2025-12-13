import * as React from "react"

const MOBILE_BREAKPOINT = 1024

/**
 * Optimized hook to detect mobile viewport
 * Uses matchMedia API for better performance and throttled resize listener as fallback
 * 
 * @returns {boolean} True if viewport width is less than MOBILE_BREAKPOINT (1024px)
 */
export function useIsMobile() {
  // Use a function to initialize state to avoid calling window.innerWidth on every render
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // SSR-safe: return false during SSR
    if (typeof window === 'undefined') return false
    
    // Use matchMedia for initial check if available (more performant)
    if (window.matchMedia) {
      return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
    }
    
    // Fallback to innerWidth
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  // Use ref to track if component is mounted and prevent state updates after unmount
  const isMountedRef = React.useRef(true)
  
  // Use ref to store the media query list for cleanup
  const mediaQueryRef = React.useRef<MediaQueryList | null>(null)
  
  // Throttle function to limit resize event frequency
  const throttleTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = React.useRef<number>(0)
  const THROTTLE_DELAY = 150 // ms

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    isMountedRef.current = true

    // Prefer matchMedia API for better performance
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      mediaQueryRef.current = mediaQuery

      // Use change event listener (more efficient than resize)
      const handleMediaChange = (e?: MediaQueryListEvent | MediaQueryList) => {
        if (!isMountedRef.current) return
        
        // Handle both event object and MediaQueryList
        const matches = e ? ('matches' in e ? e.matches : mediaQuery.matches) : mediaQuery.matches
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          if (isMountedRef.current) {
            setIsMobile(matches)
          }
        })
      }

      // Modern browsers support addEventListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMediaChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleMediaChange)
      }

      // Initial sync check
      setIsMobile(mediaQuery.matches)

      // Cleanup
      return () => {
        isMountedRef.current = false
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleMediaChange)
        } else {
          mediaQuery.removeListener(handleMediaChange)
        }
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current)
        }
      }
    }

    // Fallback to resize listener with throttling
    const handleResize = () => {
      const now = Date.now()
      
      // Throttle: only update if enough time has passed
      if (now - lastUpdateRef.current < THROTTLE_DELAY) {
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current)
        }
        
        throttleTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return
          
          const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
          requestAnimationFrame(() => {
            if (isMountedRef.current) {
              setIsMobile(newIsMobile)
            }
          })
          lastUpdateRef.current = Date.now()
        }, THROTTLE_DELAY - (now - lastUpdateRef.current))
        
        return
      }

      lastUpdateRef.current = now
      
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (!isMountedRef.current) return
        
        const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
        setIsMobile(newIsMobile)
      })
    }

    // Use passive listener for better scroll performance
    window.addEventListener('resize', handleResize, { passive: true })
    
    // Cleanup
    return () => {
      isMountedRef.current = false
      window.removeEventListener('resize', handleResize)
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return isMobile
}
