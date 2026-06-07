"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Award, Clock, Sparkles } from "lucide-react"

import type { ArtisanPageContent } from "@/lib/artisan-page-content-shared"
import { DEFAULT_ARTISAN_PAGE_CONTENT } from "@/lib/artisan-page-content-shared"

const credentialIcons = [Award, Clock, Sparkles]

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

type ArtisanProfileContentProps = {
  content?: ArtisanPageContent
}

export function ArtisanProfileContent({
  content = DEFAULT_ARTISAN_PAGE_CONTENT,
}: ArtisanProfileContentProps) {
  const videoHref = content.videoUrl.trim()

  return (
    <>
      <section className="relative h-[520px] sm:h-[580px] lg:h-[640px]">
        <Image
          src={content.heroImageUrl}
          alt={`${content.name} at work`}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-[#FDF8F4]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-white/90 uppercase">
            {content.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[44px] font-normal leading-tight text-white sm:text-[52px] lg:text-[58px]">
            {content.name}
          </h1>
          <p className="mt-3 font-serif text-[18px] italic text-white/90 sm:text-[20px]">
            {content.tagline}
          </p>
        </div>
      </section>

      <section className="bg-[#FDF8F4] px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_340px] lg:gap-16 xl:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-serif text-[32px] font-normal text-[#3D2E24] sm:text-[36px]">
              {content.biographyTitle}
            </h2>

            <div className="mt-8 space-y-5 font-serif text-[16px] leading-[1.85] text-[#6B5344] sm:text-[17px]">
              {content.biographyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="mt-10 border-l-2 border-[#C4A882] pl-6 font-serif text-[18px] italic leading-relaxed text-[#6B5344] sm:text-[19px]">
              &ldquo;{content.quote}&rdquo;
            </blockquote>
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-xl border border-[#E8E0D4] bg-white p-7 shadow-[0_4px_24px_rgba(61,46,36,0.06)]">
              <h3 className="font-serif text-[22px] font-normal text-[#3D2E24]">
                Artisan Credentials
              </h3>

              <ul className="mt-7 space-y-6">
                {content.credentials.map((item, index) => {
                  const Icon = credentialIcons[index] ?? Award
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

      <section className="bg-[#FDF8F4] px-6 pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-[32px] font-normal text-[#3D2E24] sm:text-[36px]">
            {content.videoTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-[16px] italic leading-relaxed text-[#9A8070] sm:text-[17px]">
            {content.videoSubtitle}
          </p>

          <div className="relative mx-auto mt-12 max-w-3xl">
            <span className="absolute -left-2 -top-2 size-6 rounded-full border border-[#C4A882]/60" />
            <span className="absolute -right-2 -top-2 size-6 rounded-full border border-[#C4A882]/60" />
            <span className="absolute -bottom-2 -left-2 size-6 rounded-full border border-[#C4A882]/60" />
            <span className="absolute -bottom-2 -right-2 size-6 rounded-full border border-[#C4A882]/60" />

            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#EDE8DC]">
              <Image
                src={content.videoThumbnailUrl}
                alt="Video preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-black/20" />

              {videoHref ? (
                <a
                  href={videoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Play video — ${content.videoCtaLabel}`}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-black/10"
                >
                  <span className="flex size-[64px] items-center justify-center rounded-full bg-[#7B5E43] shadow-lg transition-transform hover:scale-105">
                    <Play className="ml-1 size-6 fill-white text-white" />
                  </span>
                  <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
                    {content.videoCtaLabel}
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  aria-label={`Play video — ${content.videoCtaLabel}`}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-black/10"
                >
                  <span className="flex size-[64px] items-center justify-center rounded-full bg-[#7B5E43] shadow-lg transition-transform hover:scale-105">
                    <Play className="ml-1 size-6 fill-white text-white" />
                  </span>
                  <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
                    {content.videoCtaLabel}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FDF8F4] px-6 pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-serif text-[32px] font-normal text-[#3D2E24] sm:text-[36px]">
            {content.handpickedTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-[14px] text-[#9A8070]">
            {content.handpickedSubtitle}
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
