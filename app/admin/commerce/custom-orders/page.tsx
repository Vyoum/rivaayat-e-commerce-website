import { CustomOrdersKanban } from "@/components/admin/custom-orders-kanban"
import { loadCustomOrderKanbanBoard } from "@/lib/custom-order-admin-server"

export default async function CustomOrdersPage() {
  const board = await loadCustomOrderKanbanBoard()

  return <CustomOrdersKanban initialBoard={board} />
}
