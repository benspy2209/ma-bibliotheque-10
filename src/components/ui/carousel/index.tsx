
// Main entry point for carousel components
import { Carousel } from "./Carousel";
import { CarouselContent } from "./CarouselContent";
import { CarouselItem } from "./CarouselItem";
import { CarouselPrevious } from "./CarouselPrevious";
import { CarouselNext } from "./CarouselNext";
import { useCarousel } from "./carousel-context";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel
};

// Re-export the types for better DX
export type { CarouselApi, CarouselProps } from "./carousel-context";
