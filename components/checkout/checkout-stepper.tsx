import Link from "next/link"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckoutStep = "cart" | "details" | "payment"

type CheckoutStepperProps = {
  current: CheckoutStep
}

const steps: { id: CheckoutStep; label: string; href?: string }[] = [
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
]

export function CheckoutStepper({ current }: CheckoutStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === current)

  return (
    <nav aria-label="Checkout progress" className="mx-auto w-full max-w-sm px-4">
      <ol className="flex items-start">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = step.id === current

          const node = (
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border bg-white",
                  isComplete && "border-[#5C6B58] bg-[#5C6B58] text-white",
                  isCurrent && "border-[#6B5344]",
                  !isComplete && !isCurrent && "border-[#D8CFC4]",
                )}
              >
                {isComplete ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : isCurrent ? (
                  <span className="size-2 rounded-full bg-[#6B5344]" />
                ) : null}
              </span>
              <span
                className={cn(
                  "font-sans text-[11px] tracking-[0.06em]",
                  isCurrent ? "font-medium text-[#2B1B12]" : "text-[#9A8070]",
                )}
              >
                {step.label}
              </span>
            </div>
          )

          return (
            <li key={step.id} className="flex flex-1 items-start">
              {index > 0 ? (
                <div
                  aria-hidden
                  className={cn(
                    "mt-3.5 h-px flex-1",
                    index <= currentIndex ? "bg-[#5C6B58]/50" : "bg-[#D8CFC4]",
                  )}
                />
              ) : null}
              <div className="shrink-0 px-1">
                {step.href && isComplete ? (
                  <Link href={step.href} className="block">
                    {node}
                  </Link>
                ) : (
                  node
                )}
              </div>
              {index < steps.length - 1 ? (
                <div
                  aria-hidden
                  className={cn(
                    "mt-3.5 h-px flex-1",
                    index < currentIndex ? "bg-[#5C6B58]/50" : "bg-[#D8CFC4]",
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
