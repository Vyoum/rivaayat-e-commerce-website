"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  X,
  Sparkles,
  Bold,
  Italic,
  List,
  Video,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

const artisans = [
  {
    name: "Asha Devi",
    craft: "Block Printing Master",
    location: "Rajasthan",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
    products: 12,
    orders: 342,
    images: [
      "https://images.unsplash.com/photo-1610030469667-67a0b47a8537?w=40&h=40&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=40&h=40&fit=crop",
    ],
  },
  {
    name: "Meera Devi",
    craft: "Silver Jewellery Artisan",
    location: "Rajasthan",
    initials: "MD",
    products: 18,
    orders: 256,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=40&h=40&fit=crop",
    ],
  },
  {
    name: "Dev Kumar",
    craft: "Master Potter",
    location: "Gujarat",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    products: 8,
    orders: 189,
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=40&h=40&fit=crop",
    ],
  },
]

export function ArtisansPage() {
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F5F2ED]">
        <header className="flex h-[52px] items-center border-b border-[#EDE5D8] bg-white px-6">
          <span className="text-[14px] font-semibold text-[#2B1B12]">
            Artisan Management
          </span>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="size-4 text-[#8B6F47]" />
              <div>
                <h1 className="font-serif text-[24px] font-semibold text-[#2B1B12]">
                  Artisans
                </h1>
                <p className="text-[12px] text-[#9A8070]">
                  The hands behind every piece. Manage artisan profiles, credits,
                  and assignments.
                </p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-4">
              {[
                { label: "Active Artisans", value: "12", badge: "+2" },
                { label: "Products Credited", value: "86" },
                { label: "Pending Approvals", value: "3" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#EDE5D8] bg-white p-4"
                >
                  <p className="text-[12px] text-[#9A8070]">{stat.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[28px] font-semibold text-[#2B1B12]">
                      {stat.value}
                    </span>
                    {stat.badge && (
                      <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-semibold text-[#1E7E34]">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-5 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
                <input
                  type="search"
                  placeholder="Search artisans..."
                  className="h-10 w-full rounded-xl border border-[#EDE5D8] bg-white pr-4 pl-10 text-[13px] outline-none"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-[#EDE5D8] bg-white px-4 py-2.5 text-[13px] font-medium text-[#6B5344]"
              >
                <Filter className="size-4" />
                Filter
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {artisans.map((artisan) => (
                <div
                  key={artisan.name}
                  className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="rounded-full bg-[#E6F4EA] px-2.5 py-0.5 text-[10px] font-semibold text-[#1E7E34]">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    {artisan.avatar ? (
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="size-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-16 items-center justify-center rounded-full bg-[#E8D8C3] text-[18px] font-semibold text-[#6B5344]">
                        {artisan.initials}
                      </div>
                    )}
                    <h3 className="mt-3 text-[15px] font-semibold text-[#2B1B12]">
                      {artisan.name}
                    </h3>
                    <p className="text-[12px] text-[#9A8070]">{artisan.craft}</p>
                    <span className="mt-2 rounded-full bg-[#F5EDE3] px-2.5 py-0.5 text-[11px] font-medium text-[#6B5344]">
                      {artisan.location}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-[#F5EDE3] pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#9A8070]">Products</p>
                        <div className="mt-1 flex items-center gap-1">
                          {artisan.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              className="size-6 rounded object-cover"
                            />
                          ))}
                          <span className="text-[11px] text-[#9A8070]">
                            +{artisan.products - artisan.images.length}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-[#9A8070]">
                          Orders Fulfilled
                        </p>
                        <p className="text-[16px] font-semibold text-[#2B1B12]">
                          {artisan.orders}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-[#EDE5D8] py-2 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(true)}
                      className="flex-1 rounded-lg border border-[#2B1B12] py-2 text-[12px] font-medium text-[#2B1B12] hover:bg-[#FAF7F2]"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {drawerOpen && (
            <div className="flex w-[400px] shrink-0 flex-col border-l border-[#EDE5D8] bg-white shadow-xl">
              <div className="border-b border-[#EDE5D8] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                      Edit Profile
                    </p>
                    <h2 className="font-serif text-[20px] font-semibold text-[#2B1B12]">
                      Asha from Rajasthan
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[#9A8070] hover:text-[#2B1B12]"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Status & Visibility
                  </h3>
                  <div className="flex items-center justify-between rounded-lg border border-[#EDE5D8] p-3">
                    <div>
                      <p className="text-[13px] font-medium text-[#2B1B12]">
                        Public Profile
                      </p>
                      <p className="text-[11px] text-[#9A8070]">
                        Visible to customers on storefront
                      </p>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-[#3B82F6]" />
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Profile Photo
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face"
                      alt=""
                      className="size-16 rounded-full object-cover"
                    />
                    <div className="flex gap-3 text-[12px] font-medium text-[#6B5344]">
                      <button type="button" className="hover:text-[#2B1B12]">
                        Change
                      </button>
                      <button type="button" className="text-[#C5221F]">
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-[#9A8070]">
                    Recommended: Square JPG, min 500x500px
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Asha Devi"
                        className="h-9 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                          Primary Craft
                        </label>
                        <input
                          type="text"
                          defaultValue="Block Printing"
                          className="h-9 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                          Years of Exp.
                        </label>
                        <input
                          type="text"
                          defaultValue="15"
                          className="h-9 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                          Region/Village
                        </label>
                        <input
                          type="text"
                          defaultValue="Bagru"
                          className="h-9 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                          State
                        </label>
                        <select className="h-9 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none">
                          <option>Rajasthan</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        defaultValue="+91 98765 43210"
                        className="h-9 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Artisan Story
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                        Short Bio
                      </label>
                      <textarea
                        rows={2}
                        defaultValue="Master block printer from Bagru, preserving centuries-old traditions."
                        className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-[#6B5344] uppercase">
                        Full Narrative
                      </label>
                      <div className="overflow-hidden rounded-lg border border-[#EDE5D8]">
                        <div className="flex gap-2 border-b border-[#EDE5D8] bg-[#FAF7F2] px-3 py-2">
                          {[Bold, Italic, List].map((Icon, i) => (
                            <button key={i} type="button" className="text-[#6B5344]">
                              <Icon className="size-4" />
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows={4}
                          defaultValue="Born into a family of block printers in Bagru, Asha has spent over 15 years mastering the art of natural dyeing and hand-block printing..."
                          className="w-full px-3 py-2 text-[13px] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Artisan Video
                  </h3>
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-[#F0EDE8]">
                    <Video className="size-10 text-[#9A8070]" />
                  </div>
                  <div className="mt-2 flex gap-3 text-[12px] font-medium text-[#6B5344]">
                    <button type="button">Upload Video</button>
                    <button type="button" className="text-[#C5221F]">
                      Remove
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-[#9A8070]">
                    Recommended: MP4 or MOV, max 50MB. Showcasing the artisan at
                    work helps build customer trust.
                  </p>
                </section>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#EDE5D8] p-5">
                <button
                  type="button"
                  className="px-4 py-2 text-[13px] font-medium text-[#6B5344]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[#2B1B12] px-5 py-2 text-[13px] font-medium text-white"
                >
                  Save Artisan
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
