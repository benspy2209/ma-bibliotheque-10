
import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // Breakpoint for tablets and mobile devices

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initialize with current width
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Consider both width and orientation for better detection
      // Also handle S21's specific dimensions (412x915 portrait, 915x412 landscape)
      const isNarrowDevice = width < MOBILE_BREAKPOINT;
      const isLandscape = width > height;
      
      // Special handling for Samsung devices with unusual pixel ratios
      const pixelRatio = window.devicePixelRatio || 1;
      const isHighDensityDisplay = pixelRatio > 2.5;
      
      setIsMobile(isNarrowDevice || (isLandscape && height < 500));
    }
    
    // Check immediately
    checkMobile()
    
    // Set up event listeners for better responsiveness
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    
    // Also use matchMedia for orientation changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkMobile)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
      mql.removeEventListener("change", checkMobile)
    }
  }, [])

  return isMobile
}
