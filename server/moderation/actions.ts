"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  isReportReasonValue,
  isReportTargetTypeValue,
} from "@/lib/moderation/report-options";
import { prisma } from "@/lib/prisma";
import { getCurrentAppUser } from "@/server/users/current-user";

export type ReportActionState = {
  message: string;
  ok: boolean;
};

const EMPTY_STATE: ReportActionState = {
  message: "",
  ok: false,
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function normalizeTargetPath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value.slice(0, 240);
}

export async function createContentReportAction(
  _previousState: ReportActionState,
  formData: FormData,
): Promise<ReportActionState> {
  const currentUser = await getCurrentAppUser();
  const targetTypeValue = readText(formData, "targetType");
  const targetId = readText(formData, "targetId");
  const targetLabel = readText(formData, "targetLabel");
  const targetPath = normalizeTargetPath(readText(formData, "targetPath"));
  const reasonValue = readText(formData, "reason");
  const details = readText(formData, "details");

  if (!currentUser) {
    return { ...EMPTY_STATE, message: "Sign in before sending a report." };
  }

  if (!isReportTargetTypeValue(targetTypeValue) || !targetId || !targetLabel) {
    return { ...EMPTY_STATE, message: "This item cannot be reported yet." };
  }

  if (!isReportReasonValue(reasonValue)) {
    return { ...EMPTY_STATE, message: "Choose a report reason." };
  }

  if (details.length > 500) {
    return { ...EMPTY_STATE, message: "Keep details under 500 characters." };
  }

  if (!prisma.contentReport) {
    return {
      ...EMPTY_STATE,
      message:
        "Reports are not ready yet. Restart the dev server and apply the latest database migration.",
    };
  }

  try {
    await prisma.contentReport.create({
      data: {
        details: details || null,
        reason: reasonValue,
        reporterUserId: currentUser.id,
        targetId: targetId.slice(0, 120),
        targetLabel: targetLabel.slice(0, 160),
        targetPath,
        targetType: targetTypeValue,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ...EMPTY_STATE,
        message: "You already reported this item. Admins can now review it.",
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      return {
        ...EMPTY_STATE,
        message: "Reports are not ready yet. Ask an admin to apply the latest database migration.",
      };
    }

    throw error;
  }

  revalidatePath("/admin");

  return {
    message: "Report sent. Thanks for helping keep BRaket safer.",
    ok: true,
  };
}
