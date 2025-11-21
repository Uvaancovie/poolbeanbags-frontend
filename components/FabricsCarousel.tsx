"use client"

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const FABRICS = [
  { name: "BLACK STRIPE", image: "/fabrics/black-stripe.jpg" },
  { name: "NAVY STRIPE", image: "/fabrics/navy-stripe.jpg" },
  { name: "YELLOW STRIPE", image: "/fabrics/yellow-stripe.jpeg" },
  { name: "RED STRIPE", image: "/fabrics/red-stripe.jpg" },
  { name: "DELICIOUS MONSTER ON WHITE", image: "/fabrics/delicous-monster-on-white.jpg" },
  { name: "DELICIOUS MONSTER ON BLACK", image: "/fabrics/delicious-monster-on-black.jpeg" },
  { name: "DELICIOUS MONSTER BLUE", image: "/fabrics/blue-delicous-monster.jpeg" },
  { name: "BLUE PALMS", image: "/fabrics/blue-palms.jpeg" },
  { name: "PROTEA", image: "/fabrics/protea.jpeg" },
  { name: "WATERMELON", image: "/fabrics/watermelon.jpeg" },
  { name: "CYCADELIC", image: "/fabrics/cycadelic.jpeg" },
]

export function FabricsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 2000, stopOnInteraction: false })
  ])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h3 className="poppins-light text-[28px] md:text-[34px] leading-tight text-[var(--fg)]">
          Find Your Perfect Match
        </h3>
        <p className="poppins-extralight text-[var(--fg-muted)] text-lg">
          Explore our premium range of weather-resistant fabrics
        </p>
      </div>

      <div className="relative group">
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {FABRICS.map((fabric, index) => (
              <div key={index} className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-4">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] group/item cursor-pointer">
                  <Image
                    src={fabric.image}
                    alt={fabric.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    priority={index < 5}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium text-center w-full tracking-wide">{fabric.name}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-center text-[var(--fg-muted)] md:hidden font-medium">{fabric.name}</p>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={scrollPrev} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 border border-gray-100"
          aria-label="Previous slide"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={scrollNext} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 border border-gray-100"
          aria-label="Next slide"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
