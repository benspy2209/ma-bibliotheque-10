
import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"

export type CarouselApi = UseEmblaCarouselType[1]
export type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]
export type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1]

export type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

export type CarouselContextProps = {
  carouselRef: UseEmblaCarouselType[0]
  api: UseEmblaCarouselType[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

export const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}
