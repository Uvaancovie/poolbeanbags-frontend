import React from 'react'
import LuxCarousel from '@/components/LuxCarousel'
import LandingGallery from '@/components/LandingGallery'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function Page() {
  return (
    <main>
      {/* Announcement strip */}
      <div className="bg-[var(--gold)] text-[var(--ink)] text-sm py-2">
        <div className="container mx-auto px-4 text-center">New: We are available nationwide • Sample swatches available</div>
      </div>

      <LuxCarousel />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="h1 text-center mb-12">Inspiration</h2>
          <LandingGallery />
        </div>
      </section>

      <section className="py-12 bg-white px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center block p-4 border rounded-md">
              <h3 className="text-xl font-normal mb-2">Curated Comfort</h3>
              <p className="text-muted">Premium fillings and hand-stitched seams for outdoor use.</p>
            </div>
            <div className="text-center block p-4 border rounded-md">
              <h3 className="text-xl font-normal mb-2">Sustainable Fabrics</h3>
              <p className="text-muted">Weather-resistant, fade-safe and easy to clean.</p>
            </div>
            <div className="text-center block p-4 border rounded-md">
              <h3 className="text-xl font-normal mb-2">Design-Led</h3>
              <p className="text-muted">Shapes and colours chosen by interior designers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-normal">Bestsellers</h2>
            <Button asChild>
              <a href="/shop" className="text-sm">View all</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["lifestyle-1.jpg","lifestyle-2.jpg","lifestyle-3.jpg"].map((src, i) => (
              <Card key={src} className="p-4">
                <div className="w-full h-48 relative overflow-hidden rounded-md">
                  <Image src={`/${src}`} alt={`Pool beanbag ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="mt-4">
                  <h4 className="font-normal">Signature Beanbag {i + 1}</h4>
                  <p className="text-muted text-sm">From R1500</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-[color:var(--background)]">
        <div className="container mx-auto">
          <h3 className="text-2xl font-normal mb-6">Fabrics & Finishes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["patterns.jpg","colors.jpg","kids.jpg","dog.jpg"].map((img) => (
              <div key={img} className="rounded-md overflow-hidden">
                <Image src={`/${img}`} alt={img} width={400} height={300} className="object-cover w-full h-36" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl font-normal mb-6">What customers say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <blockquote className="p-6 border rounded-md block">"Absolutely transformed our pool area — the quality is excellent." — Anna</blockquote>
            <blockquote className="p-6 border rounded-md block">"Comfy, weatherproof and elegant." — Marcus</blockquote>
            <blockquote className="p-6 border rounded-md block">"Quick delivery and lovely colour options." — Leila</blockquote>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[var(--ink)] text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-normal mb-4">Visit our showroom</h3>
          <p className="max-w-2xl mx-auto mb-6 text-muted">Try samples and see finishes in person — appointments available by request.</p>
          <Button asChild>
            <a href="/contact" className="btn-primary">Book a visit</a>
          </Button>
        </div>
      </section>

      <footer className="py-10 px-4 bg-white border-t">
        <div className="container mx-auto text-sm text-muted flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Pool Beanbags</div>
          <div className="flex gap-4">
            <a href="/about">About</a>
            <a href="/faq">FAQ</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
