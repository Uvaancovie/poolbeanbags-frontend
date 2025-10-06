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
      {/* Top announcement bar with yellow accent */}
      <div className="w-full bg-yellow-400 text-black">
        <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">
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
                src="/lifestyle.jpg"
                alt="Poolside beanbag lifestyle"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] lifestyle-image"
              />
              <div className="absolute -bottom-6 -left-6 hidden sm:block">
                <Card className="shadow-xl bg-white border-2 border-blue-600">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Waves className="h-5 w-5 text-blue-600" />
                    <div className="text-sm">
                      <div className="font-medium">Water‑Ready</div>
                      <div className="text-gray-600">Drains fast • Quick‑dry</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons with colorful accents */}
      <section id="features" className="bg-white border-t-4 border-blue-600">
        <div className="container mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
          <Feature icon={<Sun className="h-6 w-6 text-yellow-400"/>} title="UV‑Resistant" desc="Fade‑resistant outdoor fabrics built for SA summers." />
          <Feature icon={<Shield className="h-6 w-6 text-green-500"/>} title="Chlorine‑Friendly" desc="Durable inner liners and double‑stitched seams." />
          <Feature icon={<Waves className="h-6 w-6 text-blue-600"/>} title="Float & Lounge" desc="Perfect buoyancy for poolside relaxation." />
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
            { title: "Lagoon Lounger XL", price: 'REQUEST', img: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482104864_654458160412646_5150646072672586476_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFKhQv0VAZIafatMlSWjP-Cl-gHcyWUTL6X6AdzJZRMvpVj7MTu772J-sKwePhsXHNlq-U0YvPK7k-XpXeWQWWz&_nc_ohc=7V13XAaepCgQ7kNvwFd7kys&_nc_oc=AdlOzO4Tc1vwB_ufL-7_JUUwLnmyQtGUe2554dtdUgcTNR4324Gf2XSEIE6LDUzdM2Q&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=rM2LkcHpV_sFnFTxAZgJEg&oh=00_Afby29WUtxt13UnEtMnLo0i85RvoBsq6z8qCNeww-tjFrQ&oe=68E0E84E" },
            { title: "Coastal Classic", price: 'REQUEST', img: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482015573_654458087079320_8802058203799933298_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFaRMLiBRZx4eo98umpOdWN70s4UeKq_aDvSzhR4qr9oCx6YnLAPeebEBLgtpUbCkK0kKkWHo6hv_bNf8E1mAsI&_nc_ohc=li5yTUcKQzMQ7kNvwH59hmB&_nc_oc=AdmJErDYV8kSzJTqiO7s3p3nqAHXMGSFLrSPSoG1u-1A6z4ak-qSRKkTt-r7NVv3WcQ&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=zYM8LUjheTBbfuri48d0xw&oh=00_Afa6OAFfiovfFUDJNIIZJpvNdiQU0DqMxJRtkL_h5u73Sg&oe=68E0B5FD" },
            { title: "Deck Drop Bean", price: 'REQUEST', img: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/482014020_654458050412657_2759176278776703604_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEpi5NW8BCnfCdTaMsijyAUfGjuOWiNAAt8aO45aI0AC_6L4kcTcYC3P30Gp7CtXZ_Tc0V1IzWqiC6JKLoCskYU&_nc_ohc=ZsgjX2RVVM4Q7kNvwGJa9z-&_nc_oc=AdlwsBscXVhGu4c4K7ZpGJ6zpRCbz5SQfIVj0GsQm8yZgNJDxkukWp0JiIowQ4PZw78&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=KPhZ2LprXlSey2pMhDPj6Q&oh=00_AfZCt4rKcDnKv67GFCa2FZMUpbA11plBp7zGiewjVg9hbQ&oe=68E0B7EC" },
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

      {/* Lifestyle Gallery - Showcasing all images */}
      <section id="lifestyle" className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            <span className="text-blue-600">Live</span> the Pool Life
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            See how our beanbags bring comfort, style, and vibrant colors to poolside moments
          </p>
          
          {/* Main featured grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2 row-span-2">
              <img src="/lifestyle-1.jpg" alt="Pool beanbag lifestyle" className="rounded-xl shadow-lg w-full h-full object-cover lifestyle-image" />
            </div>
            <div>
              <img src="/lifestyle-2.jpg" alt="Colorful pool beanbags" className="rounded-xl shadow-lg w-full h-full object-cover lifestyle-image" />
            </div>
            <div>
              <img src="/lifestyle-3.jpg" alt="Family poolside" className="rounded-xl shadow-lg w-full h-full object-cover lifestyle-image" />
            </div>
            <div>
              <img src="/lifestyle-5.jpg" alt="Pool beanbag close-up" className="rounded-xl shadow-lg w-full h-full object-cover lifestyle-image" />
            </div>
            <div>
              <img src="/lifestyle.jpg" alt="Lifestyle shot" className="rounded-xl shadow-lg w-full h-full object-cover lifestyle-image" />
            </div>
          </div>

          {/* Secondary row with themed images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group">
              <img src="/colors.jpg" alt="Color patterns" className="rounded-xl shadow-lg w-full h-48 object-cover lifestyle-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-semibold text-sm">Bold Colors</span>
              </div>
            </div>
            <div className="relative group">
              <img src="/patterns.jpg" alt="Pattern designs" className="rounded-xl shadow-lg w-full h-48 object-cover lifestyle-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-semibold text-sm">Fun Patterns</span>
              </div>
            </div>
            <div className="relative group">
              <img src="/family.jpg" alt="Family enjoying pool" className="rounded-xl shadow-lg w-full h-48 object-cover lifestyle-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-semibold text-sm">Family Fun</span>
              </div>
            </div>
            <div className="relative group">
              <img src="/dog.jpg" alt="Dog-friendly pool beanbags" className="rounded-xl shadow-lg w-full h-48 object-cover lifestyle-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-semibold text-sm">Pet Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric & Colours */}
      <section id="fabric" className="bg-white py-16 border-t-4 border-pink-500">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Palette className="h-6 w-6 text-pink-500"/> Fabrics & Colours
              </h2>
              <p className="mt-2 text-gray-600 max-w-prose">
                Choose from marine‑grade canvas and outdoor‑performance fabrics. Removable, washable covers with heavy‑duty zips and double‑stitched seams.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveColor(c.name)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      activeColor === c.name 
                        ? "bg-blue-600 text-white shadow-lg scale-105" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    aria-label={`Select ${c.name}`}
                  >
                    <span className="mr-2 inline-block h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <Leaf className="h-4 w-4 text-green-600"/> Quick‑dry fill
                </span>
                <span className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <Sun className="h-4 w-4 text-yellow-600"/> UV 50+ rated
                </span>
                <span className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Shield className="h-4 w-4 text-blue-600"/> 2‑Year warranty
                </span>
              </div>
            </div>
            <div>
              <img
                src="/patterns.jpg"
                alt="Colorful fabric patterns and prints"
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] lifestyle-image border-4 border-yellow-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews with colorful accent borders */}
      <section id="reviews" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Loved by <span className="text-blue-600">SA Households</span>
        </h2>
        <p className="text-gray-600 text-center">Real comfort. Real quality.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-yellow-400 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "Super comfy and perfect for our Durban heat. Kids basically live on these in the pool. Quality stitching and dries fast!"
              </p>
              <div className="mt-4 text-sm font-semibold text-black">Aisha • Umhlanga</div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-pink-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "The bright colors match our pool deck vibe perfectly! Love the patterns and the quality is unbeatable. Worth every cent!"
              </p>
              <div className="mt-4 text-sm font-semibold text-black">Thabo • Johannesburg</div>
            </CardContent>
          </Card>
          <Card className="border-t-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                "Best purchase ever! Floats perfectly, dries quickly, and the kids love the fun designs. Highly recommend for SA summers!"
              </p>
              <div className="mt-4 text-sm font-semibold text-black">Sarah • Cape Town</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Store info with colorful icons */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
          <StorePill icon={<Truck className="h-5 w-5 text-blue-600"/>} title="Nationwide Delivery" desc="3–5 business days to main centres"/>
          <StorePill icon={<MapPin className="h-5 w-5 text-pink-500"/>} title="KZN Pickup" desc="Durban North (by appointment)"/>
          <StorePill icon={<Shield className="h-5 w-5 text-green-500"/>} title="Secure Payments" desc="Ozow Instant EFT"/>
        </div>
      </section>

      {/* CTA with bold blue gradient */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-8 md:p-12 shadow-2xl border-4 border-yellow-400">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to level up your pool days?</h3>
          <p className="text-white/90 mt-2 max-w-prose">
            Choose your size, pick a colour, and float into the weekend.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <ShoppingCart className="h-4 w-4"/> Shop Beanbags
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with black background and colorful accents */}
      <footer className="bg-black text-white border-t-4 border-blue-600">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-lg font-bold text-blue-400">Pool Beanbags</div>
            <p className="text-sm text-gray-400 mt-2">Premium outdoor beanbags engineered for South African summers.</p>
          </div>
          <div>
            <div className="font-semibold mb-2 text-yellow-400">Shop</div>
            <ul className="space-y-1 text-sm">
              <li><a className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
              <li><a className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
              <li><a className="text-gray-400 hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-pink-400">Company</div>
            <ul className="space-y-1 text-sm">
              <li><a className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a className="text-gray-400 hover:text-white transition-colors">Announcements</a></li>
              <li><a className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2 text-green-400">Help</div>
            <ul className="space-y-1 text-sm">
              <li><a className="text-gray-400 hover:text-white transition-colors">Shipping</a></li>
              <li><a className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a className="text-gray-400 hover:text-white transition-colors">Care Guide</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Pool Beanbags. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <div className="font-semibold text-black">{title}</div>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function StorePill({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white border-2 border-gray-200 p-5 flex items-center gap-4 hover:border-blue-600 hover:shadow-lg transition-all">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <div className="font-semibold text-black">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
    </div>
  );
}
