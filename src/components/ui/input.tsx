
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pointer-events-auto",
          className
        )}
        ref={ref}
        autoComplete="on"
        spellCheck="false"
        style={{ 
          caretColor: 'auto', 
          WebkitAppearance: 'none', 
          WebkitUserSelect: 'auto',
          fontSize: '16px'  // Important pour éviter le zoom sur les appareils iOS
        }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
