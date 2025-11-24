'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type Slide = {
  src: string
  alt: string
  title?: string
  blurb?: string
  ctaHref?: string
  ctaLabel?: string
}

const slides: Slide[] = [
  {
    src: '/lifestyle-5.jpg',
    alt: 'Pool bean bags by a sunlit pool',
    title: 'Luxury Poolside Comfort',
    blurb: 'Minimal shapes, weather-ready fabrics, built for the coast.',
    ctaHref: '/shop',
    ctaLabel: 'Shop Now',
  },
  {
    src: '/lifestyle-1.jpg',
    alt: 'Close-up of stitching and fabric texture',
    title: 'Craft in the Details',
    blurb: 'Hand-finished seams and premium fillings.',
    ctaHref: '/shop',
    ctaLabel: 'View Collection',
  },
  {
    src: '/family.jpg',
    alt: 'Family relaxing on outdoor bean bags',
    title: 'Relaxed Living',
    blurb: 'Comfort that works from pool deck to patio.',
    ctaHref: '/shop',
    ctaLabel: 'Explore',
  },
]

export default function LuxCarousel() {
  return (
    <section aria-label="Hero" className="relative">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl mx-auto max-w-[1280px]">
        {/* NOTE: No autoplay. Drag/Prev/Next only. */}
        <Carousel
          opts={{
            loop: false,
            align: 'start',
            // keep movement deliberate; no snap skipping
            skipSnaps: false,
            // if you want to also prevent swipe, set draggable: false
          }}
          aria-roledescription="carousel"
        >
          <CarouselContent>
            {slides.map((s, i) => (
              <CarouselItem key={i}>
                <div className="relative h-[58vh] min-h-[520px] w-full">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                    className="object-cover"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="absolute bottom-10 left-8 right-8 sm:left-12 sm:right-12"
                  >
                    <div className="max-w-xl text-white">
                      {s.title && (
                        <h1 className="poppins-light text-[34px] md:text-[48px] leading-tight">
                          {s.title}
                        </h1>
                      )}
                      {s.blurb && (
                        <p className="poppins-extralight text-white/90 mt-2">
                          {s.blurb}
                        </p>
                      )}
                      {s.ctaHref && s.ctaLabel && (
                        <a href={s.ctaHref} className="btn-primary inline-flex mt-6">
                          {s.ctaLabel}
                        </a>
                      )}
                    </div>
                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls: visible, minimal, accessible */}
          <CarouselPrevious
            aria-label="Previous slide"
            className="left-4 bg-white/90 text-[var(--fg)] hover:bg-white"
          />
          <CarouselNext
            aria-label="Next slide"
            className="right-4 bg-white/90 text-[var(--fg)] hover:bg-white"
          />
        </Carousel>
      </div>
    </section>
  )
}
