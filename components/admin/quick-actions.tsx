import { Plus, UserPlus, Ruler, Tag } from "lucide-react"

const actions = [
  { label: "Add Product", icon: Plus },
  { label: "Add Artisan", icon: UserPlus },
  { label: "Custom Orders", icon: Ruler },
  { label: "Create Promo", icon: Tag },
]

export function QuickActions() {
  return (
    <div>
      <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
        Quick Actions
      </h3>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex flex-col items-center justify-center gap-2.5 rounded-xl bg-[#E8D8C3] px-4 py-6 transition-colors hover:bg-[#DFD0B8]"
          >
            <action.icon
              className="size-5 text-[#6B5344]"
              strokeWidth={1.75}
            />
            <span className="text-[13px] font-medium text-[#2D1E17]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
