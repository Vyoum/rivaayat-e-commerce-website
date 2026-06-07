import Link from "next/link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { FileText, Image, PenLine, Plus } from "lucide-react"

const contentItems = [
  {
    title: "Hero Slideshow",
    description: "Homepage background images — up to 5 rotating hero photos.",
    count: "Manage",
    icon: Image,
    href: "/admin/content/hero",
  },
  {
    title: "Artisan Stories",
    description: "Featured profiles and craft narratives on the homepage.",
    count: 12,
    icon: PenLine,
    href: null,
  },
  {
    title: "Blog Posts",
    description: "Editorial articles about heritage crafts and makers.",
    count: 8,
    icon: FileText,
    href: null,
  },
  {
    title: "Media Library",
    description: "Images and videos used across the storefront.",
    count: 156,
    icon: Image,
    href: null,
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
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl bg-[#2D1E17] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21]"
            >
              <Plus className="size-4" />
              New Content
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {contentItems.map((item) => {
              const card = (
                <>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#F5EDE3]">
                    <item.icon className="size-5 text-[#6B5344]" strokeWidth={1.75} />
                  </div>
                  <h2 className="mt-4 font-serif text-[18px] font-semibold text-[#2D1E17]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">
                    {item.description}
                  </p>
                  <p className="mt-3 text-[22px] font-semibold text-[#2D1E17]">
                    {item.count}
                  </p>
                </>
              )

              return item.href ? (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm"
                >
                  {card}
                </div>
              )
            })}
          </div>

          <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
            <h2 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
              Quick Links
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/admin/content/hero"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Hero Slideshow
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
                href="/admin/commerce/custom-orders"
                className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
              >
                Custom Order Stories
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
