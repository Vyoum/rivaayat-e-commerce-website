import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-4xl font-serif font-semibold tracking-wider text-background">रिवायत</span>
              <span className="block text-xs tracking-[0.3em] uppercase font-sans font-light text-background/60">
                RIVAAYAT
              </span>
            </Link>
            <p className="text-background/70 font-sans leading-relaxed mb-6">
              Where every purchase nurtures a life, preserves a tradition, and weaves a story of hope.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-6">Explore</h4>
            <ul className="space-y-3">
              {["Our Story", "Products", "Artisans", "Impact Report", "Blog", "FAQs"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-background/70 font-sans hover:text-background transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-serif mb-6">Collections</h4>
            <ul className="space-y-3">
              {[
                "Wellness Foods",
                "Seed Calendars",
                "Handcrafted Jewelry",
                "Home Décor",
                "Gift Boxes",
                "Corporate Gifting",
              ].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-background/70 font-sans hover:text-background transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif mb-6">Connect With Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70 font-sans">
                  42, Artisan Lane, Jaipur,
                  <br />
                  Rajasthan 302001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:namaste@rivaayat.in"
                  className="text-background/70 font-sans hover:text-background transition-colors"
                >
                  namaste@rivaayat.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-background/70 font-sans hover:text-background transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>

            {/* NGO Partners Logo Strip */}
            <div className="mt-8">
              <p className="text-xs font-sans text-background/50 mb-3 tracking-wider uppercase">Proud Partners</p>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-16 h-8 bg-background/20 rounded flex items-center justify-center text-xs font-sans">
                  NGO 1
                </div>
                <div className="w-16 h-8 bg-background/20 rounded flex items-center justify-center text-xs font-sans">
                  NGO 2
                </div>
                <div className="w-16 h-8 bg-background/20 rounded flex items-center justify-center text-xs font-sans">
                  NGO 3
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-sans text-background/50">© 2025 Rivaayat. Crafted with love in India.</p>
          <div className="flex items-center gap-6 text-sm font-sans text-background/50">
            <Link href="#" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Shipping
            </Link>
          </div>
        </div>

        {/* Emotional Closing */}
        <div className="mt-12 text-center">
          <p className="text-xl md:text-2xl font-serif italic text-background/40">
            &quot;आपकी हर खरीद एक कहानी लिखती है&quot;
          </p>
          <p className="text-sm font-sans text-background/30 mt-2">Every purchase you make writes a story</p>
        </div>
      </div>
    </footer>
  )
}
