import LuxCarousel from '@/components/LuxCarousel';
import LandingGallery from '@/components/LandingGallery';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LuxCarousel />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="h1 text-center mb-12">Inspiration</h2>
          <LandingGallery />
        </div>
      </section>
    </main>
  );
}