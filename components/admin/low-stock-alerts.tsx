const products = [
  {
    name: "Royal Blue Banarasi Dupatta",
    sku: "SKU: HBD-001",
    stock: "2 left",
    image:
      "https://images.unsplash.com/photo-1610030469667-67a0b47a8537?w=80&h=80&fit=crop",
  },
  {
    name: "Handwoven Kashmiri Shawl",
    sku: "SKU: HKS-014",
    stock: "0 left",
    image:
      "https://images.unsplash.com/photo-1601924999567-420b55106fd9?w=80&h=80&fit=crop",
  },
  {
    name: "Terracotta Diya Set (6pc)",
    sku: "SKU: HTD-008",
    stock: "3 left",
    image:
      "https://images.unsplash.com/photo-1602874801006-4f7e31a4c2b1?w=80&h=80&fit=crop",
  },
  {
    name: "Block Print Cotton Kurta",
    sku: "SKU: HBK-022",
    stock: "1 left",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=80&h=80&fit=crop",
  },
]

export function LowStockAlerts() {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
        Low Stock Alerts
      </h3>

      <div className="mt-4 space-y-3">
        {products.map((product) => (
          <div
            key={product.sku}
            className="flex items-center gap-3 rounded-lg border border-[#F5EDE3] p-3"
          >
            <img
              src={product.image}
              alt={product.name}
              className="size-10 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#2D1E17]">
                {product.name}
              </p>
              <p className="text-[11px] text-[#9A8070]">{product.sku}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#FCE8E6] px-2.5 py-0.5 text-[11px] font-semibold text-[#C5221F]">
              {product.stock}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
