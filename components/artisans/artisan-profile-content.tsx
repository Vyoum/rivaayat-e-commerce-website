"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Award, Clock, Sparkles } from "lucide-react"

const credentials = [
  {
    icon: Award,
    title: "100% Handloomed",
    description: "Authentic handloom weaving process.",
  },
  {
    icon: Clock,
    title: "25+ Years Experience",
    description: "A lifetime dedicated to mastering the craft.",
  },
  {
    icon: Sparkles,
    title: "Honored Techniques",
    description: "Hansa-Zari borders, Chata-Dandi patterns.",
  },
]

const handpickedProducts = [
  {
    id: "1",
    name: "Neelam Maheshwari Saree",
    price: "₹ 14,500",
    image:
      "https://images.unsplash.com/photo-1610030318558-78a395d62a42?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Milli Striped Dupatta",
    price: "₹ 4,500",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Panna Zari Stole",
    price: "₹ 6,800",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d5d?w=600&h=800&fit=crop&q=80",
  },
]

function ArchedProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[220px] overflow-hidden rounded-t-[999px] rounded-b-md bg-[#EDE8DC] aspect-[3/4]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="220px" />
    </div>
  )
}

export function ArtisanProfileContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[520px] sm:h-[580px] lg:h-[640px]">
        <Image
          src="/indian-artisan-weaving-handloom-fabric.jpg"
          alt="Devendra Khatri weaving at his loom"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-[#FDF8F4]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-white/90 uppercase">
            Master Weaver · Maheshwar
          </p>
          <h1 className="mt-4 font-serif text-[44px] font-normal leading-tight text-white sm:text-[52px] lg:text-[58px]">
            Devendra Khatri
          </h1>
          <p className="mt-3 font-serif text-[18px] italic text-white/90 sm:text-[20px]">
            Weaving the Threads of Tradition
          </p>
        </div>
      </section>

      {/* Biography + Credentials */}
      <section className="bg-[#FDF8F4] px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_340px] lg:gap-16 xl:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-serif text-[32px] font-normal text-[#3D2E24] sm:text-[36px]">
              The Loom as a Sanctuary
            </h2>

            <div className="mt-8 space-y-5 font-serif text-[16px] leading-[1.85] text-[#6B5344] sm:text-[17px]">
              <p>
                In the quiet lanes of Maheshwar, where the Narmada flows with ancient grace, Devendra
                Khatri has spent more than two decades at his loom — not merely weaving fabric, but
                preserving a lineage of Maheshwari craft passed down through generations of master
                weavers.
              </p>
              <p>
                Each saree, dupatta, and stole that leaves his workshop carries the rhythm of the
                shuttle, the patience of hand-spun thread, and the distinctive geometry of borders
                that have made Maheshwar textiles beloved across India and beyond.
              </p>
              <p>
                For Devendra, the loom is not a machine of production. It is a place of meditation,
                memory, and meaning — where every warp and weft holds the story of a craft that refuses
                to be hurried.
              </p>
            </div>

            <blockquote className="mt-10 border-l-2 border-[#C4A882] pl-6 font-serif text-[18px] italic leading-relaxed text-[#6B5344] sm:text-[19px]">
              &ldquo;When I weave, I am not just creating cloth. I am holding a conversation with my
              ancestors. The loom is my sanctuary, and the thread is my voice.&rdquo;
            </blockquote>
          </div>

          {/* Credentials card */}
          <aside className="lg:pt-2">
            <div className="rounded-xl border border-[#E8E0D4] bg-white p-7 shadow-[0_4px_24px_rgba(61,46,36,0.06)]">
              <h3 className="font-serif text-[22px] font-normal text-[#3D2E24]">
                Artisan Credentials
              </h3>

              <ul className="mt-7 space-y-6">
                {credentials.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title} className="flex gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8]">
                        <Icon className="size-[16px] text-[#846246]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#3D2E24] uppercase">
                          {item.title}
                        </p>
                        <p className="mt-1 font-sans text-[13px] leading-relaxed text-[#9A8070]">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <button
                type="button"
                className="mt-8 w-full bg-[#7B5E43] py-3.5 font-sans text-[12px] font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#6B5344]"
              >
                Support this craft
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Video section */}
      <section className="bg-[#FDF8F4] px-6 pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-[32px] font-normal text-[#3D2E24] sm:text-[36px]">
            The Rhythm of the Loom in Motion
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-[16px] italic leading-relaxed text-[#9A8070] sm:text-[17px]">
            A symphony of shuttle and thread, woven slow to the pace of the heartbeat.
          </p>

          <div className="relative mx-auto mt-12 max-w-3xl">
            {/* Decorative corner accents */}
            <span className="absolute -left-2 -top-2 size-6 rounded-full border border-[#C4A882]/60" />
            <span className="absolute -right-2 -top-2 size-6 rounded-full border border-[#C4A882]/60" />
            <span className="absolute -bottom-2 -left-2 size-6 rounded-full border border-[#C4A882]/60" />
            <span className="absolute -bottom-2 -right-2 size-6 rounded-full border border-[#C4A882]/60" />

            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#EDE8DC]">
              <Image
                src="/indian-artisan-woman-weaving-traditional-handloom-.jpg"
                alt="Close-up of loom in motion"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-black/20" />

              <button
                type="button"
                aria-label="Play video — Watch the Weaver's Song"
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-black/10"
              >
                <span className="flex size-[64px] items-center justify-center rounded-full bg-[#7B5E43] shadow-lg transition-transform hover:scale-105">
                  <Play className="ml-1 size-6 fill-white text-white" />
                </span>
                <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
                  Watch the Weaver&apos;s Song
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Handpicked products */}
      <section className="bg-[#FDF8F4] px-6 pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-[32px] font-normal text-[#3D2E24] sm:text-[36px]">
            Handpicked by Devendra
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-[14px] text-[#9A8070]">
            Discover the signature weaves that define his legacy…
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {handpickedProducts.map((product) => (
              <Link
                key={product.id}
                href="/products/mandala-crochet-earrings"
                className="group block"
              >
                <ArchedProductImage src={product.image} alt={product.name} />
                <div className="mt-5 text-center">
                  <p className="font-serif text-[17px] text-[#3D2E24] transition-colors group-hover:text-[#846246]">
                    {product.name}
                  </p>
                  <p className="mt-1 font-sans text-[14px] text-[#6B5344]">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
