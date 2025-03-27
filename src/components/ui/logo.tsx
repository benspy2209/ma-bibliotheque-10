
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
  
  // Définir les tailles pour les différentes variantes
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };
  
  // Déterminer les couleurs en fonction du thème
  const logoColor = "#FF1A75"; // Rose/magenta du logo
  const textColor = theme === "dark" ? "#FFFFFF" : "#221F26"; // Noir plus foncé en mode clair
  const strokeWidth = 8; // Augmenter l'épaisseur du trait pour une meilleure visibilité
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative">
        {/* Logo "B" stylisé avec trait plus épais */}
        <svg 
          className={cn(sizes[size], "w-auto")} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M26.4,90c0,0,18.4-77.3,40.8-77.3c13.4,0,20.2,15.3,7.4,22.6C63,41.1,44.6,42,39.9,56.5 c-2.8,8.5,1.7,17,11.2,17c8.1,0,13.9-5.8,13.9-13.4" 
            stroke={logoColor} 
            strokeWidth={strokeWidth} 
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Ajouter un contour blanc/noir selon le thème pour améliorer la visibilité */}
        {theme === "light" && (
          <svg 
            className={cn(sizes[size], "w-auto absolute top-0 left-0")} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0px 0px 1px #221F26)" }}
          >
            <path 
              d="M26.4,90c0,0,18.4-77.3,40.8-77.3c13.4,0,20.2,15.3,7.4,22.6C63,41.1,44.6,42,39.9,56.5 c-2.8,8.5,1.7,17,11.2,17c8.1,0,13.9-5.8,13.9-13.4" 
              stroke={logoColor} 
              strokeWidth={strokeWidth} 
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      
      <div className="flex flex-col ml-2">
        <h1 
          className={cn(
            "font-bold tracking-wider", 
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
            theme === "light" ? "text-brand" : "" // Utiliser la couleur brand en mode clair
          )}
        >
          BIBLIOPULSE
        </h1>
        
        {showTagline && (
          <p 
            className={cn(
              "tracking-widest uppercase", 
              size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
            )}
            style={{ color: textColor }}
          >
            Lire, mieux.
          </p>
        )}
      </div>
    </div>
  );
};
