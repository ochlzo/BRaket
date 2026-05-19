"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { TALENT_PORTFOLIO_MEDIA_BUCKET } from "@/lib/supabase/storage";
import { getCurrentAppUser } from "@/server/users/current-user";

function getPortfolioMediaObjectPath(publicUrl: string) {
  const marker = `/storage/v1/object/public/${TALENT_PORTFOLIO_MEDIA_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const objectPath = publicUrl.slice(markerIndex + marker.length);
  return objectPath ? decodeURIComponent(objectPath) : null;
}

export async function deleteTalentPortfolioAction(portfolioId: string) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return { message: "Your session expired. Please sign in again.", ok: false };
  }

  const ownedPortfolio = await prisma.talentPortfolio.findFirst({
    select: {
      TalentPortfolioMedia: { select: { media_url: true } },
      talent_portfolio_id: true,
    },
    where: {
      talent_portfolio_id: portfolioId,
      TalentProfile: { user_id: currentUser.id },
    },
  });

  if (!ownedPortfolio) {
    return { message: "We could not find that portfolio post.", ok: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.contentReport.deleteMany({
      where: { targetId: portfolioId, targetType: "PORTFOLIO" },
    });

    await tx.talentPortfolio.delete({
      where: { talent_portfolio_id: portfolioId },
    });
  });

  const objectPaths = ownedPortfolio.TalentPortfolioMedia.map((media) =>
    getPortfolioMediaObjectPath(media.media_url),
  ).filter((path): path is string => Boolean(path));

  if (objectPaths.length > 0) {
    const supabase = createAdminClient();
    await supabase.storage.from(TALENT_PORTFOLIO_MEDIA_BUCKET).remove(objectPaths).catch(() => {});
  }

  revalidatePath("/onboarding/talent");
  revalidatePath("/dashboard/talent/profile");

  return { message: "Portfolio post deleted.", ok: true };
}
