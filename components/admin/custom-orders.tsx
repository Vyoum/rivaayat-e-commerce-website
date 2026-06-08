import Link from "next/link"

import type { DashboardCustomOrder } from "@/lib/dashboard-admin-server"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

type CustomOrdersProps = {
  orders: DashboardCustomOrder[]
  pendingCount: number
}

export function CustomOrders({ orders, pendingCount }: CustomOrdersProps) {
  return (
    <div className="rounded-xl bg-[#F0E6D6] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">Custom Orders</h3>
        {pendingCount > 0 && (
          <span className="rounded-full bg-[#FCE8E6] px-2.5 py-0.5 text-[11px] font-semibold text-[#C5221F]">
            {pendingCount} Pending
          </span>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {orders.length === 0 ? (
          <p className="rounded-xl border border-[#E8D8C3] bg-white/60 p-4 text-[13px] text-[#6B5344]">
            No pending custom order requests
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-[#E8D8C3] bg-white/60 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#2D1E17]">{order.title}</h4>
                  <p className="mt-0.5 text-[12px] text-[#6B5344]">{order.customerName}</p>
                </div>
                <span className="shrink-0 text-[11px] text-[#9A8070]">{order.timeAgo}</span>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B5344]">{order.summary}</p>
              <div className="mt-3 flex items-center gap-2">
                {order.showAssign ? (
                  <>
                    <Link
                      href="/admin/commerce/custom-orders"
                      className="rounded-lg bg-[#2D1E17] px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#3D2B21]"
                    >
                      Assign Artisan
                    </Link>
                    {order.whatsapp ? (
                      <a
                        href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-8 items-center justify-center rounded-lg border border-[#EDE5D8] bg-white transition-colors hover:bg-[#FAF7F2]"
                        aria-label="Contact on WhatsApp"
                      >
                        <WhatsAppIcon />
                      </a>
                    ) : null}
                  </>
                ) : (
                  <Link
                    href="/admin/commerce/custom-orders"
                    className="rounded-lg border border-[#C4A882] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#2D1E17] transition-colors hover:bg-[#FAF7F2]"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pendingCount > 0 && (
        <Link
          href="/admin/commerce/custom-orders"
          className="mt-4 block w-full text-center text-[12px] font-medium text-[#6B5344] transition-colors hover:text-[#2D1E17]"
        >
          View all {pendingCount} request{pendingCount === 1 ? "" : "s"}
        </Link>
      )}
    </div>
  )
}
