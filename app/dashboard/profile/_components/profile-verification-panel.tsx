"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";

import { verifyBuEmailAction } from "@/app/dashboard/profile/_actions/verify-bu-email-action";
import { ProfileVerificationCard } from "@/app/dashboard/profile/_components/profile-verification-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  BU_ID_IMAGE_ACCEPTED_TYPES,
  BU_ID_IMAGE_BUCKET,
  BU_ID_IMAGE_MAX_BYTES,
} from "@/lib/supabase/storage";

type ProfileVerificationPanelProps = {
  authId: string;
  isVerified: boolean;
};

function buildSafeUploadPath(authId: string, file: File) {
  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    file.type.split("/").pop() ||
    "jpg";
  const uploadId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now());

  return `${authId}/bu-id-${uploadId}.${extension}`;
}

function validateBuIdImage(file: File) {
  if (!BU_ID_IMAGE_ACCEPTED_TYPES.includes(file.type)) {
    return "Upload a JPG, PNG, or WebP image of your BU ID.";
  }

  if (file.size > BU_ID_IMAGE_MAX_BYTES) {
    return "Keep the BU ID image under 5 MB.";
  }

  return "";
}

export function ProfileVerificationPanel({
  authId,
  isVerified,
}: ProfileVerificationPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploadError, setIsUploadError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadMessage("");
    setUploadUrl("");
    setIsUploadError(false);
  }

  function handleVerify() {
    setMessage("");
    setIsError(false);

    startTransition(async () => {
      const result = await verifyBuEmailAction();
      setMessage(result.message);
      setIsError(!result.ok);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  async function handleUploadBuId() {
    setUploadMessage("");
    setUploadUrl("");
    setIsUploadError(false);

    if (!selectedFile) {
      setUploadMessage("Choose your BU ID image before uploading.");
      setIsUploadError(true);
      return;
    }

    const validationMessage = validateBuIdImage(selectedFile);

    if (validationMessage) {
      setUploadMessage(validationMessage);
      setIsUploadError(true);
      return;
    }

    setIsUploading(true);

    const supabase = createClient();
    const filePath = buildSafeUploadPath(authId, selectedFile);
    const { error: uploadError } = await supabase.storage
      .from(BU_ID_IMAGE_BUCKET)
      .upload(filePath, selectedFile, {
        cacheControl: "3600",
        contentType: selectedFile.type,
        upsert: false,
      });

    if (uploadError) {
      setIsUploading(false);
      setUploadMessage(
        `We could not upload your BU ID image yet: ${uploadError.message}`,
      );
      setIsUploadError(true);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BU_ID_IMAGE_BUCKET).getPublicUrl(filePath);

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        buIdImageBucket: BU_ID_IMAGE_BUCKET,
        buIdImagePath: filePath,
        buIdImageUploadedAt: new Date().toISOString(),
        buIdImageUrl: publicUrl,
      },
    });

    setIsUploading(false);

    if (metadataError) {
      setUploadMessage(
        "Your image uploaded, but we could not save it to your profile yet.",
      );
      setIsUploadError(true);
      setUploadUrl(publicUrl);
      return;
    }

    setSelectedFile(null);
    setUploadUrl(publicUrl);
    setUploadMessage("BU ID image uploaded. You can now see it in Supabase Storage.");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <ProfileVerificationCard
        handleVerify={handleVerify}
        isVerified={isVerified}
        verifying={isPending}
      />
      {!isVerified ? (
        <div className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground">
                Upload BU ID image
              </p>
              <p className="mt-0.5 text-[11px] text-[color:var(--ink-muted)]">
                JPG, PNG, or WebP. Files are stored in the{" "}
                <span className="font-semibold">{BU_ID_IMAGE_BUCKET}</span>{" "}
                bucket.
              </p>
            </div>
            <label className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 text-[11px] font-semibold text-[color:var(--ink-body)] transition hover:bg-white">
              Choose image
              <input
                accept={BU_ID_IMAGE_ACCEPTED_TYPES.join(",")}
                className="sr-only"
                onChange={handleFileChange}
                type="file"
              />
            </label>
            <Button
              className="h-8 rounded-md bg-[color:var(--brand-blue)] px-3 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-blue)]/90 disabled:opacity-60"
              disabled={!selectedFile || isUploading}
              onClick={() => void handleUploadBuId()}
              type="button"
            >
              {isUploading ? "Uploading..." : "Upload ID"}
            </Button>
          </div>
          {selectedFile ? (
            <p className="mt-2 truncate text-[11px] text-[color:var(--ink-soft)]">
              Selected: {selectedFile.name}
            </p>
          ) : null}
          {uploadMessage ? (
            <p
              className={`mt-2 rounded-lg px-3 py-2 text-xs ${
                isUploadError
                  ? "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
                  : "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
              }`}
              role={isUploadError ? "alert" : "status"}
            >
              {uploadMessage}
            </p>
          ) : null}
          {uploadUrl ? (
            <a
              className="mt-2 inline-flex text-[11px] font-semibold text-[color:var(--brand-orange)] hover:text-[color:var(--brand-orange-strong)]"
              href={uploadUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open uploaded image
            </a>
          ) : null}
        </div>
      ) : null}
      {message ? (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${
            isError
              ? "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
              : "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
          }`}
          role={isError ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
