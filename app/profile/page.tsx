import { redirect } from "next/navigation"

import { ProfileAccountPage } from "@/components/profile/profile-account-page"
import { buildFallbackProfile, loadProfileForUser } from "@/lib/profile-server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    redirect("/login?next=/profile")
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login?next=/profile")
  }

  let profile
  try {
    profile = await loadProfileForUser(user)
  } catch (dbError) {
    console.error("[profile page] database error:", dbError)
    profile = buildFallbackProfile(user)
  }

  return <ProfileAccountPage profile={profile} />
}
