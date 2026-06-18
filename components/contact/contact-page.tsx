"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Clock,
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { SiteHeader } from "@/components/site-header"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { cn } from "@/lib/utils"

const CONTACT_EMAIL = "Heritage@houseofindika.com"
const CONTACT_PHONE = "8130088626"
const CONTACT_PHONE_DISPLAY = "+91 88266 64130"
const WHATSAPP_URL = `https://wa.me/91${CONTACT_PHONE}`

const inquiryTypes = [
  "Order & delivery",
  "Custom orders",
  "Product care",
  "Artisan partnerships",
  "Something else",
] as const

const conciergeNotes = [
  {
    icon: Clock,
    title: "Thoughtful replies",
    description: "We respond within one business day, often sooner.",
  },
  {
    icon: Heart,
    title: "Human, not automated",
    description: "A real member of our team reads every message.",
  },
  {
    icon: Sparkles,
    title: "Craft-first guidance",
    description: "Questions about materials, sizing, or gifting? We know the makers.",
  },
]

function BotanicalMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="mx-auto size-9 text-[#C4A882]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" strokeOpacity="0.45" />
      <path d="M24 34V18M24 18C24 18 16 16 14 10C18 12 24 18 24 18ZM24 18C24 18 32 16 34 10C30 12 24 18 24 18Z" />
    </svg>
  )
}

