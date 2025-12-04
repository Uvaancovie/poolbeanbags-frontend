import Image from "next/image"
import Link from "next/link"
import Card from "@/components/ui/Card"
import { API_BASE } from "lib/api"
import { formatPriceFromCents } from "@/lib/formatPrice"
import AddToCartButton from "./AddToCartButton"
import { FabricSelector } from "@/components/FabricSelector"

type ProductImage = { _id?: string; id?: string; url: string; alt?: string }
type Product = {
  _id?: string
  id: string
  slug: string
  title: string
  description?: string
  base_price_cents?: number
  images?: ProductImage[]
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // ✅ Unwrap params on the server (no React.use in client)
  const { slug } = await params

  let product: Product | null = null
  try {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 120 }, // ISR
    })
    if (res.ok) {
      const data = await res.json()
      product = (data.product || data) as Product
    }
  } catch {
    // swallow; product stays null
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-10 text-center border border-[var(--border)] bg-[var(--card)] rounded-2xl">
          <h1 className="poppins-light text-2xl text-[var(--fg)] mb-2">Product not found</h1>
          <p className="text-[var(--fg-muted)] mb-6">Please browse our collection.</p>
          <a href="/shop" className="btn-outline rounded-full px-5 py-2">Back to Shop</a>
        </Card>
      </main>
    )
  }

  const price = formatPriceFromCents(product.base_price_cents || 0)
  const gallery = (product.images?.length ? product.images : [{ url: "/lifestyle-1.jpg", alt: product.title }]).slice(0, 4)

  return (
    <main className="bg-[var(--bg)]">
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-[1280px] px-4 pt-6 text-sm text-[var(--fg-muted)]">
        <Link href="/shop" className="hover:opacity-80">Shop</Link>
        <span className="px-2">/</span>
        <span className="text-[var(--fg)]">{product.title}</span>
      </nav>
      <div className="mx-auto max-w-[1280px] px-4 mt-4">
        <Link href="/shop" className="btn btn-outline">
          Back to Shop
        </Link>
      </div>

      {/* Fabric Selector - First thing on the page */}
      <section className="mx-auto max-w-[1280px] px-4 py-10">
        <FabricSelector />
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <Image
              src={gallery[0].url}
              alt={gallery[0].alt || product.title}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {gallery.slice(1).map((img, i) => (
                <div
                  key={img._id || img.id || `${img.url}-${i}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.title}
                    fill
                    sizes="(max-width:1024px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-8">
          <header>
            <h1 className="poppins-light text-[32px] md:text-[40px] leading-tight text-[var(--fg)]">
              {product.title}
            </h1>
            <div className="poppins-regular text-[24px] md:text-[28px] text-[var(--fg)] mt-2">
              {price}
            </div>
            <p className="poppins-extralight text-[var(--fg-muted)] mt-3 max-w-prose">
              {product.description || "Minimal outdoor comfort. Weather-ready. Designed for calm spaces."}
            </p>
          </header>

          {/* Meta */}
          <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
            <li><span className="text-[var(--fg)]">Product ID:</span> {product._id || product.id}</li>
            <li><span className="text-[var(--fg)]">Slug:</span> {product.slug}</li>
          </ul>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <AddToCartButton product={product} />
          </div>

          {/* Pill highlights */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Weather-resistant fabric",  "Easy-care"].map((t) => (
              <span
                key={t}
                className="text-[11px] uppercase tracking-wide text-[var(--fg-muted)] border border-[var(--border)] rounded-full px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Long form details */}
      <section id="details" className="mx-auto max-w-[1280px] px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Fabric & Care", copy: "Fade-safe outdoor fabric. Clean with mild soap and water. Air-dry flat." },
            { title: "Build", copy: " Durable cover, premium filling for support." },
            { title: "Delivery", copy: "Nationwide delivery. Typical lead time 3–7 working days depending on stock." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="poppins-light text-[var(--fg)] text-xl mb-2">{s.title}</h3>
              <p className="text-[var(--fg-muted)]">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
