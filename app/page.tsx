import React from 'react'
import LuxCarousel from '@/components/LuxCarousel'
import LandingGallery from '@/components/LandingGallery'
import Image from 'next/image'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Reviews from '@/components/Reviews'
import { API_BASE } from 'lib/api'
import { FabricsCarousel } from '@/components/FabricsCarousel'

type Announcement = {
  id: number
  slug: string
  title: string
  excerpt?: string
  body_richtext?: string
  banner_image?: string
  banner_image_url?: string
  published_at?: string
  start_at?: string
  end_at?: string
  is_featured: boolean
  created_at: string
}

export default async function Page() {
  let announcements: Announcement[] = []
  try {
    const res = await fetch(`${API_BASE}/api/announcements`, { next: { revalidate: 60 } })
    const data = await res.json()
    announcements = data.announcements || []
  } catch (err) {
    console.error('Failed to fetch announcements:', err)
  }

  // Filter out summer sale announcements
  const filteredAnnouncements = announcements.filter(
    (announcement) => !announcement.title.toLowerCase().includes('summer sale')
  )
  const latestAnnouncement = filteredAnnouncements.length > 0 ? filteredAnnouncements[0] : null

  return (
    <main className="space-y-16 md:space-y-20">
      {/* Announcement strip — crisp, single line */}
      <div className="bg-black text-white text-sm">
        <div className="mx-auto max-w-[1280px] px-4 py-2 text-center">
          <span className="poppins-extralight">
            {latestAnnouncement ? latestAnnouncement.title : 'New: Nationwide delivery • Sample swatches available'}
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4">
        <LuxCarousel />
      </div>

      {/* Mood / Inspiration */}
      <section className="px-4">
        <div className="mx-auto max-w-[1280px]">
          <header className="mb-10 text-center">
            <h2 className="poppins-light text-[28px] md:text-[34px] leading-tight text-[var(--fg)]">
              Inspiration
            </h2>
            <p className="poppins-extralight text-[var(--fg-muted)]">
              Calm lines, tactile fabrics, sunshine-ready comfort.
            </p>
          </header>
          <LandingGallery />
        </div>
      </section>

      {/* Fabrics Carousel */}
      <section className="px-4">
        <div className="mx-auto max-w-[1280px]">
          <FabricsCarousel />
        </div>
      </section>

      {/* Three value props — rounder cards, cement copy */}
      <section className="px-4">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Curated Comfort', copy: 'Premium fillings and hand-finished seams.' },
              { title: 'Weather-Ready', copy: 'Fade-safe, easy-care outdoor fabrics.' },
              { title: 'Design-Led', copy: 'Shapes specified by interior designers.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
                <h3 className="poppins-light text-xl text-[var(--fg)] mb-1">{item.title}</h3>
                <p className="text-[var(--fg-muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers — cleaner cards, fixed ratio, tidy meta */}
      <section className="px-4">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="poppins-light text-[26px] md:text-[32px] text-[var(--fg)]">Bestsellers</h2>
            <Button asChild>
              <a href="/shop" className="text-sm">View all</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['lifestyle-1.jpg', 'lifestyle-2.jpg', 'lifestyle-3.jpg'].map((src, i) => (
              <Card key={src} className="p-0 overflow-hidden rounded-2xl border border-[var(--border)]">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={`/${src}`}
                    alt={`Pool bean bag ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h4 className="poppins-regular text-[var(--fg)]">Pool Bean Bags {i + 1}</h4>
                  <p className="text-sm text-[var(--fg-muted)] mt-1">From R1200</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fabrics & Finishes — tidy grid */}
      <section className="px-4">
        <div className="mx-auto max-w-[1280px]">
          <h3 className="poppins-light text-[22px] md:text-[26px] text-[var(--fg)] mb-6">Fabrics &amp; Finishes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['lifestyle-1.jpg', 'lifestyle-2.jpg', 'kids.jpg', 'dog.jpg'].map((img) => (
              <div key={img} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <Image src={`/${img}`} alt={img} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — your minimal, no-star version */}
      <Reviews />

      {/* Footer */}
      <footer className="px-4 pb-10">
        <div className="mx-auto max-w-[1280px] border-t pt-8 text-sm text-[var(--fg-muted)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Pool Bean Bags</div>
          <nav className="flex gap-4">
            <a href="/about" className="hover:opacity-80">About</a>
            <a href="/faq" className="hover:opacity-80">FAQ</a>
            <a href="/contact" className="hover:opacity-80">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
