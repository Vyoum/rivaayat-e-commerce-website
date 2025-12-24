import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react"
import { MessageCircle } from "lucide-react"

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

          {/* About Rivaayat */}
          <div>
            <h4 className="text-lg font-serif mb-6">About Rivaayat</h4>
            <ul className="space-y-3">
              {["Our Story", "The Artisans", "Impact Report", "Blog", "Careers"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-background/70 font-sans hover:text-background transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-serif mb-6">Shop</h4>
            <ul className="space-y-3">
              {["Clothing", "Décor", "Jewellery", "Custom Food"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-background/70 font-sans hover:text-background transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-serif mb-6">Help</h4>
            <ul className="space-y-3">
              {["FAQs", "Shipping & Returns", "Contact"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-background/70 font-sans hover:text-background transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Follow Us */}
            <div className="mt-8">
              <h4 className="text-lg font-serif mb-6">Follow Us</h4>
              <div className="flex items-center gap-4">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>
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
