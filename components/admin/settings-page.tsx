"use client"

import Link from "next/link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import {
  Search,
  Bell,
  History,
  Mail,
  Phone,
  Lock,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminUserAvatar } from "./admin-user-avatar"
import { useAdminProfile } from "./admin-session-provider"

const settingsNav = [
  "Store Information",
  "Payments",
  "Shipping & Logistics",
  "Notifications",
  "Team & Roles",
  "SEO & Analytics",
  "Data & Privacy",
]

export function SettingsPage() {
  const profile = useAdminProfile()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F9F7F2]">
        <header className="flex h-[56px] items-center justify-between border-b border-[#EDE5D8] bg-white px-6">
          <div className="relative w-[240px]">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-full border border-[#EDE5D8] bg-[#FAF7F2] pr-4 pl-10 text-[13px] outline-none"
            />
          </div>
          <nav className="flex items-center gap-6">
            {["Dashboard", "Analytics", "Reports"].map((link) => (
              <Link
                key={link}
                href={link === "Dashboard" ? "/admin" : "/admin"}
                className="text-[13px] font-medium text-[#6B5344] hover:text-[#2B1B12]"
              >
                {link}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button type="button" className="text-[#6B5344]">
              <Bell className="size-[18px]" />
            </button>
            <button type="button" className="text-[#6B5344]">
              <History className="size-[18px]" />
            </button>
            {profile ? <AdminUserAvatar profile={profile} size="sm" /> : null}
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-[28px] font-semibold text-[#2B1B12]">
                Configuration & Settings
              </h1>
              <p className="mt-1 text-[13px] text-[#9A8070]">
                Manage your store details, integrations, and admin preferences.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-[#2B1B12] px-5 py-2 text-[13px] font-medium text-[#2B1B12] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#2B1B12] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#3D2B21]"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white">
            <div className="flex">
              <nav className="w-[220px] shrink-0 space-y-0.5 border-r border-[#EDE5D8] bg-[#F2EBE1] p-3">
                {settingsNav.map((item, i) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                      i === 0
                        ? "bg-white text-[#2B1B12] shadow-sm"
                        : "text-[#6B5344] hover:bg-white/60"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>

              <div className="flex-1 p-6">
                <section className="mb-8">
                  <h2 className="text-[16px] font-semibold text-[#2B1B12]">
                    Store Information
                  </h2>
                  <p className="mt-1 text-[12px] text-[#9A8070]">
                    Basic details about your brand and storefront.
                  </p>
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        defaultValue={HOUSE_OF_INDIKA}
                        className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        Tagline
                      </label>
                      <input
                        type="text"
                        defaultValue="Handcrafted Heritage"
                        className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        About (Short Description)
                      </label>
                      <textarea
                        rows={4}
                        defaultValue={`${HOUSE_OF_INDIKA} celebrates India's rich artisanal heritage. We connect master craftspeople with conscious consumers, ensuring every purchase supports traditional skills and sustainable livelihoods.`}
                        className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] leading-relaxed outline-none focus:border-[#C4A882]"
                      />
                    </div>
                  </div>
                </section>

                <section className="mb-8 border-t border-[#EDE5D8] pt-8">
                  <h2 className="text-[16px] font-semibold text-[#2B1B12]">
                    Contact & Compliance
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        Contact Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                        <input
                          type="email"
                          defaultValue="namaste@houseofindika.com"
                          className="h-10 w-full rounded-lg border border-[#EDE5D8] pl-10 pr-3 text-[13px] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        WhatsApp Business Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                        <input
                          type="text"
                          defaultValue="+91 98765 43210"
                          className="h-10 w-full rounded-lg border border-[#EDE5D8] pl-10 pr-3 text-[13px] outline-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        GST Number
                      </label>
                      <input
                        type="text"
                        defaultValue="27AAACH1234F1Z5"
                        className="h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        Registered Business Address
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="42, Johari Bazaar Road, Near Hawa Mahal, Jaipur, Rajasthan 302003, India"
                        className="w-full rounded-lg border border-[#EDE5D8] px-3 py-2 text-[13px] outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-[#EDE5D8] pt-8">
                  <h2 className="text-[16px] font-semibold text-[#2B1B12]">
                    Regional Settings
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-6">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        Primary Currency
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A8070]" />
                        <input
                          type="text"
                          defaultValue="INR (₹)"
                          readOnly
                          className="h-10 w-full rounded-lg border border-[#EDE5D8] bg-[#F2EBE1] pl-10 pr-3 text-[13px] text-[#6B5344] outline-none"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-[#9A8070]">
                        Currency cannot be changed after initial setup.
                      </p>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-semibold text-[#6B5344]">
                        Store Language
                      </label>
                      <div className="flex rounded-lg border border-[#EDE5D8] p-1">
                        <button
                          type="button"
                          className="flex-1 rounded-md bg-[#2B1B12] py-2 text-[13px] font-medium text-white"
                        >
                          English
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-md py-2 text-[13px] font-medium text-[#9A8070]"
                        >
                          Hindi
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
