import { redirect } from "next/navigation";

import { getDashboardProfilePath } from "@/lib/auth/session";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function ProfilePage() {
  const user = await requireCurrentAppUser();

  redirect(getDashboardProfilePath(user.role));
}
