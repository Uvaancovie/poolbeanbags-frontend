'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

const slides = [
  { src: '/lifestyle.jpg', alt: 'Luxury poolside lifestyle scene' },
  { src: '/lifestyle-1.jpg', alt: 'Outdoor comfort and relaxation' },
  { src: '/lifestyle-2.jpg', alt: 'Premium poolside furnishings' },
  { src: '/family.jpg', alt: 'Family enjoying poolside comfort' },
  { src: '/kids.jpg', alt: 'Children playing by the pool' },
];

export default function LuxCarousel() {
  return (
    <section className="relative w-full h-[60vh] min-h-[520px] overflow-hidden">
      <Carousel className="w-full h-full" plugins={[Autoplay({ delay: 4000 })]}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full"
                style={{ height: '60vh', minHeight: 520 }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/80 hover:bg-white transition-colors z-20" />
        <CarouselNext className="right-4 bg-white/80 hover:bg-white transition-colors z-20" />
      </Carousel>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Image
            src="/logo.jpg"
            alt="Pool Bean Bags Logo"
            width={120}
            height={60}
            className="mx-auto mb-4"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h1 mb-4 drop-shadow-lg"
        >
          Luxury Poolside Comfort
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md"
        >
          Premium outdoor fabrics. Hand-finished details.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/shop" className="btn-primary">
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}