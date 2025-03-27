
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
    sm: "h-9",
    md: "h-14",
    lg: "h-20",
  };
  
  // Logo color - magenta pink
  const logoColor = "#FF1A75";
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Stylized "B" logo */}
      <div className="relative">
        <svg 
          className={cn(sizes[size], "w-auto")} 
          viewBox="0 0 60 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Completely redesigned "B" path based on reference image */}
          <path 
            d="M20,20 C40,20 50,30 50,40 C50,50 40,60 20,60 C40,60 50,70 50,80 C50,90 40,100 20,100 L20,20 Z"
            stroke={logoColor} 
            strokeWidth={10} 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className="flex flex-col justify-center">
        <h1 
          className={cn(
            "font-bold tracking-widest", 
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-3xl",
          )}
          style={{ color: logoColor }}
        >
          BIBLIOPULSE
        </h1>
        
        {showTagline && (
          <p 
            className={cn(
              "tracking-widest uppercase mt-0.5 letter-spacing-wide", 
              size === "sm" ? "text-[0.6rem]" : size === "md" ? "text-xs" : "text-sm",
            )}
            style={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}
          >
            LIRE, MIEUX.
          </p>
        )}
      </div>
    </div>
  );
};
