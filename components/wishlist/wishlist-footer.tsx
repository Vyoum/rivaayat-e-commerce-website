"use client"

import Link from "next/link"
import { Mail, Heart, Share2 } from "lucide-react"

export function WishlistFooter() {
  return (
    <footer className="bg-[#EDE8DC]/60 border-t border-[#E8E0D4]">
      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          {/* Share Wishlist */}
          <div className="rounded-lg bg-white border border-[#E8E0D4] p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-3 rounded-full bg-[#846246]/10">
                <Share2 className="size-6 text-[#846246]" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-[18px] text-[#3D2E24] mb-2">
                  Share Your Wishlist
                </h3>
                <p className="font-serif text-[14px] text-[#9A8070] mb-4">
                  Let your loved ones know exactly what artisan pieces speak to your heart.
                </p>
                <button className="font-sans text-[11px] font-semibold text-[#846246] uppercase tracking-wider hover:text-[#5C4332] transition-colors">
                  Get Share Link →
                </button>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="rounded-lg bg-white border border-[#E8E0D4] p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-3 rounded-full bg-[#846246]/10">
                <Mail className="size-6 text-[#846246]" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-[18px] text-[#3D2E24] mb-2">
                  Stock Notifications
                </h3>
                <p className="font-serif text-[14px] text-[#9A8070] mb-4">
                  Get notified when out-of-stock items are back and new collections launch.
                </p>
                <button className="font-sans text-[11px] font-semibold text-[#846246] uppercase tracking-wider hover:text-[#5C4332] transition-colors">
                  Enable Alerts →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 border-t border-[#E8E0D4]">
        <div className="max-w-3xl">
          <p className="font-sans text-[11px] font-medium text-[#9A8070] uppercase tracking-[0.2em] mb-4">
            Why Wishlist?
          </p>
          <blockquote className="font-serif text-[20px] leading-relaxed text-[#3D2E24] italic">
            &ldquo;A wishlist is more than a shopping tool — it&apos;s a reflection of your appreciation for
            handcrafted artistry. Each piece you save is an acknowledgment of the artisan&apos;s skill, heritage, and
            soul poured into their work. Keep your favorites close, and let them inspire your journey with authentic,
            conscious living.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Footer Links */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 border-t border-[#E8E0D4]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="font-sans text-[12px] font-semibold text-[#3D2E24] uppercase tracking-wider mb-4">
              Browse
            </h4>
            <ul className="space-y-2">
              {["Jewellery", "Textiles", "Home Décor", "Clothing"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-sans text-[13px] text-[#9A8070] hover:text-[#846246] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[12px] font-semibold text-[#3D2E24] uppercase tracking-wider mb-4">
              Account
            </h4>
            <ul className="space-y-2">
              {["Profile", "Orders", "Settings", "Sign Out"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-sans text-[13px] text-[#9A8070] hover:text-[#846246] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[12px] font-semibold text-[#3D2E24] uppercase tracking-wider mb-4">
              About
            </h4>
            <ul className="space-y-2">
              {["Our Story", "Artisans", "Impact", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-sans text-[13px] text-[#9A8070] hover:text-[#846246] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[12px] font-semibold text-[#3D2E24] uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {["Contact", "Shipping", "Returns", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-sans text-[13px] text-[#9A8070] hover:text-[#846246] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#E8E0D4] flex flex-col sm:flex-row items-center justify-between">
          <p className="font-sans text-[12px] text-[#9A8070]">
            © 2024 Rivaayat. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-sans text-[12px] text-[#9A8070] hover:text-[#846246] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </footer>
  )
}
