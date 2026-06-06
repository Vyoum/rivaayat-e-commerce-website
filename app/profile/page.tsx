"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingBag,
  RefreshCcw,
  Truck,
  Heart,
  Eye,
  History,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Pencil,
  LogOut,
  Package,
  Sparkles,
} from "lucide-react"
import { ProductDetailHeader } from "@/components/product/product-detail-header"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionId =
  | "all-orders"
  | "custom-orders"
  | "track-shipment"
  | "wishlist"
  | "recently-viewed"
  | "browse-history"
  | "addresses"
  | "payment"
  | "notifications"
  | "help"
  | "our-story"

// ─── Sidebar data ─────────────────────────────────────────────────────────────

const sidebarGroups = [
  {
    label: "My Orders",
    items: [
      { id: "all-orders" as SectionId, label: "All Orders", icon: ShoppingBag, badge: null },
      { id: "custom-orders" as SectionId, label: "Custom Orders", icon: RefreshCcw, badge: "2" },
      { id: "track-shipment" as SectionId, label: "Track Shipment", icon: Truck, badge: null },
    ],
  },
  {
    label: "My Collection",
    items: [
      { id: "wishlist" as SectionId, label: "Wishlist", icon: Heart, badge: null },
      { id: "recently-viewed" as SectionId, label: "Recently Viewed", icon: Eye, badge: null },
      { id: "browse-history" as SectionId, label: "Browse History", icon: History, badge: null },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "addresses" as SectionId, label: "Addresses", icon: MapPin, badge: null },
      { id: "payment" as SectionId, label: "Payment", icon: CreditCard, badge: null },
      { id: "notifications" as SectionId, label: "Notifications", icon: Bell, badge: null },
      { id: "help" as SectionId, label: "Help", icon: HelpCircle, badge: null },
      { id: "our-story" as SectionId, label: "Our Story", icon: BookOpen, badge: null },
    ],
  },
]

// ─── Mock order data ──────────────────────────────────────────────────────────

const mockOrders = [
  {
    id: "RVT-2024-001",
    product: "Mandala Crochet Earrings",
    artisan: "Asha, Rajasthan",
    date: "Thu, May 28, 2026",
    status: "Delivered",
    price: "₹650",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=120&h=120&fit=crop",
  },
  {
    id: "RVT-2024-002",
    product: "Block Print Cotton Kurta",
    artisan: "Meera Devi, Jaipur",
    date: "Sat, May 15, 2026",
    status: "Delivered",
    price: "₹2,450",
    image: "/indian-artisan-woman-weaving-traditional-handloom-.jpg",
  },
  {
    id: "RVT-2024-003",
    product: "Silver Tribal Choker",
    artisan: "Dev Kumar, Jaipur",
    date: "Tue, Jun 3, 2026",
    status: "In Transit",
    price: "₹4,200",
    image: "/elegant-handmade-beaded-necklace-with-colorful-fab.jpg",
  },
]

const wishlistItems = [
  {
    id: "w1",
    product: "Warli Art Bead Bracelet",
    price: "₹890",
    image: "/warli-art-painted-wooden-bead-bracelet-with-tribal.jpg",
  },
  {
    id: "w2",
    product: "Brass Temple Earrings",
    price: "₹1,200",
    image: "/intricate-brass-temple-jewelry-earrings-with-tradi.jpg",
  },
]

// ─── Panel components ─────────────────────────────────────────────────────────

function AllOrdersPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">All Orders</h2>
      <div className="space-y-5">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-[#E8E0D4] bg-white overflow-hidden"
          >
            <div className="flex items-start gap-5 p-5">
              <div className="relative size-[72px] shrink-0 rounded-lg overflow-hidden bg-[#EDE8DC]">
                <Image src={order.image} alt={order.product} fill className="object-cover" sizes="72px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-[19px] font-medium text-[#3D2E24]">{order.product}</p>
                    <p className="font-sans text-[15px] text-[#9A8070] mt-0.5">{order.artisan}</p>
                    <p className="font-sans text-[13px] text-[#B5A898] mt-1">ORDER #{order.id} · {order.date}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1 font-sans text-[13px] font-semibold",
                      order.status === "Delivered"
                        ? "bg-[#EAF4EC] text-[#3D7A4F]"
                        : "bg-[#FEF3E2] text-[#B45309]",
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#F0EAE2] pt-4">
                  <p className="font-serif text-[20px] font-semibold text-[#3D2E24]">{order.price}</p>
                  <div className="flex items-center gap-3">
                    <button className="font-sans text-[14px] font-semibold uppercase tracking-wide text-[#846246] border border-[#846246] px-4 py-2 hover:bg-[#846246] hover:text-white transition-colors">
                      View Details
                    </button>
                    <button className="font-sans text-[14px] font-semibold uppercase tracking-wide text-[#9A8070] border border-[#D9CFC0] px-4 py-2 hover:bg-[#EDE8DC] transition-colors">
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomOrdersPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Custom Orders</h2>
      <div className="space-y-4">
        {[
          { id: "CO-001", desc: "Hand-painted ceramic dinner set, 6 pieces", status: "In Progress", eta: "Est. Jun 20, 2026", artisan: "Priya Kumari, Khurja" },
          { id: "CO-002", desc: "Custom protein ladoo box, 500g assorted", status: "Confirmed", eta: "Est. Jun 12, 2026", artisan: "Sunita Devi, Varanasi" },
        ].map((order) => (
          <div key={order.id} className="rounded-xl border border-[#E8E0D4] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-[19px] font-medium text-[#3D2E24]">{order.desc}</p>
                <p className="font-sans text-[15px] text-[#9A8070] mt-1">By {order.artisan}</p>
                <p className="font-sans text-[13px] text-[#B5A898] mt-1">ORDER #{order.id} · {order.eta}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#EDE8DC] px-3 py-1 font-sans text-[13px] font-semibold text-[#846246]">
                {order.status}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-[#F0EAE2]">
              <button className="font-sans text-[14px] font-semibold uppercase tracking-wide text-[#846246] hover:text-[#5C4332] transition-colors">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrackShipmentPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Track Shipment</h2>
      <div className="rounded-xl border border-[#E8E0D4] bg-white p-6">
        <p className="font-sans text-[15px] text-[#9A8070] mb-4">Active shipment</p>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-serif text-[21px] font-medium text-[#3D2E24]">Silver Tribal Choker</p>
            <p className="font-sans text-[15px] text-[#9A8070] mt-0.5">ORDER #RVT-2024-003</p>
          </div>
          <span className="rounded-full bg-[#FEF3E2] px-3 py-1 font-sans text-[13px] font-semibold text-[#B45309]">
            In Transit
          </span>
        </div>
        <div className="relative pl-6 space-y-6">
          {[
            { label: "Order Placed", date: "Jun 3, 2026", done: true },
            { label: "Processing", date: "Jun 4, 2026", done: true },
            { label: "Shipped", date: "Jun 5, 2026", done: true },
            { label: "Out for Delivery", date: "Jun 7, 2026 (Est.)", done: false },
            { label: "Delivered", date: "", done: false },
          ].map((step, i) => (
            <div key={i} className="relative flex items-start gap-4">
              <div
                className={cn(
                  "absolute -left-6 top-0.5 size-3 rounded-full border-2",
                  step.done
                    ? "border-[#846246] bg-[#846246]"
                    : "border-[#D9CFC0] bg-white",
                )}
              />
              {i < 4 && (
                <div
                  className={cn(
                    "absolute -left-[22px] top-4 h-full w-0.5",
                    step.done ? "bg-[#846246]" : "bg-[#E8E0D4]",
                  )}
                />
              )}
              <div>
                <p className={cn("font-sans text-[16px] font-medium", step.done ? "text-[#3D2E24]" : "text-[#B5A898]")}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="font-sans text-[14px] text-[#9A8070] mt-0.5">{step.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WishlistPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Wishlist</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {wishlistItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-[#E8E0D4] bg-white overflow-hidden flex gap-4 p-4">
            <div className="relative size-[72px] shrink-0 rounded-lg overflow-hidden bg-[#EDE8DC]">
              <Image src={item.image} alt={item.product} fill className="object-cover" sizes="72px" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <p className="font-serif text-[18px] font-medium text-[#3D2E24]">{item.product}</p>
              <p className="font-serif text-[19px] text-[#846246]">{item.price}</p>
              <button className="mt-1 font-sans text-[13px] font-semibold uppercase tracking-wide text-[#846246] hover:text-[#5C4332] transition-colors text-left">
                Add to Cart →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentlyViewedPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Recently Viewed</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {mockOrders.slice(0, 2).map((item) => (
          <div key={item.id} className="rounded-xl border border-[#E8E0D4] bg-white overflow-hidden flex gap-4 p-4">
            <div className="relative size-[72px] shrink-0 rounded-lg overflow-hidden bg-[#EDE8DC]">
              <Image src={item.image} alt={item.product} fill className="object-cover" sizes="72px" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <p className="font-serif text-[18px] font-medium text-[#3D2E24]">{item.product}</p>
              <p className="font-serif text-[19px] text-[#846246]">{item.price}</p>
              <Link href="/products/mandala-crochet-earrings" className="mt-1 font-sans text-[13px] font-semibold uppercase tracking-wide text-[#846246] hover:text-[#5C4332] transition-colors">
                View Product →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddressesPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Addresses</h2>
      <div className="space-y-4">
        {[
          { type: "Home", address: "12, Green Park Extension, New Delhi – 110016", default: true },
          { type: "Work", address: "Tower B, Cyber City, Gurugram – 122002", default: false },
        ].map((addr, i) => (
          <div key={i} className="rounded-xl border border-[#E8E0D4] bg-white p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[13px] font-semibold uppercase tracking-wide text-[#846246] border border-[#846246]/40 bg-[#F9F4EE] px-2 py-0.5">
                  {addr.type}
                </span>
                {addr.default && (
                  <span className="font-sans text-[13px] text-[#9A8070]">Default</span>
                )}
              </div>
              <button className="font-sans text-[14px] font-semibold text-[#846246] uppercase tracking-wide hover:text-[#5C4332] transition-colors">
                Edit
              </button>
            </div>
            <p className="font-sans text-[16px] text-[#6B5344] mt-3 leading-relaxed">{addr.address}</p>
          </div>
        ))}
        <button className="w-full rounded-xl border border-dashed border-[#D9CFC0] bg-white py-4 font-sans text-[15px] font-semibold text-[#9A8070] hover:border-[#846246] hover:text-[#846246] transition-colors">
          + Add New Address
        </button>
      </div>
    </div>
  )
}

function PaymentPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Payment Methods</h2>
      <div className="space-y-4">
        {[
          { type: "Visa", last4: "4242", expiry: "08/27", default: true },
          { type: "UPI", last4: "vyoum@okaxis", expiry: "", default: false },
        ].map((card, i) => (
          <div key={i} className="rounded-xl border border-[#E8E0D4] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-[#EDE8DC] flex items-center justify-center">
                  <CreditCard className="size-5 text-[#846246]" />
                </div>
                <div>
                  <p className="font-sans text-[16px] font-semibold text-[#3D2E24]">
                    {card.type} {card.last4.startsWith("4") ? `•••• ${card.last4}` : card.last4}
                  </p>
                  {card.expiry && (
                    <p className="font-sans text-[14px] text-[#9A8070]">Expires {card.expiry}</p>
                  )}
                </div>
              </div>
              {card.default && (
                <span className="font-sans text-[13px] font-semibold text-[#3D7A4F] bg-[#EAF4EC] px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Notifications</h2>
      <div className="space-y-3">
        {[
          { title: "Your order has shipped!", desc: "Silver Tribal Choker is on its way.", time: "2 hours ago", unread: true },
          { title: "New drop from Asha's workshop", desc: "Monsoon edition crochet earrings are live.", time: "Yesterday", unread: true },
          { title: "Order delivered", desc: "Block Print Cotton Kurta was delivered on May 15.", time: "3 weeks ago", unread: false },
        ].map((notif, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl border p-4 flex gap-4",
              notif.unread ? "border-[#D9CFC0] bg-white" : "border-[#E8E0D4] bg-[#FAFAF8]",
            )}
          >
            <div
              className={cn(
                "mt-1 size-2 shrink-0 rounded-full",
                notif.unread ? "bg-[#846246]" : "bg-transparent",
              )}
            />
            <div>
              <p className="font-sans text-[17px] font-semibold text-[#3D2E24]">{notif.title}</p>
              <p className="font-sans text-[15px] text-[#9A8070] mt-0.5">{notif.desc}</p>
              <p className="font-sans text-[13px] text-[#B5A898] mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HelpPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Help</h2>
      <div className="space-y-3">
        {[
          "How do I track my order?",
          "Can I return or exchange a product?",
          "How does the Custom Order process work?",
          "What is the Artisan Patronage tip?",
          "How can I contact support?",
        ].map((q, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between rounded-xl border border-[#E8E0D4] bg-white px-5 py-4 text-left hover:border-[#D9CFC0] hover:bg-[#FAFAF8] transition-colors"
          >
            <span className="font-sans text-[16px] text-[#3D2E24]">{q}</span>
            <ChevronRight className="size-4 text-[#9A8070] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

function OurStoryPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-6">Our Story</h2>
      <div className="rounded-xl overflow-hidden">
        <div className="relative h-[200px] bg-[#EDE8DC]">
          <Image
            src="/group-of-smiling-indian-women-artisans-in-colorful.jpg"
            alt="Artisans"
            fill
            className="object-cover"
            sizes="700px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D2E24]/60 to-transparent" />
        </div>
        <div className="bg-white border border-t-0 border-[#E8E0D4] rounded-b-xl p-6 space-y-4">
          <p className="font-serif text-[20px] italic text-[#6B5344] leading-relaxed">
            "House of Indika started with a simple idea — to keep the beauty of handmade Indian crafts alive in a world that moves fast."
          </p>
          <p className="font-sans text-[16px] text-[#9A8070] leading-relaxed">
            Every item is handmade or carefully curated to reflect thoughtful design. We are as much about the people behind the products as we are about the customers who choose to wear, use, and gift these pieces.
          </p>
          <Link
            href="/outerboxdesign"
            className="inline-block font-sans text-[14px] font-semibold uppercase tracking-[0.16em] text-[#846246] hover:text-[#5C4332] transition-colors"
          >
            Read the full story →
          </Link>
        </div>
      </div>
    </div>
  )
}

function BrowseHistoryPanel() {
  return (
    <div>
      <h2 className="font-serif text-[32px] text-[#3D2E24] mb-8">Browse History</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {[...mockOrders].reverse().map((item) => (
          <div key={item.id} className="rounded-xl border border-[#E8E0D4] bg-white overflow-hidden flex gap-4 p-4">
            <div className="relative size-[72px] shrink-0 rounded-lg overflow-hidden bg-[#EDE8DC]">
              <Image src={item.image} alt={item.product} fill className="object-cover" sizes="72px" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <p className="font-serif text-[18px] font-medium text-[#3D2E24]">{item.product}</p>
              <p className="font-serif text-[19px] text-[#846246]">{item.price}</p>
              <Link href="/products/mandala-crochet-earrings" className="mt-1 font-sans text-[13px] font-semibold uppercase tracking-wide text-[#846246] hover:text-[#5C4332] transition-colors">
                View Product →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Panel registry ────────────────────────────────────────────────────────────

const panels: Record<SectionId, React.ReactNode> = {
  "all-orders": <AllOrdersPanel />,
  "custom-orders": <CustomOrdersPanel />,
  "track-shipment": <TrackShipmentPanel />,
  wishlist: <WishlistPanel />,
  "recently-viewed": <RecentlyViewedPanel />,
  "browse-history": <BrowseHistoryPanel />,
  addresses: <AddressesPanel />,
  payment: <PaymentPanel />,
  notifications: <NotificationsPanel />,
  help: <HelpPanel />,
  "our-story": <OurStoryPanel />,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("all-orders")

  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <ProductDetailHeader />

      {/* Profile Header Banner */}
      <div className="bg-[#5C4332] text-[#F5F0E8]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-[#F5F0E8]/15 ring-2 ring-[#F5F0E8]/30">
                <span className="font-serif text-[26px] font-semibold text-[#F5F0E8]">RS</span>
              </div>
              <div>
                <h1 className="font-serif text-[30px] font-normal text-[#F5F0E8]">Rahul Sharma</h1>
                <p className="font-sans text-[15px] text-[#F5F0E8]/65 mt-0.5">
                  rahul.sharma@email.com &nbsp;·&nbsp; Patron since 2023
                </p>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 rounded-none border border-[#F5F0E8]/40 px-5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[#F5F0E8] transition-colors hover:bg-[#F5F0E8]/10 self-start sm:self-auto">
              <Pencil className="size-3.5" />
              Edit Profile
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-7 grid grid-cols-3 divide-x divide-[#F5F0E8]/15 rounded-xl border border-[#F5F0E8]/15 bg-[#F5F0E8]/08">
            {[
              { value: "3", label: "Orders" },
              { value: "5", label: "Wishlist" },
              { value: "1", label: "Custom" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-4">
                <span className="font-serif text-[28px] font-semibold text-[#F5F0E8]">{stat.value}</span>
                <span className="font-sans text-[13px] tracking-[0.12em] uppercase text-[#F5F0E8]/60 mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Artisan Patronage banner */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#C4A035]/40 bg-[#C4A035]/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="size-[18px] text-[#C4A035] shrink-0" />
              <div>
                <p className="font-sans text-[16px] font-semibold text-[#F5F0E8]">Artisan Patronage</p>
                <p className="font-sans text-[14px] text-[#F5F0E8]/65 mt-0.5">
                  You've added ₹450 in artisan tips so far.
                </p>
              </div>
            </div>
            <Sparkles className="size-4 text-[#C4A035]/50 shrink-0" />
          </div>
        </div>
      </div>

      {/* Main content: sidebar + panel */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex gap-8 lg:gap-12 items-start">

          {/* ── Sidebar ── */}
          <aside className="hidden w-[240px] shrink-0 lg:block">
            <div className="sticky top-6 space-y-6">
              {sidebarGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9A8070]">
                    {group.label}
                  </p>
                  <div className="rounded-xl border border-[#E8E0D4] bg-white overflow-hidden divide-y divide-[#F0EAE2]">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeSection === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors",
                            isActive
                              ? "bg-[#F9F4EE]"
                              : "hover:bg-[#FAFAF8]",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                "size-[15px] shrink-0",
                                isActive ? "text-[#846246]" : "text-[#9A8070]",
                              )}
                              strokeWidth={1.8}
                            />
                            <span
                              className={cn(
                                "font-sans text-[15px] font-medium",
                                isActive ? "text-[#846246]" : "text-[#3D2E24]",
                              )}
                            >
                              {item.label}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            {item.badge && (
                              <span className="size-[20px] rounded-full bg-[#846246] font-sans text-[12px] font-semibold text-white flex items-center justify-center">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={cn(
                                "size-3.5",
                                isActive ? "text-[#846246]" : "text-[#C4B5A5]",
                              )}
                            />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Sign Out */}
              <button className="flex w-full items-center gap-3 px-3 py-3 font-sans text-[15px] font-medium text-[#9A8070] hover:text-[#3D2E24] transition-colors">
                <LogOut className="size-[15px]" strokeWidth={1.8} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* ── Mobile: grouped list nav (visible < lg) ── */}
          <div className="lg:hidden w-full space-y-4 mb-6">
            {sidebarGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-1 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9A8070]">
                  {group.label}
                </p>
                <div className="rounded-xl border border-[#E8E0D4] bg-white overflow-hidden divide-y divide-[#F0EAE2]">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-3.5",
                          isActive ? "bg-[#F9F4EE]" : "hover:bg-[#FAFAF8]",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={cn("size-[15px]", isActive ? "text-[#846246]" : "text-[#9A8070]")} strokeWidth={1.8} />
                          <span className={cn("font-sans text-[15px] font-medium", isActive ? "text-[#846246]" : "text-[#3D2E24]")}>
                            {item.label}
                          </span>
                        </span>
                        <ChevronRight className="size-3.5 text-[#C4B5A5]" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Right content panel ── */}
          <div className="flex-1 min-w-0">
            {/* breadcrumb / section title chip */}
            <div className="hidden lg:flex items-center gap-2 mb-8">
              <Package className="size-4 text-[#9A8070]" />
              <span className="font-sans text-[14px] text-[#9A8070]">Account</span>
              <ChevronRight className="size-3.5 text-[#C4B5A5]" />
              <span className="font-sans text-[14px] text-[#3D2E24] font-semibold">
                {sidebarGroups.flatMap(g => g.items).find(i => i.id === activeSection)?.label}
              </span>
            </div>

            {panels[activeSection]}
          </div>
        </div>
      </div>
    </main>
  )
}
