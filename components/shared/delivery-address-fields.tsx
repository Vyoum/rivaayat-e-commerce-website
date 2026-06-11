"use client"

import { INDIAN_STATES } from "@/lib/indian-states"
import type { DeliveryAddress } from "@/lib/delivery-address"
import { cn } from "@/lib/utils"

function UnderlineField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  className,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  className?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#9A8070]">
        {label}
        {!required ? (
          <span className="normal-case tracking-normal text-[#B5A090]"> (Optional)</span>
        ) : null}
      </span>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-0 border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#2B1B12] outline-none transition-colors placeholder:text-[#C4B5A5] focus:border-[#6B5344]"
      />
    </label>
  )
}

type DeliveryAddressFieldsProps = {
  value: DeliveryAddress
  onChange: (patch: Partial<DeliveryAddress>) => void
  title?: string
  className?: string
}

export function DeliveryAddressFields({
  value,
  onChange,
  title = "Delivery Details",
  className,
}: DeliveryAddressFieldsProps) {
  return (
    <div className={className}>
      <h3 className="font-serif text-[18px] text-[#3D2E24]">{title}</h3>
      <div className="mt-6 space-y-6">
        <UnderlineField
          label="Full Name"
          id="delivery-fullName"
          required
          value={value.fullName}
          onChange={(fullName) => onChange({ fullName })}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <UnderlineField
            label="Email Address"
            id="delivery-email"
            type="email"
            required
            value={value.email}
            onChange={(email) => onChange({ email })}
          />
          <UnderlineField
            label="WhatsApp Number"
            id="delivery-whatsapp"
            type="tel"
            required
            value={value.whatsapp}
            onChange={(whatsapp) => onChange({ whatsapp })}
          />
        </div>

        <UnderlineField
          label="Address Line 1"
          id="delivery-addressLine1"
          required
          value={value.addressLine1}
          onChange={(addressLine1) => onChange({ addressLine1 })}
        />

        <UnderlineField
          label="Address Line 2"
          id="delivery-addressLine2"
          value={value.addressLine2}
          onChange={(addressLine2) => onChange({ addressLine2 })}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <UnderlineField
            label="City"
            id="delivery-city"
            required
            value={value.city}
            onChange={(city) => onChange({ city })}
          />
          <UnderlineField
            label="PIN Code"
            id="delivery-pinCode"
            required
            value={value.pinCode}
            onChange={(pinCode) =>
              onChange({ pinCode: pinCode.replace(/\D/g, "").slice(0, 6) })
            }
          />
        </div>

        <label className="block">
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#9A8070]">
            State
          </span>
          <select
            id="delivery-state"
            required
            value={value.state}
            onChange={(event) => onChange({ state: event.target.value })}
            className="mt-2 w-full appearance-none border-0 border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#2B1B12] outline-none transition-colors focus:border-[#6B5344]"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
