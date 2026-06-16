import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { OurStoryAdminEditors } from "./our-story-admin-editors"

export function OurStoryAdminPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <div>
            <h1 className="font-serif text-[26px] font-semibold text-[#2D1E17]">Our Story</h1>
            <p className="mt-1 text-[13px] text-[#9A8070]">
              Edit the Our Story page and artisan profiles — photo, name, biography, and more.
            </p>
          </div>

          <section className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2]/50 p-5 shadow-sm">
            <OurStoryAdminEditors />
          </section>
        </main>
      </div>
    </div>
  )
}
