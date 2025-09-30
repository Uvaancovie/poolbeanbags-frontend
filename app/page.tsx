'use client';

import { useState } from "react";
import Link from "next/link";

// Minimal local UI components and icon placeholders so this page compiles
function Button({ children, className = '', variant, ...rest }: any) {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2';
  const cls = `${base} ${className}`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

function Card({ children, className = '', ...rest }: any) {
  return (
    <div className={`rounded-xl bg-white ${className}`} {...rest}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '', ...rest }: any) {
  return (
    <div className={`p-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

function Badge({ children, className = '', ...rest }: any) {
  return (
    <div className={`inline-block px-2 py-1 rounded-full text-xs bg-gray-200 ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Very small icon placeholders (SVGs)
const Icon = ({ children }: any) => (
  <span className="inline-flex items-center">{children}</span>
);
const ShoppingCart = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 3h2l1 9h12" stroke="currentColor" fill="none"/></svg></Icon>;
const Waves = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M2 12c4-4 8 4 12 0s8 4 12 0" stroke="currentColor" fill="none"/></svg></Icon>;
const Sun = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="4"/></svg></Icon>;
const Shield = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 3l8 4v5c0 5-3 9-8 11-5-2-8-6-8-11V7z"/></svg></Icon>;
const Truck = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><rect x="1" y="7" width="13" height="7"/><path d="M14 10h6v4"/></svg></Icon>;
const CheckCircle2 = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4" stroke="currentColor" fill="none"/></svg></Icon>;
const Star = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2l2.9 6.26L21 9.27l-5 4.87L17.8 21 12 17.77 6.2 21 7 14.14 2 9.27l6.1-1.01L12 2z"/></svg></Icon>;
const ArrowRight = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" fill="none"/></svg></Icon>;
const MapPin = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg></Icon>;
const Leaf = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 4c-2 4-6 6-10 8-4 2-8 6-10 12 6-2 10-6 12-10 2-4 4-8 8-10z"/></svg></Icon>;
const Palette = (p: any) => <Icon><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2a10 10 0 100 20c1.1 0 2-.9 2-2 0-1.7-1.6-3-3.5-3C9 17 7 15 7 12 7 7.6 9.6 4 12 2z"/></svg></Icon>;

// NOTE: This is a single-file React page component you can drop into a Next.js App Router project
// (e.g., app/page.tsx). It uses Tailwind + shadcn/ui + daisyUI utility classes.
// Replace placeholder images/links with your real assets.

export default function LandingPage() {
  const [activeColor, setActiveColor] = useState("Navy");
  const colors = [
    { name: "Navy", hex: "#1f3b73" },
    { name: "Turquoise", hex: "#30c1c9" },
    { name: "Sand", hex: "#d8c9a3" },
    { name: "Charcoal", hex: "#2f2f2f" },
    { name: "Coral", hex: "#ff7b6e" },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Top announcement bar */}
      <div className="w-full bg-primary text-primary-content">
        <div className="container mx-auto px-4 py-2 text-center text-sm">
          Summer Special 🌞 — Save 10% on all Pool Beanbags this week only!
        </div>
      </div>

      {/* Navbar is rendered globally from app/layout.tsx */}

      {/* Hero */}
      <section className="hero bg-base-100">
        <div className="hero-content container mx-auto px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="uppercase">Durban • South Africa</Badge>
              <Badge className="uppercase" variant="default">Water‑Lounge Comfort</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Float. Lounge. <span className="text-primary">Unwind.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Premium, UV‑resistant pool beanbags designed for lazy days and stylish decks.
              Built for SA sun. Made to last.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button className="btn btn-primary gap-2">
                  Shop Pool Beanbags <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/announcements">
                <Button variant="outline" className="btn gap-2">
                  See Collections
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success"/> 2‑Year Stitch Guarantee</span>
              <span className="flex items-center gap-2"><Truck className="h-4 w-4"/> Nationwide Delivery</span>
            </div>
          </div>
          <div>
            <div className="relative">
              <img
                src="https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482059248_654439077081221_5807789097237605750_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG24KbBw_TYkVb6CLdV8FFdzg6seDtjga7ODqx4O2OBrobfyiyo37FvxNWiUbsVTpFhNMmVaxGqinFGT8ExxXnc&_nc_ohc=pmc1UyoaRNwQ7kNvwHuQoC3&_nc_oc=AdntERyzEuIAf1i7oJa99ngSshYjjN7VWBx7qlxOegVkW3Iof1KpYCSDpriQo0JiqlE&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=iWB7IbkLT0CqCPgxEMdpgw&oh=00_Afbx0LJDZFNY_DSJ-TVanp6uJCQIO6j3v4jHxrmcHvOYQQ&oe=68E0D854"
                alt="Poolside beanbag"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 hidden sm:block">
                <Card className="shadow-xl">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Waves className="h-5 w-5" />
                    <div className="text-sm">
                      <div className="font-medium">Water‑Ready</div>
                      <div className="text-muted-foreground">Drains fast • Quick‑dry</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons */}
      <section id="features" className="bg-base-200">
        <div className="container mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
          <Feature icon={<Sun className="h-6 w-6"/>} title="UV‑Resistant" desc="Fade‑resistant outdoor fabrics built for SA summers." />
          <Feature icon={<Shield className="h-6 w-6"/>} title="Chlorine‑Friendly" desc="Durable inner liners and double‑stitched seams." />
          <Feature icon={<Waves className="h-6 w-6"/>} title="Float & Lounge" desc="Perfect buoyancy for poolside relaxation." />
        </div>
      </section>

      {/* Bestsellers */}
      <section id="bestsellers" className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Bestsellers</h2>
            <p className="text-muted-foreground">Our most‑loved shapes and colours</p>
          </div>
          <a className="link link-primary">View all</a>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Lagoon Lounger XL", price: 2999, img: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482104864_654458160412646_5150646072672586476_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFKhQv0VAZIafatMlSWjP-Cl-gHcyWUTL6X6AdzJZRMvpVj7MTu772J-sKwePhsXHNlq-U0YvPK7k-XpXeWQWWz&_nc_ohc=7V13XAaepCgQ7kNvwFd7kys&_nc_oc=AdlOzO4Tc1vwB_ufL-7_JUUwLnmyQtGUe2554dtdUgcTNR4324Gf2XSEIE6LDUzdM2Q&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=rM2LkcHpV_sFnFTxAZgJEg&oh=00_Afby29WUtxt13UnEtMnLo0i85RvoBsq6z8qCNeww-tjFrQ&oe=68E0E84E" },
            { title: "Coastal Classic", price: 2399, img: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482015573_654458087079320_8802058203799933298_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFaRMLiBRZx4eo98umpOdWN70s4UeKq_aDvSzhR4qr9oCx6YnLAPeebEBLgtpUbCkK0kKkWHo6hv_bNf8E1mAsI&_nc_ohc=li5yTUcKQzMQ7kNvwH59hmB&_nc_oc=AdmJErDYV8kSzJTqiO7s3p3nqAHXMGSFLrSPSoG1u-1A6z4ak-qSRKkTt-r7NVv3WcQ&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=zYM8LUjheTBbfuri48d0xw&oh=00_Afa6OAFfiovfFUDJNIIZJpvNdiQU0DqMxJRtkL_h5u73Sg&oe=68E0B5FD" },
            { title: "Deck Drop Bean", price: 1999, img: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482014020_654458050412657_2759176278776703604_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEpi5NW8BCnfCdTaMsijyAUfGjuOWiNAAt8aO45aI0AC_6L4kcTcYC3P30Gp7CtXZ_Tc0V1IzWqiC6JKLoCskYU&_nc_ohc=ZsgjX2RVVM4Q7kNvwGJa9z-&_nc_oc=AdlwsBscXVhGu4c4K7ZpGJ6zpRCbz5SQfIVj0GsQm8yZgNJDxkukWp0JiIowQ4PZw78&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=KPhZ2LprXlSey2pMhDPj6Q&oh=00_AfZCt4rKcDnKv67GFCa2FZMUpbA11plBp7zGiewjVg9hbQ&oe=68E0B7EC" },
          ].map((p) => (
            <Card key={p.title} className="group overflow-hidden">
              <div className="relative">
                <img src={p.img} alt={p.title} className="w-full aspect-square object-cover transition duration-300 group-hover:scale-[1.02]"/>
                <Badge className="absolute left-3 top-3">New</Badge>
                <Button className="btn btn-primary absolute right-3 bottom-3 gap-2"><ShoppingCart className="h-4 w-4"/> Add</Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-primary font-bold">R {p.price.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fabric & Colours */}
      <section id="fabric" className="bg-base-200">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><Palette className="h-6 w-6"/> Fabrics & Colours</h2>
              <p className="mt-2 text-muted-foreground max-w-prose">
                Choose from marine‑grade canvas and outdoor‑performance fabrics. Removable, washable covers with heavy‑duty zips and double‑stitched seams.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveColor(c.name)}
                    className={`btn btn-sm ${activeColor === c.name ? "btn-primary" : "btn-outline"}`}
                    aria-label={`Select ${c.name}`}
                  >
                    <span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2"><Leaf className="h-4 w-4"/> Quick‑dry fill</span>
                <span className="flex items-center gap-2"><Sun className="h-4 w-4"/> UV 50+ rated</span>
                <span className="flex items-center gap-2"><Shield className="h-4 w-4"/> 2‑Year warranty</span>
              </div>
            </div>
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKFG_D8XfrOvKFxpqzaCFiTWK6TE3ebb6bsg&s"
                alt="Fabric detail"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Loved by SA Households</h2>
        <p className="text-muted-foreground">Real comfort. Real quality.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <Card key={i} className="">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 text-warning mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  "Super comfy and perfect for our Durban heat. Kids basically live on these in the pool. Quality stitching and dries fast!"
                </p>
                <div className="mt-4 text-sm font-semibold">Aisha • Umhlanga</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Store info */}
      <section className="bg-base-200">
        <div className="container mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
          <StorePill icon={<Truck className="h-5 w-5"/>} title="Nationwide Delivery" desc="3–5 business days to main centres"/>
          <StorePill icon={<MapPin className="h-5 w-5"/>} title="KZN Pickup" desc="Durban North (by appointment)"/>
          <StorePill icon={<Shield className="h-5 w-5"/>} title="Secure Payments" desc="Ozow Instant EFT"/>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-transparent p-8 md:p-12 border">
          <h3 className="text-2xl md:text-3xl font-bold">Ready to level up your pool days?</h3>
          <p className="text-muted-foreground mt-2 max-w-prose">
            Choose your size, pick a colour, and float into the weekend.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button className="btn btn-primary gap-2"><ShoppingCart className="h-4 w-4"/> Shop Beanbags</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="btn">Talk to Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-200 border-t">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-lg font-bold">Pool Beanbags</div>
            <p className="text-sm text-muted-foreground mt-2">Premium outdoor beanbags engineered for South African summers.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Shop</div>
            <ul className="space-y-1 text-sm">
              <li><a className="link link-hover">All Products</a></li>
              <li><a className="link link-hover">New Arrivals</a></li>
              <li><a className="link link-hover">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Company</div>
            <ul className="space-y-1 text-sm">
              <li><a className="link link-hover">About</a></li>
              <li><a className="link link-hover">Announcements</a></li>
              <li><a className="link link-hover">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Help</div>
            <ul className="space-y-1 text-sm">
              <li><a className="link link-hover">Shipping</a></li>
              <li><a className="link link-hover">Returns</a></li>
              <li><a className="link link-hover">Care Guide</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pool Beanbags. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-3">
          <div className="btn btn-circle btn-ghost btn-sm">{icon}</div>
          <div className="font-semibold">{title}</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function StorePill({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-base-100 border p-5 flex items-center gap-4">
      <div className="btn btn-sm btn-circle btn-ghost">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
