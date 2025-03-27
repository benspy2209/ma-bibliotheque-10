
import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, showTagline = true, size = "md" }: LogoProps) => {
  const { theme } = useTheme();
  
  // Define sizes for different variants
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };
  
  // Logo color - magenta pink
  const logoColor = "#FF1A75";
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Stylized "B" logo */}
      <div className="relative">
        <svg 
          className={cn(sizes[size], "w-auto")} 
          viewBox="0 0 110 110" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Updated path for the "B" to match the reference image */}
          <path 
            d="M28,95 C28,95 35,35 60,35 C85,35 70,60 55,60 C45,60 35,70 40,80 C45,90 55,85 60,75"
            stroke={logoColor} 
            strokeWidth={6} 
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <h1 
          className={cn(
            "font-bold tracking-widest", 
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
          )}
          style={{ color: theme === "dark" ? "#FFFFFF" : logoColor }}
        >
          BIBLIOPULSE
        </h1>
        
        {showTagline && (
          <p 
            className={cn(
              "tracking-widest uppercase text-xs mt-0.5 letter-spacing-wide", 
              size === "sm" ? "text-[0.6rem]" : size === "md" ? "text-xs" : "text-sm",
            )}
            style={{ color: theme === "dark" ? "#FFFFFF" : logoColor }}
          >
            LIRE, MIEUX.
          </p>
        )}
      </div>
    </div>
  );
};
