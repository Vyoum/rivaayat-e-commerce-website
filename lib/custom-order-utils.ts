export type ParsedCustomOrderDescription = {
  category: string
  weight: string
  quantity: string
  selections: Record<string, string>
  notes: string
  contactName: string
  whatsapp: string
  email: string
}

export function parseCustomOrderDescription(description: string): ParsedCustomOrderDescription {
  const result: ParsedCustomOrderDescription = {
    category: "",
    weight: "",
    quantity: "",
    selections: {},
    notes: "",
    contactName: "",
    whatsapp: "",
    email: "",
  }

  let section: "selections" | "contact" | null = null

  for (const line of description.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed === "Selections:") {
      section = "selections"
      continue
    }
    if (trimmed === "Contact:") {
      section = "contact"
      continue
    }

    if (trimmed.startsWith("Category: ")) {
      result.category = trimmed.slice("Category: ".length)
    } else if (trimmed.startsWith("Weight: ")) {
      result.weight = trimmed.slice("Weight: ".length)
    } else if (trimmed.startsWith("Quantity: ")) {
      result.quantity = trimmed.slice("Quantity: ".length)
    } else if (trimmed.startsWith("Notes: ")) {
      result.notes = trimmed.slice("Notes: ".length)
    } else if (section === "selections" && trimmed.startsWith("- ")) {
      const body = trimmed.slice(2)
      const colon = body.indexOf(": ")
      if (colon >= 0) {
        result.selections[body.slice(0, colon)] = body.slice(colon + 2)
      }
    } else if (section === "contact" && trimmed.startsWith("- ")) {
      const body = trimmed.slice(2)
      if (body.startsWith("Name: ")) result.contactName = body.slice(6)
      else if (body.startsWith("WhatsApp: ")) result.whatsapp = body.slice(10)
      else if (body.startsWith("Email: ")) result.email = body.slice(7)
    }
  }

  return result
}

export function formatCustomOrderDisplayId(id: string) {
  const compact = id.replace(/-/g, "").toUpperCase()
  return `COI-${compact.slice(-3)}`
}

export function formatCustomOrderSummary(parsed: ParsedCustomOrderDescription) {
  const parts = [parsed.weight, parsed.quantity].filter(Boolean)
  if (parts.length > 0) return parts.join(" · ")
  return parsed.category || "Custom order request"
}

const categoryTagColors = [
  "bg-[#EDE7F6] text-[#5E35B1]",
  "bg-[#FCE4EC] text-[#AD1457]",
  "bg-[#E6F4EA] text-[#1E7E34]",
  "bg-[#FFF3E0] text-[#E65100]",
  "bg-[#E3F2FD] text-[#1565C0]",
]

export function categoryTagColor(category: string) {
  const hash = category.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return categoryTagColors[hash % categoryTagColors.length]
}
