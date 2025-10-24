import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MainCarousel = () => {
  return (
    <div className="group relative w-full">
      <Carousel
        showArrows
        showStatus={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={5000}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <button
            key={index}
            onClick={onClickHandler}
            title={label}
            className={`h-2 rounded-full bg-white transition-all ${
              isSelected
                ? "mx-2.5 w-10 scale-125"
                : "mx-1 w-2 opacity-50 hover:opacity-75"
            }`}
          />
        )}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              onClick={onClickHandler}
              title={label}
              className="absolute left-8 top-1/2 z-10 flex h-8 w-8 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-all duration-300 ease-out hover:bg-black/60 group-hover:translate-x-0 group-hover:opacity-100" // Added translate animation
            >
              <ChevronLeft size={16} />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              onClick={onClickHandler}
              title={label}
              className="absolute right-8 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 translate-x-2 items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-all duration-300 ease-out hover:bg-black/60 group-hover:translate-x-0 group-hover:opacity-100" // Added translate animation
            >
              <ChevronRight size={16} />
            </button>
          )
        }
      >
        <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[32/9]">
          <Image
            src="/carousel-1.jpg"
            alt="Carousel 1"
            fill
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[32/9]">
          <Image
            src="/carousel-2.jpg"
            alt="Carousel 2"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[32/9]">
          <Image
            src="/carousel-3.jpg"
            alt="Carousel 3"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default MainCarousel;
