
import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className, showTagline = true, size = "md" }: LogoProps) => {
  const { theme } = useTheme();
  
  // Enhanced size variants with taller heights
  const sizes = {
    sm: "h-10",
    md: "h-14",
    lg: "h-16",
    xl: "h-20",
  };
  
  // Déterminer les couleurs en fonction du thème
  const logoColor = "#FF1A75"; // Rose/magenta du logo
  const textColor = theme === "dark" ? "#FFFFFF" : "#221F26";
  const taglineColor = theme === "dark" ? "#FFFFFF" : "#000000"; // Tagline in black for light mode
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative">
        {/* Nouveau logo "B" stylisé basé sur l'image fournie */}
        <svg 
          className={cn(sizes[size], "w-auto")} 
          viewBox="0 0 150 150" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M30,150 C30,150 40,30 90,30 C115,30 125,60 90,75 C60,88 30,90 20,120 C15,135 30,145 50,145 C65,145 80,135 80,120" 
            stroke={logoColor} 
            strokeWidth="12" 
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      <div className="flex flex-col ml-3">
        <h1 
          className={cn(
            "font-bold tracking-wider", 
            size === "sm" ? "text-lg" : 
            size === "md" ? "text-xl" : 
            size === "lg" ? "text-2xl" : "text-3xl"
          )}
          style={{ color: textColor }}
        >
          BIBLIOPULSE
        </h1>
        
        {showTagline && (
          <p 
            className={cn(
              "tracking-widest uppercase", 
              size === "sm" ? "text-xs" : 
              size === "md" ? "text-sm" : 
              size === "lg" ? "text-base" : "text-lg"
            )}
            style={{ color: taglineColor }}
          >
            Lire, mieux.
          </p>
        )}
      </div>
    </div>
  );
};
