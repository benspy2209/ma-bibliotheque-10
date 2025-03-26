
// Main entry point for carousel components
import { Carousel } from "./Carousel";
import { CarouselContent } from "./CarouselContent";
import { CarouselItem } from "./CarouselItem";
import { CarouselPrevious } from "./CarouselPrevious";
import { CarouselNext } from "./CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};

// Re-export the type for better DX
export type { CarouselProps } from "./Carousel";
