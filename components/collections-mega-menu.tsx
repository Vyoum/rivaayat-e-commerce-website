"use client"

import Link from "next/link"

import {
  COLLECTIONS_MEGA_MENU_COLUMNS,
  COLLECTIONS_NAV_HREF,
  type CollectionsMegaMenuColumn,
} from "@/lib/collections-mega-menu"
import { cn } from "@/lib/utils"

type CollectionsMegaMenuPanelProps = {
  onNavigate?: () => void
  className?: string
}

function MegaMenuColumn({
  column,
  onNavigate,
}: {
  column: CollectionsMegaMenuColumn
  onNavigate?: () => void
}) {
  return (
    <div className="min-w-0">
      {column.href ? (
        <Link
          href={column.href}
          onClick={onNavigate}
          className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#B85A32] uppercase transition-colors hover:text-[#8A4528]"
        >
          {column.title}
        </Link>
      ) : (
        <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#B85A32] uppercase">
          {column.title}
        </p>
      )}

      <ul className="mt-3 space-y-2.5">
        {column.links.map((link) => (
          <li key={`${column.title}-${link.href}-${link.label}`}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="font-sans text-[13px] leading-snug text-[#2D1A12]/88 transition-colors hover:text-[#B85A32]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CollectionsMegaMenuPanel({ onNavigate, className }: CollectionsMegaMenuPanelProps) {
  return (
    <div className={cn("collections-mega-menu-panel", className)}>
      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6 lg:px-8 lg:py-8">
        {COLLECTIONS_MEGA_MENU_COLUMNS.map((column) => (
          <MegaMenuColumn key={column.title} column={column} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}

type CollectionsNavTriggerProps = {
  active: boolean
  open: boolean
  onHero: boolean
  navLinkClass: (active: boolean) => string
  onOpen: () => void
}

export function CollectionsNavTrigger({
  active,
  open,
  onHero,
  navLinkClass,
  onOpen,
}: CollectionsNavTriggerProps) {
  return (
    <div className="relative" onMouseEnter={onOpen}>
      <Link
        href={COLLECTIONS_NAV_HREF}
        className={cn(
          navLinkClass(active),
          "relative inline-flex items-center pb-1",
          "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200",
          onHero ? "after:bg-white/90" : "after:bg-[#B85A32]",
          (active || open) && "after:scale-x-100",
          "hover:after:scale-x-100",
        )}
      >
        Collections
      </Link>
    </div>
  )
}

type CollectionsMegaMenuDropdownProps = {
  open: boolean
  onOpen: () => void
  onClose: () => void
  onNavigate?: () => void
}

export function CollectionsMegaMenuDropdown({
  open,
  onOpen,
  onClose,
  onNavigate,
}: CollectionsMegaMenuDropdownProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-full z-[60] border-t border-[#E8E0D4] bg-[#FCF8F4] shadow-[0_18px_40px_rgba(45,26,18,0.12)] transition-[opacity,visibility] duration-200",
        open
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
      )}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <CollectionsMegaMenuPanel onNavigate={onNavigate} />
    </div>
  )
}

export function CollectionsMegaMenuMobileSection({
  active,
  navLinkClass,
  onNavigate,
}: {
  active: boolean
  navLinkClass: (active: boolean, mobile?: boolean) => string
  onNavigate?: () => void
}) {
  return (
    <div className="border-b border-[#E8E0D4]/80 py-1">
      <Link
        href={COLLECTIONS_NAV_HREF}
        onClick={onNavigate}
        className={navLinkClass(active, true)}
      >
        Collections
      </Link>

      <div className="mt-1 space-y-4 pb-3 pl-3">
        {COLLECTIONS_MEGA_MENU_COLUMNS.map((column) => (
          <div key={column.title}>
            {column.href ? (
              <Link
                href={column.href}
                onClick={onNavigate}
                className="font-sans text-[11px] font-semibold tracking-[0.12em] text-[#B85A32] uppercase"
              >
                {column.title}
              </Link>
            ) : (
              <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-[#B85A32] uppercase">
                {column.title}
              </p>
            )}
            <ul className="mt-2 space-y-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="font-sans text-[14px] text-[#5C4332] transition-colors hover:text-[#2D1A12]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
