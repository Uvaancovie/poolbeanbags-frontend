// components/Reviews.tsx
// Monochrome, rounded, minimal reviews (Poppins). No stars/icons.

type Review = {
  author: string
  body: string
  rating?: number // kept for SEO JSON-LD only (default 5)
}

const REVIEWS: Review[] = [
  { author: "Dawid Van Jaarsveld", body: "Very nice pool bean bags. The kids loves it. The delivery was quick. Just do it — I bought 4!", rating: 5 },
  { author: "Michelle Kemp", body: "Wooohooo summer is here. Love my pool beanbag. You guys are amazing.", rating: 5 },
  { author: "Zulynn Havenga", body: "I got my pool beanbags yesterday and I’m super happy. Thank you — they’re beautiful. Can’t wait to try them out. My daughter already hopped on one yesterday!!", rating: 5 },
  { author: "Amalta Pillay", body: "My son loves his pool bean bag, thank you.", rating: 5 },
  { author: "Janine Marais", body: "BEST POOL accessory ever.", rating: 5 },
]

export default function Reviews() {
  // Aggregate rating for structured data (not shown in UI)
  const avg =
    Math.round(
      (REVIEWS.reduce((s, r) => s + (r.rating ?? 5), 0) / REVIEWS.length) * 10
    ) / 10

  return (
    <section className="py-16 px-4 bg-[var(--bg)]">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10 text-center">
          <h3 className="poppins-light text-[28px] md:text-[34px] leading-tight text-[var(--fg)]">
            What customers say
          </h3>
          <p className="poppins-extralight text-[var(--fg-muted)] mt-2">
            Quiet feedback. Real homes. Minimal noise.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <figure
              key={`${r.author}-${i}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-7 transition-shadow hover:shadow-lg"
            >
              {/* Decorative minimal quote mark */}
              <div className="mb-4">
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)]"
                >
                  &ldquo;
                </span>
              </div>

              <blockquote className="poppins-light text-[var(--fg)] leading-relaxed text-[16px] md:text-[17px]">
                {r.body}
              </blockquote>

              <figcaption className="mt-6 flex items-center justify-between">
                <span className="text-[14px] poppins-regular text-[var(--fg)]">
                  {r.author}
                </span>
                {r.rating && (
                  <span className="text-[11px] uppercase tracking-wide text-[var(--fg-muted)] border border-[var(--border)] rounded-full px-3 py-1">
                    Verified Review
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* SEO: aggregate rating JSON-LD (no UI stars shown) */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Pool Bean Bag",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: String(avg),
                reviewCount: String(REVIEWS.length),
              },
              review: REVIEWS.map((r) => ({
                "@type": "Review",
                reviewBody: r.body,
                reviewRating: { "@type": "Rating", ratingValue: r.rating ?? 5 },
                author: { "@type": "Person", name: r.author },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
