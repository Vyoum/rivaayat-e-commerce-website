"use client"

import { useState } from "react"
import { ChevronDown, Ruler } from "lucide-react"

import {
  CLOTHING_SIZE_GUIDE_MEASURE_TIPS,
  CLOTHING_SIZE_GUIDE_NOTE,
  CLOTHING_SIZE_GUIDE_ROWS,
} from "@/lib/clothing-size-guide"
import { cn } from "@/lib/utils"

type ProductSizeGuideProps = {
  variant?: "detail" | "card"
}

export function ProductSizeGuide({ variant = "detail" }: ProductSizeGuideProps) {
  const [open, setOpen] = useState(false)
  const isDetail = variant === "detail"

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8E0D4]",
        isDetail ? "mt-6 bg-[#FDF9F3]" : "mt-2.5 bg-white/50 sm:mt-4",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between text-left transition-colors hover:bg-[#FAF7F2]",
          isDetail ? "rounded-2xl px-5 py-4" : "rounded-2xl px-2.5 py-2.5 sm:px-3 sm:py-3",
        )}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Ruler
            className={cn("shrink-0 text-[#846246]", isDetail ? "size-4" : "size-3 sm:size-3.5")}
            strokeWidth={1.5}
          />
          <span
            className={cn(
              "font-medium uppercase tracking-[0.14em] text-[#3D2E24]",
              isDetail ? "font-sans text-[11px]" : "font-sans text-[9px] sm:text-[10px]",
            )}
          >
            Size Guide
          </span>
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 text-[#9A8070] transition-transform duration-200",
            isDetail ? "size-4" : "size-3.5 sm:size-4",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "border-t border-[#E8E0D4]",
              isDetail ? "px-5 pt-4 pb-5" : "px-2.5 pt-3 pb-3 sm:px-3 sm:pb-4",
            )}
          >
            <p
              className={cn(
                "leading-relaxed text-[#9A8070]",
                isDetail ? "font-sans text-[13px]" : "font-serif text-[10px] sm:text-[11px]",
              )}
            >
              Compare your body measurements with the chart below to find your best fit for handwoven textiles and garments.
            </p>

            <div className="mt-4 overflow-x-auto rounded-xl border border-[#E8E0D4] bg-white">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E8E0D4] bg-[#FAF7F2]">
                    {["Size", "Chest", "Waist", "Hip", "Length"].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className={cn(
                          "px-3 py-2.5 font-medium tracking-[0.08em] text-[#6B5344] uppercase",
                          isDetail ? "font-sans text-[10px]" : "font-sans text-[8px] sm:text-[9px]",
                        )}
                      >
                        {heading}
                        {heading !== "Size" ? (
                          <span className="ml-1 font-normal normal-case tracking-normal text-[#9A8070]">
                            (in)
                          </span>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLOTHING_SIZE_GUIDE_ROWS.map((row, index) => (
                    <tr
                      key={row.size}
                      className={cn(
                        index < CLOTHING_SIZE_GUIDE_ROWS.length - 1 && "border-b border-[#EDE8DC]",
                      )}
                    >
                      <td
                        className={cn(
                          "px-3 py-2.5 font-semibold text-[#3D2E24]",
                          isDetail ? "font-sans text-[13px]" : "font-sans text-[10px] sm:text-[11px]",
                        )}
                      >
                        {row.size}
                      </td>
                      {[row.chestIn, row.waistIn, row.hipIn, row.lengthIn].map((value) => (
                        <td
                          key={`${row.size}-${value}`}
                          className={cn(
                            "px-3 py-2.5 text-[#6B5344]",
                            isDetail ? "font-sans text-[13px]" : "font-serif text-[10px] sm:text-[11px]",
                          )}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              className={cn(
                "mt-4 leading-relaxed text-[#9A8070]",
                isDetail ? "font-sans text-[12px]" : "font-serif text-[10px] sm:text-[11px]",
              )}
            >
              {CLOTHING_SIZE_GUIDE_NOTE}
            </p>

            <div className="mt-4">
              <p
                className={cn(
                  "font-medium tracking-[0.12em] text-[#6B5344] uppercase",
                  isDetail ? "font-sans text-[10px]" : "font-sans text-[8px] sm:text-[9px]",
                )}
              >
                How to measure
              </p>
              <ul
                className={cn(
                  "mt-2 space-y-1.5 leading-relaxed text-[#9A8070]",
                  isDetail ? "font-sans text-[12px]" : "font-serif text-[10px] sm:text-[11px]",
                )}
              >
                {CLOTHING_SIZE_GUIDE_MEASURE_TIPS.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span aria-hidden className="text-[#C4B5A5]">
                      ·
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
