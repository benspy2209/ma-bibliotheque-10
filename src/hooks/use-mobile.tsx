
import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // Breakpoint increased to include tablets and landscape mobile devices

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initialize with current width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkMobile()
    
    // Set up event listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use resize event for more responsive handling
    window.addEventListener('resize', checkMobile)
    
    // Also use matchMedia for orientation changes
    mql.addEventListener("change", checkMobile)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile)
      mql.removeEventListener("change", checkMobile)
    }
  }, [])

  return isMobile
}
