// app/announcements/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Announcements — Pool Bean Bags",
  description: "Minimal, editorial announcements and updates.",
}

type StaticAnnouncement = {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  featured?: boolean
  body?: string
}

const ANNOUNCEMENTS: StaticAnnouncement[] = [
  {
    id: 1,
    title: "Summer Is Coming",
    excerpt:
      " Hand-finished details, weather-ready fabrics.",
    date: "2025-11-01",
    image: "/lifestyle-2.jpg",
    featured: true,
    body:
      "Celebrate summer with elevated comfort. Our bestselling pool bean bags are on promotion for a limited time. Enjoy minimal aesthetics, durable stitching, and materials engineered for South African sun.",
  },
  {
    id: 2,
    title: "New Colours, Same Minimal Feel",
    excerpt:
      "A curated palette of neutral tones designed to complement contemporary outdoor spaces.",
    date: "2025-10-20",
    image: "/lifestyle-3.jpg",
  },
  {
    id: 3,
    title: "Summer Colors",
    excerpt:
      "See textures and scale in person. Private viewings available weekdays 09:00–16:00.",
    date: "2025-10-12",
    image: "/lifestyle-1.jpg",
  },
  {
    id: 4,
    title: "Craft & Care",
    excerpt:
      "Reinforced seams, premium fillings, and simple care routines to extend product life.",
    date: "2025-09-28",
    image: "/kids.jpg",
  },
]

function formatZA(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function AnnouncementsPage() {
  const featured = ANNOUNCEMENTS.find((a) => a.featured)
  const regular = ANNOUNCEMENTS.filter((a) => !a.featured)

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-screen">
          <Image
            src="/lifestyle-1.jpg"
            alt="Pool Bean Bags — lifestyle"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div className="max-w-4xl text-center text-white">
              <h1 className="poppins-light text-[40px] md:text-[64px] leading-tight tracking-tight">
                Announcements
              </h1>
              <p className="poppins-extralight text-white/90 text-lg md:text-xl mt-3">
                Quiet luxury. Minimal design. Updates that matter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-10 py-16 space-y-16">
        {/* Featured */}
        {featured && (
          <section aria-labelledby="featured">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
              <div className="relative h-[420px]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 text-xs font-medium bg-[var(--card)] text-[var(--fg)] border border-[var(--border)] rounded-full">
                      Featured
                    </span>
                    <span className="text-[var(--card)]/90 text-sm">
                      {formatZA(featured.date)}
                    </span>
                  </div>
                  <h2 className="poppins-light text-white text-4xl md:text-5xl leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-white/90 text-lg md:text-xl max-w-2xl mt-3 poppins-extralight">
                    {featured.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <p className="text-[var(--fg)]/90 leading-relaxed">
                      {featured.body}
                    </p>
                  </div>
                  <div className="flex md:justify-end">
                    <Link
                      href="/shop"
                      className="btn-primary self-start"
                      aria-label="Shop now"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Grid of updates */}
        {regular.length > 0 && (
          <section aria-labelledby="updates" className="space-y-6">
            <h3 className="poppins-light text-2xl text-[var(--fg)]">Latest Updates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regular.map((a) => (
                <article
                  key={a.id}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-48">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-[var(--fg-muted)] mb-2">
                      {formatZA(a.date)}
                    </div>
                    <h4 className="poppins-light text-xl text-[var(--fg)] leading-tight mb-2">
                      {a.title}
                    </h4>
                    <p className="text-[var(--fg-muted)]">{a.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm">
                      <span className="text-[var(--fg-muted)]">Read more</span>
                      <span className="text-[var(--fg)] group-hover:opacity-70 transition-opacity">
                        →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter / CTA */}
        <section
          aria-labelledby="newsletter"
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-10"
        >
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="poppins-light text-2xl text-[var(--fg)]">
                Quiet updates, no noise.
              </h3>
              <p className="text-[var(--fg-muted)] mt-1">
                Be first to hear about limited runs, restocks and events.
              </p>
            </div>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="input"
                aria-label="Email address"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center btn-outline"
            aria-label="Back to shop"
          >
            ← Back to Shop
          </Link>
        </div>
      </main>
    </div>
  )
}
