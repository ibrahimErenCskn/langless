"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useBearStore } from "@/store/Deneme/store";
import Autoplay from "embla-carousel-autoplay"

export default function HomeCarousel() {
    const bears = useBearStore((state) => state.bears)
    const increaseBy = useBearStore((state) => state.increase)
    return (
        <Carousel
            className="select-none"
            plugins={[
                Autoplay({
                    delay: 2000,
                }),
            ]}>
            <CarouselContent className="h-96 rounded-sm">
                <CarouselItem className="h-full flex items-center justify-center bg-white text-black rounded-sm">...</CarouselItem>
                <CarouselItem className="">{bears}</CarouselItem>
                <CarouselItem className="">...</CarouselItem>
            </CarouselContent>
            <CarouselPrevious variant={"secondary"} />
            <CarouselNext variant={"secondary"} />
        </Carousel>
    )
}
