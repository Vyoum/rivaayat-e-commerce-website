const orders = [
  {
    id: "#HOI-2847",
    customer: "Priya Sharma",
    date: "24 Oct, 2023",
    status: "Shipped" as const,
    amount: "₹4,200",
  },
  {
    id: "#HOI-2846",
    customer: "Ananya Patel",
    date: "24 Oct, 2023",
    status: "Processing" as const,
    amount: "₹2,850",
  },
  {
    id: "#HOI-2845",
    customer: "Meera Reddy",
    date: "23 Oct, 2023",
    status: "Pending" as const,
    amount: "₹6,100",
  },
  {
    id: "#HOI-2844",
    customer: "Kavitha Nair",
    date: "23 Oct, 2023",
    status: "Shipped" as const,
    amount: "₹1,950",
  },
  {
    id: "#HOI-2843",
    customer: "Divya Iyer",
    date: "22 Oct, 2023",
    status: "Processing" as const,
    amount: "₹3,400",
  },
]

const statusStyles = {
  Shipped: "bg-[#E6F4EA] text-[#1E7E34]",
  Processing: "bg-[#FFF4E5] text-[#B95000]",
  Pending: "bg-[#F0EDE8] text-[#6B5344]",
}

export function RecentOrders() {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
          Recent Orders
        </h3>
        <a
          href="/admin/commerce/orders"
          className="text-[12px] font-medium text-[#6B5344] transition-colors hover:text-[#2D1E17]"
        >
          View All
        </a>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE5D8]">
              {["Order ID", "Customer", "Date", "Status", "Amount"].map(
                (header) => (
                  <th
                    key={header}
                    className="pr-6 pb-3 text-left text-[11px] font-semibold tracking-wide text-[#9A8070] uppercase last:pr-0"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={
                  index < orders.length - 1 ? "border-b border-[#F5EDE3]" : ""
                }
              >
                <td className="py-3.5 pr-6 text-[13px] font-medium text-[#2D1E17]">
                  {order.id}
                </td>
                <td className="py-3.5 pr-6 text-[13px] text-[#6B5344]">
                  {order.customer}
                </td>
                <td className="py-3.5 pr-6 text-[13px] text-[#9A8070]">
                  {order.date}
                </td>
                <td className="py-3.5 pr-6">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3.5 text-[13px] font-semibold text-[#2D1E17]">
                  {order.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
