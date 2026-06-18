import Link from "next/link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { CategoryCardsManager } from "./category-cards-manager"
import { HeroSlideshowManager } from "./hero-slideshow-manager"
import { HomepageStoryManager } from "./homepage-story-manager"
import { ChevronRight, FileText, PenLine, Sparkles } from "lucide-react"

const otherContentItems = [
  {
    title: "Artisan Stories",
    description: "Featured profiles and craft narratives on the homepage.",
    count: 12,
    icon: PenLine,
  },
  {
    title: "Blog Posts",
    description: "Editorial articles about heritage crafts and makers.",
    count: 8,
    icon: FileText,
  },
]

export function ContentPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-[26px] font-semibold text-[#2D1E17]">
                Content
              </h1>
              <p className="mt-1 text-[13px] text-[#9A8070]">
                Manage stories, blog posts, and media across {HOUSE_OF_INDIKA}.
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/50 p-5 shadow-sm">
            <HeroSlideshowManager compact />
          </section>

          <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/50 p-5 shadow-sm">
            <HomepageStoryManager compact />
          </section>

          <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/50 p-5 shadow-sm">
            <CategoryCardsManager compact />
          </section>

          <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/50 p-5 shadow-sm">
            <Link
              href="/admin/content/custom-orders"
              className="group flex items-center justify-between gap-4 rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm transition-colors hover:border-[#C4A882] hover:bg-[#FFFCF8]"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F5EDE3]">
                  <Sparkles className="size-5 text-[#6B5344]" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-serif text-[20px] font-semibold text-[#2D1E17] group-hover:text-[#5C4332]">
                    Custom Order
                  </h2>
                  <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#9A8070]">
                    Edit category names, starting prices, form sections, and per-option pricing for
                    the public custom orders page.
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 shrink-0 text-[#C4B5A5] transition-transform group-hover:translate-x-0.5 group-hover:text-[#6B5344]" />
            </Link>
          </section>

          <div>
            <h2 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
              More Content
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {otherContentItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#F5EDE3]">
                    <item.icon className="size-5 text-[#6B5344]" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-serif text-[18px] font-semibold text-[#2D1E17]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">
                    {item.description}
                  </p>
                  <p className="mt-3 text-[22px] font-semibold text-[#2D1E17]">
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
            <h2 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
              Quick Links
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/admin/our-story"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Our Story Page
              </Link>
              <Link
                href="/admin/community/artisans"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Artisan Profiles
              </Link>
              <Link
                href="/admin/store/products"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Product Catalogue
              </Link>
              <Link
                href="/admin/content/custom-orders"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Custom Order
              </Link>
              <Link
                href="/admin/commerce/custom-orders"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Custom Order Inbox
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
