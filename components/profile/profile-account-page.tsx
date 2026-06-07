"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { getStoredOrders, mergeProfileOrders } from "@/lib/orders-storage"
import { getSupabaseBrowser } from "@/lib/supabase/browser"
import type { WishlistItem } from "@/lib/wishlist"
import {
  formatCurrency,
  formatOrderDate,
  formatPatronSince,
  getInitials,
} from "@/lib/profile-utils"
import type {
  ProfileCustomOrder,
  ProfileData,
  ProfileOrder,
  ProfileWishlistItem,
} from "@/types/profile"

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

function mapWishlistToProfile(items: WishlistItem[]): ProfileWishlistItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.id,
    name: item.name,
    price: item.price,
    slug: item.slug,
    image: item.image,
    addedAt: item.addedAt,
  }))
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D9CFC0] bg-white px-6 py-12 text-center">
      <p className="font-sans text-[16px] text-[#9A8070]">{message}</p>
    </div>
  )
}

function AllOrdersPanel({ orders }: { orders: ProfileOrder[] }) {
  if (orders.length === 0) {
    return (
      <div>
        <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">All Orders</h2>
        <EmptyState message="You haven't placed any orders yet." />
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">All Orders</h2>
      <div className="space-y-5">
        {orders.map((order) => {
          const item = order.items[0]
          return (
            <div key={order.id} className="overflow-hidden rounded-xl border border-[#E8E0D4] bg-white">
              <div className="flex items-start gap-5 p-5">
                <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-[#EDE8DC]">
                  {item?.image ? (
                    <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="72px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-6 text-[#9A8070]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-[19px] font-medium text-[#3D2E24]">
                        {item?.productName ?? "Order"}
                      </p>
                      {item?.artisan && (
                        <p className="mt-0.5 font-sans text-[15px] text-[#9A8070]">{item.artisan}</p>
                      )}
                      <p className="mt-1 font-sans text-[13px] text-[#B5A898]">
                        ORDER #{order.displayId} · {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 font-sans text-[13px] font-semibold",
                        order.status === "Delivered"
                          ? "bg-[#EAF4EC] text-[#3D7A4F]"
                          : order.status === "In Transit"
                            ? "bg-[#FEF3E2] text-[#B45309]"
                            : "bg-[#EDE8DC] text-[#846246]",
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#F0EAE2] pt-4">
                    <p className="font-serif text-[20px] font-semibold text-[#3D2E24]">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CustomOrdersPanel({ orders }: { orders: ProfileCustomOrder[] }) {
  if (orders.length === 0) {
    return (
      <div>
        <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Custom Orders</h2>
        <EmptyState message="No custom orders yet." />
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Custom Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-[#E8E0D4] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-[19px] font-medium text-[#3D2E24]">{order.description}</p>
                {order.artisan && (
                  <p className="mt-1 font-sans text-[15px] text-[#9A8070]">By {order.artisan}</p>
                )}
                <p className="mt-1 font-sans text-[13px] text-[#B5A898]">
                  ORDER #{order.displayId}
                  {order.estimatedDelivery ? ` · ${order.estimatedDelivery}` : ""}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#EDE8DC] px-3 py-1 font-sans text-[13px] font-semibold text-[#846246]">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrackShipmentPanel({ orders }: { orders: ProfileOrder[] }) {
  const active = orders.find((order) => order.status === "In Transit" || order.status === "Processing")

  if (!active) {
    return (
      <div>
        <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Track Shipment</h2>
        <EmptyState message="No active shipments to track right now." />
      </div>
    )
  }

  const item = active.items[0]

  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Track Shipment</h2>
      <div className="rounded-xl border border-[#E8E0D4] bg-white p-6">
        <p className="mb-4 font-sans text-[15px] text-[#9A8070]">Active shipment</p>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-serif text-[21px] font-medium text-[#3D2E24]">
              {item?.productName ?? "Order"}
            </p>
            <p className="mt-0.5 font-sans text-[15px] text-[#9A8070]">ORDER #{active.displayId}</p>
          </div>
          <span className="rounded-full bg-[#FEF3E2] px-3 py-1 font-sans text-[13px] font-semibold text-[#B45309]">
            {active.status}
          </span>
        </div>
        <p className="font-sans text-[15px] text-[#6B5344]">
          Placed on {formatOrderDate(active.createdAt)}. We&apos;ll update this page as your order moves.
        </p>
      </div>
    </div>
  )
}

function WishlistPanel({ items }: { items: ProfileWishlistItem[] }) {
  if (items.length === 0) {
    return (
      <div>
        <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Wishlist</h2>
        <EmptyState message="Your wishlist is empty." />
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Wishlist</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 overflow-hidden rounded-xl border border-[#E8E0D4] bg-white p-4">
            <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-[#EDE8DC]">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="72px" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Heart className="size-5 text-[#9A8070]" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between py-1">
              <p className="font-serif text-[18px] font-medium text-[#3D2E24]">{item.name}</p>
              <p className="font-serif text-[19px] text-[#846246]">{formatCurrency(item.price)}</p>
              {item.slug && (
                <Link
                  href={`/products/${item.slug}`}
                  className="mt-1 font-sans text-[13px] font-semibold uppercase tracking-wide text-[#846246] transition-colors hover:text-[#5C4332]"
                >
                  View Product →
                </Link>
              )}
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
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Recently Viewed</h2>
      <EmptyState message="Products you view will appear here." />
    </div>
  )
}

function BrowseHistoryPanel() {
  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Browse History</h2>
      <EmptyState message="Your browsing history will appear here." />
    </div>
  )
}

function AddressesPanel({ phone }: { phone: string | null }) {
  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Addresses</h2>
      {phone ? (
        <div className="mb-4 rounded-xl border border-[#E8E0D4] bg-white p-5">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-wide text-[#846246]">Phone</p>
          <p className="mt-2 font-sans text-[16px] text-[#6B5344]">{phone}</p>
        </div>
      ) : null}
      <EmptyState message="Saved addresses will appear here once you add them at checkout." />
    </div>
  )
}

function PaymentPanel() {
  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Payment Methods</h2>
      <EmptyState message="Payment methods are managed securely through Razorpay at checkout." />
    </div>
  )
}

function NotificationsPanel() {
  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Notifications</h2>
      <EmptyState message="Order updates and artisan stories will appear here." />
    </div>
  )
}

function HelpPanel() {
  return (
    <div>
      <h2 className="mb-8 font-serif text-[32px] text-[#3D2E24]">Help</h2>
      <div className="space-y-3">
        {[
          "How do I track my order?",
          "Can I return or exchange a product?",
          "How does the Custom Order process work?",
          "What is the Artisan Patronage tip?",
          "How can I contact support?",
        ].map((q) => (
          <button
            key={q}
            className="flex w-full items-center justify-between rounded-xl border border-[#E8E0D4] bg-white px-5 py-4 text-left transition-colors hover:border-[#D9CFC0] hover:bg-[#FAFAF8]"
          >
            <span className="font-sans text-[16px] text-[#3D2E24]">{q}</span>
            <ChevronRight className="size-4 shrink-0 text-[#9A8070]" />
          </button>
        ))}
      </div>
    </div>
  )
}

function OurStoryPanel() {
  return (
    <div>
      <h2 className="mb-6 font-serif text-[32px] text-[#3D2E24]">Our Story</h2>
      <div className="overflow-hidden rounded-xl">
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
        <div className="space-y-4 rounded-b-xl border border-t-0 border-[#E8E0D4] bg-white p-6">
          <p className="font-serif text-[20px] italic leading-relaxed text-[#6B5344]">
            &quot;{HOUSE_OF_INDIKA} started with a simple idea — to keep the beauty of handmade Indian crafts alive in a world that moves fast.&quot;
          </p>
          <Link
            href="/outerboxdesign"
            className="inline-block font-sans text-[14px] font-semibold uppercase tracking-[0.16em] text-[#846246] transition-colors hover:text-[#5C4332]"
          >
            Read the full story →
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ProfileAccountPage({ profile }: { profile: ProfileData }) {
  const router = useRouter()
  const { userId } = useAuth()
  const { items: wishlistItems } = useWishlist()
  const [localOrders, setLocalOrders] = useState<ProfileOrder[]>([])
  const [activeSection, setActiveSection] = useState<SectionId>("all-orders")

  useEffect(() => {
    setLocalOrders(getStoredOrders(userId))
  }, [userId])

  const wishlist = useMemo(() => mapWishlistToProfile(wishlistItems), [wishlistItems])
  const orders = useMemo(
    () => mergeProfileOrders(profile.orders, localOrders),
    [profile.orders, localOrders],
  )

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.replace("/login")
  }, [router])

  const sidebarGroups = useMemo(
    () => [
      {
        label: "My Orders",
        items: [
          { id: "all-orders" as SectionId, label: "All Orders", icon: ShoppingBag, badge: null },
          {
            id: "custom-orders" as SectionId,
            label: "Custom Orders",
            icon: RefreshCcw,
            badge: profile.stats.customOrders ? String(profile.stats.customOrders) : null,
          },
          { id: "track-shipment" as SectionId, label: "Track Shipment", icon: Truck, badge: null },
        ],
      },
      {
        label: "My Collection",
        items: [
          { id: "wishlist" as SectionId, label: "Wishlist", icon: Heart, badge: wishlist.length ? String(wishlist.length) : null },
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
          { id: "our-story" as SectionId, label: "Artisans", icon: BookOpen, badge: null },
        ],
      },
    ],
    [profile.stats.customOrders, wishlist.length],
  )

  const panels: Record<SectionId, ReactNode> = {
    "all-orders": <AllOrdersPanel orders={orders} />,
    "custom-orders": <CustomOrdersPanel orders={profile.customOrders} />,
    "track-shipment": <TrackShipmentPanel orders={orders} />,
    wishlist: <WishlistPanel items={wishlist} />,
    "recently-viewed": <RecentlyViewedPanel />,
    "browse-history": <BrowseHistoryPanel />,
    addresses: <AddressesPanel phone={profile.user.phone} />,
    payment: <PaymentPanel />,
    notifications: <NotificationsPanel />,
    help: <HelpPanel />,
    "our-story": <OurStoryPanel />,
  }

  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <ProductDetailHeader />

      <div className="bg-[#5C4332] text-[#F5F0E8]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex size-[64px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F5F0E8]/15 ring-2 ring-[#F5F0E8]/30">
                {profile.user.avatarUrl ? (
                  <Image
                    src={profile.user.avatarUrl}
                    alt={profile.user.name}
                    width={64}
                    height={64}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="font-serif text-[26px] font-semibold text-[#F5F0E8]">
                    {getInitials(profile.user.name)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-serif text-[30px] font-normal text-[#F5F0E8]">{profile.user.name}</h1>
                <p className="mt-0.5 font-sans text-[15px] text-[#F5F0E8]/65">
                  {profile.user.email}
                  {profile.user.phone ? ` · ${profile.user.phone}` : ""}
                  {" · "}
                  {formatPatronSince(profile.user.patronSince)}
                </p>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 self-start rounded-none border border-[#F5F0E8]/40 px-5 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[#F5F0E8] transition-colors hover:bg-[#F5F0E8]/10 sm:self-auto">
              <Pencil className="size-3.5" />
              Edit Profile
            </button>
          </div>

          <div className="mt-7 grid grid-cols-3 divide-x divide-[#F5F0E8]/15 rounded-xl border border-[#F5F0E8]/15 bg-[#F5F0E8]/08">
            {[
              { value: String(orders.length), label: "Orders" },
              { value: String(wishlist.length), label: "Wishlist" },
              { value: String(profile.stats.customOrders), label: "Custom" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-4">
                <span className="font-serif text-[28px] font-semibold text-[#F5F0E8]">{stat.value}</span>
                <span className="mt-0.5 font-sans text-[13px] uppercase tracking-[0.12em] text-[#F5F0E8]/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#C4A035]/40 bg-[#C4A035]/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="size-[18px] shrink-0 text-[#C4A035]" />
              <div>
                <p className="font-sans text-[16px] font-semibold text-[#F5F0E8]">Artisan Patronage</p>
                <p className="mt-0.5 font-sans text-[14px] text-[#F5F0E8]/65">
                  You&apos;ve added {formatCurrency(profile.user.totalTips)} in artisan tips so far.
                </p>
              </div>
            </div>
            <Sparkles className="size-4 shrink-0 text-[#C4A035]/50" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex items-start gap-8 lg:gap-12">
          <aside className="hidden w-[240px] shrink-0 lg:block">
            <div className="sticky top-6 space-y-6">
              {sidebarGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9A8070]">
                    {group.label}
                  </p>
                  <div className="divide-y divide-[#F0EAE2] overflow-hidden rounded-xl border border-[#E8E0D4] bg-white">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeSection === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors",
                            isActive ? "bg-[#F9F4EE]" : "hover:bg-[#FAFAF8]",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <Icon
                              className={cn("size-[15px] shrink-0", isActive ? "text-[#846246]" : "text-[#9A8070]")}
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
                              <span className="flex size-[20px] items-center justify-center rounded-full bg-[#846246] font-sans text-[12px] font-semibold text-white">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={cn("size-3.5", isActive ? "text-[#846246]" : "text-[#C4B5A5]")}
                            />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 px-3 py-3 font-sans text-[15px] font-medium text-[#9A8070] transition-colors hover:text-[#3D2E24]"
              >
                <LogOut className="size-[15px]" strokeWidth={1.8} />
                Sign Out
              </button>
            </div>
          </aside>

          <div className="mb-6 w-full space-y-4 lg:hidden">
            {sidebarGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-1 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9A8070]">
                  {group.label}
                </p>
                <div className="divide-y divide-[#F0EAE2] overflow-hidden rounded-xl border border-[#E8E0D4] bg-white">
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

          <div className="min-w-0 flex-1">
            <div className="mb-8 hidden items-center gap-2 lg:flex">
              <Package className="size-4 text-[#9A8070]" />
              <span className="font-sans text-[14px] text-[#9A8070]">Account</span>
              <ChevronRight className="size-3.5 text-[#C4B5A5]" />
              <span className="font-sans text-[14px] font-semibold text-[#3D2E24]">
                {sidebarGroups.flatMap((g) => g.items).find((i) => i.id === activeSection)?.label}
              </span>
            </div>

            {panels[activeSection]}
          </div>
        </div>
      </div>
    </main>
  )
}
