import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { delhiveryTrackingUrl } from "@/lib/payment-confirmation"

type OrderConfirmationDetailsProps = {
  orderId: string
  trackingId: string | null
  className?: string
}

export function OrderConfirmationDetails({
  orderId,
  trackingId,
  className,
}: OrderConfirmationDetailsProps) {
  return (
    <div
      className={[
        "mt-6 space-y-4 rounded-xl border border-[#EDE5D8] bg-white px-5 py-4 text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8070]">
          Order ID
        </p>
        <p className="mt-1 break-all font-mono text-[14px] font-medium text-[#2B1B12]">
          {orderId}
        </p>
      </div>

      <div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8070]">
          Tracking ID
        </p>
        {trackingId ? (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="break-all font-mono text-[14px] font-medium text-[#2B1B12]">
              {trackingId}
            </p>
            <Link
              href={delhiveryTrackingUrl(trackingId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-[#846246] underline underline-offset-4"
            >
              Track shipment
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        ) : (
          <p className="mt-1 font-sans text-[13px] leading-relaxed text-[#9A8070]">
            Your tracking ID will be shared by email once the shipment is booked.
          </p>
        )}
      </div>
    </div>
  )
}