function ContactChannelCard({
  icon: Icon,
  eyebrow,
  title,
  href,
  external,
}: {
  icon: typeof Mail
  eyebrow: string
  title: string
  href: string
  external?: boolean
}) {
  const className =
    "group flex items-start gap-4 rounded-2xl border border-[#E8E0D4]/80 bg-white/70 p-5 shadow-[0_8px_30px_rgba(61,46,36,0.05)] backdrop-blur-sm transition-all hover:border-[#C4A882]/50 hover:bg-white hover:shadow-[0_12px_40px_rgba(61,46,36,0.08)]"

  const content = (
    <>
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F5EDE3] text-[#846246] transition-colors group-hover:bg-[#EDE0CE]">
        <Icon className="size-[18px]" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[#9A8070]">
          {eyebrow}
        </p>
        <p className="mt-1 font-serif text-[17px] text-[#3D2E24] transition-colors group-hover:text-[#5C4332]">
          {title}
        </p>
      </div>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  )
}

export function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [inquiry, setInquiry] = useState<(typeof inquiryTypes)[number]>(inquiryTypes[0])
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.")
      return
    }

    setSubmitting(true)

    const subject = encodeURIComponent(`${inquiry} — ${HOUSE_OF_INDIKA}`)
    const body = encodeURIComponent(
      [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        phone.trim() ? `Phone: ${phone.trim()}` : null,
        `Inquiry: ${inquiry}`,
        "",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    )

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`

    await new Promise((resolve) => setTimeout(resolve, 600))

    setSubmitting(false)
    setSubmitted(true)
    toast.success("Opening your email app — we'll reply soon.")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FCFAF5]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(196,168,130,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(232,220,200,0.35) 0%, transparent 50%), linear-gradient(180deg, #FCFAF5 0%, #F7F0E6 45%, #FCFAF5 100%)",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-32 size-64 rounded-full bg-[#E8DCC8]/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 top-[420px] size-72 rounded-full bg-[#C4A882]/15 blur-3xl" aria-hidden />

      <SiteHeader className="relative bg-[#FCFAF5]/80 backdrop-blur-md" />

      <div className="relative mx-auto max-w-[1080px] px-5 pb-24 pt-12 lg:px-8 lg:pt-16">
        <header className="text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#8B7355]">
            Concierge
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-light italic leading-[1.1] text-[#3D2E24]">
            Let&apos;s begin a conversation
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] font-serif text-[15px] leading-relaxed text-[#6B5A4E] sm:text-[16px]">
            Whether you&apos;re tracing an order, dreaming up a custom piece, or simply
            wishing to know more about the hands behind your treasure — we&apos;re here.
          </p>
          <div className="mt-6 flex justify-center">
            <BotanicalMark />
          </div>
          <div className="mx-auto mt-6 flex w-24 items-center gap-2">
            <span className="h-px flex-1 bg-[#C4A882]/60" />
            <span className="size-1 rotate-45 bg-[#C4A882]" />
            <span className="h-px flex-1 bg-[#C4A882]/60" />
          </div>
        </header>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-[#E8E0D4] bg-[#FAF7F2]/80 p-6 shadow-sm sm:p-7">
              <h2 className="font-serif text-[26px] font-normal text-[#3D2E24]">
                Reach us directly
              </h2>
              <p className="mt-3 font-sans text-[13px] leading-relaxed text-[#8B7355]">
                Our concierge team at {HOUSE_OF_INDIKA} is delighted to help with orders,
                custom requests, and thoughtful gifting.
              </p>

              <div className="mt-6 space-y-3">
                <ContactChannelCard
                  icon={Mail}
                  eyebrow="Write to us"
                  title={CONTACT_EMAIL}
                  href={`mailto:${CONTACT_EMAIL}`}
                />
                <ContactChannelCard
                  icon={Phone}
                  eyebrow="Call or text"
                  title={CONTACT_PHONE_DISPLAY}
                  href={`tel:+91${CONTACT_PHONE}`}
                />
                <ContactChannelCard
                  icon={MessageCircle}
                  eyebrow="WhatsApp"
                  title="Chat with our team"
                  href={WHATSAPP_URL}
                  external
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {conciergeNotes.map((note) => (
                <div
                  key={note.title}
                  className="rounded-xl border border-[#EDE5D8] bg-white/60 px-4 py-4"
                >
                  <note.icon className="size-4 text-[#C4A882]" strokeWidth={1.5} />
                  <p className="mt-3 font-serif text-[15px] text-[#3D2E24]">{note.title}</p>
                  <p className="mt-1 font-sans text-[12px] leading-relaxed text-[#9A8070]">
                    {note.description}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="relative">
            <div className="absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-[#E8DCC8] via-[#F5EDE3] to-[#D4C4A8] opacity-70" />
            <div className="relative rounded-[1.3rem] border border-[#E8E0D4]/90 bg-[#FFFCF8] p-6 shadow-[0_20px_60px_rgba(61,46,36,0.08)] sm:p-8">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#EAF4EC]">
                    <Heart className="size-6 text-[#5C6B58]" strokeWidth={1.5} />
                  </div>
                  <h2 className="mt-6 font-serif text-[28px] text-[#3D2E24]">Message prepared</h2>
                  <p className="mt-4 max-w-sm font-serif text-[15px] leading-relaxed text-[#6B5A4E]">
                    Your email app should open shortly. If it doesn&apos;t, write to us at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-[#846246] underline underline-offset-4"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 font-sans text-[11px] uppercase tracking-[0.16em] text-[#846246] underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={(event) => void handleSubmit(event)} className="space-y-7">
                  <div>
                    <h2 className="font-serif text-[26px] text-[#3D2E24]">Send a message</h2>
                    <p className="mt-2 font-sans text-[13px] text-[#8B7355]">
                      Share a little context and we&apos;ll guide you from there.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block sm:col-span-1">
                      <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
                        Full name
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-2 w-full border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#3D2E24] outline-none transition-colors focus:border-[#3D2E24]"
                      />
                    </label>

                    <label className="block sm:col-span-1">
                      <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
                        Email
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#3D2E24] outline-none transition-colors focus:border-[#3D2E24]"
                      />
                    </label>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
                        Phone <span className="normal-case tracking-normal text-[#B5A090]">(optional)</span>
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+91"
                        className="mt-2 w-full border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#3D2E24] placeholder:text-[#C4B5A5] outline-none transition-colors focus:border-[#3D2E24]"
                      />
                    </label>

                    <label className="block">
                      <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
                        How can we help?
                      </span>
                      <select
                        value={inquiry}
                        onChange={(event) =>
                          setInquiry(event.target.value as (typeof inquiryTypes)[number])
                        }
                        className="mt-2 w-full appearance-none border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#3D2E24] outline-none transition-colors focus:border-[#3D2E24]"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
                      Your message
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Tell us about your order, custom idea, or question..."
                      className="mt-3 w-full resize-y rounded-xl border border-[#E8DCC8] bg-[#F5EDD8]/35 px-4 py-3.5 font-serif text-[14px] leading-relaxed text-[#3D2E24] placeholder:text-[#A89888] outline-none transition-colors focus:border-[#C4A882]"
                    />
                  </label>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs font-sans text-[11px] leading-relaxed text-[#9A8070]">
                      Prefer a quicker reply? Message us on WhatsApp at {CONTACT_PHONE_DISPLAY}.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={cn(
                        "inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-[#3D2E24] px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-all hover:bg-[#2B1B12] disabled:cursor-not-allowed disabled:opacity-60",
                      )}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Preparing…
                        </>
                      ) : (
                        <>
                          <span className="text-[#C4A882]">✦</span>
                          Send message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>

        <section className="mt-16 rounded-2xl border border-[#E8E0D4] bg-[#F5EDE3]/50 px-6 py-8 text-center sm:px-10">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#8B7355]">
            While you wait
          </p>
          <p className="mt-3 font-serif text-[20px] text-[#3D2E24]">
            Explore collections shaped by hand across India
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Jewellery", href: "/jewellery" },
              { label: "Custom Orders", href: "/custom-orders" },
              { label: "Our Story", href: "/outerboxdesign" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[#D8CFC4] bg-white/80 px-5 py-2 font-sans text-[11px] uppercase tracking-[0.12em] text-[#6B5344] transition-colors hover:border-[#C4A882] hover:text-[#3D2E24]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
