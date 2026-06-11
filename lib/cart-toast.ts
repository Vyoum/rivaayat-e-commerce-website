import { toast } from "sonner"

export function showAddedToCollectionToast(productName: string, quantity = 1) {
  const description =
    quantity > 1 ? `${productName} · ${quantity} pieces` : productName

  toast.success("Added to your collection", {
    description,
    duration: 3200,
    classNames: {
      toast:
        "!bg-[#F5EDE3] !border !border-[#D4C4A8] !text-[#2D1A12] !shadow-[0_10px_32px_rgba(61,46,36,0.1)]",
      title: "!font-serif !text-[15px] !font-normal !text-[#2D1A12]",
      description: "!font-sans !text-[12px] !text-[#6B5344]",
      closeButton: "!border-[#D4C4A8] !bg-transparent !text-[#6B5344]",
      success: "!text-[#8B7355]",
    },
  })
}
