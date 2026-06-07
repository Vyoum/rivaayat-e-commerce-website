import Link from "next/link"

import type { DashboardLowStockProduct } from "@/lib/dashboard-admin-server"

type LowStockAlertsProps = {
  products: DashboardLowStockProduct[]
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">Low Stock Alerts</h3>

      <div className="mt-4 space-y-3">
        {products.length === 0 ? (
          <p className="rounded-lg border border-[#F5EDE3] p-4 text-[13px] text-[#9A8070]">
            All published products are in stock
          </p>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/store/products/${product.id}/edit`}
              className="flex items-center gap-3 rounded-lg border border-[#F5EDE3] p-3 transition-colors hover:bg-[#FAF7F2]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="size-10 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#2D1E17]">{product.name}</p>
                <p className="text-[11px] text-[#9A8070]">/{product.slug}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#FCE8E6] px-2.5 py-0.5 text-[11px] font-semibold text-[#C5221F]">
                {product.stockLabel}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
