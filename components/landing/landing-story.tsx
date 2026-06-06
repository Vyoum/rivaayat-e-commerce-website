import Link from "next/link"
import { StampPhotoFrame } from "@/components/landing/stamp-photo-frame"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const storyImages = [
  {
    src: "/indian-brass-craftsman-working-traditional-temple-.jpg",
    alt: "Artisan table setting with brass vessels",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=650&fit=crop&q=80",
    alt: "Traditional living space with textiles",
  },
  {
    src: "/intricate-brass-temple-jewelry-earrings-with-tradi.jpg",
    alt: "Close-up of gold traditional jewellery",
  },
  {
    src: "/indian-artisan-weaving-handloom-fabric.jpg",
    alt: "Artisan hands at work on craft",
  },
]

export function LandingStory() {
  return (
    <section className="relative z-10 px-5 py-10 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-[960px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:items-start">
        <div className="mx-auto grid w-full max-w-[340px] grid-cols-2 gap-3 sm:max-w-none sm:gap-3.5 lg:max-w-[400px]">
          {storyImages.map((img) => (
            <StampPhotoFrame key={img.src} src={img.src} alt={img.alt} />
          ))}
        </div>

        <div className="lg:pt-1">
          <p className="landing-label text-[10px] text-[#B85A32]">Our Story</p>

          <h2 className="mt-3 text-[28px] leading-[1.22] sm:text-[32px]">
            <span className="landing-brand block text-[#8A9DAA]">{HOUSE_OF_INDIKA} —</span>
            <span className="landing-display-italic block text-[#7D5A44]">A Heritage of Hope</span>
          </h2>

          <div className="mt-5 space-y-4 landing-body text-[15px]">
            <p>
              House of Indika was born from a simple belief — that the beauty of handmade Indian
              craft deserves to live in contemporary homes, and that the artisans who create it
              deserve dignity, fair wages, and a platform to share their stories with the world.
            </p>
            <p>
              We partner directly with rural makers across India — weavers, potters, jewellers,
              and food artisans — curating each piece with the same care they put into making it.
            </p>
          </div>

          <blockquote className="landing-quote my-6 border-l border-[#B85A32]/70 pl-4 text-[14px] leading-[1.65]">
            Each purchase you make empowers rural artisans and helps revive the beauty of
            India&apos;s handmade traditions.
          </blockquote>

          <Link
            href="/outerboxdesign"
            className="landing-btn inline-block border-b border-[#B85A32] pb-0.5 text-[#B85A32] transition-colors hover:text-[#A04E2A] hover:border-[#A04E2A]"
          >
            Learn More About Our Journey →
          </Link>
        </div>
      </div>
    </section>
  )
}
