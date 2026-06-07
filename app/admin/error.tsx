"use client"

import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDF8F1] px-6">
      <div className="max-w-md rounded-xl border border-[#EDE5D8] bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-[24px] font-semibold text-[#2D1E17]">
          Admin could not load
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#6B5344]">
          Something went wrong loading the admin console. This is usually a temporary database
          connection issue on the server.
        </p>
        {error.digest && (
          <p className="mt-2 text-[11px] text-[#9A8070]">Ref: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[#2D1E17] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21]"
          >
            Try again
          </button>
          <Link
            href="/login?next=/admin"
            className="rounded-lg border border-[#EDE5D8] px-4 py-2.5 text-[13px] font-medium text-[#6B5344] hover:bg-[#FAF7F2]"
          >
            Sign in again
          </Link>
        </div>
      </div>
    </div>
  )
}
