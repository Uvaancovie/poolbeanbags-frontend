import Image from 'next/image';

const images = [
  { src: '/lifestyle-3.jpg', alt: 'Luxury outdoor living space' },
  { src: '/lifestyle-5.jpg', alt: 'Comfortable poolside seating' },
  { src: '/lifestyle-6.jpg', alt: 'Premium outdoor furnishings' },
  { src: '/colors.jpg', alt: 'Colorful pool bean bags' },
  { src: '/dog.jpg', alt: 'Pet-friendly outdoor comfort' },
];

export default function LandingGallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}