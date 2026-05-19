import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  getBoostPlanByBoostPlanId,
  type BoostPlan,
} from "@/lib/content/boost-plans";
import {
  retrievePaymongoCheckoutSession,
  type PaymongoCheckoutSession,
} from "@/server/paymongo/client";

export type ActiveBoost = {
  badgeLabel: string;
  expiresAt: string;
  features: string[];
  name: string;
  slug: string;
  visibilityRank: number;
};

type BoostRow = {
  boost_plan_id: string | null;
  expires_at: Date | null;
  talent_profile_id?: string | null;
};

type PendingBoostRow = {
  boost_subs_id: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function toActiveBoost(row: BoostRow): ActiveBoost | null {
  const plan = getBoostPlanByBoostPlanId(row.boost_plan_id);

  if (!plan || !row.expires_at) {
    return null;
  }

  return {
    badgeLabel: plan.badgeLabel,
    expiresAt: row.expires_at.toISOString(),
    features: plan.features,
    name: plan.name,
    slug: plan.slug,
    visibilityRank: plan.visibilityRank,
  };
}

export async function getTalentProfileIdForUser(userId: string) {
  const talentProfile = await prisma.talentProfile.findUnique({
    select: { talent_profile_id: true },
    where: { user_id: userId },
  });

  return talentProfile?.talent_profile_id ?? null;
}

export async function createPendingBoost({
  plan,
  talentProfileId,
}: {
  plan: BoostPlan;
  talentProfileId: string;
}) {
  if (!isUuid(talentProfileId)) {
    return null;
  }

  const rows = await prisma.$queryRaw<PendingBoostRow[]>`
    insert into public.boost_subscriptions (
      talent_profile_id,
      boost_plan_id,
      payment_status,
      status,
      created_at
    )
    values (
      cast(${talentProfileId} as uuid),
      cast(${plan.boostPlanId} as uuid),
      'unpaid',
      'pending_payment',
      now()
    )
    returning boost_subs_id::text
  `;

  return rows[0]?.boost_subs_id ?? null;
}

export async function attachCheckoutSessionToBoost({
  checkoutSessionId,
  boostId,
}: {
  checkoutSessionId: string;
  boostId: string;
}) {
  await prisma.$executeRaw`
    update public.boost_subscriptions
       set paymongo_checkout_session_id = ${checkoutSessionId}
     where boost_subs_id = cast(${boostId} as uuid)
  `;
}

export async function cancelPendingBoost(boostId: string) {
  if (!boostId) {
    return;
  }

  await prisma.$executeRaw`
    update public.boost_subscriptions
       set status = 'canceled'
     where boost_subs_id = cast(${boostId} as uuid)
       and payment_status = 'unpaid'
       and status = 'pending_payment'
  `;
}

export async function activateBoostFromCheckoutSession(
  checkoutSession: PaymongoCheckoutSession,
) {
  const payment = checkoutSession.attributes.payments?.[0];
  const paidAtSeconds =
    payment?.attributes?.paid_at ?? checkoutSession.attributes.paid_at ?? null;

  if (payment?.attributes?.status !== "paid" || !paidAtSeconds) {
    return null;
  }

  const existingRows = await prisma.$queryRaw<BoostRow[]>`
    select boost_plan_id::text, talent_profile_id::text
      from public.boost_subscriptions
     where paymongo_checkout_session_id = ${checkoutSession.id}
     limit 1
  `;
  const existing = existingRows[0];
  const plan = getBoostPlanByBoostPlanId(existing?.boost_plan_id ?? null);

  if (!existing || !plan) {
    return null;
  }

  const paidAt = new Date(paidAtSeconds * 1000);
  const expiresAt = new Date(
    paidAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
  );
  const paymentIntentId =
    payment?.attributes?.payment_intent_id ??
    checkoutSession.attributes.payment_intent?.id ??
    null;

  await prisma.$executeRaw`
    update public.boost_subscriptions
       set paymongo_payment_id = ${payment.id},
           paymongo_payment_intent_id = ${paymentIntentId},
           payment_status = 'paid',
           status = 'active',
           paid_at = ${paidAt},
           expires_at = ${expiresAt}
     where paymongo_checkout_session_id = ${checkoutSession.id}
  `;

  return getActiveBoostForTalentProfile(
    existing.talent_profile_id ?? "",
  );
}

export async function syncBoostFromPaymongo(boostId: string) {
  const rows = await prisma.$queryRaw<
    Array<{ paymongo_checkout_session_id: string | null }>
  >`
    select paymongo_checkout_session_id
      from public.boost_subscriptions
     where boost_subs_id = cast(${boostId} as uuid)
     limit 1
  `;
  const checkoutSessionId = rows[0]?.paymongo_checkout_session_id;

  if (!checkoutSessionId) {
    return null;
  }

  const checkoutSession =
    await retrievePaymongoCheckoutSession(checkoutSessionId);

  return activateBoostFromCheckoutSession(checkoutSession);
}

export async function getActiveBoostForTalentProfile(
  talentProfileId: string,
) {
  if (!isUuid(talentProfileId)) {
    return null;
  }

  const rows = await prisma.$queryRaw<BoostRow[]>`
    select boost_plan_id::text, expires_at
      from public.boost_subscriptions
     where talent_profile_id = cast(${talentProfileId} as uuid)
       and payment_status = 'paid'
       and status = 'active'
       and expires_at > now()
     order by expires_at desc
     limit 1
  `;

  return rows[0] ? toActiveBoost(rows[0]) : null;
}

export async function getActiveBoostsByTalentProfileIds(
  talentProfileIds: string[],
) {
  if (talentProfileIds.length === 0) {
    return new Map<string, ActiveBoost>();
  }

  const rows = await prisma.$queryRaw<BoostRow[]>`
    select distinct on (talent_profile_id)
           talent_profile_id::text,
           boost_plan_id::text,
           expires_at
      from public.boost_subscriptions
     where talent_profile_id::text in (${Prisma.join(talentProfileIds)})
       and payment_status = 'paid'
       and status = 'active'
       and expires_at > now()
     order by talent_profile_id, expires_at desc
  `;

  return new Map(
    rows.flatMap((row) => {
      const boost = toActiveBoost(row);

      return boost && row.talent_profile_id
        ? [[row.talent_profile_id, boost] as const]
        : [];
    }),
  );
}
